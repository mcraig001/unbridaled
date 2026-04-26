import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-xs text-stone-400 uppercase tracking-widest mb-4">Page not found</p>
        <h1 className="text-2xl font-semibold text-stone-900 mb-3">This page doesn&apos;t exist</h1>
        <p className="text-stone-500 text-sm mb-8 leading-relaxed">
          The page you were looking for could not be found. If you were in the middle of entering
          your information, you can start the intake form again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 bg-stone-900 text-white text-sm rounded font-medium hover:bg-stone-800 transition-colors"
          >
            Go home
          </Link>
          <Link
            href="/intake"
            className="px-5 py-2.5 border border-stone-300 text-stone-700 text-sm rounded font-medium hover:bg-stone-50 transition-colors"
          >
            Start intake form
          </Link>
        </div>
        <p className="mt-8 text-xs text-stone-400 leading-relaxed">
          Not financial, legal, or tax advice. Consult a licensed attorney and financial advisor.
        </p>
      </div>
    </main>
  );
}
