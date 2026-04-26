"use client";

import { useState } from "react";

/**
 * Pass 6 — Upsell prompt after user runs first scenario
 * S7: No dark patterns. Soft prompt, dismissible, specific benefit stated.
 */
export default function UpsellPrompt({ onDismiss }: { onDismiss?: () => void }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  function handleDismiss() {
    setDismissed(true);
    onDismiss?.();
  }

  return (
    <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-30 bg-stone-900 text-white rounded-xl shadow-xl p-5">
      <div className="flex justify-between items-start gap-3 mb-3">
        <p className="font-medium text-sm">See this as a printable PDF</p>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="text-stone-400 hover:text-white flex-shrink-0"
        >
          ✕
        </button>
      </div>
      <p className="text-stone-300 text-xs leading-relaxed mb-4">
        Export your scenario summary as a PDF you can take to an attorney or financial advisor.
        Available on the Essential plan — 14-day free trial, no credit card required.
      </p>
      <div className="flex gap-2">
        <a
          href="/signup?tier=frontend"
          className="flex-1 text-center py-2 bg-white text-stone-900 text-xs font-medium rounded hover:bg-stone-100 transition-colors"
        >
          Start free trial
        </a>
        <button
          onClick={handleDismiss}
          className="px-3 py-2 text-stone-400 text-xs hover:text-white"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
