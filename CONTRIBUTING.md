# Contributing to Unbridaled

Thank you for your interest in improving Unbridaled. Because this product serves a vulnerable population, we hold contributions to a high standard. Please read this before submitting a pull request.

## Core principles

**1. Source everything.**
Every formula, percentage, cap, and threshold must cite a primary legal source (statute, official court document, or federal data). We do not accept contributions based on secondary sources, blog posts, or legal summaries alone.

**2. Mark estimates clearly.**
If a formula approximates judicial discretion or requires a lookup table we don't have access to, mark it `ESTIMATE` in code comments, test notes, and UI badges. Do not present estimates as exact.

**3. Verify against official worked examples.**
Before adding a new state, find an official worked example from the state courts, OAG, or DSHS. Write a test that matches the official example exactly. If no official example exists, note this in the test file.

**4. Safety UX is non-negotiable.**
Any change that touches the intake flow, results page, or account management must preserve: Quick Exit button, session timeout (15 min idle clear), privacy-first data practices (no server storage without account), and the LEGAL_REVIEW_COMPLETE gate.

**5. No dark patterns.**
Do not add: fake scarcity, countdown timers, misleading free trial language, friction on cancellation, or any opt-out dark patterns. The anti-dark-patterns commitment on the pricing page is a product constraint, not a marketing claim.

## Development setup

```bash
git clone https://github.com/mcraig001/unbridaled.git
cd unbridaled
npm install
cp .env.local.example .env.local
# fill in at minimum: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

## Running tests

```bash
npm test               # all tests
npm test -- --watch    # watch mode
npm test -- --verbose  # show each test name
```

## Adding a new state

Follow these steps exactly. Skipping any step will block the PR.

1. **Create `lib/states/XX.ts`**
   - Export `calcXXSpousalSupport`, `calcXXChildSupport`, `calcXXPropertyDivision`
   - Cite primary statutes in file-level JSDoc comment
   - Include `lastReviewed` date
   - Mark anything that approximates judicial discretion as ESTIMATE

2. **Add to `lib/scenario-engine.ts`**
   - Add `"XX"` to `SupportedState` type
   - Add state to `SUPPORTED` array in `runScenarios`
   - Add state blocks to `getSpousalSupportForState`, `getChildSupportForState`, `getPropertyDivision`

3. **Create `lib/legal-checklists/xx.ts`**
   - Source checklist items from official court self-help pages
   - Export `XX_CHECKLIST` and `XX_CHECKLIST_META`
   - Include `disclaimer` and `primarySource` in meta

4. **Update `app/checklists/page.tsx`**
   - Add to `STATE_DATA` map

5. **Update `app/intake/page.tsx`**
   - Add to state selector array and labels map

6. **Update `app/api/scenarios/route.ts`**
   - Add to `supportedStates` array

7. **Write `__tests__/states-xx.test.ts`**
   - Cover spousal support, child support, and property division
   - Include at least one official worked example test if available
   - Cover edge cases: zero income, income at/above cap, short vs. long marriage

8. **Update `OPERATOR_HANDOFF.md`**
   - Add state to the supported states list

## Formula accuracy requirements

| Formula type | Minimum requirement |
|-------------|---------------------|
| Fixed statutory formula | Exact match to statute + official example |
| Table-based (child support) | Percentage approximation with ESTIMATE flag + link to official calculator |
| Judicial discretion (maintenance) | Range estimate with ESTIMATE flag + disclosure language |
| Property division | Method-specific (community, equitable, just/equitable) with range where applicable |

## Test requirements

- All existing tests must pass before PR is reviewed
- New state: minimum 10 new tests
- Edge cases required: zero income, zero children, income at cap, income above cap
- No test may mock state formula functions (integration tests at the scenario engine level must use real formulas)

## Pull request checklist

Before submitting:

- [ ] All tests pass (`npm test`)
- [ ] Build is clean (`node node_modules/next/dist/bin/next build`)
- [ ] No new ESLint warnings
- [ ] All formulas have primary source citations
- [ ] ESTIMATE flag used for any approximation
- [ ] Official worked example test added (or documented why none exists)
- [ ] Checklist sourced from official courts/government pages
- [ ] OPERATOR_HANDOFF.md updated if new state added
- [ ] Quick Exit, SessionGuard, disclaimer preserved on any new pages

## Questions

Open an issue before working on large features or new states. We want to make sure the sourcing approach is agreed on before you invest significant time.
