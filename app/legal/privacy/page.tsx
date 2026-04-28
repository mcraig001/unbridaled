import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Unbridaled",
  robots: "noindex",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-stone-50 px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs text-stone-400 uppercase tracking-widest mb-2">Legal</p>
        <h1 className="text-2xl font-semibold text-stone-900 mb-1">Privacy Policy</h1>
        <p className="text-sm text-stone-400 mb-10">Last updated: April 27, 2026</p>

        <Section title="1. Who We Are">
          <p>Unbridaled is operated by Auriflow Digital LLC, a Wyoming LLC. We take privacy especially seriously because we know you may be in a vulnerable situation.</p>
          <p>Contact: <a href="mailto:delongmike@gmail.com" className="underline">delongmike@gmail.com</a></p>
        </Section>

        <Section title="2. Information We Collect">
          <h3>Free tier (no account)</h3>
          <p>Financial inputs you enter are stored <strong>only in your browser's session storage</strong>. They are never transmitted to our servers unless you explicitly generate a scenario. They are cleared when you close the browser tab.</p>
          <p>If you submit your email on the waitlist, we store only your email address.</p>

          <h3>Account users</h3>
          <p>Email address and password (hashed — we never store plaintext passwords), scenario inputs and results you choose to save, and bank account connection data via Plaid if you choose to connect.</p>

          <h3>Automatically collected</h3>
          <p>Browser type, general geographic region (not precise location), pages visited (anonymized), error logs (no financial data included). We do not use third-party advertising trackers, Google Analytics, or Meta Pixel.</p>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use your information to: provide the Service, maintain your account, communicate with you (transactional only — no marketing without opt-in), improve the Service using anonymized usage patterns, and comply with applicable law.</p>
          <p>We do <strong>not</strong> use your financial data to train machine learning models. We do <strong>not</strong> sell your data. We do <strong>not</strong> share with data brokers.</p>
        </Section>

        <Section title="4. How We Share Your Information">
          <p>We share your information only with service providers under data processing agreements:</p>
          <ul>
            <li><strong>Supabase</strong> — database and authentication</li>
            <li><strong>Stripe</strong> — payment processing (account users only)</li>
            <li><strong>Plaid</strong> — bank connection (only if you choose to connect)</li>
            <li><strong>Resend</strong> — transactional email (receives only your email address)</li>
            <li><strong>Vercel</strong> — hosting (processes request logs)</li>
          </ul>
          <p>We may disclose your information if required by valid legal process, and will notify you to the extent legally permitted.</p>
        </Section>

        <Section title="5. Plaid and Bank Connections">
          <p>If you connect a bank account via Plaid, your access token is stored in encrypted form using Supabase Vault — never in plaintext. We do not store your banking credentials. You can revoke Plaid access at any time from Account Settings, which removes your token from our system.</p>
        </Section>

        <Section title="6. Data Security">
          <p>All data in transit is encrypted via TLS. Data at rest is encrypted at the database level. Passwords are hashed and cannot be recovered. Free-tier financial inputs never leave your device unless you generate a scenario.</p>
        </Section>

        <Section title="7. Data Retention">
          <ul>
            <li><strong>Free-tier session data:</strong> cleared when you close the tab — never retained by us</li>
            <li><strong>Account data:</strong> retained until you delete your account</li>
            <li><strong>Deleted accounts:</strong> all personal data purged within 30 days of deletion request</li>
            <li><strong>Payment records:</strong> retained as required by law (typically 7 years)</li>
          </ul>
        </Section>

        <Section title="8. Your Rights">
          <p><strong>All users:</strong> access, deletion, correction, and portability of your data. Delete your account via Account Settings → Delete Account at any time.</p>
          <p><strong>California residents (CCPA):</strong> right to know what we collect, right to delete, right to opt-out of sale (we don't sell data), right to non-discrimination. Financial information is treated as sensitive personal information and used only to provide the Service.</p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>The Service is not directed to individuals under 18. We do not knowingly collect information from minors. Contact us at delongmike@gmail.com if you believe we have collected information from a minor.</p>
        </Section>

        <Section title="10. Cookies">
          <p>We use only essential cookies: a session cookie (if you have an account) and a CSRF token. No advertising cookies, tracking cookies, or third-party cookies.</p>
        </Section>

        <Section title="11. Changes to This Policy">
          <p>We will notify registered users by email at least 14 days before material changes take effect.</p>
        </Section>

        <Section title="12. Contact">
          <p>For privacy requests or to exercise your rights: <a href="mailto:delongmike@gmail.com" className="underline">delongmike@gmail.com</a>. We respond within 45 days.</p>
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-base font-semibold text-stone-900 mb-3">{title}</h2>
      <div className="text-sm text-stone-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
