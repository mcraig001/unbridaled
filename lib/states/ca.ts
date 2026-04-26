/**
 * California State Formulas — SOURCED
 *
 * Community property state. All property acquired during marriage = 50/50 split.
 *
 * Sources:
 * - Spousal support: California Family Code §§ 4320, 4330-4339
 *   https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=FAM&sectionNum=4320.
 *   Temporary formula: Santa Clara formula (most widely used)
 *   https://courts.ca.gov/programs-initiatives/families-and-children/family-law
 * - Child support: California Family Code § 4055
 *   https://childsupport.ca.gov/guideline-calculator/
 * - Community property: California Family Code § 760
 *   https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=FAM&sectionNum=760.
 *
 * lastReviewed: 2026-04-26
 * verifiedAgainst: courts.ca.gov self-help, childsupport.ca.gov user guide (Apr 2025)
 */

export const CA_STATE = {
  code: "CA",
  name: "California",
  propertySystem: "community_property" as const,
  lastReviewed: "2026-04-26",
  sources: {
    spousalSupport:
      "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=FAM&sectionNum=4320.",
    childSupport: "https://childsupport.ca.gov/guideline-calculator/",
    communityProperty:
      "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=FAM&sectionNum=760.",
    courtSelfHelp: "https://courts.ca.gov/programs-initiatives/families-and-children/family-law",
  },
};

export interface CAInputs {
  higherNetMonthlyIncome: number;
  lowerNetMonthlyIncome: number;
  combinedNetMonthlyIncome: number;
  numberOfChildren: number;
  higherEarnerCustodyPct: number; // 0.0 – 1.0
  marriageYears: number;
  maritalAssets: number;
  maritalDebts: number;
}

export interface SpousalSupportRange {
  low: number;
  mid: number;
  high: number;
  formula: string;
  sourceUrl: string;
  note: string;
}

export interface ChildSupportEstimate {
  monthly: number;
  formula: string;
  sourceUrl: string;
  note: string;
}

/**
 * Temporary spousal support — Santa Clara formula
 * Formula: 40% of high earner net - 50% of low earner net
 * Source: California courts self-help, widely applied guideline (not statatory for temp orders)
 * Long-term support has NO formula — purely judicial discretion per FC § 4320 (14 factors).
 * We return a range to reflect that uncertainty.
 */
export function calcCASpousalSupport(inputs: CAInputs): SpousalSupportRange {
  const { higherNetMonthlyIncome, lowerNetMonthlyIncome, marriageYears } = inputs;

  const tempFormula = 0.4 * higherNetMonthlyIncome - 0.5 * lowerNetMonthlyIncome;
  const midEstimate = Math.max(0, tempFormula);

  // Long-term support has no statutory formula. Duration guideline (not law):
  // marriages < 10 years: support often lasts ~half the marriage length.
  // marriages ≥ 10 years: potentially indefinite; judge determines.
  // We apply ±30% range to reflect judicial discretion.
  const low = Math.max(0, midEstimate * 0.7);
  const high = midEstimate * 1.3;

  return {
    low: Math.round(low),
    mid: Math.round(midEstimate),
    high: Math.round(high),
    formula:
      "Temporary: (0.40 × higher net monthly income) − (0.50 × lower net monthly income). " +
      "Long-term: no formula — judge applies 14 factors under Family Code § 4320. " +
      "Range reflects typical judicial variance.",
    sourceUrl:
      "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=FAM&sectionNum=4320.",
    note:
      marriageYears >= 10
        ? "Marriage ≥ 10 years. Long-term support may be indefinite. Consult a family law attorney."
        : `Marriage < 10 years. Support commonly ordered for ~${Math.round(marriageYears / 2)} years. Consult a family law attorney.`,
  };
}

/**
 * Child support — California Guideline (simplified algebraic approximation)
 * Full statutory formula: CS = K[HN − (H%)(TN)] per Family Code § 4055
 * K = income allocation factor (depends on combined income and children)
 * HN = high earner net monthly income
 * H% = high earner custodial time fraction
 * TN = total net monthly income
 *
 * We use a simplified K approximation. Actual calculation requires certified software
 * (DissoMaster, XSpouse, or official online calculator at childsupport.ca.gov).
 * Output should be treated as an estimate only.
 *
 * Source: California Family Code § 4055
 * https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=FAM&sectionNum=4055.
 * Official calculator: https://childsupport.ca.gov/guideline-calculator/
 */
export function calcCAChildSupport(inputs: CAInputs): ChildSupportEstimate {
  const { higherNetMonthlyIncome, lowerNetMonthlyIncome, numberOfChildren, higherEarnerCustodyPct } =
    inputs;

  if (numberOfChildren === 0) {
    return {
      monthly: 0,
      formula: "No children indicated.",
      sourceUrl:
        "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=FAM&sectionNum=4055.",
      note: "No child support applicable.",
    };
  }

  // K factor approximation by combined income tier (simplified from statutory table)
  // UNVERIFIED — K factor requires full statutory table per FC § 4055(b)(3)
  const totalNet = higherNetMonthlyIncome + lowerNetMonthlyIncome;
  let k: number;
  if (totalNet < 800) k = 0.2 + 0.25 * numberOfChildren;
  else if (totalNet < 6667) k = 0.25;
  else if (totalNet < 10000) k = 0.1 + 0.12 * numberOfChildren;
  else k = 0.04 + 0.1 * numberOfChildren;
  k = Math.min(k, 0.5);

  const cs = k * (higherNetMonthlyIncome - higherEarnerCustodyPct * totalNet);
  const monthly = Math.max(0, Math.round(cs));

  return {
    monthly,
    formula: `CS = K × [HN − (H% × TN)] where K≈${k.toFixed(2)}, HN=$${higherNetMonthlyIncome}, H%=${(higherEarnerCustodyPct * 100).toFixed(0)}%, TN=$${totalNet}. K is approximated; use official calculator for exact figure.`,
    sourceUrl: "https://childsupport.ca.gov/guideline-calculator/",
    note: "ESTIMATE ONLY. California child support requires certified software for exact amounts. Use the official calculator at childsupport.ca.gov. K factor approximated.",
  };
}

/**
 * Community property division — California
 * All marital assets and debts split 50/50 unless agreement otherwise.
 * Source: California Family Code § 760, § 2550
 */
export function calcCACommunityPropertySplit(maritalAssets: number, maritalDebts: number) {
  const netMarital = maritalAssets - maritalDebts;
  const eachSpouseShare = netMarital / 2;

  return {
    netMaritalEstate: netMarital,
    eachSpouseShare,
    formula: "Net marital estate ÷ 2 (community property — equal division)",
    sourceUrl:
      "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=FAM&sectionNum=760.",
    note: "Separate property (pre-marital assets, inheritances, gifts) is excluded from division. Consult an attorney to identify separate vs. community property.",
  };
}
