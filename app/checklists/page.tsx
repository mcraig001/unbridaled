"use client";

import { useState } from "react";
import Link from "next/link";
import { CA_CHECKLIST, CA_CHECKLIST_META } from "@/lib/legal-checklists/ca";
import { TX_CHECKLIST, TX_CHECKLIST_META } from "@/lib/legal-checklists/tx";
import { NY_CHECKLIST, NY_CHECKLIST_META } from "@/lib/legal-checklists/ny";
import type { ChecklistItem } from "@/lib/legal-checklists/ca";

const STATE_DATA = {
  CA: { checklist: CA_CHECKLIST, meta: CA_CHECKLIST_META },
  TX: { checklist: TX_CHECKLIST, meta: TX_CHECKLIST_META },
  NY: { checklist: NY_CHECKLIST, meta: NY_CHECKLIST_META },
};

type StateKey = keyof typeof STATE_DATA;

const CATEGORIES_ORDER = [
  "Court Forms",
  "Financial Documents",
  "Children (if applicable)",
  "Property",
  "Safety Planning",
  "Timeline",
];

export default function ChecklistsPage() {
  const [selectedState, setSelectedState] = useState<StateKey>("CA");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const { checklist, meta } = STATE_DATA[selectedState];

  const toggleItem = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const grouped = CATEGORIES_ORDER.reduce<Record<string, ChecklistItem[]>>(
    (acc, cat) => {
      acc[cat] = checklist.filter((item) => item.category === cat);
      return acc;
    },
    {}
  );

  const total = checklist.length;
  const done = checklist.filter((item) => checked[item.id]).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <main className="min-h-screen bg-stone-50 pb-20">
      <div className="max-w-2xl mx-auto px-4 pt-12">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs text-stone-400 uppercase tracking-widest mb-2">Document Checklist</p>
          <h1 className="text-2xl font-semibold text-stone-900 mb-2">
            What you&apos;ll need to gather
          </h1>
          <p className="text-stone-500 text-sm leading-relaxed">
            A sourced list of documents typically required in a divorce proceeding. Use this to
            start organizing before you meet with an attorney — it can significantly reduce your
            legal fees.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-800 leading-relaxed">
          <strong>Not legal advice.</strong> Requirements vary by county and case complexity.
          Consult a licensed family law attorney in your state. Sources are cited for each item.
        </div>

        {/* State selector */}
        <div className="flex gap-2 mb-6">
          {(Object.keys(STATE_DATA) as StateKey[]).map((s) => (
            <button
              key={s}
              onClick={() => { setSelectedState(s); setChecked({}); }}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                selectedState === s
                  ? "bg-stone-900 text-white"
                  : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
              }`}
            >
              {STATE_DATA[s].meta.stateName}
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-stone-500 mb-1.5">
            <span>{done} of {total} items reviewed</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-stone-700 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Checklist by category */}
        {CATEGORIES_ORDER.map((cat) => {
          const items = grouped[cat];
          if (!items || items.length === 0) return null;
          return (
            <section key={cat} className="mb-8">
              <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">
                {cat}
              </h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <ChecklistRow
                    key={item.id}
                    item={item}
                    checked={!!checked[item.id]}
                    onToggle={() => toggleItem(item.id)}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* Source attribution */}
        <div className="border-t border-stone-200 pt-6 text-xs text-stone-400 leading-relaxed">
          <p className="font-medium text-stone-500 mb-1">Primary source</p>
          <a
            href={meta.primarySource}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-stone-600 break-all"
          >
            {meta.primarySource}
          </a>
          <p className="mt-2">Last verified: {meta.lastVerified}</p>
          <p className="mt-2">{meta.disclaimer}</p>
        </div>

        {/* CTA */}
        <div className="mt-10 bg-stone-900 text-white rounded-xl p-6 text-center">
          <p className="text-sm font-medium mb-1">Ready to run your financial scenarios?</p>
          <p className="text-stone-400 text-xs mb-4 leading-relaxed">
            Pair this checklist with Unbridaled&apos;s financial scenario projections to see what
            different outcomes might look like for your situation.
          </p>
          <Link
            href="/intake"
            className="inline-block px-5 py-2.5 bg-white text-stone-900 text-sm font-medium rounded hover:bg-stone-100 transition-colors"
          >
            Start financial intake
          </Link>
        </div>
      </div>
    </main>
  );
}

function ChecklistRow({
  item,
  checked,
  onToggle,
}: {
  item: ChecklistItem;
  checked: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`bg-white border rounded-lg p-4 transition-colors ${
        checked ? "border-stone-300 opacity-70" : "border-stone-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="mt-0.5 h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-400 shrink-0"
          aria-label={`Mark "${item.title}" as reviewed`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-medium ${checked ? "line-through text-stone-400" : "text-stone-900"}`}>
              {item.title}
            </span>
            {item.required && (
              <span className="text-xs bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">
                required
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{item.description}</p>

          {(item.notes || item.source) && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-xs text-stone-400 hover:text-stone-600 mt-1 underline-offset-2 underline"
            >
              {expanded ? "Less" : "More details"}
            </button>
          )}

          {expanded && (
            <div className="mt-2 space-y-1.5">
              {item.notes && (
                <p className="text-xs text-stone-600 bg-stone-50 rounded p-2 leading-relaxed">
                  {item.notes}
                </p>
              )}
              {item.source && (
                <a
                  href={item.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-stone-500 underline hover:text-stone-700 block truncate"
                >
                  Source: {item.source}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
