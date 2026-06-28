# Astra — Setup & Run (Smart Caller Protection MVP)

This branch (`feat/smart-caller-protection`) implements the first feature end-to-end across all three services.

## What's built
- **`server/`** — Express + Prisma (Neon Postgres). Auth + caller-lookup, community reports, recent checks. Risk = community signal **blended with** the AI service. Seeded with realistic Indian scam numbers.
- **`service/`** — FastAPI + LangChain + **Groq** (`llama-3.3-70b-versatile`). `POST /classify/caller` → `{ scamType, riskScore, label, explanation, recommendation }`.
- **`app/`** — Expo (SDK 56) RN app: auth, **Check a number**, **Report**, **Recent checks**, **Settings** (+ a "Simulate incoming call" demo button), and a Truecaller-style verdict overlay.
- **`modules/astra-call-guard/`** — native Android (Kotlin) module: real incoming-call detection (`PHONE_STATE`) + a system overlay (`WindowManager`/`SYSTEM_ALERT_WINDOW`) + runtime permissions. JS orchestrates, native renders.

## Prebuilt APK
`releases/astra-smart-caller-protection.apk` — standalone, installable on a real Android device. **The app talks to the backend, so the backend + AI service must be running and reachable from the phone** (see networking below).

## Run the backend + AI service
```bash
# 1) AI service  (needs a GROQ_API_KEY in service/.env)
cd service
python -m venv .venv && .venv/Scripts/python -m pip install -r requirements.txt
.venv/Scripts/python -m uvicorn app:app --host 0.0.0.0 --port 8000

# 2) API server  (needs DATABASE_URL + JWT_SECRET in server/.env)
cd server
npm install
npx prisma generate && npx prisma db push   # sync schema to Neon
npm run seed                                  # load demo scam numbers
npm run dev                                   # http://localhost:9000
```

## Run the app
- Dev (with Metro): `cd app && npm install && npx expo run:android` (custom dev build — Expo Go won't work because of the native module).
- Or install the prebuilt APK from `releases/`.

### Networking (important for a real phone)
`EXPO_PUBLIC_HTTP_BASE_URL` is baked into the APK at build time. For an on-device demo, set it (in `app/.env`) to your laptop's LAN IP, e.g. `http://192.168.x.x:9000`, with the phone on the same Wi-Fi — or use `adb reverse tcp:9000 tcp:9000` over USB. The committed APK was built against a LAN IP; rebuild after changing it.

## Demo flow
1. Sign up / sign in.
2. **Check a number** → enter a seeded number (e.g. `+919812345678`) → AI-blended verdict card.
3. **Settings → Simulate incoming call** → drives the same lookup → native system overlay (grant the overlay + phone permissions first).

## Notes / security
- All secrets live in **gitignored `.env` files** (`server/`, `service/`, `app/`). `.env.example` files document the keys. Rotate the Groq key + Neon password before any public use.
- `JWT_SECRET` and `CORS: *` are demo defaults — harden before production.
- Schema was applied with `prisma db push` (Neon pooler can't run `migrate dev`'s shadow DB).
- Design/contract spec: `docs/superpowers/specs/2026-06-28-astra-smart-caller-protection-design.md`.
