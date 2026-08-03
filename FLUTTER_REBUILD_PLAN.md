# Flutter Rebuild of `doctor_web_nextjs` (Labass Doctor App)

## Context

`doctor_web_nextjs` is the **doctor-facing portal** of "Labass", a Saudi telemedicine platform. It is a Next.js 15 web app that behaves like a mobile app (mobile-first, RTL Arabic, push notifications, real-time chat, video calls). The goal is to rebuild it as a **native Flutter app (iOS + Android)** that talks to the **same backend, WebSocket server, LiveKit cloud, Firebase project, and Algolia indices** — nothing on the server changes.

This plan is the single source of truth for the Flutter agent. Every API request/response, socket event, enum value, storage key, and screen is specified verbatim from the existing code so **nothing is guessed**, especially requests and responses.

**Decisions already made (do not re-ask):**
- **State management:** Riverpod.
- **Scope:** Implemented features ONLY. The web app has navigable-but-unimplemented stubs — **SOAP notes, Sick Leave, Income page, Profile page — DO NOT build these** (no backend contract exists). The prescription builder itself IS implemented and IS in scope.
- **Platforms:** iOS + Android only. Ignore all Safari/APNs-web and browser-detection logic — use native FCM.

---

## Target Architecture & Packages

- **State/DI:** `flutter_riverpod` (+ `riverpod_annotation`/codegen optional).
- **HTTP:** `dio` (single configured instance with an auth interceptor — the web app lacked this; we add it).
- **Realtime chat:** `socket_io_client` (^2.x, matches server Socket.IO 4.x).
- **Video/audio:** `livekit_client` (Flutter LiveKit SDK) + `flutter_webrtc` under the hood.
- **Push:** `firebase_core` + `firebase_messaging` + `flutter_local_notifications` (foreground display + call UI). Optionally `flutter_callkit_incoming` for a native incoming-call screen (replaces web `IncomingCallNotification`).
- **Search:** `algolia` Dart client (App ID + search key below) — same indices.
- **Storage:** `flutter_secure_storage` for the JWT; `shared_preferences` for flags (e.g. push-permission-requested).
- **Routing:** `go_router`.
- **Audio record/play (voice notes):** `record` (record) + `just_audio` (playback).
- **Localization:** `flutter_localizations` + manual Arabic/English strings. App is mixed-direction (see "Localization").
- **Env:** `flutter_dotenv` or `--dart-define`. Constants listed below.

Suggested structure:
```
lib/
  core/        (env, dio client, storage, router, theme, constants/enums)
  models/      (Dart models — see "Data Models")
  services/    (api_service, socket_service, livekit_service, push_service, algolia_service)
  features/
    auth/      (login, otp)  providers + screens
    feed/      (home feed)
    my_consultations/
    chat/      (chat screen, message bubbles, input, voice player, video button)
    prescription/
  shared/      (widgets, status colors, age calc, arabic->english digits)
```

---

## Environment / Config Constants (exact)

| Key | Production value |
|---|---|
| API base (`API_URL`) | `https://api.labass.sa/api_labass` (test: `https://api.test.labass.sa/api_labass`) |
| WebSocket URL | `wss://api.labass.sa` (Socket.IO path `/socket.io/`) |
| LiveKit URL | `wss://labass-82ot742m.livekit.cloud` |
| Algolia App ID | `ZH3ARANS5B` |
| Algolia search key | `d113a1c7700d347fffa92ef96a3def05` |
| Firebase projectId | `labass-8b04d` |
| Firebase messagingSenderId | `61610489123` |
| Firebase appId (web) | `1:61610489123:web:d79c04bd1534b72bf48896` (mobile needs its own `google-services.json` / `GoogleService-Info.plist` from the `labass-8b04d` Firebase project) |

> **Note:** The `NEXT_PUBLIC_API_URL` base already includes the `/api_labass` path segment. All REST paths below are appended to it.

---

## Authentication & Storage (exact)

**Storage keys** (use `flutter_secure_storage` for token, `shared_preferences` for the flag):
- `labass_doctor_token` — JWT access token (string).
- `labass_doctor_userId` — user id (stored as string).
- `push_permission_requested_doctor` — `"true"` flag, prompt once.

**Auth attach:** every authed request sends header `Authorization: Bearer <labass_doctor_token>`. Implement this in a Dio interceptor (the web app attached it manually per-call).

**Refresh:** login returns a `refreshToken` but the web app **never stores or uses it**. There is NO refresh endpoint. On `401`, clear session and route to `/login`. (Optionally persist `refreshToken` for future use, but no refresh flow exists server-side that we know of — do not invent one.)

**Route guard:** on app start, if no token → go to Login. Chat additionally requires `userId`.

**Bugs in the web app to FIX (not replicate):**
1. Web logout removes the wrong key (`labass_token`). In Flutter, logout MUST clear `labass_doctor_token` + `labass_doctor_userId` (+ delete/disable push token).
2. `isAuthenticated()` checked a dead `jwtToken` key — ignore entirely.
3. Two `ConsultationStatus` enums exist (4 vs 5 values). Use the **superset**: `Paid, Open, Closed, PendingPayment, Failed`.
4. Gender casing is inconsistent (`male`/`Male`) — compare **case-insensitively** in Flutter.

---

## REST API Contract (verbatim — the critical section)

Base = `API_URL`. All bodies are JSON unless noted. Auth = `Authorization: Bearer <token>`.

### 1. `POST /send-otp` — Login step 1 (no auth)
Request:
```json
{ "phoneNumber": "+966XXXXXXXXX", "role": "doctor" }
```
Phone formatting: take 10-digit `05xxxxxxxx`, strip leading `0`, prefix `+966`. Success = HTTP 200. Error body: `{ "error": "<string>" }`.

### 2. `POST /verifyOTPandLogin` — Login step 2 (no auth)
Request:
```json
{ "role": "doctor", "phoneNumber": "+966XXXXXXXXX", "otpcode": "1234" }
```
OTP is **4 digits**. Response 200:
```json
{ "authResponse": { "userId": <string|number>, "token": "<jwt>", "refreshToken": "<jwt>" } }
```
Store `token` → `labass_doctor_token`, `userId` → `labass_doctor_userId`. Error body: `{ "error": "<string>" }` OR `{ "errors": [{ "msg": "<string>" }] }`.

### 3. `GET /feed-consultations?page={page}&limit={limit}` — Home feed (auth)
Defaults `page=1`, `limit=50`. Response:
```ts
{ data: Consultation[], limit: number, page: number, total: number }
```
`401` → treat as unauthorized (re-login).

### 4. `GET /doctor-consultations?page={page}&limit={limit}` — My Consultations (auth)
Defaults `page=0`, `limit=15` (UI offers 10/25/50/75/100). Response (DIFFERENT shape — note `metadata`):
```ts
{ data: Consultation[], metadata: { total, page, limit, totalPages, hasNextPage, hasPreviousPage } }
```

### 5. `GET /consultations/{id}` — Consultation detail / chat header (auth)
Returns the FULL consultation object (superset of the `Consultation` model). Fields the UI reads (all nested, treat as nullable):
- top: `id, status, type, createdAt, paidAT, patientJoinedAT, doctorJoinedAT, closedAt`
- `patient.user`: `{ firstName, lastName, dateOfBirth, nationalId, phoneNumber, gender }`
- `doctor`: `{ specialty, user: { firstName, lastName } }`
- `payment`: `{ paymentStatus, paymentMethod, invoiceValue, invoiceId, displayCurrencyIso, promotionalCode: { isLabassOffer, marketerProfile: { user: {firstName,lastName,phoneNumber}, organization: {name,type,dealType} } } }`
- `previousConsultations[]`: each `{ id, status, type, createdAt, doctorJoinedAT, closedAt, doctor: {user, specialty}, prescription: { diagnoses: string[], pdfURL }, labTestPDFUrls: string[], payment: { paymentStatus, invoiceValue } }`
- `obesitySurvey.survey[]`: `{ question, answer }`
- `subscription`: `{ status, price, currency, recurringType, totalConsultations, remainingConsultations, lastBilledDate, nextBillingDate, expiresAt, organization|null, surveys[]: { type, answers }, bundle: { name, type, description, consultationCount, price, originalPrice, currency, recurringType, whoSubscribes } }` — **`surveys[].answers` may be EITHER** an array of `{question, answer}` OR an object `{name, age, gender, height, weight, city, healthGoals: string[]}`. Handle both.
- `labTestPDFUrls: string[]`, `labConsultationType: string`, `marketer.user.phoneNumber`
On error the web returns `{ error: string }` (reads `error.response.data.message`).

### 6. `PUT /consultations/{id}` — Accept & End (auth)
Same endpoint, differs by body. Response: updated consultation object (UI reads `.status`).
- **Accept:** `{ "eventType": "DOCTOR_ACCEPTED" }` (status `Paid` → `Open`)
- **End:** `{ "eventType": "END_CONSULTATION" }` (status → `Closed`)
- Full `eventType` enum (`ConsultationEvents`): `PAYMENT_SUCCESSFUL, DOCTOR_ACCEPTED, PATIENT_JOINS, END_CONSULTATION` (only the two above are sent by this app).

### 7. `POST /consultations/{id}/prescription` — Issue prescription (auth)
Request:
```ts
{
  drugs: [{
    drugName: string,          // Algolia "Trade Name"
    activeIngredient: string,  // "Scientific Name"
    strength: string,          // "Strength"
    pharmaceuticalForm: string,
    dose: string,              // doctor-entered
    doseUnit: string,          // from "StrengthUnit"; picker: mg|ml|g|l|IU|gm|DF|dose
    registrationNo: string,    // "RegisterNumber"
    route: string,             // picker: oral|iv (+ passthrough)
    frequency: string,         // once daily|twice daily|three times daily|four times daily|once weekly|twice weekly|every 2 hours|as needed|at evening
    indications: string,
    duration: string,          // doctor-entered
    durationUnit: string,      // days|weeks|months
    prn: boolean
  }],
  diagnoses: string[],   // Algolia diagnosis `ascii_desc` strings
  allergies: string[],   // Algolia drug "Trade Name" strings
  labTestsIds: number[]  // Algolia lab-test `id`s
}
```
Required per drug (client validation): `dose, doseUnit(unit), route, frequency, duration, indications`. Response `response.data` (prescription result; server generates the PDF and pushes to patient). `401` → unauthorized.

### 8. `POST /upload-consultation-attatchment` — Chat file/voice upload (auth, multipart)
> Endpoint is misspelled "attatchment" — use it **verbatim**.
Headers: `Content-Type: multipart/form-data`, `Authorization: Bearer`. Form fields:
- File image/doc: `file` (File), `senderId` (string number), `consultationId` (string number)
- Voice note: `file` (Blob, filename `voice_note.mp4`, mime `audio/mp4`), `senderId`, `consultationId`, `recordedTime` (string, seconds float)
Response:
```json
{ "chat": { "attachmentUrl": "<url>", "attachmentType": "images|voiceNotes|<other>", "recordedTime": <number> } }
```
The returned `chat` object is then emitted over the socket `sendMessage` event (below).

### 9. `POST /get-token` — LiveKit token (auth)
Request:
```json
{ "userId": "doctor_<userId>", "roomName": "consultation_<consultationId>" }
```
Response: `{ "token": "<livekit-jwt>" }`. Connect to LiveKit URL with `{ audio: true, video: true }`.
(Web called this redundantly twice — call it ONCE in Flutter.)

### 10. Push token registry (auth) — `pushNotificationController`
- **POST `/push-tokens`** body: `{ userId: number, token: string, provider: "fcm"|"apns", browser: string, platform: string, role: "doctor" }`. On mobile always `provider: "fcm"`; set `browser`/`platform` to something sensible (e.g. `platform: "ios"|"android"`, `browser: "app"`).
- **PUT `/push-tokens/{urlEncodedToken}`** body: `{ enabled?: boolean, token?: string }`.
- **GET `/push-tokens/user/{userId}`** → `PushTokenResponse[]`: `{ id, userId, token, provider, browser, platform, role, enabled, createdAt, updatedAt, lastUsedAt }`.
- **DELETE `/push-tokens/{urlEncodedToken}`**.
All handle `401` → auth failed; error body `{ message }`.

**IGNORE (web-only, do not port):** `/safari-push`, `/api/video-calls/decline` (dead placeholder hitting the Next origin), and all `browserDetection` FCM-vs-APNs logic.

---

## WebSocket (Socket.IO) Contract — used ONLY on the chat screen

Connect:
```
io(WEBSOCKET_URL, { path: "/socket.io/", transports: ["websocket"], auth: { token }, reconnectionAttempts: 5, reconnectionDelay: 1000 })
```
`room` is ALWAYS the consultationId as a **string**.

**Emit (doctor → server):**
| Event | Payload | ACK |
|---|---|---|
| `joinRoom` | `{ room: "<consultationId>" }` | — |
| `loadMessages` | `{ consultationId }` | callback → `Message[]` |
| `sendMessage` (text) | `{ room, message, consultationId: number, senderId: number }` | callback → `{ messageId: string }` |
| `sendMessage` (attachment) | `{ room, message: "", consultationId: number, senderId: number, attachmentUrl, attachmentType, recordedTime }` | callback → `{ messageId: string }` |
| `messageReceived` | `{ messageId }` (emit when an incoming message from another sender arrives — read/delivery receipt) | — |
| `videoCallStarted` | `{ room, initiatedBy: "doctor", timestamp }` | — |
| `videoCallEnded` | `{ room, endedBy: "doctor", timestamp }` | — |

**Listen (server → doctor):**
| Event | Payload |
|---|---|
| `receiveMessage` | a `Message` object (append to list; if `senderId != myUserId`, emit `messageReceived`) |
| `messageStatus` | `{ messageId: string, read: boolean }` (update that message's `read`) |
| `videoCallStarted` | `{ initiatedBy, ... }` — if `initiatedBy != "doctor"`, show incoming-call UI |
| `videoCallEnded` | `{ ... }` |

**Optimistic send:** add the message locally immediately; on ACK, set its `id = messageId` and `isSent = true`.

---

## Data Models (Dart) — source of truth is `src/models/*`, NOT root `/models`

Model these as immutable Dart classes with `fromJson`/`toJson`. Treat almost everything as nullable (API returns partial objects consumed as `any` in the web app).

**Enums:**
- `ConsultationStatus`: `Paid, Open, Closed, PendingPayment, Failed` (string values identical).
- `ConsultationType`: `quick, psychiatric, specialized`.
- `ConsultationEvents`: `PAYMENT_SUCCESSFUL, DOCTOR_ACCEPTED, PATIENT_JOINS, END_CONSULTATION`.
- `OrganizationTypes`: `pharmacy, laboratory`.
- `LabtestType`: `pre_test, post_test`.
- Push provider (mobile): always `fcm`.
- `attachmentType` runtime strings: `voiceNotes`, `images`, else generic link.
- Push `data.type`: `INCOMING_CALL, NEW_MESSAGE, NEW_CONSULTATION, MISSED_CALL`.

**Classes** (fields verbatim from `src/models`):
- `Consultation`: `id, createdAt, patientJoinedAT?, doctorJoinedAT?, paidAT, closedAt, status, type, patient?, doctor?, payment?, promotionalCode?, marketerProfile?, hasPrescription, hasSOAP, labTestPDFUrls?, labConsultationType?, hasSickLeave, subscription?, marketer?` — plus the extra nested fields from `GET /consultations/{id}` in section 5 (`previousConsultations`, `obesitySurvey`, richer `subscription`/`bundle`/`surveys`). Model these nested shapes explicitly (`PreviousConsultation`, `ObesitySurvey`, `Subscription`, `Bundle`, `SurveyAnswer`).
- `User`: `id, firstName, lastName, nationalId, dateOfBirth(String), gender, phoneNumber, email?, role`.
- `PatientProfile`: `id, user, consultations?`.
- `DoctorProfile`: `id, specialty, medicalLicenseNumber, user, iban?, consultations?`.
- `Payment`: `id, invoiceId?, invoiceValue, displayCurrencyIso?, paymentStatus?, paymentMethod?, createdAt, updatedAt?, user?, consultation?, promotionalCode?`.
- `MarketerProfile`: `id, iban?, nationality?, hasGotOffer, promoterName?, organization?, user?`.
- `MarketerOrganization`: `id, iban?, name, city, type, numberOfBranches, dealType?`.
- `PromotionalCode`: `id, code, isActive, isUsed, isFree, type, discountPercentage, marketerPercentage?, marketerOrganizationPercentage?, createdAt, usageCount, isLabassOffer, packageType?, marketerProfile?, user?(PromoCodeUser)`. `PromoCodeUser.role` is `string[]` (unlike `User.role` which is `string`).
- `Prescription`: as in section 7 payload.
- `Message`: `id?, message, senderId(int), consultationId(int), isSent(bool), read(bool), attachmentUrl?, attachmentType?, recordedTime?(num)`.
- Algolia hits: `DrugHit` (has space-containing keys `"Scientific Name"`, `"Trade Name"`, plus `RegisterNumber, Strength, StrengthUnit, PharmaceuticalForm, AdministrationRoute`, etc.), `DiagnosisHit` (`Level, code_id, ascii_desc, ascii_short_desc, effective_from, objectID`), `LabTestHit` (`id, test_name, code, objectID`).
- `PushTokenResponse`: section 10.

---

## Algolia Search (client-side, same as web)

Init: `Algolia(appId: "ZH3ARANS5B", apiKey: "d113a1c7700d347fffa92ef96a3def05")`. Search these indices from the prescription builder:
- `drugs` → `DrugHit` (drug picker AND allergy picker both search `drugs`... note: web allergy modal searches index `allergies`; **confirm which index the allergy picker uses** — web `DrugModal` uses `drugs`, allergy modal reportedly `allergies`. Default to matching each modal's index: drug→`drugs`, allergy→`allergies`, diagnosis→diagnoses index, lab→`lab-tests`).
- diagnoses index → `DiagnosisHit` (display `ascii_desc (ascii_short_desc)`, submit `ascii_desc`).
- `lab-tests` → `LabTestHit` (display `test_name - code`, submit numeric `id`).

---

## Screen-by-Screen Build Spec (implemented features only)

1. **Login** (`/login`, RTL Arabic): phone field, Arabic labels (`تسجيل الدخول`, `أدخل رقم الجوال`, placeholder `05xxxxxxx`). Normalize Arabic-Indic digits (`٠-٩`→`0-9`), require exactly 10 digits, strip leading `0`, prefix `+966`. Calls `POST /send-otp` → navigate to OTP passing `phoneNumber`.
2. **OTP** (`/otp`, RTL Arabic): 4 boxes, auto-advance, auto-submit when full, resend (re-calls send-otp). Calls `POST /verifyOTPandLogin` → store token+userId → go to Feed.
3. **Feed / Home** (`/`, LTR English): paginated list (50/page, "Load More"). Each card: Patient Info (name, age from DOB, phone tel-link, gender chip male=blue/female=pink), consultation details, payment/marketer/subscription/org context. Actions by status: `Paid` → **Accept** (PUT DOCTOR_ACCEPTED, optimistically set status Open + doctorJoinedAT now); `Open` → **Chat** (→ `/chat/{id}`). Sidebar/drawer: Feed, My Consultations, Sign out (clear correct keys).
4. **My Consultations** (`/myConsultations`, LTR): paginated (metadata shape), items-per-page selector (10/25/50/75/100), cards, tap for detail.
5. **Chat** (`/chat/{consultationId}`, chat area RTL Arabic input `اكتب رسالة...`): 
   - Fetch `GET /consultations/{id}` for header (patient name/age/gender, status chip, doctor info).
   - Connect socket, `joinRoom`, `loadMessages`, render bubbles with read receipts (single/double check, green when read), voice-note player (`just_audio`), image attachments, generic file links.
   - Input: text send; attach image/file (pick → `POST /upload-consultation-attatchment` → emit `sendMessage` with `chat`); record voice note (`record`, mime audio/mp4, filename `voice_note.mp4`, send `recordedTime`).
   - Header actions: **Accept** (if Paid), **End Consultation** (confirm dialog → PUT END_CONSULTATION → disable input when Closed), **Video call** button, **Back to Feed**.
   - Context modals: Patient History (`previousConsultations` w/ diagnoses, prescription PDFs, lab PDFs, payment, duration `(closedAt-doctorJoinedAT)/60000` min), Obesity Survey, Vitamins/Subscription Survey, Subscription details.
   - Tab bar: **Chat** and **Prescription** only (do NOT render SOAP/Sick-Leave tabs — out of scope).
6. **Prescription builder** (`/chat/{id}/prescription`, LTR): Algolia-searched Drugs (with DrugModal fields + validation from section 7), Diagnoses, Allergies, Lab Tests. Confirm → `POST /consultations/{id}/prescription` → success message "issued and sent to the patient".
7. **Video call** (LiveKit overlay): start → `POST /get-token` → connect room → mic/camera toggle, participants count, end. Signaling via socket `videoCallStarted/Ended`. Incoming call (from `videoCallStarted` where `initiatedBy != doctor`, or FCM `INCOMING_CALL`): full-screen ringtone UI (use `flutter_callkit_incoming` or a custom screen), 60s auto-decline, Answer → open `/chat/{id}`.
8. **Push notifications:** request permission ~3s after login (once, guarded by `push_permission_requested_doctor`), get FCM token, `POST /push-tokens` with `role:"doctor"`, `provider:"fcm"`. Foreground: display via `flutter_local_notifications`; route on tap: `NEW_MESSAGE`/`INCOMING_CALL`/`MISSED_CALL` → `/chat/{consultationId}`, `NEW_CONSULTATION` → feed/my-consultations. On logout: DELETE the push token.

---

## Localization / Theming

- **Mixed direction:** RTL Arabic for Login, OTP, and the chat message area/input; LTR English for Feed, My Consultations, chat header/buttons, prescription builder. Implement per-screen `Directionality`.
- **Brand colors:** primary green `#4DA514` (`custom-green`), background tint `#F5FAF1` (`custom-background`, used for doctor's own chat bubbles), body white, text black.
- **Font:** use **Cairo** (Arabic-friendly; the web Tailwind config intended Cairo even though it accidentally loaded Inter).
- **Status colors:** Open=green, Paid=blue, Closed=red/gray, PendingPayment=orange. Gender chips male=blue-200, female=pink-200. Centralize this in one Dart helper (web had it duplicated per screen — fix that).

> **NOTE — visual design is a SEPARATE later phase.** A new canonical brand look (forest/lime/cream palette, Cairo, pill buttons, a reusable widget kit) is specified in **`LABASS_DESIGN_SYSTEM.md`** and will be applied AFTER this functional rebuild. Build the functional screens now with basic/neutral styling; do NOT invest in the `#4DA514` look — it is being retired. Do not read or act on the design system until that phase begins.

---

## Verification

End-to-end, against the **test** backend (`https://api.test.labass.sa/api_labass`) so real data flows:
1. **Auth:** run app → Login with a real KSA doctor number → receive OTP → verify → confirm token+userId stored in secure storage and land on Feed. Confirm 401 handling routes back to Login.
2. **Feed:** list loads with pagination; Accept a `Paid` consultation → status flips to `Open`; Chat opens the room.
3. **Chat realtime:** open a consultation on the Flutter app AND the existing web app (or patient app) side-by-side → send text both ways → verify `receiveMessage`, read receipts (`messageStatus`), and ordering. Send an image and a voice note → verify upload endpoint returns `chat`, socket emits, and playback works. End consultation → input disables.
4. **Prescription:** search a drug in Algolia, fill required fields, add a diagnosis/allergy/lab test, confirm → verify `POST /consultations/{id}/prescription` returns success and patient receives PDF.
5. **Video:** start a call → verify `/get-token`, LiveKit connect, mic/camera toggle, and that the other side sees `videoCallStarted`. Trigger an incoming call → ringtone UI → Answer navigates to chat.
6. **Push:** grant permission → verify `/push-tokens` POST with `role:doctor, provider:fcm` → send a test FCM message of each `data.type` → verify foreground display + tap routing. Logout → verify token cleared and push token deleted.
7. Run `flutter analyze` and `flutter test` (add unit tests for model `fromJson` round-trips against captured sample responses, and for the phone-normalization + age-calc helpers).

**Recommended first step for the Flutter agent:** capture 2–3 real JSON responses from `GET /feed-consultations`, `GET /doctor-consultations`, and `GET /consultations/{id}` against the test backend, and pin them as fixtures — this eliminates any remaining ambiguity in the loosely-typed nested objects (subscription/surveys/previousConsultations) before writing the models.
