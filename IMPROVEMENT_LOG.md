# IMPROVEMENT LOG — Unbridaled
Append-only. Each entry: pass, score, duration, top changes, blockers.

---

## Pass 1 — Initial Build (Phases 0–6)
**Date:** 2026-04-26
**Duration:** ~2 hours (autonomous)
**Commit:** 9d8ac6f

### Score: 64/100

| Category | Score | Notes |
|----------|-------|-------|
| Product shape adherence (10) | 8/10 | S1-S7 implemented. Quick Exit on all pages. Disclaimer every page. Gate active. Minor: no session timeout yet (S3 partial). |
| Safety UX completeness (10) | 6/10 | Quick Exit ✓, no marketing emails ✓, explicit disclaimer checkbox ✓. Missing: session timeout (15min idle clear), private browsing prompt, account deletion flow. |
| Calculation accuracy (10) | 7/10 | All 65 unit tests passing. State formulas verified from primary sources. CA K-factor approximated (UNVERIFIED flag in code). Real worked examples verified for TX and NY. |
| Sourcing integrity (10) | 8/10 | Every formula has source URL in code and tests. All citations to primary sources (leginfo, statutes.capitol.texas.gov, nycourts.gov, childsupport.ny.gov). HUD FMR integrated. Minor: CA K-factor still approximated. |
| Disclaimers + legal posture (10) | 6/10 | G1 disclaimer on every page, in PDF, in API. Legal gate (G7) enforced via middleware. Missing: ToS draft, Privacy Policy draft, CCPA review. |
| PDF report quality (10) | 6/10 | 7-page PDF with sources page, attorney questions, advisor questions. Not yet tested against reference reports. Print/B&W not verified. |
| Conversion readiness (10) | 5/10 | Pricing page built, 3 tiers correct, anti-dark-patterns section. Missing: Stripe product IDs, checkout flow, trial period logic, A/B variants. |
| Code quality (10) | 8/10 | TypeScript throughout, all strict types, build passing, 65 tests passing. No dead code. Minor: middleware deprecation warning (proxy vs middleware). |
| Operator-readiness (10) | 6/10 | DECISION_LOG.md ✓, security-posture.md ✓, usability-test-plan.md ✓. Missing: OPERATOR_HANDOFF.md, PROPOSED_EDITS_2.md (done). |
| Scalability (10) | 4/10 | Adding state #4 requires: new lib/states/XX.ts, update runScenarios() switch, add to ub_state_formulas seed. Clear pattern but not fully abstracted. Engine is pure TS, testable. |

### Top Changes This Pass
1. Complete calculation engine (scenario-engine.ts) with 3 states, 3 scenarios, runway calc
2. 65 unit tests across CA/TX/NY covering all major formula paths
3. Full UI: landing, intake (8 steps), results dashboard, pricing, methodology
4. PDF export (7 pages, sourced), Stripe webhook handler, HUD FMR integration
5. LEGAL_REVIEW_COMPLETE gate enforced at middleware level

### Blockers / Gaps for Pass 2+
- Pass 2: CA child support K-factor verification against official worked examples
- Pass 2: Verify NY maintenance formula against nycourts.gov worked examples
- Pass 3: Session timeout (15-min idle clear) — sessionStorage clearing not yet implemented
- Pass 3: Private browsing prompt not yet built
- Pass 3: Account deletion flow (API route + Plaid disconnect) not yet built
- Pass 4: Click-through transparency on every output number (currently only "Show calculations" toggle)
- Pass 5: PDF tested against reference reports (Bankrate, NerdWallet, NOLO)
- Pass 6: Stripe checkout flow, trial period, product IDs not yet wired
- Middleware deprecation: Next.js 16 uses "proxy" not "middleware" — rename file

---

## Pass 2 — State Formula Rigor (pending)
**Status:** Not yet started

---

## Pass 3 — Safety UX Hardening (pending)
**Status:** Not yet started

---

## Pass 4 — Calculation Transparency (pending)
**Status:** Not yet started

---

## Pass 5 — PDF Quality (pending)
**Status:** Not yet started

---

## Pass 6 — Conversion + Pricing (pending)
**Status:** Not yet started

---

## Pass 7 — Adversarial Critique (pending)
**Status:** Not yet started

---

## Pass 8 — Production Polish (pending)
**Status:** Not yet started
