"use client";

import { useEffect, useRef, useState } from "react";

const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const STORAGE_KEYS = ["ub_intake_progress", "ub_scenario_inputs"];

/**
 * S3 Safety UX: Clear session data after 15 minutes of inactivity.
 * Fires on any page inside /intake or /results where user data may be present.
 */
export default function SessionGuard() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  function clearData() {
    STORAGE_KEYS.forEach((k) => {
      try {
        sessionStorage.removeItem(k);
      } catch {
        // ignore
      }
    });
    setTimedOut(true);
  }

  function resetTimer() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(clearData, IDLE_TIMEOUT_MS);
  }

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!timedOut) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Session timed out"
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center shadow-xl">
        <h2 className="text-xl font-semibold text-stone-900 mb-3">Session cleared</h2>
        <p className="text-stone-600 text-sm mb-6 leading-relaxed">
          For your privacy, your form data has been cleared after 15 minutes of inactivity.
          You can start again at any time.
        </p>
        <a
          href="/intake"
          className="block px-5 py-2.5 bg-stone-900 text-white text-sm rounded font-medium hover:bg-stone-800 transition-colors"
        >
          Start again
        </a>
        <a
          href="/"
          className="block mt-3 text-sm text-stone-400 hover:text-stone-600"
        >
          Go to home page
        </a>
      </div>
    </div>
  );
}
