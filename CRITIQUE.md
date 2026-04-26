# CRITIQUE — Unbridaled Adversarial Analysis
**Date:** 2026-04-26 | **Pass:** 7 (written in Pass 2/3 for early integration)

Five stress tests, steel-manned. For each: the critique, the exposure, and the specific fixes implemented or required.

---

## A. The User in Distress — Coercive Control

**Critique:**
A user in a coercive control situation may be actively monitored by their partner. If they visit Unbridaled, even in private browsing, the partner might:
- Check phone for apps open
- Check notification history
- See "Unbridaled" in autocomplete or app switcher
- Access a shared device where session was left open
- See a PDF export notification or email

**Specific harm vectors:**
1. Partner discovers the visit → escalation risk
2. User leaves tab open → partner sees scenario numbers
3. User receives an email from Unbridaled to shared inbox
4. Quick Exit doesn't fully clear on shared device (localStorage)

**Exposure:** Reputational (harm to user) and product liability (if positioned as "safe" and isn't).

**Fixes implemented:**
- Quick Exit button on every page clears sessionStorage and navigates to weather.com
- Private browsing prompt on first /intake visit
- Session timeout after 15 minutes of inactivity
- No email sent without explicit opt-in
- sessionStorage (not localStorage) for form data — clears on tab close
- No marketing retargeting

**Fixes still needed:**
- [ ] Explicitly state in onboarding: "Use a device your partner doesn't have access to"
- [ ] Add "How to clear your history" link in Quick Exit redirect page (or on landing)
- [ ] App name "Unbridaled" should not appear in browser push notifications, OS-level notifications, or email subject lines without user awareness
- [ ] Consider offering "code name" mode — user can set a display name (e.g., "Budget Planner") that appears in browser title bar while on the site
- [ ] Test that Quick Exit works on iOS Safari (some mobile browsers ignore location.replace history clearing)

**Status:** Partially mitigated. Three critical items above need implementation.

---

## B. The Skeptical Attorney — Legal Liability

**Critique:**
A user makes a worse financial decision because she believed our support estimate. She later sues, claiming she didn't hire an attorney because "the app said she'd get $2,000/month" and she got $800.

**Specific exposure:**
1. California K-factor approximation could be off by 30-40% — not disclosed with sufficient clarity
2. NY maintenance formula uses $228,000 cap that may have changed
3. TX spousal maintenance: we say "ineligible" for users below 10 years — but the court has discretion to consider other factors we don't model (custody of disabled child is modeled, but payee disability requires a separate flag)
4. Disclaimers present but may not be prominent enough at point of number viewing
5. No ToS or Privacy Policy exists yet

**Exposure:** High in a sensitive vertical. Class action risk is low (we don't give advice) but individual lawsuit risk exists if user relied on number.

**Fixes implemented:**
- "ESTIMATE ONLY" flag on CA child support
- "UNVERIFIED" flag on CA K-factor in code
- "Consult a family law attorney" on every support number, in PDF footer, in results page
- LEGAL_REVIEW_COMPLETE gate prevents public access until attorney review
- Ranges (low/mid/high) for all judicial-discretion calculations

**Fixes still needed:**
- [ ] ToS with clear disclaimer section (attorney to draft — operator action)
- [ ] Privacy Policy (attorney to draft — operator action)
- [ ] On CA child support results: add explicit note that K-factor is approximated, link to official childsupport.ca.gov calculator
- [ ] Make "this is an estimate" more visually prominent on results page — not just text
- [ ] Add "Formula accuracy" confidence badges: HIGH (TX child support — exact formula) / MEDIUM (NY maintenance — formula is exact, cap may change) / ESTIMATE (CA child support — K factor approximated)
- [ ] Date-stamp every formula: "Based on [state] law as of [date]" on every number

---

## C. The Competitor — Hello Divorce, Untie the Knot

**What they do better:**
- Hello Divorce (hellodivorce.com): Full-service guided divorce process, flat-fee attorney access, document preparation. Much broader scope. More trusted by users who want hand-holding.
- Untie the Knot (untietheknot.com): Similar financial planning focus, but includes mediation referrals and more holistic emotional support resources.

**Why a user would choose Unbridaled instead:**
1. **Privacy first:** No relationship data, no communication style advice, no "divorce coaching." We are financial numbers only.
2. **Formula transparency:** We show every formula. Competitors often show outputs without explanation.
3. **Lower commitment:** No subscription required to see numbers. No account required for estimates.
4. **State formula precision:** We cite primary statutes. Most competitors use approximations without citations.
5. **No AI relationship advice:** S1 is absolute — we never give relationship guidance.

**Is the answer real or aspirational?**
Real for privacy and transparency. Aspirational for scope — Hello Divorce is 10x the product right now.

**Fixes still needed:**
- [ ] Add a "Why Unbridaled" comparison table on landing/pricing — honest comparison vs. full-service alternatives
- [ ] Lean harder into the formula citation angle — "We cite the statute, not just the formula"
- [ ] Differentiate with the PDF: position it as "a document you take to an attorney" — something Hello Divorce doesn't produce in this format

---

## D. The Plaid Compliance Reviewer

**Critique:**
Will our app pass Plaid Production review? What's missing from our security posture?

**Plaid Production requirements (standard):**
1. Live URL with working app
2. Privacy Policy linked from landing page
3. ToS linked from landing page
4. Clear explanation of what bank data is used for
5. Data use limited to stated purpose (we're good — financial scenario modeling only)
6. No storage of Plaid credentials (we use vault — good)
7. Item access tokens encrypted at rest (Supabase Vault — designed, not yet implemented)
8. Webhook for item updates implemented (partially — structure exists)
9. Income verification or transaction categorization use cases documented

**Missing for Plaid Production:**
- [ ] Privacy Policy (attorney required)
- [ ] ToS (attorney required)
- [ ] Live production URL
- [ ] Supabase Vault actually configured (currently designed, not running)
- [ ] Bank data usage explanation on landing page
- [ ] Plaid Link customization with our brand colors and privacy explanation
- [ ] Transaction categorization logic (currently transactions pulled but not categorized in auto-fill)
- [ ] Webhook handling for ITEM_ERROR and PENDING_EXPIRATION events

**Status:** Not ready for Plaid Production. Blocked on Privacy Policy + ToS. Estimate: 3-4 weeks of operator action.

---

## E. The PE Buyer — 18-Month View

**Critique:**
What's the moat? What would a PE buyer at 8x ARR want to see before acquiring?

**Moat analysis:**
- **Data moat:** WEAK. State formula data is public. No proprietary database.
- **User moat:** MEDIUM. If we build a reputation for accuracy and privacy, switching cost is high (trust in sensitive vertical is earned slowly).
- **Distribution moat:** WEAK currently. SEO could be strong — "CA child support calculator" has real search volume. Attorney referral network is a potential distribution channel.
- **Regulatory moat:** MEDIUM. As we add states with attorney-reviewed formulas, the compliance investment becomes a barrier to entry.

**LTV/CAC model (estimate):**
- CAC: $0 organic (SEO/attorney referral) or $20-50 per paid
- LTV: $9.99/mo Essential × 3 months avg = ~$30 LTV (low — this is not a recurring need for most users)
- Key insight: LTV per user is low, but **referral value is high** — attorneys who trust the product refer clients
- Better model: B2B2C — sell to family law firms as a client intake tool

**What PE would want:**
1. 3+ years of data showing formula accuracy (verifiable outcomes data)
2. Attorney network with referral agreements in place
3. 5+ states live with attorney-reviewed formulas
4. Privacy-certified (SOC2, or at minimum a third-party security audit)
5. B2B revenue from law firms or financial advisors

**Fixes still needed:**
- [ ] Build attorney referral page: "Recommend Unbridaled to your clients" + referral tracking
- [ ] Consider B2B2C pivot: law firm dashboard showing client scenario history
- [ ] Document formula verification process as a repeatable, audited procedure
- [ ] State expansion roadmap: WA, FL, IL next (high divorce rate, distinct legal systems)

---

## Changes Implemented Based on Critique

### A (Coercive Control)
- sessionStorage instead of localStorage ✓
- Quick Exit on every page ✓
- Private browsing prompt ✓
- Session timeout (15min) ✓
- No marketing emails ✓
- TODO: "Use a safe device" onboarding note, code-name mode, iOS Safari test

### B (Legal Liability)
- "ESTIMATE ONLY" and "UNVERIFIED" flags in code ✓
- Disclaimer on every page, in PDF footer ✓
- LEGAL_REVIEW_COMPLETE gate ✓
- Ranges for all discretionary calculations ✓
- TODO: ToS, Privacy Policy, formula confidence badges, official CA calculator link

### C (Competitor)
- Formula transparency and source citations ✓
- No AI relationship advice ✓
- TODO: Comparison table on landing

### D (Plaid)
- Supabase Vault design ✓
- Audit log ✓
- TODO: Privacy Policy, ToS, Vault implementation, Plaid Link customization

### E (PE Buyer)
- Clear architecture for state expansion ✓
- Formula versioning (ub_state_formulas) ✓
- TODO: Attorney referral path, B2B consideration
