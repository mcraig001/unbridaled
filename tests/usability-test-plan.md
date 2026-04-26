# Usability Test Plan — Unbridaled
**Version:** 1.0 | **Date:** 2026-04-26

## Success Criteria

A usability test is "passed" if:
1. User completes intake in ≤ 15 minutes without confusion
2. User can explain what each of the 3 scenario cards means
3. User can find and click "Show calculations" and understands what they see
4. User rates the experience "dignified" or "respectful" (not "scary" or "pushy")
5. User notices and understands the Quick Exit button
6. User says they would share the PDF with an attorney or financial advisor

## Target Participants

**N = 5 testers**

ICP criteria:
- Woman, ages 28–52
- Currently in a relationship lasting 3+ years
- Household income $60K–$150K
- Resident of CA, TX, or NY
- Has considered separation at some point (or has a close friend who has)

**ICP note:** Operator does not share this ICP personally. Recruit via trusted networks — NOT via cold outreach, Reddit, or Facebook groups per G4.

## Session Protocol

**Duration:** 60 minutes
**Format:** Zoom, screen share, think-aloud
**Compensation:** $75 Amazon gift card

### Pre-session briefing script
"We're going to look at a financial planning tool together. There are no right or wrong answers — we're testing the tool, not you. I'll ask you to think out loud as you go. You can stop or skip anything you're uncomfortable with."

### Tasks
1. "Look at the landing page and tell me what you think this product does."
2. "Imagine you wanted to understand your financial picture. Walk me through what you'd do."
3. "You've reached the results page. What do these three cards mean to you?"
4. "Show me where the calculations come from."
5. "How would you describe this product to a friend?"
6. "Is there anything that made you feel pressured or uncomfortable?"

### Post-session survey (5-point scale)
- The product felt respectful (1=strongly disagree, 5=strongly agree)
- The numbers felt credible and sourced
- I understood what each scenario meant
- I would share this PDF with an attorney or advisor
- I felt my privacy was protected

## Failure Conditions (FAILURES.md)

Log any instance of:
- User confused about what a scenario card means (not completing task 3 above)
- User doesn't notice Quick Exit button when prompted
- User feels pressured to take action
- User says copy feels "scary" or "urgent"
- User can't find "Show calculations" in under 30 seconds
- User doesn't understand disclaimer
- User is unable to complete intake in 15 minutes

## Sign-off

Before opening to ICP testers:
- [ ] LEGAL_REVIEW_COMPLETE=false (gate is on during testing)
- [ ] Plaid is Sandbox only
- [ ] No real payment processing
- [ ] Test accounts created and working
- [ ] Resend verified for notification emails (if any)
