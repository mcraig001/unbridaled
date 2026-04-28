import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Unbridaled",
  robots: "noindex",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-stone-50 px-4 py-16">
      <div className="max-w-2xl mx-auto prose prose-stone prose-sm">
        <p className="text-xs text-stone-400 uppercase tracking-widest mb-2">Legal</p>
        <h1 className="text-2xl font-semibold text-stone-900 mb-1">Terms of Service</h1>
        <p className="text-sm text-stone-400 mb-10">Last updated: April 27, 2026</p>

        <Section title="1. Agreement to Terms">
          <p>By accessing or using Unbridaled ("Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
          <p>Unbridaled is operated by Auriflow Digital LLC, a Wyoming limited liability company ("Company," "we," "us," or "our").</p>
        </Section>

        <Section title="2. Description of Service">
          <p>Unbridaled is an educational financial planning tool. It provides mathematical projections based on publicly available state statutes for spousal support, child support, and property division, along with estimates of post-separation household expenses and financial runway.</p>
          <p><strong>Unbridaled does not provide financial advice, legal advice, tax advice, or any professional services.</strong> All projections are estimates with significant uncertainty. Courts have broad discretion and actual outcomes may vary substantially.</p>
        </Section>

        <Section title="3. Not a Professional Relationship">
          <p>Use of this Service does not create an attorney-client, financial advisor-client, or any other professional relationship. No information provided through the Service constitutes legal, financial, or tax advice.</p>
          <p>You should consult a licensed family law attorney, certified financial planner, and/or CPA before making any decisions related to your financial situation, separation, or divorce.</p>
        </Section>

        <Section title="4. Eligibility">
          <p>You must be at least 18 years of age to use the Service.</p>
        </Section>

        <Section title="5. Account Registration">
          <p>If you create an account, you are responsible for maintaining the confidentiality of your credentials and for all activity under your account. Notify us immediately of any unauthorized use at delongmike@gmail.com.</p>
        </Section>

        <Section title="6. Privacy and Data">
          <p>Your use of the Service is governed by our <a href="/legal/privacy" className="underline">Privacy Policy</a>. Key practices:</p>
          <ul>
            <li>Free-tier users: all data is stored only in your browser session and is never transmitted to our servers. It clears when you close the tab.</li>
            <li>Account users: scenario inputs and results are stored in encrypted form.</li>
            <li>We do not sell your data. We do not use your data for marketing.</li>
            <li>You can delete your account and all associated data at any time.</li>
          </ul>
        </Section>

        <Section title="7. Subscription and Payment">
          <p>Paid tiers are billed through Stripe. By subscribing, you also agree to Stripe's terms of service. Subscriptions auto-renew unless cancelled. A 14-day free trial is offered for paid tiers. No credit card is required for the free tier.</p>
        </Section>

        <Section title="8. Acceptable Use">
          <p>You agree not to use the Service for any unlawful purpose, attempt to gain unauthorized access, interfere with or disrupt the Service, or use automated means to access the Service without permission.</p>
        </Section>

        <Section title="9. Intellectual Property">
          <p>The Service, including its design, code, and content, is owned by the Company and protected by copyright law. State statutes referenced are public domain. The Company's organization, presentation, and calculation engine are proprietary.</p>
        </Section>

        <Section title="10. Disclaimer of Warranties">
          <p>THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT WARRANT THAT PROJECTIONS ARE ACCURATE OR SUITABLE FOR ANY PARTICULAR PURPOSE.</p>
        </Section>

        <Section title="11. Limitation of Liability">
          <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE COMPANY'S TOTAL LIABILITY SHALL NOT EXCEED THE GREATER OF AMOUNTS PAID BY YOU IN THE PRIOR TWELVE MONTHS OR ONE HUNDRED DOLLARS ($100).</p>
        </Section>

        <Section title="12. Governing Law">
          <p>These Terms are governed by the laws of the State of Wyoming, without regard to conflict of law provisions.</p>
        </Section>

        <Section title="13. Changes to Terms">
          <p>We may update these Terms from time to time. Registered users will be notified by email. Continued use after changes take effect constitutes acceptance.</p>
        </Section>

        <Section title="14. Termination">
          <p>We may suspend or terminate your account if you violate these Terms. You may terminate your account at any time via Account Settings.</p>
        </Section>

        <Section title="15. Contact">
          <p>For questions about these Terms: <a href="mailto:delongmike@gmail.com" className="underline">delongmike@gmail.com</a></p>
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
