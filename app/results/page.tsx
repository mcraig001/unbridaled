"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ScenarioResult, ScenarioOutput, LineItem } from "@/lib/scenario-engine";
import SessionGuard from "@/components/SessionGuard";

const DISCLAIMER =
  "UNBRIDALED provides educational financial scenarios. This is not financial, legal, or tax advice. Consult a licensed financial advisor and family law attorney for guidance on your specific situation.";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWork, setShowWork] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("ub_scenario_inputs");
    if (!raw) {
      router.push("/intake");
      return;
    }

    const inputs = JSON.parse(raw);

    fetch("/api/scenarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setResult(data);
      })
      .catch((e) => setError(e.message ?? "An error occurred"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-stone-800 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-600 text-sm">Calculating your scenarios...</p>
          <p className="text-stone-400 text-xs mt-1">Usually takes a few seconds.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold text-stone-900 mb-3">Something went wrong</h1>
          <p className="text-stone-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => router.push("/intake")}
            className="px-5 py-2.5 bg-stone-900 text-white text-sm rounded hover:bg-stone-800 transition-colors"
          >
            Go back to intake
          </button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const { scenarios, state } = result;

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-12">
      <SessionGuard />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs text-stone-500 uppercase tracking-widest mb-1">
              Financial scenarios — {state}
            </p>
            <h1 className="text-2xl font-semibold text-stone-900">Your projected scenarios</h1>
            <p className="text-sm text-stone-500 mt-1">
              Generated {new Date(result.generatedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowWork((v) => !v)}
              className="px-4 py-2 border border-stone-300 text-stone-700 text-sm rounded hover:bg-stone-100 transition-colors"
            >
              {showWork ? "Hide" : "Show"} calculations
            </button>
            <a
              href="/export"
              className="px-4 py-2 bg-stone-900 text-white text-sm rounded hover:bg-stone-800 transition-colors"
            >
              Export PDF
            </a>
          </div>
        </div>

        {/* Disclaimer banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-5 py-4 mb-8 text-sm text-amber-800">
          <strong>Not advice.</strong> {DISCLAIMER}
        </div>

        {/* Three scenario cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          <ScenarioCard
            scenario={scenarios.stay}
            label="Current situation"
            color="stone"
            showWork={showWork}
          />
          <ScenarioCard
            scenario={scenarios.leaveWithDivision}
            label="Separation with legal process"
            color="blue"
            showWork={showWork}
          />
          <ScenarioCard
            scenario={scenarios.leaveWithoutDivision}
            label="Separation without legal process"
            color="orange"
            showWork={showWork}
          />
        </div>

        {/* Runway gauge */}
        <section className="bg-white border border-stone-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-stone-900 mb-4">6-month financial runway</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {Object.entries({
              "Current situation": scenarios.stay,
              "Separation with legal process": scenarios.leaveWithDivision,
              "Separation without legal process": scenarios.leaveWithoutDivision,
            }).map(([label, s]) => (
              <RunwayGauge key={label} label={label} scenario={s} />
            ))}
          </div>
          <p className="text-xs text-stone-400 mt-4">
            Runway = current savings ÷ monthly shortfall. Positive monthly net = runway shown as "indefinite."
          </p>
        </section>

        {/* Support summary */}
        {(scenarios.leaveWithDivision.spousalSupportReceived ||
          scenarios.leaveWithDivision.spousalSupportPaid ||
          scenarios.leaveWithDivision.childSupportReceived ||
          scenarios.leaveWithDivision.childSupportPaid) && (
          <section className="bg-white border border-stone-200 rounded-xl p-6 mb-6">
            <h2 className="font-semibold text-stone-900 mb-4">Support estimates</h2>
            <p className="text-xs text-stone-500 mb-4">
              These are projections based on {state} state formulas. Courts have discretion.
              Ranges shown where applicable.
            </p>
            <div className="space-y-3">
              {[
                scenarios.leaveWithDivision.spousalSupportReceived,
                scenarios.leaveWithDivision.spousalSupportPaid,
                scenarios.leaveWithDivision.childSupportReceived,
                scenarios.leaveWithDivision.childSupportPaid,
              ]
                .filter(Boolean)
                .map((item) => item && <SupportItem key={item.label} item={item} showWork={showWork} />)}
            </div>
          </section>
        )}

        {/* Source citation */}
        <section className="bg-stone-100 border border-stone-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-stone-900 mb-3 text-sm">Sources and methodology</h2>
          <p className="text-xs text-stone-600 leading-relaxed mb-3">
            All formulas sourced from official state statutes and federal datasets. Every number can be
            traced to a source. Formulas reviewed {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}.
          </p>
          <div className="flex flex-col gap-1.5 text-xs text-stone-500">
            {state === "CA" && (
              <>
                <a href="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=FAM&sectionNum=4320." target="_blank" rel="noopener noreferrer" className="hover:text-stone-800 underline">
                  CA Family Code § 4320 — Spousal support factors
                </a>
                <a href="https://childsupport.ca.gov/guideline-calculator/" target="_blank" rel="noopener noreferrer" className="hover:text-stone-800 underline">
                  CA Child Support Guideline Calculator — Family Code § 4055
                </a>
                <a href="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=FAM&sectionNum=760." target="_blank" rel="noopener noreferrer" className="hover:text-stone-800 underline">
                  CA Family Code § 760 — Community property
                </a>
              </>
            )}
            {state === "TX" && (
              <>
                <a href="https://statutes.capitol.texas.gov/docs/fa/pdf/fa.8.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-stone-800 underline">
                  TX Family Code Chapter 8 — Spousal Maintenance
                </a>
                <a href="https://statutes.capitol.texas.gov/GetStatute.aspx?Code=FA&Value=154.125" target="_blank" rel="noopener noreferrer" className="hover:text-stone-800 underline">
                  TX Family Code § 154.125 — Child Support Guidelines
                </a>
              </>
            )}
            {state === "NY" && (
              <>
                <a href="https://ww2.nycourts.gov/divorce/MaintenanceChildSupportTools.shtml" target="_blank" rel="noopener noreferrer" className="hover:text-stone-800 underline">
                  NY Courts — Maintenance & Child Support Calculator
                </a>
                <a href="https://childsupport.ny.gov/pdfs/CSSA.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-stone-800 underline">
                  NY CSSA Chart — LDSS-4515 (Rev. 03/26)
                </a>
              </>
            )}
            <a href="https://www.huduser.gov/portal/datasets/fmr.html" target="_blank" rel="noopener noreferrer" className="hover:text-stone-800 underline">
              HUD Fair Market Rents (FY2025) — rental estimates
            </a>
          </div>
        </section>

        {/* Next steps */}
        <section className="bg-white border border-stone-200 rounded-xl p-6">
          <h2 className="font-semibold text-stone-900 mb-3">Questions to ask next</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-stone-800 mb-2">For a family law attorney</h3>
              <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
                <li>What is my likely support range given our specific incomes?</li>
                <li>What qualifies as separate vs. marital property in my situation?</li>
                <li>What would a temporary support order look like?</li>
                <li>How does custody affect the child support calculation?</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-stone-800 mb-2">For a financial advisor</h3>
              <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
                <li>How do I value retirement accounts in the division?</li>
                <li>What are the tax implications of receiving spousal support?</li>
                <li>How should I budget for a transition period of 6–12 months?</li>
                <li>What financial records do I need to gather?</li>
              </ul>
            </div>
          </div>
        </section>

        <button
          onClick={() => router.push("/intake")}
          className="mt-8 text-sm text-stone-500 hover:text-stone-800 underline"
        >
          Run another scenario with different numbers
        </button>
      </div>
    </main>
  );
}

function ScenarioCard({
  scenario,
  label,
  color,
  showWork,
}: {
  scenario: ScenarioOutput;
  label: string;
  color: "stone" | "blue" | "orange";
  showWork: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const headerColors = {
    stone: "bg-stone-800",
    blue: "bg-blue-800",
    orange: "bg-orange-800",
  };

  const netColor =
    scenario.monthlyNet >= 0
      ? "text-emerald-700"
      : "text-red-700";

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
      <div className={`${headerColors[color]} text-white px-5 py-4`}>
        <h3 className="font-semibold text-sm">{label}</h3>
        <p className="text-xs opacity-80 mt-0.5">{scenario.description}</p>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-stone-500">Monthly income</p>
            <p className="text-lg font-semibold text-stone-900">
              ${scenario.monthlyIncome.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-stone-500">Monthly expenses</p>
            <p className="text-lg font-semibold text-stone-900">
              ${scenario.totalMonthlyExpenses.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="border-t border-stone-100 pt-3 mb-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-stone-600">Monthly net</p>
            <p className={`text-lg font-bold ${netColor}`}>
              {scenario.monthlyNet >= 0 ? "+" : ""}${scenario.monthlyNet.toLocaleString()}
            </p>
          </div>
        </div>

        {scenario.propertyShareReceived > 0 && (
          <div className="bg-stone-50 rounded p-3 mb-4 text-xs">
            <p className="text-stone-500 mb-0.5">Projected one-time property share</p>
            <p className="font-semibold text-stone-900">
              ${scenario.propertyShareReceived.toLocaleString()}
            </p>
          </div>
        )}

        <div className="text-xs text-stone-500 mb-3">
          <span className="font-medium">Est. runway:</span>{" "}
          {scenario.monthsRunway === 999
            ? "Positive cash flow — indefinite"
            : `${scenario.monthsRunway} months`}
        </div>

        {showWork && (
          <div className="border-t border-stone-100 pt-3">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-xs text-stone-500 hover:text-stone-800 underline"
            >
              {expanded ? "Hide" : "Show"} expense breakdown
            </button>
            {expanded && (
              <div className="mt-3 space-y-2">
                {scenario.monthlyExpenses.map((e) => (
                  <ExpenseRow key={e.label} item={e} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ExpenseRow({ item }: { item: LineItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="text-xs">
      <div className="flex justify-between items-center">
        <button
          onClick={() => item.formula ? setOpen((v) => !v) : undefined}
          className={`text-left text-stone-600 ${item.formula ? "underline cursor-pointer" : ""}`}
        >
          {item.label}
        </button>
        <span className="text-stone-800 font-medium">${item.amount.toLocaleString()}</span>
      </div>
      {open && item.formula && (
        <div className="mt-1 pl-2 border-l border-stone-200 text-stone-400 space-y-0.5">
          <p>{item.formula}</p>
          {item.sourceUrl && (
            <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
              Source →
            </a>
          )}
          {item.note && <p>{item.note}</p>}
        </div>
      )}
    </div>
  );
}

function SupportItem({ item, showWork }: { item: LineItem; showWork: boolean }) {
  return (
    <div className="bg-stone-50 rounded p-4 text-sm">
      <div className="flex justify-between items-center">
        <p className="text-stone-700">{item.label}</p>
        <p className="font-semibold text-stone-900">${item.amount.toLocaleString()}/mo</p>
      </div>
      {showWork && item.formula && (
        <div className="mt-2 text-xs text-stone-500 space-y-1">
          <p>{item.formula}</p>
          {item.sourceUrl && (
            <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">
              Source →
            </a>
          )}
          {item.note && <p className="text-stone-400">{item.note}</p>}
        </div>
      )}
    </div>
  );
}

function RunwayGauge({ label, scenario }: { label: string; scenario: ScenarioOutput }) {
  const months = scenario.monthsRunway;
  const isPositive = months === 999;
  const displayMonths = isPositive ? 24 : Math.min(months, 24);
  const pct = (displayMonths / 24) * 100;

  const barColor =
    isPositive ? "bg-emerald-500" : months >= 6 ? "bg-blue-500" : months >= 3 ? "bg-amber-500" : "bg-red-500";

  return (
    <div>
      <p className="text-xs font-medium text-stone-700 mb-2">{label}</p>
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden mb-1">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${Math.max(pct, 3)}%` }}
        />
      </div>
      <p className="text-xs text-stone-500">
        {isPositive ? "Positive cash flow" : `${months} months runway`}
      </p>
    </div>
  );
}
