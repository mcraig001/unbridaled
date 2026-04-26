"use client";

/**
 * Quick Exit — S3: Safety UX is a feature, not a warning.
 * Clears session storage and redirects to a neutral site immediately.
 * Present on every page. Keyboard accessible.
 */
export default function QuickExitButton() {
  function handleExit() {
    // Clear any local/session storage data
    try {
      sessionStorage.clear();
      localStorage.removeItem("ub_intake_progress");
    } catch {
      // ignore — privacy mode may block storage access
    }

    // Replace history so back button doesn't return to this site
    window.location.replace("https://weather.com");
  }

  return (
    <button
      onClick={handleExit}
      aria-label="Quick Exit — leave this site immediately"
      className="fixed top-4 right-4 z-50 bg-stone-800 text-white text-sm font-medium px-4 py-2 rounded shadow-lg hover:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-500 transition-colors"
    >
      Exit quickly ✕
    </button>
  );
}
