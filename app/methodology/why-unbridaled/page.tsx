import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why Unbridaled — Honest comparison",
  description: "How Unbridaled compares to other financial planning options. Honest about what we do and don't do.",
};

export default function WhyUnbridaledPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-stone-900 mb-2">Why Unbridaled</h1>
        <p className="text-stone-500 mb-10 text-sm">
          And how it compares to other options. Honest, because you deserve honest.
        </p>

        {/* Comparison table */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-stone-900 mb-6">How we compare</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-3 pr-4 font-semibold text-stone-900 w-1/3">Feature</th>
                  <th className="text-left py-3 pr-4 font-semibold text-stone-900">Unbridaled</th>
                  <th className="text-left py-3 pr-4 font-semibold text-stone-400">Full-service<br />alternatives</th>
                  <th className="text-left py-3 font-semibold text-stone-400">Generic<br />calculators</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {[
                  ["Formula citations (primary sources)", "Every formula, every time", "Sometimes", "Rarely"],
                  ["State-specific legal formulas", "CA, TX, NY (with citations)", "Varies", "Usually no"],
                  ["Three-scenario output", "Stay / leave-with / leave-without", "No", "No"],
                  ["Financial runway calculation", "Yes", "Sometimes", "No"],
                  ["PDF to share with attorney", "Yes (paid tiers)", "Yes (expensive)", "No"],
                  ["No AI relationship advice", "Never", "Often included", "N/A"],
                  ["Privacy first", "No analytics on logged-in pages", "Varies", "Varies"],
                  ["Data deletion within 24h", "Yes — one tap", "Varies", "N/A"],
                  ["Attorney referral", "Coming soon", "Often included", "No"],
                  ["Full divorce process support", "No — financial modeling only", "Yes", "No"],
                ].map(([feature, us, fullService, generic]) => (
                  <tr key={feature}>
                    <td className="py-3 pr-4 text-stone-600 font-medium">{feature}</td>
                    <td className="py-3 pr-4 text-stone-900">
                      <span className="text-emerald-700">{us}</span>
                    </td>
                    <td className="py-3 pr-4 text-stone-400">{fullService}</td>
                    <td className="py-3 text-stone-400">{generic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-stone-400 mt-3">
            "Full-service alternatives" includes products like Hello Divorce, Untie the Knot, and similar services.
          </p>
        </section>

        {/* What we don't do */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-stone-900 mb-4">What Unbridaled does not do</h2>
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-5">
            <ul className="space-y-2 text-sm text-stone-600">
              {[
                "Give relationship advice. We model finances, not decisions.",
                "Tell you whether to stay or leave. That's not our place.",
                "Predict what a court will order. Judges have discretion.",
                "Replace an attorney. We say this on every page, in every PDF, in every email.",
                "Track you with advertising pixels after you leave.",
                "Send marketing emails without your explicit consent.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-stone-400 flex-shrink-0 mt-0.5">–</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* For attorneys */}
        <section className="bg-stone-900 text-white rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2">For family law attorneys</h2>
          <p className="text-stone-300 text-sm leading-relaxed mb-4">
            Unbridaled is designed to produce a PDF your clients can bring to their first consultation.
            If you recommend it to clients, they arrive with numbers already organized — less time on
            basics, more time on strategy.
          </p>
          <p className="text-stone-300 text-sm leading-relaxed">
            We cite every formula from primary state statutes. If you spot an error, we want to know.
            Every formula is versioned and can be updated.
          </p>
          <a
            href="mailto:attorney@[DOMAIN_TBD]"
            className="mt-4 inline-block text-sm text-stone-400 underline hover:text-white"
          >
            Contact us about attorney partnerships →
          </a>
        </section>

      </div>
    </main>
  );
}
