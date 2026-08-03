# Labass Design System — shared look across ALL Labass apps

> **This is a SEPARATE phase from the functional Flutter rebuild** (`FLUTTER_REBUILD_PLAN.md`).
> Apply it to re-skin the doctor Flutter app AFTER the functional rebuild (auth, feed,
> my-consultations, chat, prescription, video, push) is complete. Visuals only — do NOT
> change any API calls, socket events, models, or navigation.

## Context & goal

One canonical brand look across the patient web, doctor web, and the new Flutter apps. The new-design pages in `nextjs_patient` (`src/app/obesityProgram`, `generalPackage`, `landingPage`) define the *de facto* new brand, but they hardcode hex values in CSS modules with **no shared token source**. We fix that by defining ONE framework-agnostic token spec that every app implements natively (Flutter can't share widget code with Next.js, but it shares the exact tokens).

**Decisions (locked):**
- New palette is **canonical** — retire the old `#4DA514` everywhere.
- Doctor app is a **theme-only restyle** of functional screens (palette + pill buttons + cards + Cairo font). **NO marketing flourishes** (no hero orbs, animated chips, stat strips, spark charts).
- Fonts: **Cairo** (Arabic + UI) + **Inter** (Latin words & numerals). *(Web CSS references "Tajawal" but only Cairo is shipped — standardize on Cairo.)*

---

## Deliverable 1 — Standalone token spec (framework-agnostic)

This file IS that spec. Optionally also emit `design-tokens.json` with the same values. Then every app consumes it:
- **Flutter apps** implement it as Dart token classes + `ThemeData` (Deliverable 2).
- **Web apps** promote the hardcoded hex into Tailwind `theme.extend.colors` + CSS variables using the SAME token names, and refactor the `.module.css` hardcodes to reference them. This is how the patient web, doctor web, and Flutter converge on one look.

### Color tokens (canonical)
| Token | Hex | Use |
|---|---|---|
| `forest` (primary) | `#173404` | primary buttons, brand mark, dark sections, primary ink |
| `forestDeep` | `#0d2002` | headings, footer, pressed state |
| `lime` (accent) | `#7ED957` | accent dots, arrow glyphs, CTA-on-dark, active indicators |
| `sage` | `#97C459` | hero gradient end |
| `green600` | `#639922` | checkmarks, selected radio, active dots |
| `green700` | `#27500A` | secondary accent text/icons on light |
| `surface` | `#fdfcf7` | app/card cream background |
| `surfaceAlt` | `#f7fbf0` | alt section background |
| `surfaceTint` | `#f2faed` | strip/notice background |
| `paleGreen` | `#EAF3DE` | badges, icon chips, text-on-dark |
| `paleGreen2` | `#C0DD97` | subtle accents on dark |
| `white` | `#ffffff` | cards, nav |
| `ink` base | `rgb(23,52,4)` | text color; opacities: heading `#0d2002`, body `0.82`, secondary `0.70`, muted `0.55` |
| ink-on-dark | `#EAF3DE` | text on forest; secondary `rgba(234,243,222,0.75)`, muted `0.55` |
| `border` | `rgba(23,52,4,0.08–0.15)` | hairline borders (0.5px) |

**Status colors** (functional — centralize in ONE Dart mapper; the web duplicated it per-screen, don't repeat that): `Open`→green600, `Paid`→blue, `Closed`→red/gray, `PendingPayment`→orange, `Failed`→red. Gender chips: male=blue-200 tone, female=pink-200 tone.

### Shape, elevation, motion tokens
- **Radii:** `sm 12`, `md 14`, `lg 16`, `xl 18`, `xxl 22`, `pill 999`. Buttons & badges = pill.
- **Shadows:** card `0 24px 64px rgba(23,52,4,0.08)`; hover `0 16px 36px rgba(23,52,4,0.10)`; chip `0 8px 22px rgba(23,52,4,0.15)`.
- **Borders:** hairline `0.5px solid rgba(23,52,4,0.08–0.15)`.
- **Spacing scale:** 8-based (8/12/14/16/20/22/24/32/48).
- **Motion:** easing `cubic-bezier(0.37,0,0.63,1)`; keep only subtle motion for theme-only scope — pulsing "live/status" dot (1.8s), button press lift (`translateY(-1px)`), pill-button arrow nudge on tap. Respect reduced-motion.

### Typography tokens
- **Fonts:** ship **Cairo** (weights Regular/Medium/SemiBold/Bold/ExtraBold) — files already exist at `nextjs_patient/labass_patient/public/fonts/Cairo-*.ttf`; copy into the Flutter app's `assets/fonts/`. Use **Inter** for Latin words & numerals (`fontFamilyFallback`), matching the web (`.lat`/`.glp` classes use Inter with tight tracking).
- **Scale** (name / size / weight / letter-spacing):
  - `sectionTitle` 30 / 800 / -0.6 (mobile 24)
  - `titleLg` 17 / 800 / -0.2
  - `title` 15 / 800
  - `statNum` 32–44 / 800 / tabular-nums (Inter)
  - `body` 14 / 500 / lh 1.6
  - `bodySm` 12.5 / 400–500 / lh 1.7
  - `label`/`eyebrow` 12 / 500
  - `caption` 10.5 / 500 / muted

---

## Deliverable 2 — Flutter theme + widget kit

Location: `lib/core/design/` → `labass_colors.dart`, `labass_typography.dart`, `labass_radii.dart`, `labass_shadows.dart`, `labass_spacing.dart`, `labass_theme.dart` (builds `ThemeData` with the palette, Cairo `textTheme`, pill `ElevatedButtonTheme`, card theme, input theme with lime/forest focus). Register Cairo+Inter in `pubspec.yaml`.

Reusable widgets in `lib/shared/design_kit/` (build once, use across every screen):
- `LabassPillButton` — primary (forest bg, `paleGreen` label, lime circular arrow glyph) + secondary/ghost (transparent, hairline border, fills forest on press). Pill radius, press lift.
- `LabassCard` — white/cream, hairline border, radius 14–16, soft shadow, optional tap lift.
- `LabassEyebrow` — pill chip with pulsing dot + label (section/status headers).
- `LabassSectionHeader` — eyebrow + title + subtitle.
- `LabassStatusBadge` — maps `ConsultationStatus` → color/label (the single status mapper).
- `LabassSelectableCard` / `LabassRadio` — plan-card radio pattern (forest ring when selected); reuse for prescription option lists & items-per-page selector.
- `LabassTextField` — hairline border, pill/rounded, lime focus ring; used by login/OTP/chat input/prescription forms.
- `LabassFaqTile` — accordion row (rotating `+`→`×` icon) if any expandable lists are needed.

### Applying it to the doctor screens (theme-only)
- **Login / OTP:** cream `surface` background, forest headings, `LabassPillButton` primary for submit/verify, `LabassTextField` for phone/OTP boxes with lime focus. RTL Arabic. Small brand mark (forest circle + lime dot, per web `.mark`) instead of a full marketing hero.
- **Feed / My Consultations:** `LabassCard` per consultation, `LabassStatusBadge` for status, `LabassPillButton` for Accept/Chat, forest/green section headers, cream page background. "Load More" = ghost pill button.
- **Chat:** forest/cream header, `LabassStatusBadge`, own-message bubbles use `paleGreen`/`surfaceAlt` fill with forest text, other bubbles white; input bar = `LabassTextField` + pill send button; video/end actions as pill buttons.
- **Prescription:** `LabassCard` sections, `LabassSelectableCard` for added drugs/diagnoses, `LabassPillButton` "Issue prescription", forest section headers.

**Reference files (patient web, for exact values):** `nextjs_patient/labass_patient/src/app/obesityProgram/obesity.module.css`, `generalPackage/generalPackage.module.css`, `landingPage/_components/*`, `tailwind.config.ts`, `src/app/globals.css`, and the shipped fonts in `public/fonts/`.

---

## Verification
- `flutter analyze` passes.
- Run the app: every screen uses the new palette / Cairo font / design-kit components.
- `grep -ri "4DA514\|F5FAF1" lib/` returns nothing — the old brand is fully retired.

---

## Ready-to-send prompt (paste to the Flutter agent when this phase begins)

```
The functional rebuild (auth, feed, my-consultations, chat, prescription, video,
push) is done. This is a NEW, SEPARATE phase: apply the Labass Design System to
re-skin the existing screens. Do NOT change any API calls, socket events, models,
or navigation — visuals only.

Read the design spec first: LABASS_DESIGN_SYSTEM.md. Source-of-truth values live
in the patient web repo:
  nextjs_patient/labass_patient/src/app/obesityProgram/obesity.module.css
  nextjs_patient/labass_patient/src/app/generalPackage/generalPackage.module.css
  nextjs_patient/labass_patient/src/app/landingPage/_components/*
  nextjs_patient/labass_patient/tailwind.config.ts  +  src/app/globals.css
  nextjs_patient/labass_patient/public/fonts/Cairo-*.ttf   (ship these)

Canonical brand (RETIRE the old #4DA514 everywhere):
  forest #173404, forestDeep #0d2002, lime #7ED957, sage #97C459,
  green600 #639922, green700 #27500A, surfaces #fdfcf7/#f7fbf0/#f2faed,
  paleGreen #EAF3DE / #C0DD97. Ink = rgb(23,52,4) at opacities
  (heading #0d2002, body .82, secondary .70, muted .55).
Radii: sm12 md14 lg16 xl18 xxl22 pill999 (buttons/badges = pill).
Shadows: card 0 24px 64px rgba(23,52,4,.08); hover 0 16px 36px rgba(23,52,4,.10).
Fonts: Cairo (Regular/Medium/SemiBold/Bold/ExtraBold) for Arabic+UI, Inter for
Latin words & numerals. Register in pubspec with fontFamilyFallback.

Build in this order:
1. Tokens + theme: lib/core/design/{labass_colors,labass_typography,labass_radii,
   labass_shadows,labass_spacing,labass_theme}.dart — ThemeData with the palette,
   Cairo textTheme, pill button theme, card theme, input theme (lime/forest focus).
2. Widget kit: lib/shared/design_kit/ — LabassPillButton (primary forest + lime
   arrow glyph; ghost with hairline border), LabassCard, LabassEyebrow (pulsing
   dot chip), LabassSectionHeader, LabassStatusBadge (the ONE ConsultationStatus
   -> color mapper), LabassSelectableCard/LabassRadio, LabassTextField, LabassFaqTile.
3. Refactor existing screens to use the theme + kit (theme-only, NO marketing
   flourishes — no hero orbs, animated chips, stat strips, spark charts):
   - Login/OTP: cream bg, forest headings, brand mark (forest circle + lime dot),
     pill submit, LabassTextField, RTL.
   - Feed / My Consultations: LabassCard per item, LabassStatusBadge, pill
     Accept/Chat, ghost "Load More".
   - Chat: forest/cream header, own bubbles paleGreen/surfaceAlt fill + forest text,
     other bubbles white; input = LabassTextField + pill send.
   - Prescription: LabassCard sections, LabassSelectableCard for added items,
     pill "Issue prescription".
Respect reduced-motion; keep motion minimal (pulsing status dot, press lift).

Verify: flutter analyze passes; run the app and confirm every screen uses the
new palette/font/components and no #4DA514 remains (grep the codebase).
```
