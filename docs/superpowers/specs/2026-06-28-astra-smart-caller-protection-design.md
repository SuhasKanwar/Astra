# Astra — Smart Caller Protection (Hero Feature) — Design & Contract

**Date:** 2026-06-28
**Context:** Hackathon/demo build. First feature end-to-end across all 3 services.
**Decisions locked:**
- Goal: **Hackathon demo** (optimize for a great live demo; mock/seed where needed).
- AI engine: **LLM API via LangChain + Groq** (`llama-3.3-70b-versatile`). README's local ML stack (Transformers/PaddleOCR/Whisper) is **dropped** for now.
- First slice: **Real-time Android call interception** + overlay.
- Hero feature: **Smart Caller Protection** (caller reputation lookup + warning overlay).
- Overlay ownership: **Option A — JS orchestrates, native renders.** App calls backend; native only detects the call + draws/hides the overlay + can simulate a call. (Full app-killed background support = future scope.)
- Demo device: **real Android phone via EAS dev build** (not Expo Go).
- App scope: **Lean** — auth + Check-a-number + Report + Recent checks + Settings/permissions + a "Simulate incoming call" demo button.

---

## 1. Architecture & flow

```
Incoming/simulated call
  → Native BroadcastReceiver (PHONE_STATE) extracts number
  → emits onIncomingCall(number) event to JS
  → App: GET /api/calls/lookup?number=...   (Bearer JWT)
       → Server aggregates ScamReports for number (Prisma/Neon)
       → Server POST /classify/caller to AI service (Groq) for scamType/explanation/risk
       → Server blends community + AI score → Verdict, logs CallCheck
  → App: native.showCallerOverlay(verdict)  → WindowManager overlay (Truecaller-style)
  → call ends → onCallEnded → native.hideCallerOverlay()
```

Three services (already scaffolded): `app/` (Expo RN), `server/` (Express + Prisma + Neon), `service/` (FastAPI + Groq).

---

## 2. Shared data shapes (THE CONTRACT — do not diverge)

### Verdict (server → app; drives the overlay + verdict card)
```jsonc
{
  "number": "+919812345678",
  "riskScore": 94,                 // integer 0..100
  "label": "Scam",                 // "Safe" | "Suspicious" | "Scam" | "Unknown"
  "scamType": "Digital Arrest Scam", // string | null
  "reportCount": 36,
  "explanation": "Reported 36 times for impersonating police and demanding payment to avoid a fake arrest...",
  "recommendation": "Do not share personal info or pay. Hang up, block, and report.",
  "reports": [                     // up to 3 sample reports, optional
    { "scamType": "Digital Arrest Scam", "description": "...", "severity": 5, "createdAt": "2026-06-20T..." }
  ]
}
```
**Label mapping by riskScore:** `>=70 → "Scam"`, `40..69 → "Suspicious"`, `1..39 → "Safe"`, `reportCount==0 → "Unknown"` (riskScore ~10).

### AI service `POST /classify/caller`
Request:
```jsonc
{ "number": "+91...", "reports": [ { "scamType": "Digital Arrest Scam", "description": "...", "severity": 5 } ] }
```
Response (LangChain structured/Pydantic output):
```jsonc
{ "scamType": "Digital Arrest Scam", "riskScore": 90, "label": "Scam",
  "explanation": "...", "recommendation": "..." }
```

---

## 3. Server (Express + Prisma + Neon Postgres)

### Prisma models (add to existing `User`)
```prisma
model ScamReport {
  id          String   @id @default(cuid())
  number      String                       // E.164-ish string; index it
  reporterId  String?                      // User.id, nullable (seeded reports have none)
  scamType    String
  description String
  severity    Int      @default(3)         // 1..5
  createdAt   DateTime @default(now())
  @@index([number])
}

model CallCheck {
  id         String   @id @default(cuid())
  userId     String
  number     String
  riskScore  Int
  label      String
  scamType   String?
  createdAt  DateTime @default(now())
  @@index([userId])
}
```
Migrations must run against Neon. Note: datasource block currently has no `url`; ensure `prisma migrate`/`generate` work (use `prisma.config.ts` and/or `url = env("DATABASE_URL")`). Generated client output is `src/generated/prisma` (gitignored) — run `prisma generate`.

### Endpoints (all under `/api`, JWT `authenticate` except auth routes)
- `POST /api/auth/signup|signin|signout` — **already implemented**, keep.
- `GET  /api/calls/lookup?number=<str>` → **Verdict**. Logic:
  1. Fetch ScamReports for number.
  2. If none → `{ label:"Unknown", riskScore:10, reportCount:0, scamType:null, explanation:"No community reports for this number yet.", recommendation:"No history found — stay cautious with unknown callers." }` (skip AI).
  3. If some → `communityScore = min(95, 30 + reportCount*12 + round(avgSeverity*5))`; call AI `/classify/caller`; `finalRisk = round((communityScore + ai.riskScore)/2)`; use AI `scamType/explanation/recommendation`; label from finalRisk; include up to 3 sample reports; log a `CallCheck`.
  4. If AI call fails → fall back to community-only verdict (never 500 the lookup).
- `POST /api/reports` body `{ number, scamType, description, severity? }` → creates ScamReport (reporterId = req.userId) → `{ success, data }`.
- `GET  /api/reports?number=<str>` → list reports for number.
- `GET  /api/checks` → current user's recent CallChecks (desc, limit 50).

### Seed script (`server/prisma/seed.ts` or `scripts/seed.ts`)
~10 realistic Indian scam numbers, each with 2–6 reports across types: Digital Arrest, KYC/bank, lottery, fake delivery (courier), job scam, investment, electricity-bill, UPI refund. Varied severity. This is what makes the demo light up. Provide an npm script `seed`.

---

## 4. AI service (FastAPI + LangChain + Groq)
- Add to `service/config`: `GROQ_API_KEY`, `GROQ_MODEL` (default `llama-3.3-70b-versatile`).
- `requirements.txt` += `langchain`, `langchain-groq`, `langchain-core`.
- `POST /classify/caller` (router or in `app.py`): build `ChatGroq(model=GROQ_MODEL)`, use `.with_structured_output(CallerVerdict)` where `CallerVerdict` is a Pydantic model matching the response shape. System prompt: "You are a fraud-analysis engine for India-focused scam detection. Given a phone number and community reports, classify the most likely scam type, give an integer riskScore 0-100, a label, a 1-2 sentence explanation, and a short actionable recommendation. Be concrete; reference the report patterns." Return JSON.
- Keep `/` and `/health`. Verify with one real call (key is in `service/.env`).

---

## 5. App (Expo RN — Lean)
- **Auth/state:** build real `astraSlice` (or `authSlice`): `{ user:{name,email}, token, isAuthenticated }` + actions `setCredentials`, `logout`. Persist token via **expo-secure-store** (add dep). Hydrate on launch.
- **API layer (`src/lib/api.ts`):** axios instance + request interceptor injecting `Authorization: Bearer <token>`; helpers: `signup`, `signin`, `lookupNumber`, `submitReport`, `getReports`, `getChecks`.
- **Screens (Expo Router):**
  - Auth (sign in / sign up).
  - **Check a number** — input → `lookupNumber` → Verdict card (risk gauge/score, color by label, scamType, explanation, recommendation).
  - **Report a number** — form (number, scamType picker, description, severity) → `submitReport`.
  - **Recent checks** — list from `getChecks`.
  - **Settings/Permissions** — grant overlay + phone perms; **"Simulate incoming call"** button (pick a seeded scam number) that runs the real lookup → overlay path.
- Before native exists, "Simulate" shows an **in-app modal** verdict overlay so screens are demoable standalone. Native swaps this for a true system overlay.
- Follow `app/AGENTS.md`: **read Expo v56 docs** before writing app code.

---

## 6. Native Android module + Expo config plugin (Kotlin)
Expo Module (e.g. `AstraCallGuard`) JS interface:
- `requestCallPermissions(): Promise<{ phone:boolean, overlay:boolean }>`
- `hasOverlayPermission(): Promise<boolean>` / `openOverlaySettings(): void`
- `showCallerOverlay(verdict): void` / `hideCallerOverlay(): void`
- `simulateIncomingCall(number: string): void` → fires `onIncomingCall`
- events: `onIncomingCall { number }`, `onCallEnded {}`
Native pieces: `PHONE_STATE` BroadcastReceiver (perms `READ_PHONE_STATE`, `READ_CALL_LOG`), `WindowManager` overlay (`SYSTEM_ALERT_WINDOW`, TYPE_APPLICATION_OVERLAY). Config plugin injects manifest perms + receiver. Requires `expo prebuild` + **EAS dev build**.

---

## 7. Build & run order (de-risked)
0. Wire-up: install deps, `prisma generate` + migrate, run all 3, verify `/health`.
1. Server: models + endpoints + seed (AI optional/stubbed).
2. AI: Groq `/classify/caller`; server integrates.
3. App UI: auth + screens; demoable via in-app simulate (no native yet).
4. Native module + config plugin + EAS dev build.
5. Integration + seed + demo script + polish.

**Networking for real phone:** set `EXPO_PUBLIC_HTTP_BASE_URL` to laptop LAN IP or a tunnel at demo time; `server.MICROSERVICE_BASE_URL` stays `localhost`.

## 8. Parallel workstream ownership (no-collision)
- **Agent S — server/** (models, endpoints, seed, AI integration).
- **Agent A — service/** (Groq classify endpoint, config, requirements).
- **Agent U — app/** foundation (auth, api layer, screens, in-app simulate modal). Owns `app/src/**`, `app/package.json`, base `app.json`.
- **Agent N — app/ native** (Kotlin module + config plugin + app.json wiring + integrate overlay/events). Runs AFTER U to avoid `app.json`/`package.json` races.

## 9. Security / housekeeping
- Secrets in gitignored `.env` files only. Rotate Groq key + Neon password before any public use.
- CORS `*` and default `JWT_SECRET` are demo-only.
