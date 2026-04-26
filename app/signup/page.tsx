"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function SignupContent() {
  const params = useSearchParams();
  const tier = (params.get("tier") ?? "frontend") as "frontend" | "core";
  const [loading, setLoading] = useState(false);

  const TIER_LABELS: Record<string, string> = {
    frontend: "Essential — $9.99/month",
    core: "Complete — $29.99/month",
  };

  async function handleStart(interval: "month" | "year") {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, interval }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="bg-white border border-stone-200 rounded-xl p-8 max-w-md w-full shadow-sm">
        <h1 className="text-2xl font-semibold text-stone-900 mb-2">Start your 14-day trial</h1>
        <p className="text-stone-500 text-sm mb-6">
          {TIER_LABELS[tier] ?? "Essential"} · No credit card required to start.
          Cancel any time.
        </p>

        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={() => handleStart("month")}
            disabled={loading}
            className="w-full py-3 bg-stone-900 text-white rounded font-medium text-sm hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Redirecting…" : "Start monthly trial → $9.99/mo after 14 days"}
          </button>
          <button
            onClick={() => handleStart("year")}
            disabled={loading}
            className="w-full py-3 border border-stone-300 text-stone-700 rounded font-medium text-sm hover:bg-stone-50 transition-colors disabled:opacity-50"
          >
            Start annual trial → $99/year after 14 days (save 17%)
          </button>
        </div>

        <div className="space-y-2 text-xs text-stone-500">
          {[
            "14-day trial — no credit card required",
            "Cancel any time, no questions asked",
            "No 'are you sure?' friction on cancellation",
            "Account deletion is one tap and completes within 24 hours",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="text-emerald-600">✓</span>
              {item}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-stone-50 border border-stone-200 rounded text-xs text-stone-500 leading-relaxed">
          <strong>Not advice.</strong> Unbridaled provides educational financial scenarios. This is
          not financial, legal, or tax advice. Consult a licensed financial advisor and family law
          attorney for guidance on your specific situation.
        </div>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50" />}>
      <SignupContent />
    </Suspense>
  );
}
