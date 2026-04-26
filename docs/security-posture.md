# Security Posture — Unbridaled
**Version:** 1.0 | **Date:** 2026-04-26

## Guardrail Compliance (G2)

### Plaid Data Security

| Control | Status | Notes |
|---------|--------|-------|
| Plaid Sandbox during build | IMPLEMENTED | PLAID_ENV=sandbox in env config |
| Access tokens via Supabase Vault | DESIGNED | ub_plaid_items.vault_secret_id references vault.secrets; operator must enable Vault extension |
| Access tokens never plaintext | DESIGNED | Schema stores only vault reference, not token value |
| All data access logged to ub_audit_log | IMPLEMENTED | API routes call logAuditEvent() |
| Account deletion = full purge + Plaid disconnect within 24h | DESIGNED | Account deletion flow pending implementation |
| No third-party analytics on logged-in pages | IMPLEMENTED | No GA/Mixpanel scripts in app layout |

### Authentication & Authorization

| Control | Status |
|---------|--------|
| Supabase Auth (email/password) | Configured |
| Row Level Security on all user tables | IMPLEMENTED (see migration 001) |
| Service role key used only server-side | ENV variable, never exposed client-side |
| JWT verification via Supabase SSR | Configured |

### Data Transmission

| Control | Status |
|---------|--------|
| All traffic HTTPS (Vercel enforces) | YES |
| No PII in query strings | DESIGNED — intake data stored in sessionStorage, not URL |
| No PII in browser history | DESIGNED — results navigation avoids PII in paths |

### Data Storage

| Control | Status |
|---------|--------|
| Scenario inputs/outputs stored as JSONB | YES (ub_scenarios) |
| No PII beyond financial figures in scenario JSONB | DESIGNED — no names, addresses, or SSN in inputs |
| Session data cleared on tab close | YES — sessionStorage (not localStorage) |
| Local save uses sessionStorage key "ub_intake_progress" | YES |

## Plaid Production Requirements (G5 — not yet approved)

Before Plaid Production activation, operator must:
1. Complete Plaid Production application
2. Pass Plaid security review
3. Add production environment variables
4. Verify Supabase Vault is enabled for production project
5. Test account deletion flow end-to-end
6. Confirm full audit log coverage

## ToS and Privacy (Pending Attorney Review)

Per G7 (LEGAL_REVIEW_COMPLETE gate), the app requires:
- Terms of Service (attorney draft — not yet complete)
- Privacy Policy (attorney draft — not yet complete)
- CCPA compliance review (California users)
- Clear data retention policy (30 days post-deletion?)

**These must be complete before LEGAL_REVIEW_COMPLETE is set to true.**

## Secrets Inventory

| Secret | Storage | Rotation |
|--------|---------|----------|
| SUPABASE_SERVICE_ROLE_KEY | Vercel env | On breach |
| STRIPE_SECRET_KEY | Vercel env | On breach |
| STRIPE_WEBHOOK_SECRET | Vercel env | On breach |
| PLAID_SECRET | Vercel env | On breach |
| HUD_API_TOKEN | Vercel env | Annual |
| RESEND_API_KEY | Vercel env | On breach |
| INTERNAL_API_SECRET | Vercel env | Quarterly |

## Known Gaps (to address before launch)

1. **Account deletion API route** — not yet implemented. Must delete: ub_users row, ub_scenarios, ub_pdf_exports, ub_plaid_items, Plaid disconnect, Supabase auth user. Due: Pass 3.
2. **Supabase Vault** — requires operator to enable Vault extension in Supabase dashboard before Plaid tokens can be stored. Documented in OPERATOR_HANDOFF.md.
3. **Session timeout** — 15-minute idle clear not yet implemented (Pass 3).
4. **Private browsing prompt** — not yet implemented (Pass 3).
5. **Email domain split** — functional emails (verify@) vs. no-reply@ — consider subdomain for deliverability (Pass 3).
