/**
 * Shown when LEGAL_REVIEW_COMPLETE !== "true"
 * S6: PRE-LAUNCH GATE IS REAL.
 */
export default function ComingSoonPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-white">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold text-stone-900 mb-4">Under review</h1>
        <p className="text-stone-600 leading-relaxed mb-6">
          The Unbridaled calculator is currently undergoing legal review to ensure it meets accuracy
          and disclosure standards. We expect to open access in the coming weeks.
        </p>
        <p className="text-stone-600 leading-relaxed mb-8">
          Leave your email below and we will let you know when it is ready.
        </p>
        <form action="/api/leads" method="POST" className="flex flex-col sm:flex-row gap-3">
          <label htmlFor="email-cs" className="sr-only">
            Email address
          </label>
          <input
            id="email-cs"
            name="email"
            type="email"
            required
            placeholder="Your email address"
            className="flex-1 px-4 py-3 rounded border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 bg-white text-sm"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-stone-900 text-white rounded font-medium text-sm hover:bg-stone-800 transition-colors"
          >
            Notify me
          </button>
        </form>
        <p className="mt-4 text-xs text-stone-400">No marketing emails. Unsubscribe at any time.</p>
        <div className="mt-10 p-4 bg-stone-50 border border-stone-200 rounded text-xs text-stone-500 text-left leading-relaxed">
          <strong>Not advice.</strong> Unbridaled provides educational financial scenarios. This is
          not financial, legal, or tax advice. Consult a licensed financial advisor and family law
          attorney for guidance on your specific situation.
        </div>
      </div>
    </main>
  );
}
