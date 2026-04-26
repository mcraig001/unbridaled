# Privacy Policy — DRAFT
**Status:** DRAFT — requires attorney review before publication  
**Last updated:** 2026-04-26  
**Entity:** [OPERATOR: INSERT LLC/CORP NAME]  
**Product:** Unbridaled  
**Attorney review required before publishing:** YES — see [ATTORNEY REVIEW NOTES] sections

---

> **To the operator:** This draft addresses CCPA (California), and broadly applies to NY and TX. A full CCPA compliance review by an attorney is required before publishing, given that your primary launch state is California. Users in this product's target demographic deserve clear, honest privacy commitments — draft language errs on the side of specificity.

---

## 1. Who We Are

Unbridaled is operated by [OPERATOR ENTITY NAME] ("Company," "we," "us," "our"). We provide an educational financial scenario planning tool for people evaluating their household finances. We take privacy especially seriously because we know you may be in a vulnerable situation.

**Contact:** [OPERATOR EMAIL]  
**Address:** [OPERATOR MAILING ADDRESS]

## 2. Information We Collect

### 2a. Information you provide

**Free tier (no account):**
- Financial inputs you enter (income, expenses, assets, children) — stored ONLY in your browser's session storage. Never transmitted to our servers unless you explicitly generate a scenario. Cleared when you close the browser tab.
- Email address, if you opt in to our waitlist or updates.

**Account users:**
- Email address and password (hashed — we never store plaintext passwords)
- Financial inputs you choose to save
- Scenario results you generate and save
- Bank account connection data via Plaid (if you choose to connect) — see §5

### 2b. Information collected automatically

- Browser type, operating system, general geographic region (not precise location)
- Pages visited and features used (anonymized)
- Error logs (no financial data included)

We do **not** use third-party advertising trackers. We do **not** use Google Analytics or Meta Pixel. 

[ATTORNEY REVIEW NOTES: Confirm analytics provider and update this section. If using any third-party analytics, disclose it here. Under CCPA, sharing data with analytics providers for purposes other than "service provider" purposes may constitute a "sale."]

### 2c. Information we do NOT collect

- Your name (unless you provide it)
- Precise location
- Social Security number
- We do not collect any data not listed in §2a or §2b

## 3. How We Use Your Information

We use collected information to:

1. **Provide the Service** — run financial scenario calculations and generate reports
2. **Maintain your account** — authentication, session management, account deletion
3. **Communicate with you** — account notifications, scenario completion, deletion confirmations (no marketing without opt-in)
4. **Improve the Service** — anonymized usage patterns to understand which features are helpful
5. **Legal compliance** — respond to valid legal process, protect our rights

We do **not** use your financial data to train machine learning models.  
We do **not** sell your data to third parties.  
We do **not** share your data with data brokers.

## 4. How We Share Your Information

We share your information only with:

- **Supabase** — our database and authentication provider (processes data as a service provider)
- **Stripe** — payment processing (for paid account users only; they receive only what is needed to process payment)
- **Plaid** — bank connection data (only if you choose to connect; see §5)
- **Resend** — transactional email delivery (receives only your email address for sending)
- **Vercel** — hosting provider (processes request logs)

All vendors are under data processing agreements. We do not share your financial scenario data with any of these vendors beyond what is necessary to deliver the Service.

We may disclose your information if required by law (e.g., valid court order, subpoena). We will notify you of such disclosure to the extent legally permitted.

## 5. Plaid and Bank Connections

If you choose to connect a bank account via Plaid:
- Plaid retrieves your transaction data on your behalf
- Your Plaid access token is stored in encrypted form using Supabase Vault (never in plaintext)
- We do not store your banking credentials — Plaid handles authentication directly with your bank
- You can revoke Plaid access at any time from your account settings
- Disconnecting removes your Plaid token from our system

[ATTORNEY REVIEW NOTES: Plaid has its own privacy policy and end-user terms. Users should consent to Plaid's terms separately. Verify Plaid's required disclosures for a production deployment.]

## 6. Data Security

- All data in transit is encrypted via TLS
- Data at rest is encrypted at the database level (Supabase)
- Sensitive tokens (Plaid access tokens) use Supabase Vault encryption
- Passwords are hashed using bcrypt or equivalent — we cannot recover your password
- Free-tier financial inputs never leave your device unless you generate a scenario
- We conduct regular security reviews

Despite these measures, no system is perfectly secure. In the event of a data breach, we will notify affected users as required by applicable law.

## 7. Data Retention

- **Free-tier session data:** cleared when you close the browser tab — never retained by us
- **Account data:** retained until you delete your account
- **Scenario results:** retained until you delete them or delete your account
- **Payment records:** retained as required by law (typically 7 years for tax purposes)
- **Audit logs:** retained for 90 days, then purged
- **Deleted accounts:** all personal data purged within 30 days of account deletion request

## 8. Your Rights

### For all users:
- **Access:** request a copy of the data we hold about you
- **Deletion:** delete your account and all associated data at any time via Account Settings → Delete Account
- **Correction:** update your information in Account Settings
- **Portability:** request your data in a machine-readable format

### For California residents (CCPA):
- **Right to Know:** the categories and specific pieces of personal information we collect
- **Right to Delete:** request deletion of your personal information
- **Right to Opt-Out:** we do not sell personal information, so no opt-out is needed
- **Right to Non-Discrimination:** we will not discriminate against you for exercising your privacy rights
- **Sensitive Personal Information:** financial information is "sensitive" under CCPA. We limit its use to providing the Service.

[ATTORNEY REVIEW NOTES: Conduct a full CCPA data map before publishing. Determine if you meet the revenue thresholds or data volume thresholds for CCPA applicability. Verify "sensitive personal information" provisions under CPRA (effective 2023).]

### For New York residents:
- New York SHIELD Act requires breach notification within 72 hours of discovery.
- [ATTORNEY REVIEW NOTES: Verify NY SHIELD Act compliance. Confirm whether the NY Consumer Protection Law creates additional obligations.]

## 9. Children's Privacy

The Service is not directed to individuals under 18. We do not knowingly collect personal information from minors. If you believe we have collected information from a minor, contact us at [OPERATOR EMAIL] and we will delete it.

## 10. Cookies

We use only essential cookies:
- **Session cookie:** maintains your login session (if you have an account)
- **CSRF token:** prevents cross-site request forgery

We do **not** use advertising cookies, tracking cookies, or third-party cookies.

## 11. Changes to This Policy

We will notify registered users by email at least 14 days before material changes take effect. Continued use after the effective date constitutes acceptance of the updated policy.

## 12. Contact

For privacy requests, questions, or to exercise your rights:

**Email:** [OPERATOR EMAIL]  
**Mailing Address:** [OPERATOR MAILING ADDRESS]

We will respond to verifiable requests within 45 days.

---

**[OPERATOR: BEFORE PUBLISHING]**
- [ ] Attorney has reviewed all sections
- [ ] CCPA data map completed (§8)
- [ ] Entity name, email, and address inserted
- [ ] Analytics provider identified and disclosed (§2b)
- [ ] Plaid end-user disclosure reviewed with Plaid's requirements (§5)
- [ ] NY SHIELD Act compliance confirmed (§8)
- [ ] Breach notification procedure documented internally
