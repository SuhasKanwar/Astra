package expo.modules.astracallguard

import android.Manifest
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import android.telephony.TelephonyManager
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import expo.modules.interfaces.permissions.PermissionsResponseListener
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

/**
 * Verdict shape passed from JS -> native to render the system overlay.
 * Mirrors the trimmed `CallGuardVerdict` in the TS layer.
 */
class VerdictRecord : Record {
  @Field var number: String = ""
  @Field var riskScore: Int = 0
  @Field var label: String = "Unknown"
  @Field var scamType: String? = null
  @Field var recommendation: String = ""
}

/**
 * Astra Call Guard — Option A (JS orchestrates, native renders).
 *
 * Native responsibilities:
 *  - Detect incoming calls via a dynamically-registered PHONE_STATE receiver
 *    and emit `onIncomingCall` / `onCallEnded` to JS.
 *  - Draw / remove a Truecaller-style system overlay (WindowManager).
 *  - Request the runtime call permissions + expose overlay-permission helpers.
 *  - `simulateIncomingCall` fires the exact same JS path as a real call.
 */
class AstraCallGuardModule : Module() {
  private val mainHandler = Handler(Looper.getMainLooper())
  private var phoneStateReceiver: BroadcastReceiver? = null
  private var overlayView: View? = null
  private var lastState: String? = null

  private val appCtx: Context?
    get() = appContext.reactContext?.applicationContext

  override fun definition() = ModuleDefinition {
    Name("AstraCallGuard")

    Events("onIncomingCall", "onCallEnded")

    OnCreate {
      registerPhoneStateReceiver()
    }

    OnDestroy {
      unregisterPhoneStateReceiver()
      mainHandler.post { removeOverlayView() }
    }

    // Request READ_PHONE_STATE + READ_CALL_LOG at runtime, report state back.
    AsyncFunction("requestCallPermissions") { promise: Promise ->
      val permissions = appContext.permissions
      if (permissions != null) {
        try {
          permissions.askForPermissions(
            PermissionsResponseListener { _ -> promise.resolve(currentPermissionsMap()) },
            Manifest.permission.READ_PHONE_STATE,
            Manifest.permission.READ_CALL_LOG
          )
          return@AsyncFunction
        } catch (e: Throwable) {
          // Fall through to a manual request below.
        }
      }

      // Fallback: trigger the system dialog directly and report current status.
      val activity = appContext.activityProvider?.currentActivity
      val ctx = appCtx
      if (activity != null && ctx != null) {
        val needed = arrayOf(
          Manifest.permission.READ_PHONE_STATE,
          Manifest.permission.READ_CALL_LOG
        ).filter { ctx.checkSelfPermission(it) != PackageManager.PERMISSION_GRANTED }
        if (needed.isNotEmpty()) {
          try {
            activity.requestPermissions(needed.toTypedArray(), PERMISSION_REQUEST_CODE)
          } catch (e: Exception) {
            // ignore — we still resolve with current status
          }
        }
      }
      promise.resolve(currentPermissionsMap())
    }

    AsyncFunction("hasOverlayPermission") {
      val ctx = appCtx
      ctx != null && Settings.canDrawOverlays(ctx)
    }

    Function("openOverlaySettings") {
      val ctx = appCtx
      if (ctx != null) {
        val intent = Intent(
          Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
          Uri.parse("package:${ctx.packageName}")
        ).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        try {
          ctx.startActivity(intent)
        } catch (e: Exception) {
          // ignore
        }
      }
    }

    Function("showCallerOverlay") { verdict: VerdictRecord ->
      showOverlay(verdict)
    }

    Function("hideCallerOverlay") {
      mainHandler.post { removeOverlayView() }
    }

    // Fires the same event a real RINGING broadcast would — works without the
    // phone permission (the native overlay still needs draw-over permission).
    Function("simulateIncomingCall") { number: String ->
      sendEvent("onIncomingCall", mapOf("number" to number))
    }
  }

  // --- Permissions ---------------------------------------------------------

  private fun currentPermissionsMap(): Map<String, Any> {
    val ctx = appCtx
    val phone = ctx != null &&
      ctx.checkSelfPermission(Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED
    val overlay = ctx != null && Settings.canDrawOverlays(ctx)
    return mapOf("phone" to phone, "overlay" to overlay)
  }

  // --- Phone-state detection ----------------------------------------------

  private fun registerPhoneStateReceiver() {
    val ctx = appCtx ?: return
    if (phoneStateReceiver != null) return

    val receiver = object : BroadcastReceiver() {
      override fun onReceive(c: Context?, intent: Intent?) {
        if (intent?.action != TelephonyManager.ACTION_PHONE_STATE_CHANGED) return
        when (intent.getStringExtra(TelephonyManager.EXTRA_STATE)) {
          TelephonyManager.EXTRA_STATE_RINGING -> {
            // PHONE_STATE can fire RINGING repeatedly; only emit once per call.
            if (lastState == TelephonyManager.EXTRA_STATE_RINGING) return
            lastState = TelephonyManager.EXTRA_STATE_RINGING
            // EXTRA_INCOMING_NUMBER is null on API 29+ without READ_CALL_LOG.
            val number = intent.getStringExtra(TelephonyManager.EXTRA_INCOMING_NUMBER) ?: ""
            sendEvent("onIncomingCall", mapOf("number" to number))
          }
          TelephonyManager.EXTRA_STATE_OFFHOOK -> {
            lastState = TelephonyManager.EXTRA_STATE_OFFHOOK
          }
          TelephonyManager.EXTRA_STATE_IDLE -> {
            if (lastState != null && lastState != TelephonyManager.EXTRA_STATE_IDLE) {
              sendEvent("onCallEnded", mapOf<String, Any?>())
              mainHandler.post { removeOverlayView() }
            }
            lastState = TelephonyManager.EXTRA_STATE_IDLE
          }
        }
      }
    }

    val filter = IntentFilter(TelephonyManager.ACTION_PHONE_STATE_CHANGED)
    try {
      // PHONE_STATE is a protected system broadcast; export so the system can deliver it.
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        ctx.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED)
      } else {
        @Suppress("UnspecifiedRegisterReceiverFlag")
        ctx.registerReceiver(receiver, filter)
      }
      phoneStateReceiver = receiver
    } catch (e: Exception) {
      phoneStateReceiver = null
    }
  }

  private fun unregisterPhoneStateReceiver() {
    val r = phoneStateReceiver ?: return
    try {
      appCtx?.unregisterReceiver(r)
    } catch (e: Exception) {
      // ignore
    }
    phoneStateReceiver = null
  }

  // --- Overlay rendering ---------------------------------------------------

  private fun showOverlay(verdict: VerdictRecord) {
    val ctx = appCtx ?: return
    // No draw-over permission => no-op; JS shows its in-app overlay instead.
    if (!Settings.canDrawOverlays(ctx)) return

    mainHandler.post {
      removeOverlayView()
      val wm = ctx.getSystemService(Context.WINDOW_SERVICE) as? WindowManager ?: return@post
      val view = buildOverlayView(ctx, verdict)

      val type = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
      } else {
        @Suppress("DEPRECATION")
        WindowManager.LayoutParams.TYPE_PHONE
      }

      val params = WindowManager.LayoutParams(
        WindowManager.LayoutParams.MATCH_PARENT,
        WindowManager.LayoutParams.WRAP_CONTENT,
        type,
        WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
          WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL or
          WindowManager.LayoutParams.FLAG_DIM_BEHIND,
        PixelFormat.TRANSLUCENT
      ).apply {
        gravity = Gravity.TOP
        dimAmount = 0.5f
        y = dp(ctx, 44)
      }

      try {
        wm.addView(view, params)
        overlayView = view
      } catch (e: Exception) {
        overlayView = null
      }
    }
  }

  private fun removeOverlayView() {
    val v = overlayView ?: return
    try {
      val wm = appCtx?.getSystemService(Context.WINDOW_SERVICE) as? WindowManager
      wm?.removeView(v)
    } catch (e: Exception) {
      // ignore
    }
    overlayView = null
  }

  private fun buildOverlayView(ctx: Context, verdict: VerdictRecord): View {
    val accent = labelColor(verdict.label)

    val container = LinearLayout(ctx).apply {
      orientation = LinearLayout.VERTICAL
      val side = dp(ctx, 12)
      setPadding(side, 0, side, 0)
    }

    val card = LinearLayout(ctx).apply {
      orientation = LinearLayout.VERTICAL
      val pad = dp(ctx, 20)
      setPadding(pad, pad, pad, pad)
      background = GradientDrawable().apply {
        cornerRadius = dp(ctx, 22).toFloat()
        setColor(Color.parseColor("#0F172A"))
        setStroke(dp(ctx, 2), accent)
      }
    }

    // Header strip
    card.addView(makeText(ctx, "INCOMING CALL · SCREENED BY ASTRA", 11f, Color.parseColor("#94A3B8"), true).apply {
      letterSpacing = 0.08f
    })

    // Caller number
    card.addView(makeText(ctx, verdict.number.ifBlank { "Unknown number" }, 24f, Color.WHITE, true).apply {
      val lp = LinearLayout.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT
      )
      lp.topMargin = dp(ctx, 6)
      layoutParams = lp
    })

    // Risk score + label badge row
    val scoreRow = LinearLayout(ctx).apply {
      orientation = LinearLayout.HORIZONTAL
      gravity = Gravity.CENTER_VERTICAL
      val lp = LinearLayout.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT
      )
      lp.topMargin = dp(ctx, 14)
      layoutParams = lp
    }
    scoreRow.addView(makeText(ctx, "${verdict.riskScore}%", 40f, accent, true))
    val badge = makeText(ctx, verdict.label.uppercase(), 13f, Color.WHITE, true).apply {
      val hp = dp(ctx, 12)
      val vp = dp(ctx, 5)
      setPadding(hp, vp, hp, vp)
      background = GradientDrawable().apply {
        cornerRadius = dp(ctx, 20).toFloat()
        setColor(accent)
      }
      val lp = LinearLayout.LayoutParams(
        ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT
      )
      lp.leftMargin = dp(ctx, 12)
      layoutParams = lp
    }
    scoreRow.addView(badge)
    card.addView(scoreRow)

    // Risk score caption
    card.addView(makeText(ctx, "Risk score", 12f, Color.parseColor("#94A3B8"), false))

    // Scam type
    if (!verdict.scamType.isNullOrBlank()) {
      card.addView(makeText(ctx, verdict.scamType!!, 16f, accent, true).apply {
        val lp = LinearLayout.LayoutParams(
          ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT
        )
        lp.topMargin = dp(ctx, 12)
        layoutParams = lp
      })
    }

    // Recommendation
    if (verdict.recommendation.isNotBlank()) {
      card.addView(makeText(ctx, "What to do", 12f, Color.parseColor("#94A3B8"), true).apply {
        val lp = LinearLayout.LayoutParams(
          ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT
        )
        lp.topMargin = dp(ctx, 12)
        layoutParams = lp
      })
      card.addView(makeText(ctx, verdict.recommendation, 14f, Color.parseColor("#E2E8F0"), false).apply {
        val lp = LinearLayout.LayoutParams(
          ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT
        )
        lp.topMargin = dp(ctx, 2)
        layoutParams = lp
      })
    }

    // Dismiss button
    val dismiss = Button(ctx).apply {
      text = "Dismiss"
      isAllCaps = false
      setTextColor(Color.WHITE)
      textSize = 15f
      typeface = Typeface.DEFAULT_BOLD
      background = GradientDrawable().apply {
        cornerRadius = dp(ctx, 14).toFloat()
        setColor(accent)
      }
      val lp = LinearLayout.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT, dp(ctx, 48)
      )
      lp.topMargin = dp(ctx, 18)
      layoutParams = lp
      setOnClickListener { removeOverlayView() }
    }
    card.addView(dismiss)

    container.addView(
      card,
      LinearLayout.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT
      )
    )
    return container
  }

  private fun makeText(
    ctx: Context,
    value: String,
    sizeSp: Float,
    color: Int,
    bold: Boolean
  ): TextView = TextView(ctx).apply {
    text = value
    textSize = sizeSp
    setTextColor(color)
    if (bold) typeface = Typeface.DEFAULT_BOLD
  }

  private fun labelColor(label: String): Int = when (label.lowercase()) {
    "scam" -> Color.parseColor("#DC2626")
    "suspicious" -> Color.parseColor("#F59E0B")
    "safe" -> Color.parseColor("#16A34A")
    else -> Color.parseColor("#6B7280")
  }

  private fun dp(ctx: Context, value: Int): Int =
    TypedValue.applyDimension(
      TypedValue.COMPLEX_UNIT_DIP,
      value.toFloat(),
      ctx.resources.displayMetrics
    ).toInt()

  companion object {
    private const val PERMISSION_REQUEST_CODE = 7341
  }
}
