/**
 * Unbridaled Scenario Engine — core calculation module
 *
 * Pure TypeScript. No side effects. No API calls. Fully unit-testable.
 *
 * GUARDRAIL S1: This engine produces SCENARIOS, not advice.
 * Output is "if X, then projected Y." Never "you should."
 *
 * Inputs describe the household's current financial state.
 * Outputs are 3 scenarios with projected monthly cash flows, runway, and legal estimates.
 *
 * All formulas sourced — see individual state files for citations.
 */

import { calcCASpousalSupport, calcCAChildSupport, calcCACommunityPropertySplit } from "./states/ca";
import { calcTXSpousalMaintenance, calcTXChildSupport, calcTXPropertyDivision } from "./states/tx";
import {
  calcNYMaintenance,
  calcNYChildSupport,
  calcNYEquitableDistribution,
} from "./states/ny";
import {
  calcWASpousalMaintenance,
  calcWAChildSupport,
  calcWAPropertyDivision,
} from "./states/wa";

export type SupportedState = "CA" | "TX" | "NY" | "WA";

export interface HouseholdFinancials {
  // Income
  yourGrossMonthlyIncome: number;
  partnerGrossMonthlyIncome: number;
  yourNetMonthlyIncome: number;
  partnerNetMonthlyIncome: number;

  // Monthly expenses (current household)
  rent: number;
  utilities: number;
  groceries: number;
  transportation: number;
  childcare: number;
  healthcare: number;
  otherExpenses: number;

  // Assets & debts
  maritalAssets: number;
  maritalDebts: number;
  yourSeparateAssets: number;
  currentSavings: number;

  // Family
  numberOfChildren: number;
  childrenAges: number[];

  // Legal context
  state: SupportedState;
  marriageYears: number;
  familyViolence: boolean;
  youAreHigherEarner: boolean;

  // Custody assumption for estimates
  estimatedCustodySplit: "primary" | "50_50" | "limited";

  // Housing
  estimatedRentForNewPlace: number; // from HUD FMR or user input
}

export interface LineItem {
  label: string;
  amount: number;
  formula?: string;
  sourceUrl?: string;
  note?: string;
}

export interface ScenarioOutput {
  label: string;
  description: string;

  // Monthly cash flow
  monthlyIncome: number;
  monthlyExpenses: LineItem[];
  totalMonthlyExpenses: number;
  monthlyNet: number;

  // Legal projections
  spousalSupportReceived: LineItem | null;
  spousalSupportPaid: LineItem | null;
  childSupportReceived: LineItem | null;
  childSupportPaid: LineItem | null;

  // One-time
  propertyShareReceived: number;
  propertyShareNote: string;

  // Runway
  currentSavings: number;
  monthsRunway: number; // months savings lasts at projected burn rate
  sixMonthBurndown: number[];

  // Insurance delta
  healthInsuranceDelta: LineItem;
}

export interface ScenarioResult {
  inputs: HouseholdFinancials;
  generatedAt: string;
  state: SupportedState;
  scenarios: {
    stay: ScenarioOutput;
    leaveWithDivision: ScenarioOutput;
    leaveWithoutDivision: ScenarioOutput;
  };
  disclaimer: string;
}

const DISCLAIMER =
  "UNBRIDALED provides educational financial scenarios. This is not financial, legal, or tax advice. " +
  "Consult a licensed financial advisor and family law attorney for guidance on your specific situation.";

function buildMonthlyExpenses(inputs: HouseholdFinancials, scenario: "stay" | "solo"): LineItem[] {
  if (scenario === "stay") {
    return [
      { label: "Rent/mortgage", amount: inputs.rent },
      { label: "Utilities", amount: inputs.utilities },
      { label: "Groceries", amount: inputs.groceries },
      { label: "Transportation", amount: inputs.transportation },
      { label: "Childcare", amount: inputs.childcare },
      { label: "Healthcare", amount: inputs.healthcare },
      { label: "Other", amount: inputs.otherExpenses },
    ];
  }

  // Solo: use HUD FMR rent if user provided it; utilities increase ~20% for single household
  const soloRent = inputs.estimatedRentForNewPlace || inputs.rent;
  const soloUtilities = Math.round(inputs.utilities * 1.1);

  return [
    {
      label: "Rent (new place)",
      amount: soloRent,
      note:
        inputs.estimatedRentForNewPlace
          ? "Estimated new rent from HUD Fair Market Rents or your input"
          : "Using current rent as placeholder — enter your estimated new rent for accuracy",
      sourceUrl: "https://www.huduser.gov/portal/datasets/fmr.html",
    },
    { label: "Utilities", amount: soloUtilities },
    { label: "Groceries", amount: Math.round(inputs.groceries * 0.7) },
    { label: "Transportation", amount: inputs.transportation },
    {
      label: "Childcare",
      amount:
        inputs.estimatedCustodySplit === "primary"
          ? inputs.childcare
          : inputs.estimatedCustodySplit === "50_50"
          ? Math.round(inputs.childcare * 0.6)
          : Math.round(inputs.childcare * 0.3),
    },
    {
      label: "Healthcare / insurance",
      amount: inputs.healthcare,
      note: "Healthcare cost may change significantly post-separation — see insurance delta below",
    },
    { label: "Other", amount: inputs.otherExpenses },
  ];
}

function getHealthInsuranceDelta(inputs: HouseholdFinancials): LineItem {
  // Health insurance delta is UNVERIFIED — varies enormously by employer/plan/state
  // Placeholder: ACA marketplace average individual premium ~$450/month if uninsured via employer
  // Source (UNVERIFIED): https://www.kff.org/health-costs/
  return {
    label: "Health insurance (estimated solo cost if losing employer coverage)",
    amount: 450,
    formula: "Placeholder: $450/month ACA marketplace individual premium estimate",
    sourceUrl: "https://www.kff.org/health-costs/",
    note: "UNVERIFIED average — your actual cost depends on income, state, age, and employer plan. " +
      "Check healthcare.gov for your specific estimate.",
  };
}

function calcMonthsRunway(savings: number, monthlyBurn: number): number {
  if (monthlyBurn <= 0) return 999; // positive cash flow = infinite runway
  return Math.round((savings / monthlyBurn) * 10) / 10;
}

function calcSixMonthBurndown(savings: number, monthlyNet: number): number[] {
  return Array.from({ length: 7 }, (_, i) => Math.round(savings + monthlyNet * i));
}

function getSpousalSupportForState(inputs: HouseholdFinancials) {
  const higherNet = Math.max(inputs.yourNetMonthlyIncome, inputs.partnerNetMonthlyIncome);
  const lowerNet = Math.min(inputs.yourNetMonthlyIncome, inputs.partnerNetMonthlyIncome);
  const higherGross = Math.max(inputs.yourGrossMonthlyIncome, inputs.partnerGrossMonthlyIncome);
  const lowerGross = Math.min(inputs.yourGrossMonthlyIncome, inputs.partnerGrossMonthlyIncome);

  if (inputs.state === "CA") {
    const result = calcCASpousalSupport({
      higherNetMonthlyIncome: higherNet,
      lowerNetMonthlyIncome: lowerNet,
      combinedNetMonthlyIncome: higherNet + lowerNet,
      numberOfChildren: inputs.numberOfChildren,
      higherEarnerCustodyPct:
        inputs.estimatedCustodySplit === "primary" ? (inputs.youAreHigherEarner ? 0.2 : 0.8) : 0.5,
      marriageYears: inputs.marriageYears,
      maritalAssets: inputs.maritalAssets,
      maritalDebts: inputs.maritalDebts,
    });
    return {
      mid: result.mid,
      low: result.low,
      high: result.high,
      formula: result.formula,
      sourceUrl: result.sourceUrl,
      note: result.note,
    };
  }

  if (inputs.state === "TX") {
    const payorNet = inputs.youAreHigherEarner
      ? inputs.yourNetMonthlyIncome
      : inputs.partnerNetMonthlyIncome;
    const payorGross = inputs.youAreHigherEarner
      ? inputs.yourGrossMonthlyIncome
      : inputs.partnerGrossMonthlyIncome;
    const result = calcTXSpousalMaintenance({
      payorGrossMonthlyIncome: payorGross,
      payeeGrossMonthlyIncome: inputs.youAreHigherEarner
        ? inputs.partnerGrossMonthlyIncome
        : inputs.yourGrossMonthlyIncome,
      payorNetMonthlyResources: payorNet,
      numberOfChildren: inputs.numberOfChildren,
      marriageYears: inputs.marriageYears,
      familyViolence: inputs.familyViolence,
      payeeDisabled: false,
      caresForDisabledChild: false,
      maritalAssets: inputs.maritalAssets,
      maritalDebts: inputs.maritalDebts,
    });
    if (!result.eligible) {
      return { mid: 0, low: 0, high: 0, formula: result.formula, sourceUrl: result.sourceUrl, note: result.note };
    }
    return {
      mid: result.monthlyAmount,
      low: Math.round(result.monthlyAmount * 0.7),
      high: result.monthlyAmountMax,
      formula: result.formula,
      sourceUrl: result.sourceUrl,
      note: result.note,
    };
  }

  if (inputs.state === "NY") {
    const result = calcNYMaintenance({
      higherEarnerGrossAnnualIncome: higherGross * 12,
      lowerEarnerGrossAnnualIncome: lowerGross * 12,
      higherEarnerGrossMonthly: higherGross,
      lowerEarnerGrossMonthly: lowerGross,
      numberOfChildren: inputs.numberOfChildren,
      marriageYears: inputs.marriageYears,
      maritalAssets: inputs.maritalAssets,
      maritalDebts: inputs.maritalDebts,
      hasHealthInsurance: true,
      childrenInCustodyOfLower: !inputs.youAreHigherEarner,
    });
    return {
      mid: result.monthlyAmount,
      low: result.monthlyLow,
      high: result.monthlyHigh,
      formula: result.formula,
      sourceUrl: result.sourceUrl,
      note: result.note,
    };
  }

  if (inputs.state === "WA") {
    const result = calcWASpousalMaintenance({
      higherNetMonthlyIncome: higherNet,
      lowerNetMonthlyIncome: lowerNet,
      combinedNetMonthlyIncome: higherNet + lowerNet,
      numberOfChildren: inputs.numberOfChildren,
      marriageYears: inputs.marriageYears,
      maritalAssets: inputs.maritalAssets,
      maritalDebts: inputs.maritalDebts,
    });
    return {
      mid: result.mid,
      low: result.low,
      high: result.high,
      formula: result.formula,
      sourceUrl: result.sourceUrl,
      note: result.note,
    };
  }

  return { mid: 0, low: 0, high: 0, formula: "N/A", sourceUrl: "", note: "Unsupported state" };
}

function getChildSupportForState(inputs: HouseholdFinancials) {
  if (inputs.numberOfChildren === 0) return null;

  const custodyPct =
    inputs.estimatedCustodySplit === "primary"
      ? inputs.youAreHigherEarner
        ? 0.2
        : 0.8
      : 0.5;

  if (inputs.state === "CA") {
    return calcCAChildSupport({
      higherNetMonthlyIncome: Math.max(inputs.yourNetMonthlyIncome, inputs.partnerNetMonthlyIncome),
      lowerNetMonthlyIncome: Math.min(inputs.yourNetMonthlyIncome, inputs.partnerNetMonthlyIncome),
      combinedNetMonthlyIncome: inputs.yourNetMonthlyIncome + inputs.partnerNetMonthlyIncome,
      numberOfChildren: inputs.numberOfChildren,
      higherEarnerCustodyPct: custodyPct,
      marriageYears: inputs.marriageYears,
      maritalAssets: inputs.maritalAssets,
      maritalDebts: inputs.maritalDebts,
    });
  }

  if (inputs.state === "TX") {
    const payorNetResources = inputs.youAreHigherEarner
      ? inputs.yourNetMonthlyIncome
      : inputs.partnerNetMonthlyIncome;
    return calcTXChildSupport({
      payorGrossMonthlyIncome: Math.max(inputs.yourGrossMonthlyIncome, inputs.partnerGrossMonthlyIncome),
      payeeGrossMonthlyIncome: Math.min(inputs.yourGrossMonthlyIncome, inputs.partnerGrossMonthlyIncome),
      payorNetMonthlyResources: payorNetResources,
      numberOfChildren: inputs.numberOfChildren,
      marriageYears: inputs.marriageYears,
      familyViolence: inputs.familyViolence,
      payeeDisabled: false,
      caresForDisabledChild: false,
      maritalAssets: inputs.maritalAssets,
      maritalDebts: inputs.maritalDebts,
    });
  }

  if (inputs.state === "NY") {
    return calcNYChildSupport({
      higherEarnerGrossAnnualIncome: Math.max(inputs.yourGrossMonthlyIncome, inputs.partnerGrossMonthlyIncome) * 12,
      lowerEarnerGrossAnnualIncome: Math.min(inputs.yourGrossMonthlyIncome, inputs.partnerGrossMonthlyIncome) * 12,
      higherEarnerGrossMonthly: Math.max(inputs.yourGrossMonthlyIncome, inputs.partnerGrossMonthlyIncome),
      lowerEarnerGrossMonthly: Math.min(inputs.yourGrossMonthlyIncome, inputs.partnerGrossMonthlyIncome),
      numberOfChildren: inputs.numberOfChildren,
      marriageYears: inputs.marriageYears,
      maritalAssets: inputs.maritalAssets,
      maritalDebts: inputs.maritalDebts,
      hasHealthInsurance: true,
      childrenInCustodyOfLower: !inputs.youAreHigherEarner,
    });
  }

  if (inputs.state === "WA") {
    const result = calcWAChildSupport({
      higherNetMonthlyIncome: Math.max(inputs.yourNetMonthlyIncome, inputs.partnerNetMonthlyIncome),
      lowerNetMonthlyIncome: Math.min(inputs.yourNetMonthlyIncome, inputs.partnerNetMonthlyIncome),
      combinedNetMonthlyIncome: inputs.yourNetMonthlyIncome + inputs.partnerNetMonthlyIncome,
      numberOfChildren: inputs.numberOfChildren,
      marriageYears: inputs.marriageYears,
      maritalAssets: inputs.maritalAssets,
      maritalDebts: inputs.maritalDebts,
    });
    return result;
  }

  return null;
}

function getPropertyDivision(inputs: HouseholdFinancials) {
  if (inputs.state === "CA") {
    return calcCACommunityPropertySplit(inputs.maritalAssets, inputs.maritalDebts);
  }
  if (inputs.state === "TX") {
    const div = calcTXPropertyDivision(inputs.maritalAssets, inputs.maritalDebts);
    return {
      ...div,
      eachSpouseShare: div.presumptiveSplit,
    };
  }
  if (inputs.state === "NY") {
    const dist = calcNYEquitableDistribution(
      inputs.maritalAssets,
      inputs.maritalDebts,
      inputs.marriageYears
    );
    return {
      netMaritalEstate: dist.netMaritalEstate,
      eachSpouseShare: dist.estimatedMidShare,
      formula: dist.formula,
      sourceUrl: dist.sourceUrl,
      note: dist.note,
    };
  }
  if (inputs.state === "WA") {
    const dist = calcWAPropertyDivision(inputs.maritalAssets, inputs.maritalDebts, inputs.marriageYears);
    return {
      netMaritalEstate: dist.netMaritalEstate,
      eachSpouseShare: dist.estimatedMidShare,
      formula: dist.formula,
      sourceUrl: dist.sourceUrl,
      note: dist.note,
    };
  }

  return { netMaritalEstate: 0, eachSpouseShare: 0, formula: "", sourceUrl: "", note: "" };
}

export function runScenarios(inputs: HouseholdFinancials): ScenarioResult {
  const SUPPORTED: SupportedState[] = ["CA", "TX", "NY", "WA"];
  if (!(SUPPORTED as string[]).includes(inputs.state)) {
    throw new Error(`Unsupported state: ${inputs.state}. Supported states: ${SUPPORTED.join(", ")}`);
  }

  const spousal = getSpousalSupportForState(inputs);
  const childSupport = getChildSupportForState(inputs);
  const property = getPropertyDivision(inputs);
  const insuranceDelta = getHealthInsuranceDelta(inputs);

  // You receive support if you're the lower earner
  const youReceiveSupport = !inputs.youAreHigherEarner;
  const spousalForYou = youReceiveSupport ? spousal.mid : 0;
  const spousalYouPay = !youReceiveSupport ? spousal.mid : 0;
  const childSupportMonthly = childSupport?.monthly ?? 0;
  // If you have primary custody and are lower earner, you receive child support
  const youReceiveChildSupport =
    !inputs.youAreHigherEarner && inputs.estimatedCustodySplit === "primary";

  // --- SCENARIO 1: STAY ---
  const stayExpenses = buildMonthlyExpenses(inputs, "stay");
  const stayTotalExpenses = stayExpenses.reduce((s, e) => s + e.amount, 0);
  const stayMonthlyIncome = inputs.yourNetMonthlyIncome;
  const stayNet = stayMonthlyIncome - stayTotalExpenses;

  const stay: ScenarioOutput = {
    label: "Current situation",
    description: "Your projected monthly finances if nothing changes.",
    monthlyIncome: stayMonthlyIncome,
    monthlyExpenses: stayExpenses,
    totalMonthlyExpenses: stayTotalExpenses,
    monthlyNet: stayNet,
    spousalSupportReceived: null,
    spousalSupportPaid: null,
    childSupportReceived: null,
    childSupportPaid: null,
    propertyShareReceived: 0,
    propertyShareNote: "No property division in this scenario",
    currentSavings: inputs.currentSavings,
    monthsRunway: calcMonthsRunway(
      inputs.currentSavings,
      stayNet < 0 ? Math.abs(stayNet) : 0
    ),
    sixMonthBurndown: calcSixMonthBurndown(inputs.currentSavings, stayNet),
    healthInsuranceDelta: { ...insuranceDelta, amount: 0 },
  };

  // --- SCENARIO 2: LEAVE WITH DIVISION ---
  const leaveExpenses = buildMonthlyExpenses(inputs, "solo");
  const leaveBaseTotalExpenses = leaveExpenses.reduce((s, e) => s + e.amount, 0);

  const leaveWithIncome =
    inputs.yourNetMonthlyIncome +
    spousalForYou +
    (youReceiveChildSupport ? childSupportMonthly : 0);

  const leaveWithExpenses =
    leaveBaseTotalExpenses + spousalYouPay + (!youReceiveChildSupport && inputs.numberOfChildren > 0 ? childSupportMonthly : 0);

  const leaveWithNet = leaveWithIncome - leaveWithExpenses;

  const leaveWithDivision: ScenarioOutput = {
    label: "Separation with legal process",
    description:
      "Projected finances if you separate and complete formal legal division of assets, including projected support.",
    monthlyIncome: leaveWithIncome,
    monthlyExpenses: [
      ...leaveExpenses,
      ...(spousalYouPay > 0
        ? [
            {
              label: "Spousal support (projected payment)",
              amount: spousalYouPay,
              formula: spousal.formula,
              sourceUrl: spousal.sourceUrl,
              note: spousal.note,
            },
          ]
        : []),
      ...(!youReceiveChildSupport && inputs.numberOfChildren > 0 && childSupportMonthly > 0
        ? [
            {
              label: "Child support (projected payment)",
              amount: childSupportMonthly,
              formula: childSupport?.formula,
              sourceUrl: childSupport?.sourceUrl,
              note: childSupport?.note,
            },
          ]
        : []),
    ],
    totalMonthlyExpenses: leaveWithExpenses,
    monthlyNet: leaveWithNet,
    spousalSupportReceived: youReceiveSupport && spousalForYou > 0
      ? {
          label: "Spousal support (projected receipt)",
          amount: spousalForYou,
          formula: spousal.formula,
          sourceUrl: spousal.sourceUrl,
          note: `Range: $${spousal.low.toLocaleString()}–$${spousal.high.toLocaleString()}/mo. ${spousal.note}`,
        }
      : null,
    spousalSupportPaid: !youReceiveSupport && spousalYouPay > 0
      ? {
          label: "Spousal support (projected payment)",
          amount: spousalYouPay,
          formula: spousal.formula,
          sourceUrl: spousal.sourceUrl,
          note: `Range: $${spousal.low.toLocaleString()}–$${spousal.high.toLocaleString()}/mo. ${spousal.note}`,
        }
      : null,
    childSupportReceived: youReceiveChildSupport && childSupportMonthly > 0
      ? {
          label: "Child support (projected receipt)",
          amount: childSupportMonthly,
          formula: childSupport?.formula,
          sourceUrl: childSupport?.sourceUrl,
          note: childSupport?.note,
        }
      : null,
    childSupportPaid: !youReceiveChildSupport && inputs.numberOfChildren > 0 && childSupportMonthly > 0
      ? {
          label: "Child support (projected payment)",
          amount: childSupportMonthly,
          formula: childSupport?.formula,
          sourceUrl: childSupport?.sourceUrl,
          note: childSupport?.note,
        }
      : null,
    propertyShareReceived: property.eachSpouseShare,
    propertyShareNote: property.note ?? "",
    currentSavings: inputs.currentSavings + property.eachSpouseShare,
    monthsRunway: calcMonthsRunway(
      inputs.currentSavings + property.eachSpouseShare,
      leaveWithNet < 0 ? Math.abs(leaveWithNet) : 0
    ),
    sixMonthBurndown: calcSixMonthBurndown(
      inputs.currentSavings + property.eachSpouseShare,
      leaveWithNet
    ),
    healthInsuranceDelta: insuranceDelta,
  };

  // --- SCENARIO 3: LEAVE WITHOUT FORMAL DIVISION ---
  // No support received/paid, no property division — just raw solo costs
  const leaveWithoutIncome = inputs.yourNetMonthlyIncome;
  const leaveWithoutNet = leaveWithoutIncome - leaveBaseTotalExpenses;

  const leaveWithoutDivision: ScenarioOutput = {
    label: "Separation without legal process",
    description:
      "Projected finances if you leave without a formal legal settlement — no spousal or child support orders, no property division. This is a baseline only.",
    monthlyIncome: leaveWithoutIncome,
    monthlyExpenses: leaveExpenses,
    totalMonthlyExpenses: leaveBaseTotalExpenses,
    monthlyNet: leaveWithoutNet,
    spousalSupportReceived: null,
    spousalSupportPaid: null,
    childSupportReceived: null,
    childSupportPaid: null,
    propertyShareReceived: 0,
    propertyShareNote:
      "No property division modeled — you would need to negotiate or litigate to access marital assets",
    currentSavings: inputs.currentSavings,
    monthsRunway: calcMonthsRunway(
      inputs.currentSavings,
      leaveWithoutNet < 0 ? Math.abs(leaveWithoutNet) : 0
    ),
    sixMonthBurndown: calcSixMonthBurndown(inputs.currentSavings, leaveWithoutNet),
    healthInsuranceDelta: insuranceDelta,
  };

  return {
    inputs,
    generatedAt: new Date().toISOString(),
    state: inputs.state,
    scenarios: {
      stay,
      leaveWithDivision,
      leaveWithoutDivision,
    },
    disclaimer: DISCLAIMER,
  };
}
