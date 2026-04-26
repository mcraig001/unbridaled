"use client";

import { useState, useEffect } from "react";

const DISMISSED_KEY = "ub_private_browsing_dismissed";

/**
 * S3 Safety UX: Prompt user to use private browsing on first visit.
 * Dismissible. Not shown again once dismissed.
 */
export default function PrivateBrowsingPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem(DISMISSED_KEY);
      if (!dismissed) setVisible(true);
    } catch {
      // sessionStorage unavailable — skip prompt
    }
  }, []);

  function dismiss() {
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Privacy suggestion"
      className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-40 bg-white border border-stone-200 rounded-xl shadow-lg p-5"
    >
      <div className="flex justify-between items-start gap-3">
        <div>
          <p className="font-medium text-stone-900 text-sm mb-1">Consider private browsing</p>
          <p className="text-xs text-stone-500 leading-relaxed">
            Using a private or incognito window keeps this site out of your browser history.
          </p>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="text-stone-400 hover:text-stone-600 flex-shrink-0 mt-0.5"
        >
          ✕
        </button>
      </div>
      <p className="text-xs text-stone-400 mt-3">
        Chrome: ⌘+Shift+N · Firefox: ⌘+Shift+P · Safari: ⌘+Shift+N
      </p>
    </div>
  );
}
