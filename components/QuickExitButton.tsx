"use client";

import { useEffect } from "react";

/**
 * Quick Exit — S3: Safety UX is a feature, not a warning.
 * Clears session storage and redirects to a neutral site immediately.
 * Present on every page. Keyboard accessible via Escape key.
 */
export default function QuickExitButton() {
  function handleExit() {
    try {
      sessionStorage.clear();
      localStorage.removeItem("ub_intake_progress");
    } catch {
      // ignore — privacy mode may block storage access
    }
    // Replace history so back button doesn't return to this site
    window.location.replace("https://weather.com");
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Triple-Escape to exit: prevents accidental exits from form fields
      // We track 3 rapid Escape presses within 2 seconds
      if (e.key === "Escape") {
        const now = Date.now();
        const store = window as unknown as { _ubEscTimes?: number[] };
        const prev: number[] = store._ubEscTimes ?? [];
        const times = [...prev, now].filter((t) => now - t < 2000);
        store._ubEscTimes = times;
        if (times.length >= 3) {
          handleExit();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      onClick={handleExit}
      aria-label="Quick Exit — leave this site immediately"
      title="Click or press Escape 3× to exit immediately"
      className="fixed top-4 right-4 z-50 bg-stone-800 text-white text-sm font-medium px-4 py-2 rounded shadow-lg hover:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-500 transition-colors"
    >
      Exit quickly ✕
    </button>
  );
}
