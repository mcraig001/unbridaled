/**
 * Texas State Formulas — SOURCED
 *
 * Community property state with distinct rules from California.
 *
 * Sources:
 * - Spousal maintenance: Texas Family Code §§ 8.051–8.059
 *   https://statutes.capitol.texas.gov/docs/fa/pdf/fa.8.pdf
 *   https://texaslawhelp.org/article/spousal-maintenance-alimony
 * - Child support: Texas Family Code §§ 154.001–154.308, specifically § 154.125
 *   https://statutes.capitol.texas.gov/GetStatute.aspx?Code=FA&Value=154.125
 *   Cap updated to $11,700/month net resources effective Sept 1, 2025
 *   https://www.bryanfagan.com/2025/10/new-texas-child-support-guideline-cap-and-percentages-2025-update/
 * - Community property: Texas Family Code § 3.001–3.003
 *   https://statutes.capitol.texas.gov/GetStatute.aspx?Code=FA&Value=3.001
 *
 * lastReviewed: 2026-04-26
 * verifiedAgainst: texaslawhelp.org, statutes.capitol.texas.gov, bryanfagan.com (2025 cap update)
 */

export const TX_STATE = {
  code: "TX",
  name: "Texas",
  propertySystem: "community_property" as const,
  lastReviewed: "2026-04-26",
  sources: {
    spousalMaintenance: "https://statutes.capitol.texas.gov/docs/fa/pdf/fa.8.pdf",
    childSupport:
      "https://statutes.capitol.texas.gov/GetStatute.aspx?Code=FA&Value=154.125",
    communityProperty:
      "https://statutes.capitol.texas.gov/GetStatute.aspx?Code=FA&Value=3.001",
    selfHelp: "https://texaslawhelp.org/article/spousal-maintenance-alimony",
  },
};

export interface TXInputs {
  payorGrossMonthlyIncome: number;
  payeeGrossMonthlyIncome: number;
  payorNetMonthlyResources: number;
  numberOfChildren: number;
  marriageYears: number;
  familyViolence: boolean;
  payeeDisabled: boolean;
  caresForDisabledChild: boolean;
  maritalAssets: number;
  maritalDebts: number;
}

export interface SpousalMaintenanceResult {
  eligible: boolean;
  eligibilityReason: string;
  monthlyAmount: number;
  monthlyAmountMax: number;
  durationMonths: number;
  formula: string;
  sourceUrl: string;
  note: string;
}

export interface ChildSupportResult {
  monthly: number;
  capApplied: boolean;
  percentageApplied: number;
  formula: string;
  sourceUrl: string;
  note: string;
}

/**
 * Texas spousal maintenance eligibility and amount
 * Source: Texas Family Code §§ 8.051–8.059
 * https://statutes.capitol.texas.gov/docs/fa/pdf/fa.8.pdf
 *
 * Eligibility gates (§ 8.051):
 * - Marriage ≥ 10 years AND spouse lacks minimum reasonable needs, OR
 * - Family violence within 2 years of filing, OR
 * - Spouse or child has disability
 *
 * Amount limit (§ 8.055): lesser of $5,000/month or 20% of payor's avg gross monthly income
 *
 * Duration (§ 8.054):
 * - Family violence or marriage 10–<20 years: up to 5 years
 * - Marriage 20–<30 years: up to 7 years
 * - Marriage 30+ years: up to 10 years
 * - Disability/care of disabled child: indefinite while conditions persist
 */
export function calcTXSpousalMaintenance(inputs: TXInputs): SpousalMaintenanceResult {
  const {
    payorGrossMonthlyIncome,
    marriageYears,
    familyViolence,
    payeeDisabled,
    caresForDisabledChild,
  } = inputs;

  // Check eligibility
  let eligible = false;
  let eligibilityReason = "Does not meet Texas eligibility criteria for spousal maintenance.";

  if (familyViolence) {
    eligible = true;
    eligibilityReason = "Eligible: family violence within 2 years of filing (TX FC § 8.051(a)(1)).";
  } else if (payeeDisabled) {
    eligible = true;
    eligibilityReason = "Eligible: spouse has incapacitating physical or mental disability (TX FC § 8.051(a)(2)).";
  } else if (caresForDisabledChild) {
    eligible = true;
    eligibilityReason =
      "Eligible: spouse provides primary care for child with incapacitating disability (TX FC § 8.051(a)(3)).";
  } else if (marriageYears >= 10) {
    eligible = true;
    eligibilityReason = `Eligible: marriage ≥ 10 years (${marriageYears} years) and spouse cannot meet minimum reasonable needs (TX FC § 8.051(a)(4)).`;
  }

  if (!eligible) {
    return {
      eligible: false,
      eligibilityReason,
      monthlyAmount: 0,
      monthlyAmountMax: 0,
      durationMonths: 0,
      formula: "No spousal maintenance projected — eligibility criteria not met.",
      sourceUrl: "https://statutes.capitol.texas.gov/docs/fa/pdf/fa.8.pdf",
      note: "Consult a Texas family law attorney. Courts retain discretion to award or deny maintenance even when statutory criteria are met.",
    };
  }

  // Amount: lesser of $5,000/mo or 20% of payor gross monthly income (§ 8.055)
  const twentyPctOfGross = payorGrossMonthlyIncome * 0.2;
  const monthlyAmount = Math.round(Math.min(5000, twentyPctOfGross));
  const monthlyAmountMax = Math.min(5000, twentyPctOfGross);

  // Duration (§ 8.054)
  let durationMonths = 0;
  if (payeeDisabled || caresForDisabledChild) {
    durationMonths = -1; // indefinite
  } else if (familyViolence && marriageYears < 10) {
    durationMonths = 60; // up to 5 years
  } else if (marriageYears < 20) {
    durationMonths = 60;
  } else if (marriageYears < 30) {
    durationMonths = 84;
  } else {
    durationMonths = 120;
  }

  return {
    eligible: true,
    eligibilityReason,
    monthlyAmount,
    monthlyAmountMax: Math.round(monthlyAmountMax),
    durationMonths,
    formula:
      `Amount: lesser of $5,000/month or 20% of payor gross monthly income ($${payorGrossMonthlyIncome.toLocaleString()} × 20% = $${Math.round(twentyPctOfGross).toLocaleString()}). ` +
      `Capped at $${monthlyAmount.toLocaleString()}/month. ` +
      `Duration: ${durationMonths === -1 ? "indefinite (disability/disabled child)" : `up to ${durationMonths} months`}.`,
    sourceUrl: "https://statutes.capitol.texas.gov/docs/fa/pdf/fa.8.pdf",
    note: "Texas spousal maintenance is among the most restrictive in the US. Courts apply strict eligibility standards. Range reflects judicial discretion. Consult a Texas family law attorney.",
  };
}

/**
 * Texas child support — percentage of income model
 * Source: Texas Family Code § 154.125
 * https://statutes.capitol.texas.gov/GetStatute.aspx?Code=FA&Value=154.125
 *
 * Percentages apply to obligor's NET monthly resources (not gross):
 * 1 child = 20%, 2 = 25%, 3 = 30%, 4 = 35%, 5+ = 40%
 *
 * Income cap (updated Sept 1, 2025): $11,700/month net resources
 * Below $1,000/month net resources: reduced percentages apply
 */
export function calcTXChildSupport(inputs: TXInputs): ChildSupportResult {
  const { payorNetMonthlyResources, numberOfChildren } = inputs;

  if (numberOfChildren === 0) {
    return {
      monthly: 0,
      capApplied: false,
      percentageApplied: 0,
      formula: "No children indicated.",
      sourceUrl: "https://statutes.capitol.texas.gov/GetStatute.aspx?Code=FA&Value=154.125",
      note: "No child support applicable.",
    };
  }

  const percentages: Record<number, number> = {
    1: 0.2,
    2: 0.25,
    3: 0.3,
    4: 0.35,
  };
  const pct = numberOfChildren >= 5 ? 0.4 : percentages[numberOfChildren] ?? 0.4;

  // Cap at $11,700/month net resources (effective Sept 1, 2025)
  // Source: https://www.bryanfagan.com/2025/10/new-texas-child-support-guideline-cap-and-percentages-2025-update/
  const TX_CAP_2025 = 11700;
  const cappedResources = Math.min(payorNetMonthlyResources, TX_CAP_2025);
  const capApplied = payorNetMonthlyResources > TX_CAP_2025;

  const monthly = Math.round(cappedResources * pct);

  return {
    monthly,
    capApplied,
    percentageApplied: pct,
    formula:
      `${(pct * 100).toFixed(0)}% of obligor net monthly resources. ` +
      `Net resources: $${payorNetMonthlyResources.toLocaleString()}${capApplied ? ` (capped at $${TX_CAP_2025.toLocaleString()})` : ""}. ` +
      `$${cappedResources.toLocaleString()} × ${(pct * 100).toFixed(0)}% = $${monthly.toLocaleString()}/month.`,
    sourceUrl:
      "https://statutes.capitol.texas.gov/GetStatute.aspx?Code=FA&Value=154.125",
    note: capApplied
      ? `Income above cap ($${TX_CAP_2025.toLocaleString()}/mo). Court may add to base amount for higher incomes. Cap updated Sept 1, 2025.`
      : "Calculated at statutory guideline amount. Court may deviate for documented cause.",
  };
}

/**
 * Texas community property division
 * Texas is community property BUT the presumption is "just and right" division, not always 50/50.
 * Source: Texas Family Code § 7.001
 * https://statutes.capitol.texas.gov/GetStatute.aspx?Code=FA&Value=7.001
 */
export function calcTXPropertyDivision(maritalAssets: number, maritalDebts: number) {
  const netMarital = maritalAssets - maritalDebts;

  return {
    netMaritalEstate: netMarital,
    presumptiveSplit: netMarital / 2,
    formula:
      "Texas Family Code § 7.001: court divides community property in a 'just and right' manner, considering fault and circumstances. Presumed equal but not guaranteed.",
    sourceUrl: "https://statutes.capitol.texas.gov/GetStatute.aspx?Code=FA&Value=7.001",
    note: "Unlike California, Texas courts can deviate from 50/50 based on fault in the breakup, children's needs, and other factors. Consult a Texas family law attorney.",
  };
}
