"use client";

import { useState } from "react";

interface BreakdownProps {
  label: string;
  amount: number;
  formula?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  note?: string;
  inputs?: Array<{ name: string; value: string | number }>;
}

/**
 * Pass 4 — Calculation Transparency
 * S5: User can click any number and see "this came from: [inputs] × [formula] = [result], source: [URL]"
 */
export function NumberBreakdown({
  label,
  amount,
  formula,
  sourceUrl,
  sourceLabel,
  note,
  inputs,
}: BreakdownProps) {
  const [open, setOpen] = useState(false);

  const hasBreakdown = formula || sourceUrl || note || (inputs && inputs.length > 0);

  return (
    <div className="relative inline-flex items-baseline gap-1">
      {hasBreakdown ? (
        <button
          onClick={() => setOpen((v) => !v)}
          className="font-semibold text-stone-900 underline underline-offset-2 decoration-stone-300 hover:decoration-stone-600 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400 rounded"
          aria-expanded={open}
          aria-label={`${label}: $${amount.toLocaleString()} — click to see calculation`}
        >
          ${amount.toLocaleString()}
        </button>
      ) : (
        <span className="font-semibold text-stone-900">${amount.toLocaleString()}</span>
      )}

      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-stone-200 rounded-lg shadow-xl z-30 p-4 text-xs text-stone-700 min-w-72 max-w-sm">
          <div className="flex justify-between items-start mb-3">
            <p className="font-medium text-stone-900">{label}</p>
            <button
              onClick={() => setOpen(false)}
              className="text-stone-400 hover:text-stone-600 ml-3 flex-shrink-0"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {inputs && inputs.length > 0 && (
            <div className="mb-3">
              <p className="text-stone-500 mb-1.5 font-medium">Inputs used:</p>
              <div className="space-y-1">
                {inputs.map((inp) => (
                  <div key={inp.name} className="flex justify-between gap-2">
                    <span className="text-stone-500">{inp.name}</span>
                    <span className="text-stone-800 font-medium tabular-nums">
                      {typeof inp.value === "number" ? `$${inp.value.toLocaleString()}` : inp.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formula && (
            <div className="mb-3">
              <p className="text-stone-500 mb-1 font-medium">Formula:</p>
              <p className="text-stone-700 leading-relaxed">{formula}</p>
            </div>
          )}

          <div className="border-t border-stone-100 pt-2 mb-2">
            <div className="flex justify-between items-center">
              <span className="text-stone-500">Result</span>
              <span className="font-bold text-stone-900 tabular-nums">${amount.toLocaleString()}</span>
            </div>
          </div>

          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline block truncate"
            >
              Source: {sourceLabel ?? sourceUrl}
            </a>
          )}

          {note && (
            <p className="mt-2 text-stone-400 leading-relaxed">{note}</p>
          )}
        </div>
      )}
    </div>
  );
}
