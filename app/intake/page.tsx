"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { HouseholdFinancials, SupportedState } from "@/lib/scenario-engine";
import SessionGuard from "@/components/SessionGuard";
import PrivateBrowsingPrompt from "@/components/PrivateBrowsingPrompt";

const STORAGE_KEY = "ub_intake_progress";

const STEPS = [
  "Your location",
  "Your income",
  "Your partner's income",
  "Monthly expenses",
  "Assets & debts",
  "Children",
  "Your situation",
  "Acknowledgment",
];

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

const EMPTY_FORM: Partial<HouseholdFinancials> = {};

export default function IntakePage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(0);
  const [form, setForm] = useState<Partial<HouseholdFinancials>>(EMPTY_FORM);
  const [acknowledged, setAcknowledged] = useState(false);

  // Save progress to sessionStorage only — not localStorage (safety)
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setForm(parsed.form ?? {});
        setStep(Math.min(parsed.step ?? 0, STEPS.length - 1));
      } catch {
        // ignore corrupt data
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ form, step }));
  }, [form, step]);

  function update(field: keyof HouseholdFinancials, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateNum(field: keyof HouseholdFinancials, raw: string) {
    const n = parseFloat(raw.replace(/,/g, ""));
    update(field, isNaN(n) ? 0 : n);
  }

  async function handleSubmit() {
    if (!acknowledged) return;

    // Fill defaults for optional fields
    const inputs: HouseholdFinancials = {
      yourGrossMonthlyIncome: form.yourGrossMonthlyIncome ?? 0,
      partnerGrossMonthlyIncome: form.partnerGrossMonthlyIncome ?? 0,
      yourNetMonthlyIncome: form.yourNetMonthlyIncome ?? form.yourGrossMonthlyIncome ?? 0,
      partnerNetMonthlyIncome: form.partnerNetMonthlyIncome ?? form.partnerGrossMonthlyIncome ?? 0,
      rent: form.rent ?? 0,
      utilities: form.utilities ?? 0,
      groceries: form.groceries ?? 0,
      transportation: form.transportation ?? 0,
      childcare: form.childcare ?? 0,
      healthcare: form.healthcare ?? 0,
      otherExpenses: form.otherExpenses ?? 0,
      maritalAssets: form.maritalAssets ?? 0,
      maritalDebts: form.maritalDebts ?? 0,
      yourSeparateAssets: form.yourSeparateAssets ?? 0,
      currentSavings: form.currentSavings ?? 0,
      numberOfChildren: form.numberOfChildren ?? 0,
      childrenAges: form.childrenAges ?? [],
      state: (form.state as SupportedState) ?? "CA",
      marriageYears: form.marriageYears ?? 0,
      familyViolence: form.familyViolence ?? false,
      youAreHigherEarner:
        (form.yourGrossMonthlyIncome ?? 0) > (form.partnerGrossMonthlyIncome ?? 0),
      estimatedCustodySplit: form.estimatedCustodySplit ?? "50_50",
      estimatedRentForNewPlace: form.estimatedRentForNewPlace ?? form.rent ?? 0,
    };

    // Store and navigate to results
    sessionStorage.setItem("ub_scenario_inputs", JSON.stringify(inputs));
    router.push("/results");
  }

  function clearAndRestart() {
    sessionStorage.removeItem(STORAGE_KEY);
    setForm(EMPTY_FORM);
    setStep(0);
    setAcknowledged(false);
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-12">
      <SessionGuard />
      <PrivateBrowsingPrompt />
      <div className="max-w-xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <p className="text-xs text-stone-500 mb-2">
            Step {step + 1} of {STEPS.length} — {STEPS[step]}
          </p>
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  i <= step ? "bg-stone-800" : "bg-stone-200"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
          {step === 0 && (
            <Step0State form={form} update={update} />
          )}
          {step === 1 && (
            <Step1YourIncome form={form} updateNum={updateNum} />
          )}
          {step === 2 && (
            <Step2PartnerIncome form={form} updateNum={updateNum} />
          )}
          {step === 3 && (
            <Step3Expenses form={form} updateNum={updateNum} />
          )}
          {step === 4 && (
            <Step4Assets form={form} updateNum={updateNum} />
          )}
          {step === 5 && (
            <Step5Children form={form} update={update} updateNum={updateNum} />
          )}
          {step === 6 && (
            <Step6Situation form={form} update={update} updateNum={updateNum} />
          )}
          {step === 7 && (
            <Step7Acknowledgment
              acknowledged={acknowledged}
              setAcknowledged={setAcknowledged}
            />
          )}

          <div className="flex justify-between mt-8 pt-4 border-t border-stone-100">
            <button
              onClick={() => step > 0 && setStep((s) => s - 1)}
              className="text-sm text-stone-500 hover:text-stone-800 disabled:opacity-30"
              disabled={step === 0}
            >
              Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="px-5 py-2.5 bg-stone-900 text-white text-sm rounded font-medium hover:bg-stone-800 transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!acknowledged}
                className="px-5 py-2.5 bg-stone-900 text-white text-sm rounded font-medium hover:bg-stone-800 transition-colors disabled:opacity-40"
              >
                Run my scenarios
              </button>
            )}
          </div>

          <button
            onClick={clearAndRestart}
            className="mt-4 text-xs text-stone-400 hover:text-stone-600 w-full text-center"
          >
            Clear all data and start over
          </button>
        </div>

        <p className="mt-6 text-xs text-stone-400 text-center leading-relaxed">
          Your data is stored only in your browser session. It is cleared when you close the tab.
          This is not financial, legal, or tax advice.
        </p>
      </div>
    </main>
  );
}

// --- Step components ---

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-stone-700 mb-1">{children}</label>;
}

function NumberInput({
  id,
  value,
  onChange,
  placeholder = "0",
}: {
  id: string;
  value?: number;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
      <input
        id={id}
        type="number"
        min={0}
        step={1}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-7 pr-3 py-2.5 border border-stone-300 rounded text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
      />
    </div>
  );
}

function StepHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-stone-900">{title}</h2>
      {subtitle && <p className="text-sm text-stone-500 mt-1">{subtitle}</p>}
    </div>
  );
}

function Step0State({
  form,
  update,
}: {
  form: Partial<HouseholdFinancials>;
  update: (f: keyof HouseholdFinancials, v: unknown) => void;
}) {
  return (
    <>
      <StepHeader
        title="Which state do you live in?"
        subtitle="We use state-specific legal formulas. Three states are supported at launch."
      />
      <div className="flex flex-col gap-3">
        {(["CA", "TX", "NY"] as SupportedState[]).map((s) => {
          const labels: Record<SupportedState, string> = {
            CA: "California — community property",
            TX: "Texas — community property (modified)",
            NY: "New York — equitable distribution",
          };
          return (
            <button
              key={s}
              onClick={() => update("state", s)}
              className={`w-full text-left px-4 py-3 rounded border text-sm transition-colors ${
                form.state === s
                  ? "border-stone-900 bg-stone-50 font-medium text-stone-900"
                  : "border-stone-200 text-stone-600 hover:border-stone-400"
              }`}
            >
              {labels[s]}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-stone-400">
        Additional states require operator approval and will be added after launch.
      </p>
    </>
  );
}

function Step1YourIncome({
  form,
  updateNum,
}: {
  form: Partial<HouseholdFinancials>;
  updateNum: (f: keyof HouseholdFinancials, v: string) => void;
}) {
  return (
    <>
      <StepHeader
        title="Your income"
        subtitle="Monthly amounts. Use take-home (net) if you have it; gross is fine too."
      />
      <div className="flex flex-col gap-5">
        <div>
          <FieldLabel>Your gross monthly income (before taxes)</FieldLabel>
          <NumberInput
            id="yourGross"
            value={form.yourGrossMonthlyIncome}
            onChange={(v) => updateNum("yourGrossMonthlyIncome", v)}
          />
        </div>
        <div>
          <FieldLabel>Your net (take-home) monthly income</FieldLabel>
          <NumberInput
            id="yourNet"
            value={form.yourNetMonthlyIncome}
            onChange={(v) => updateNum("yourNetMonthlyIncome", v)}
          />
          <p className="text-xs text-stone-400 mt-1">Optional. We use gross if you leave this blank.</p>
        </div>
        <div>
          <FieldLabel>Your current savings</FieldLabel>
          <NumberInput
            id="savings"
            value={form.currentSavings}
            onChange={(v) => updateNum("currentSavings", v)}
          />
          <p className="text-xs text-stone-400 mt-1">Used to calculate how many months of runway you have.</p>
        </div>
      </div>
    </>
  );
}

function Step2PartnerIncome({
  form,
  updateNum,
}: {
  form: Partial<HouseholdFinancials>;
  updateNum: (f: keyof HouseholdFinancials, v: string) => void;
}) {
  return (
    <>
      <StepHeader
        title="Your partner's income"
        subtitle="Estimates are fine. Support calculations depend on the income gap."
      />
      <div className="flex flex-col gap-5">
        <div>
          <FieldLabel>Their gross monthly income</FieldLabel>
          <NumberInput
            id="partnerGross"
            value={form.partnerGrossMonthlyIncome}
            onChange={(v) => updateNum("partnerGrossMonthlyIncome", v)}
          />
        </div>
        <div>
          <FieldLabel>Their net (take-home) monthly income</FieldLabel>
          <NumberInput
            id="partnerNet"
            value={form.partnerNetMonthlyIncome}
            onChange={(v) => updateNum("partnerNetMonthlyIncome", v)}
          />
          <p className="text-xs text-stone-400 mt-1">Optional.</p>
        </div>
      </div>
    </>
  );
}

function Step3Expenses({
  form,
  updateNum,
}: {
  form: Partial<HouseholdFinancials>;
  updateNum: (f: keyof HouseholdFinancials, v: string) => void;
}) {
  const fields: Array<{ id: keyof HouseholdFinancials; label: string }> = [
    { id: "rent", label: "Rent or mortgage" },
    { id: "utilities", label: "Utilities (electric, gas, internet)" },
    { id: "groceries", label: "Groceries" },
    { id: "transportation", label: "Transportation (car, transit)" },
    { id: "childcare", label: "Childcare / school costs" },
    { id: "healthcare", label: "Healthcare (premiums + out-of-pocket)" },
    { id: "otherExpenses", label: "Other regular expenses" },
  ];

  return (
    <>
      <StepHeader
        title="Monthly household expenses"
        subtitle="Combined household expenses — what both of you spend together."
      />
      <div className="flex flex-col gap-4">
        {fields.map(({ id, label }) => (
          <div key={id}>
            <FieldLabel>{label}</FieldLabel>
            <NumberInput
              id={id}
              value={form[id] as number | undefined}
              onChange={(v) => updateNum(id, v)}
            />
          </div>
        ))}
      </div>
    </>
  );
}

function Step4Assets({
  form,
  updateNum,
}: {
  form: Partial<HouseholdFinancials>;
  updateNum: (f: keyof HouseholdFinancials, v: string) => void;
}) {
  return (
    <>
      <StepHeader
        title="Assets and debts"
        subtitle="Marital assets and debts acquired during the marriage. Estimates are fine."
      />
      <div className="flex flex-col gap-5">
        <div>
          <FieldLabel>Total marital assets (home equity, retirement accounts, savings, vehicles)</FieldLabel>
          <NumberInput
            id="maritalAssets"
            value={form.maritalAssets}
            onChange={(v) => updateNum("maritalAssets", v)}
          />
        </div>
        <div>
          <FieldLabel>Total marital debts (mortgage balance, car loans, credit cards)</FieldLabel>
          <NumberInput
            id="maritalDebts"
            value={form.maritalDebts}
            onChange={(v) => updateNum("maritalDebts", v)}
          />
        </div>
        <div>
          <FieldLabel>Your separate assets (pre-marital, inheritance, gifts to you)</FieldLabel>
          <NumberInput
            id="yourSeparateAssets"
            value={form.yourSeparateAssets}
            onChange={(v) => updateNum("yourSeparateAssets", v)}
          />
          <p className="text-xs text-stone-400 mt-1">
            Not included in division. Consult an attorney to verify what qualifies.
          </p>
        </div>
      </div>
    </>
  );
}

function Step5Children({
  form,
  update,
  updateNum,
}: {
  form: Partial<HouseholdFinancials>;
  update: (f: keyof HouseholdFinancials, v: unknown) => void;
  updateNum: (f: keyof HouseholdFinancials, v: string) => void;
}) {
  return (
    <>
      <StepHeader
        title="Children"
        subtitle="Used to estimate child support and custody-related expenses."
      />
      <div className="flex flex-col gap-5">
        <div>
          <FieldLabel>Number of minor children (under 18)</FieldLabel>
          <input
            type="number"
            min={0}
            max={10}
            value={form.numberOfChildren ?? 0}
            onChange={(e) => updateNum("numberOfChildren", e.target.value)}
            className="w-full px-3 py-2.5 border border-stone-300 rounded text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        {(form.numberOfChildren ?? 0) > 0 && (
          <div>
            <FieldLabel>Expected custody arrangement</FieldLabel>
            <div className="flex flex-col gap-2">
              {(
                [
                  { value: "primary", label: "You would have primary custody (most of the time with you)" },
                  { value: "50_50", label: "Shared / 50-50 custody" },
                  { value: "limited", label: "Limited custody (children mostly with partner)" },
                ] as const
              ).map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => update("estimatedCustodySplit", value)}
                  className={`w-full text-left px-4 py-3 rounded border text-sm transition-colors ${
                    form.estimatedCustodySplit === value
                      ? "border-stone-900 bg-stone-50 font-medium text-stone-900"
                      : "border-stone-200 text-stone-600 hover:border-stone-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="text-xs text-stone-400 mt-2">
              This is an estimate for modeling. Actual custody is determined by the court.
            </p>
          </div>
        )}

        {(form.numberOfChildren ?? 0) > 0 && (
          <div>
            <FieldLabel>Estimated rent for a new place (1–2 bedroom)</FieldLabel>
            <NumberInput
              id="estimatedRent"
              value={form.estimatedRentForNewPlace}
              onChange={(v) => updateNum("estimatedRentForNewPlace", v)}
              placeholder="2000"
            />
            <p className="text-xs text-stone-400 mt-1">
              We use HUD Fair Market Rents as a default if you leave this blank.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function Step6Situation({
  form,
  update,
  updateNum,
}: {
  form: Partial<HouseholdFinancials>;
  update: (f: keyof HouseholdFinancials, v: unknown) => void;
  updateNum: (f: keyof HouseholdFinancials, v: string) => void;
}) {
  return (
    <>
      <StepHeader
        title="A few more details"
        subtitle="These affect formula eligibility in some states."
      />
      <div className="flex flex-col gap-5">
        <div>
          <FieldLabel>How many years have you been married?</FieldLabel>
          <input
            type="number"
            min={0}
            max={60}
            value={form.marriageYears ?? ""}
            onChange={(e) => updateNum("marriageYears", e.target.value)}
            className="w-full px-3 py-2.5 border border-stone-300 rounded text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
          />
        </div>

        <div>
          <FieldLabel>Has there been documented family violence or abuse?</FieldLabel>
          <div className="flex gap-3">
            {(["yes", "no"] as const).map((v) => (
              <button
                key={v}
                onClick={() => update("familyViolence", v === "yes")}
                className={`flex-1 py-2.5 rounded border text-sm transition-colors ${
                  (v === "yes" ? form.familyViolence === true : form.familyViolence === false)
                    ? "border-stone-900 bg-stone-50 font-medium text-stone-900"
                    : "border-stone-200 text-stone-600 hover:border-stone-400"
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-xs text-stone-400 mt-2">
            Affects spousal maintenance eligibility in Texas. All information is private.
          </p>
        </div>

        <div>
          <FieldLabel>Estimated rent for a new place (if not entered earlier)</FieldLabel>
          <NumberInput
            id="newRent2"
            value={form.estimatedRentForNewPlace}
            onChange={(v) => updateNum("estimatedRentForNewPlace", v)}
            placeholder="2000"
          />
        </div>
      </div>
    </>
  );
}

function Step7Acknowledgment({
  acknowledged,
  setAcknowledged,
}: {
  acknowledged: boolean;
  setAcknowledged: (v: boolean) => void;
}) {
  return (
    <>
      <StepHeader title="Before we run your scenarios" />
      <div className="bg-stone-50 border border-stone-200 rounded-lg p-5 mb-6 text-sm text-stone-600 leading-relaxed">
        <p className="font-medium text-stone-900 mb-2">This is not advice.</p>
        <p>
          Unbridaled provides educational financial scenarios based on the numbers you entered and
          state-specific legal formulas. It is not financial, legal, or tax advice. The projections
          are estimates with significant uncertainty.
        </p>
        <p className="mt-3">
          Every number is sourced from official state statutes or federal data. Every formula is
          explained. Courts have significant discretion — actual outcomes may vary substantially.
        </p>
        <p className="mt-3">
          <strong>Consult a licensed family law attorney and financial advisor</strong> before making
          any decisions based on these scenarios.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-5 flex gap-3">
        <span className="text-amber-600 text-base mt-0.5 shrink-0" aria-hidden>⚠</span>
        <div className="text-sm text-amber-800 leading-relaxed">
          <p className="font-medium mb-1">Use a safe device</p>
          <p>
            If someone monitors your device or internet activity, use a private browser window or a
            device they do not have access to. Unbridaled stores nothing on our servers until you
            create an account — all data entered so far exists only in this browser tab and is
            cleared when you close it.
          </p>
        </div>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(e) => setAcknowledged(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-400"
        />
        <span className="text-sm text-stone-700">
          I understand that Unbridaled provides educational scenarios only — not financial, legal, or
          tax advice — and that I should consult a licensed attorney and financial advisor before
          making any decisions.
        </span>
      </label>
    </>
  );
}
