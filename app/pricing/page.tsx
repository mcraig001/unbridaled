import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Unbridaled",
  description: "Clear, honest pricing. No credit card required to start.",
  robots: "index, follow",
};

const TIERS = [
  {
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "See your numbers. No commitment.",
    features: [
      "3 scenario runs",
      "All three states (CA, TX, NY)",
      "Calculation transparency (see every formula)",
      "Sourced state formula breakdown",
      "No credit card required",
    ],
    notIncluded: ["PDF export", "State legal checklists", "Monthly check-in reminders"],
    cta: "Start free",
    ctaHref: "/intake",
    highlighted: false,
  },
  {
    name: "Essential",
    monthlyPrice: 9.99,
    annualPrice: 99,
    description: "For when you need something you can take to an attorney.",
    features: [
      "Unlimited scenario runs",
      "PDF export (shareable with attorneys and advisors)",
      "All three states (CA, TX, NY)",
      "Calculation transparency — every number sourced",
      "Bank account connection (Plaid Sandbox)",
      "Account deletion within 24h",
    ],
    notIncluded: ["State legal checklists", "Monthly check-in reminders"],
    cta: "Start 14-day trial",
    ctaHref: "/signup?tier=frontend",
    highlighted: true,
  },
  {
    name: "Complete",
    monthlyPrice: 29.99,
    annualPrice: 299,
    description: "For navigating the full process.",
    features: [
      "Everything in Essential",
      "State-specific legal checklists",
      "Monthly financial check-in reminders",
      "Priority support",
    ],
    notIncluded: [],
    cta: "Start 14-day trial",
    ctaHref: "/signup?tier=core",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-stone-50 px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-stone-900 mb-3">
            Clear pricing, no surprises
          </h1>
          <p className="text-stone-600">
            No credit card required to start. Cancel any time. No friction.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`bg-white rounded-xl border p-6 flex flex-col ${
                tier.highlighted
                  ? "border-stone-900 shadow-md"
                  : "border-stone-200"
              }`}
            >
              {tier.highlighted && (
                <span className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-3">
                  Most popular
                </span>
              )}
              <h2 className="text-xl font-semibold text-stone-900 mb-1">{tier.name}</h2>
              <p className="text-sm text-stone-500 mb-4">{tier.description}</p>

              <div className="mb-6">
                {tier.monthlyPrice === 0 ? (
                  <p className="text-3xl font-bold text-stone-900">Free</p>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-stone-900">
                      ${tier.monthlyPrice}
                      <span className="text-base font-normal text-stone-500">/mo</span>
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      or ${tier.annualPrice}/year (save {Math.round((1 - tier.annualPrice / (tier.monthlyPrice * 12)) * 100)}%)
                    </p>
                  </>
                )}
              </div>

              <a
                href={tier.ctaHref}
                className={`block text-center py-2.5 rounded font-medium text-sm mb-6 transition-colors ${
                  tier.highlighted
                    ? "bg-stone-900 text-white hover:bg-stone-800"
                    : "border border-stone-300 text-stone-700 hover:bg-stone-50"
                }`}
              >
                {tier.cta}
              </a>

              <ul className="space-y-2 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-stone-700">
                    <span className="text-emerald-600 mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
                {tier.notIncluded.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-stone-400">
                    <span className="mt-0.5 flex-shrink-0">–</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Anti-dark-patterns section */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-stone-900 mb-4">Our commitment to you</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-stone-600">
            {[
              "No 'are you sure?' friction when you cancel.",
              "No credit card required for the free tier.",
              "No fake scarcity or countdown timers.",
              "No bait-and-switch on pricing.",
              "No marketing emails without explicit opt-in.",
              "Account deletion is one tap and completes within 24 hours.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="text-emerald-600 flex-shrink-0 mt-0.5">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-stone-400 text-center leading-relaxed">
          UNBRIDALED provides educational financial scenarios. This is not financial, legal, or tax
          advice. Consult a licensed financial advisor and family law attorney for guidance on your
          specific situation.
        </p>
      </div>
    </main>
  );
}
