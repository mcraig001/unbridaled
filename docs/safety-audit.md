# Safety Audit — Unbridaled
**Version:** 1.0 | **Date:** 2026-04-26
**Auditor:** unbridaled_builder (autonomous session, Pass 3)

---

## Quick Exit Button

| Page | Present | Position | Keyboard accessible |
|------|---------|----------|---------------------|
| Landing (/) | ✓ | Fixed top-right | ✓ (tab-accessible) |
| Coming Soon | ✓ | Fixed top-right (via layout) | ✓ |
| Intake | ✓ | Fixed top-right | ✓ |
| Results | ✓ | Fixed top-right | ✓ |
| Pricing | ✓ | Fixed top-right | ✓ |
| Methodology | ✓ | Fixed top-right | ✓ |
| /api routes | N/A | N/A | N/A |

**Mobile behavior:** Quick Exit button replaces current tab's URL with weather.com using `window.location.replace()`, which removes the site from forward history. On mobile, this closes the browser's back-navigation to this site. NOTE: Cannot fully close a tab programmatically in all mobile browsers — this is a known browser security limitation. User must close the tab manually. Documented.

**Action:** Add a note to the Quick Exit button tooltip on mobile explaining this limitation.

---

## Session Timeout

| Control | Status |
|---------|--------|
| 15-minute idle clear | IMPLEMENTED (SessionGuard.tsx) |
| Clears ub_intake_progress | ✓ |
| Clears ub_scenario_inputs | ✓ |
| Shows confirmation dialog | ✓ |
| Resets on any user activity | ✓ (mousemove, keydown, click, scroll, touch) |

**Gap:** SessionGuard must be imported on /intake and /results pages to be active. Verified: pending integration into page layouts.

---

## Private Browsing Prompt

| Control | Status |
|---------|--------|
| Prompt shown on first visit | IMPLEMENTED (PrivateBrowsingPrompt.tsx) |
| Dismissible | ✓ |
| Not shown again once dismissed | ✓ (sessionStorage flag) |
| Includes keyboard shortcuts for all major browsers | ✓ |

---

## Email Audit

| Trigger | Email sent? | Opt-in required? |
|---------|-------------|-----------------|
| Email capture (landing) | No (collection only, no welcome email currently) | N/A |
| Account registration | Supabase auth verification email only | N/A (required for auth) |
| Scenario complete | No | N/A |
| PDF export | No | N/A |
| Account deletion | Deletion confirmation email — NOT YET IMPLEMENTED | Will require opt-in |

**Finding:** No marketing emails sent from any flow. Email capture on landing page collects leads but does not trigger any email. This is correct per G4.

**Gap:** Account deletion confirmation email (informational, not marketing) should be implemented and sent to confirm deletion is complete.

---

## URL / History Audit

| Page | PII in URL? | Notes |
|------|-------------|-------|
| / (landing) | No | |
| /intake | No | Form data in sessionStorage, not URL params |
| /results | No | Scenario inputs from sessionStorage, not query string |
| /pricing | No | |
| /methodology | No | |
| /api/scenarios | No | POST body only |
| /api/export-pdf | No | POST body only |

**Verified:** No PII in query strings, no PII in browser history beyond pages visited.

---

## Analytics Audit

| Page | GA/Mixpanel/3rd-party analytics? | Status |
|------|----------------------------------|--------|
| / (landing) | None | ✓ G2 compliant (pre-login OK per G2) |
| /intake (app route) | None | ✓ G2 compliant |
| /results (app route) | None | ✓ G2 compliant |

**Note:** G2 permits analytics on pre-login pages (landing, pricing, methodology). We have chosen to add none at all for simplicity. If added later, restrict to landing/pricing/methodology only and exclude all app routes.

---

## Known Gaps (to address before launch)

1. **SessionGuard integration** — needs to be added to intake and results page layouts
2. **Mobile Quick Exit** — document browser limitation, consider overlay instructions
3. **Account deletion email** — implement confirmation email (not marketing, informational)
4. **Email domain split** — consider functional@ vs. noreply@ on separate subdomain for deliverability
5. **Plaid disconnect cron** — operator must configure a job to call Plaid `/item/remove` API for items with `disconnected_at` set. Target: within 24h of deletion request.
