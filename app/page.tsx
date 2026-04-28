import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unbridaled — Know Your Financial Picture",
  description:
    "Model what your finances could look like in different scenarios. Educational, private, and built for clarity.",
  robots: "index, follow",
};

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center bg-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm font-medium text-stone-500 tracking-widest uppercase mb-4">
            Financial scenario planning
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold text-stone-900 leading-tight mb-6">
            Know your financial picture
            <span className="block text-stone-600 font-normal mt-1">
              before you make any decisions.
            </span>
          </h1>
          <p className="text-lg text-stone-600 leading-relaxed mb-10 max-w-xl mx-auto">
            Unbridaled models what your finances could look like in different life scenarios —
            using your real income, expenses, and state-specific legal formulas. Clear numbers.
            No advice. No pressure.
          </p>

          <EmailCapture />

          <p className="mt-8 text-xs text-stone-400">
            No marketing emails. No credit card. Account deletion is one tap and completes within 24 hours.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-stone-50 border-t border-stone-200 px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-stone-900 mb-12 text-center">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-10">
            {[
              {
                step: "1",
                title: "Enter your numbers",
                body: "Income, expenses, assets, debts. Takes about 10 minutes. Saved as you go.",
              },
              {
                step: "2",
                title: "See three scenarios",
                body: "Current situation, separate with legal process, or separate without. Monthly cash flow, runway, and support projections — all sourced.",
              },
              {
                step: "3",
                title: "Export and share",
                body: "Download a clear PDF to share with an attorney or advisor. Every number is explained.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="flex flex-col gap-3">
                <div className="w-9 h-9 rounded-full bg-stone-800 text-white flex items-center justify-center text-sm font-semibold">
                  {step}
                </div>
                <h3 className="font-semibold text-stone-900">{title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="bg-white border-t border-stone-200 px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-stone-900 mb-8 text-center">
            Built for privacy and accuracy
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: "Formulas, not opinions",
                body: "Every projection uses state-specific legal formulas sourced from official statutes. We cite every source.",
              },
              {
                title: "Your data stays yours",
                body: "No third-party analytics on logged-in pages. No retargeting. Delete your account and all data is gone within 24 hours.",
              },
              {
                title: "Three states supported",
                body: "California, Texas, and New York — each with jurisdiction-specific formulas for support and property division.",
              },
              {
                title: "Ranges, not false precision",
                body: "Where courts have discretion, we show a range. Low, mid, and high. Because that's what's honest.",
              },
            ].map(({ title, body }) => (
              <div key={title} className="bg-stone-50 border border-stone-200 rounded-lg p-5">
                <h3 className="font-semibold text-stone-900 mb-2">{title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}

function EmailCapture() {
  return (
    <form
      action="/api/leads"
      method="POST"
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <label htmlFor="email" className="sr-only">
        Email address
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        placeholder="Your email address"
        className="flex-1 px-4 py-3 rounded border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 bg-white text-sm"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-stone-900 text-white rounded font-medium text-sm hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-500"
      >
        Get early access
      </button>
    </form>
  );
}
