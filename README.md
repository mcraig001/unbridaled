# Unbridaled

Financial scenario planning for women evaluating their household finances. Provides sourced projections — not advice — for what different outcomes might look like.

**Stack:** Next.js 16 · Tailwind CSS · Supabase · Stripe · Plaid (Sandbox) · Resend · Vercel

**Launch states:** California · Texas · New York

---

## Getting Started

```bash
cp .env.local.example .env.local
# fill in values — see OPERATOR_HANDOFF.md for which are required vs optional
npm install
npm run dev
```

Open `http://localhost:3000`.

**Pre-launch gate:** The app redirects all authenticated routes to `/coming-soon` until `LEGAL_REVIEW_COMPLETE=true` is set in your environment. This is intentional. See `OPERATOR_HANDOFF.md`.

---

## Development

```bash
npm run dev       # Next.js dev server with Turbopack
npm test          # Jest unit tests (66 tests)
npm run build     # Production build
npm run lint      # ESLint
```

---

## Project Structure

```
app/               # Next.js App Router pages and API routes
  api/
    account/delete/  # G2: full data purge on account deletion
    export-pdf/      # PDF report generation
    leads/           # Email capture
    plaid/           # Bank connection (Sandbox only)
    scenarios/       # Core calculation endpoint
    stripe/          # Checkout + webhook
  checklists/        # State legal document checklists (Core tier)
  intake/            # 8-step financial intake form
  methodology/       # Formula explanations and source citations
  pricing/           # Pricing page
  results/           # Scenario results dashboard
  signup/            # Account creation + Stripe trial
components/
  FormulaConfidence.tsx   # HIGH/MEDIUM/ESTIMATE confidence badges
  NumberBreakdown.tsx     # Click-through formula transparency (S5)
  PrivateBrowsingPrompt.tsx
  QuickExitButton.tsx     # Fixed quick exit on all pages
  ScenarioPDF.tsx         # 7-page PDF report
  SessionGuard.tsx        # 15-min idle session clear
  UpsellPrompt.tsx        # Soft post-scenario upsell
lib/
  email/
    templates.ts    # Resend email templates (welcome, verify, deletion)
  legal-checklists/
    ca.ts           # California divorce document checklist
    tx.ts           # Texas divorce document checklist
    ny.ts           # New York divorce document checklist
  states/
    ca.ts           # CA spousal support, child support, property division
    tx.ts           # TX spousal maintenance, child support, property
    ny.ts           # NY maintenance, CSSA child support, equitable distribution
  hud-fmr.ts        # HUD Fair Market Rents API (rental cost estimates)
  scenario-engine.ts # Core calculation engine (pure TS, fully tested)
__tests__/         # Jest unit tests
  states-ca.test.ts   # 6 tests + official worked example (SC-0)
  states-tx.test.ts   # 9 tests
  states-ny.test.ts   # 7 tests
  scenario-engine.test.ts # Integration tests
docs/
  legal/
    terms-of-service-draft.md  # ToS draft — requires attorney review
    privacy-policy-draft.md    # Privacy Policy draft — requires attorney review
  safety-audit.md
  security-posture.md
supabase/
  migrations/001_unbridaled_schema.sql
proxy.ts          # Next.js 16 route proxy (auth + legal gate)
```

---

## Formula Sources

All formulas are sourced from primary legal statutes. No third-party estimates.

| State | Formula | Source | Verification |
|-------|---------|--------|-------------|
| CA | Spousal support (Santa Clara) | Cal. Fam. Code § 4320 | selfhelp.courts.ca.gov official example ✓ |
| CA | Child support (K-factor) | Cal. Fam. Code § 4055 | **ESTIMATE** — K-factor approximated, disclosed in UI |
| CA | Community property | Cal. Fam. Code § 760 | Statute ✓ |
| TX | Spousal maintenance | Tex. Fam. Code § 8.051–8.054 | OAG calculator ✓ |
| TX | Child support | Tex. Fam. Code § 154.125 (Sept 2025 update) | OAG calculator ✓ |
| NY | Maintenance | DRL § 236(B)(6) | nycourts.gov ✓ |
| NY | Child support (CSSA) | Family Court Act § 413, LDSS-4515 Rev 03/26 | OTDA worksheet ✓ |

---

## Product Shape Requirements (S1–S7)

From the product spec — all implemented:

- **S1:** Scenarios only, not advice
- **S2:** Dignified copy, no fear-based language
- **S3:** Safety UX: Quick Exit, session timeout, private browsing prompt, safe-device warning
- **S4:** Formulas sourced from primary legal statutes
- **S5:** Click-through transparency on every output number (NumberBreakdown)
- **S6:** Pre-launch LEGAL_REVIEW_COMPLETE gate
- **S7:** No dark-pattern upsells (UpsellPrompt: dismissible, specific benefit stated, once per session)

---

## Guardrails (G1–G7)

- **G1:** "Not financial, legal, or tax advice" disclaimer on every page, in footer, in API responses, in PDF
- **G2:** Full data purge: account deletion removes all rows, revokes Plaid access, confirms via email
- **G3:** 3 launch states only (CA, TX, NY) — engine rejects unknown states
- **G4:** No cold outreach — email requires explicit opt-in
- **G5:** No autonomous payments — Stripe is TEST mode, domain pending operator approval
- **G6:** No fabricated data — every formula cites primary source
- **G7:** LEGAL_REVIEW_COMPLETE gate — attorney review required before app routes open

---

## Pre-Launch Checklist

See `OPERATOR_HANDOFF.md` for the complete gate checklist. Short version:

- [ ] Attorney reviews ToS and Privacy Policy drafts (`docs/legal/`)
- [ ] Set `LEGAL_REVIEW_COMPLETE=true` in Vercel environment
- [ ] Purchase domain (getunbridaled.com available, ~$12/yr)
- [ ] Configure Supabase project + Vault extension
- [ ] Set Stripe product IDs (`STRIPE_FRONTEND_PRODUCT_ID`, `STRIPE_CORE_PRODUCT_ID`)
- [ ] Apply for Plaid Production (Sandbox only until approved)
- [ ] Get HUD API token at huduser.gov (free)

---

## Adding a New State

1. Create `lib/states/XX.ts` — implement `calcXXSpousalSupport`, `calcXXChildSupport`, `calcXXPropertyDivision`
2. Add 3 lines to `runScenarios()` switch in `lib/scenario-engine.ts`
3. Add formula rows to `supabase/migrations/001_unbridaled_schema.sql` seed
4. Add `XX_CHECKLIST` and `XX_CHECKLIST_META` to `lib/legal-checklists/xx.ts`
5. Add to `STATE_DATA` map in `app/checklists/page.tsx`
6. Write unit tests in `__tests__/states-xx.test.ts` — verify against official worked examples

---

## License

Proprietary. All rights reserved. See `DECISION_LOG.md` for operator context.
