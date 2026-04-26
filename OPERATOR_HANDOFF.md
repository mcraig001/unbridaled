# OPERATOR HANDOFF — Unbridaled
**Date:** 2026-04-26 | **Build Pass:** 2-3 complete, 4-8 in progress
**Repo:** https://github.com/mcraig001/unbridaled

---

## Gate Status

| Gate | Status | Action Required |
|------|--------|----------------|
| Domain | PENDING | Choose domain — see below |
| Attorney review | NOT STARTED | Engage attorney for ToS/Privacy Policy/disclaimer review |
| ICP testing | NOT STARTED | Recruit 5 testers per tests/usability-test-plan.md |
| Plaid Production | NOT STARTED | Submit application after attorney review |
| LEGAL_REVIEW_COMPLETE | FALSE | Do NOT set to true until gates 1-4 met |
| Stripe live keys | NOT CONFIGURED | Add after legal review complete |

---

## Domain Decision Required

Three candidates (checked 2026-04-26):

| Domain | Status | Price (est.) | Notes |
|--------|--------|-------------|-------|
| unbridaled.com | TAKEN (since 2000-07-25) | N/A | Network Solutions |
| getunbridaled.com | AVAILABLE | ~$12/yr | Recommended |
| tryunbridaled.com | AVAILABLE | ~$12/yr | Alternative |

**Recommended:** getunbridaled.com — clear, intentional, not aggressive.

**To register:** Use Cloudflare Registrar (~$9/yr, no markup). Do NOT register autonomously — this requires your approval per G5.

---

## Supabase Setup (one-time, operator action)

1. Create new Supabase project (or use existing: rmaokwylstpvmaaycuiu)
2. Run migration: supabase/migrations/001_unbridaled_schema.sql in SQL editor
3. Enable Supabase Vault extension: `CREATE EXTENSION IF NOT EXISTS supabase_vault;`
4. Create project and copy URL + anon key + service role key

---

## Vercel Deploy (one-time, operator action)

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# From ~/ventures/unbridaled
vercel --prod

# Set environment variables in Vercel dashboard:
# (or via: vercel env add <NAME>)
```

Required environment variables (all in .env.local.example):
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (TEST mode)
- STRIPE_SECRET_KEY (TEST mode)
- STRIPE_WEBHOOK_SECRET
- PLAID_CLIENT_ID
- PLAID_SECRET (sandbox)
- PLAID_ENV=sandbox
- HUD_API_TOKEN (sign up: huduser.gov/hudapi/public/register/form)
- RESEND_API_KEY
- RESEND_FROM_EMAIL
- LEGAL_REVIEW_COMPLETE=false
- NEXT_PUBLIC_APP_URL
- INTERNAL_API_SECRET

**CRITICAL:** Set LEGAL_REVIEW_COMPLETE=false. Do not change until all gates cleared.

---

## Stripe Products (TEST mode — operator action)

Create products in Stripe test dashboard:
1. Essential: $9.99/month or $99/year
2. Complete: $29.99/month or $299/year

Copy product IDs to Vercel env:
- STRIPE_FRONTEND_PRODUCT_ID
- STRIPE_CORE_PRODUCT_ID

Add webhook endpoint in Stripe dashboard: `https://[your-domain]/api/stripe/webhook`

---

## Plaid Setup

1. Create Plaid developer account at plaid.com
2. Copy client_id and sandbox secret to Vercel env
3. Test Plaid Link in sandbox mode
4. Do NOT apply for Plaid Production until:
   - Attorney review complete
   - Privacy Policy live on site
   - ToS live on site
   - Security audit complete

---

## HUD API

1. Sign up at: https://www.huduser.gov/hudapi/public/register/form
2. Copy token to HUD_API_TOKEN env var
3. Test fair market rent endpoint

---

## Attorney Review Checklist

Engage a family law attorney and a technology/privacy attorney for:
- [ ] Disclaimer language review (currently on every page — needs attorney approval)
- [ ] "Not financial advice" language — sufficiency
- [ ] Terms of Service draft
- [ ] Privacy Policy draft (CCPA for CA users)
- [ ] State formula accuracy review for CA, TX, NY, WA
- [ ] Review CA child support K-factor approximation disclosure
- [ ] Review WA spousal maintenance / child support ESTIMATE disclosures (no statutory formula)

**Budget estimate:** $1,500–$3,000 for 2-3 hours of attorney time.

---

## ICP Testing

Recruit 5 testers per tests/usability-test-plan.md. Do NOT recruit via:
- Reddit, Facebook groups, Twitter/X (per G4)
- Cold email or DM

**Recruit via:**
- Personal network
- Trusted referrals
- Women's financial planning communities where you have an existing relationship

---

## Launch Checklist

Before setting LEGAL_REVIEW_COMPLETE=true:
- [ ] Domain registered and DNS configured
- [ ] ToS and Privacy Policy live on site (attorney reviewed)
- [ ] Disclaimer language attorney-approved
- [ ] 5 ICP testers completed sessions (tests/usability-test-plan.md)
- [ ] Plaid Production approved (or remain in sandbox — acceptable for soft launch)
- [ ] Supabase Vault configured and tested
- [ ] Account deletion flow end-to-end tested
- [ ] Stripe webhooks tested in test mode
- [ ] Security audit completed

---

## Ongoing Costs (when live)

| Service | Cost | Notes |
|---------|------|-------|
| Vercel | $0–$20/mo | Free tier likely sufficient early |
| Supabase | $0–$25/mo | Free tier likely sufficient early |
| Stripe | 2.9% + 30¢/transaction | TEST mode currently |
| Plaid | $0 sandbox / $0.10-$0.30/user/mo production | Sandbox during build |
| HUD API | $0 | Free |
| Resend | $0–$20/mo | 3,000 free emails/month |
| Domain | ~$12/yr | After operator approval |

---

## Resume Instructions

If resuming an autonomous build session:
1. `cd ~/ventures/unbridaled`
2. `npm test` — verify 66 tests passing
3. Read CHECKPOINT.md for current pass and blockers
4. Read IMPROVEMENT_LOG.md for scores and gaps
5. Continue from current_pass
6. Commit with format: `ub(pass-N): <what>`
7. Push to https://github.com/mcraig001/unbridaled
