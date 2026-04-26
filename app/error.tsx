"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[unbridaled-error]", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-xs text-stone-400 uppercase tracking-widest mb-4">Something went wrong</p>
        <h1 className="text-2xl font-semibold text-stone-900 mb-3">
          We hit an unexpected error
        </h1>
        <p className="text-stone-500 text-sm mb-8 leading-relaxed">
          Your data was not lost — it is saved in your browser session. Try reloading the page.
          If the problem persists, start the intake form again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-stone-900 text-white text-sm rounded font-medium hover:bg-stone-800 transition-colors"
          >
            Try again
          </button>
          <a
            href="/intake"
            className="px-5 py-2.5 border border-stone-300 text-stone-700 text-sm rounded font-medium hover:bg-stone-50 transition-colors"
          >
            Restart intake
          </a>
        </div>
      </div>
    </main>
  );
}
