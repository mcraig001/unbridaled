/**
 * New York State Formulas — SOURCED
 *
 * Equitable distribution state (not community property).
 *
 * Sources:
 * - Spousal maintenance: New York Domestic Relations Law § 236(B)
 *   Official calculator: https://ww2.nycourts.gov/divorce/MaintenanceChildSupportTools.shtml
 *   Calculator PDF: https://ww2.nycourts.gov/sites/default/files/document/files/2018-05/Calculator.pdf
 *   Income cap: $228,000 (as of 2024 adjustment)
 * - Child support: Child Support Standards Act (CSSA), NY DRL § 240(1-b)
 *   Official chart: https://childsupport.ny.gov/pdfs/CSSA.pdf
 *   Income cap: $183,000 combined (March 2024 – February 2026)
 *   Self-support reserve: $21,128 (effective March 1, 2025)
 *   Source: https://ww2.nycourts.gov/divorce/MaintenanceChildSupportTools.shtml
 * - Equitable distribution: NY DRL § 236(B)(5)
 *   https://www.nysenate.gov/legislation/laws/DOM/236
 *
 * lastReviewed: 2026-04-26
 * verifiedAgainst:
 *   - nycourts.gov official maintenance calculator
 *   - childsupport.ny.gov CSSA chart (LDSS-4515 Rev 03/26)
 *   - matlawyers.com 2025 adjustment article
 */

export const NY_STATE = {
  code: "NY",
  name: "New York",
  propertySystem: "equitable_distribution" as const,
  lastReviewed: "2026-04-26",
  sources: {
    maintenance: "https://ww2.nycourts.gov/divorce/MaintenanceChildSupportTools.shtml",
    childSupport: "https://childsupport.ny.gov/pdfs/CSSA.pdf",
    equitableDistribution: "https://www.nysenate.gov/legislation/laws/DOM/236",
    selfHelp: "https://ww2.nycourts.gov/divorce/divorce_basics.shtml",
  },
};

export interface NYInputs {
  higherEarnerGrossAnnualIncome: number;
  lowerEarnerGrossAnnualIncome: number;
  higherEarnerGrossMonthly: number;
  lowerEarnerGrossMonthly: number;
  numberOfChildren: number;
  marriageYears: number;
  maritalAssets: number;
  maritalDebts: number;
  hasHealthInsurance: boolean;
  childrenInCustodyOfLower: boolean;
}

export interface NYMaintenanceResult {
  monthlyAmount: number;
  monthlyLow: number;
  monthlyHigh: number;
  capApplied: boolean;
  formula: string;
  sourceUrl: string;
  note: string;
}

export interface NYChildSupportResult {
  monthly: number;
  combinedCapApplied: boolean;
  percentageApplied: number;
  formula: string;
  sourceUrl: string;
  note: string;
}

/**
 * New York maintenance (spousal support) calculation
 * Source: NY DRL § 236(B); official nycourts.gov calculator
 * https://ww2.nycourts.gov/divorce/MaintenanceChildSupportTools.shtml
 *
 * Formula (without child support, income up to cap):
 *   Step 1: 30% × higher income - 20% × lower income
 *   Step 2: 40% × combined income - lower income
 *   Result: lower of Step 1 and Step 2 (if positive)
 *
 * Income cap: $228,000 gross annual (as of most recent adjustment)
 * UNVERIFIED: exact 2026 cap — $228,000 is the most recently published figure
 */
export function calcNYMaintenance(inputs: NYInputs): NYMaintenanceResult {
  const { higherEarnerGrossAnnualIncome, lowerEarnerGrossAnnualIncome } = inputs;

  // Income cap for maintenance calculation
  // Source: nycourts.gov — $228,000 cap; verify current year cap at nycourts.gov
  // UNVERIFIED: 2026 cap — using $228,000 from most recent published data
  const NY_MAINTENANCE_CAP = 228000;

  const cappedHigher = Math.min(higherEarnerGrossAnnualIncome, NY_MAINTENANCE_CAP);
  const capApplied = higherEarnerGrossAnnualIncome > NY_MAINTENANCE_CAP;

  const step1Annual = 0.3 * cappedHigher - 0.2 * lowerEarnerGrossAnnualIncome;
  const combined = cappedHigher + lowerEarnerGrossAnnualIncome;
  const step2Annual = 0.4 * combined - lowerEarnerGrossAnnualIncome;

  const annualMaintenance = Math.max(0, Math.min(step1Annual, step2Annual));
  const monthly = Math.round(annualMaintenance / 12);

  // ±25% range for judicial discretion
  const monthlyLow = Math.round(monthly * 0.75);
  const monthlyHigh = Math.round(monthly * 1.25);

  return {
    monthlyAmount: monthly,
    monthlyLow,
    monthlyHigh,
    capApplied,
    formula:
      `Step 1: (30% × $${cappedHigher.toLocaleString()}) − (20% × $${lowerEarnerGrossAnnualIncome.toLocaleString()}) = $${Math.round(step1Annual).toLocaleString()}/yr. ` +
      `Step 2: (40% × $${combined.toLocaleString()}) − $${lowerEarnerGrossAnnualIncome.toLocaleString()} = $${Math.round(step2Annual).toLocaleString()}/yr. ` +
      `Result: lower of Step 1 and Step 2 = $${Math.round(annualMaintenance).toLocaleString()}/yr = $${monthly.toLocaleString()}/mo.` +
      (capApplied ? ` Income capped at $${NY_MAINTENANCE_CAP.toLocaleString()}/yr for formula.` : ""),
    sourceUrl: "https://ww2.nycourts.gov/divorce/MaintenanceChildSupportTools.shtml",
    note:
      "Formula applies to income up to $228,000 cap. For income above cap, court has discretion. " +
      "Duration varies by marriage length. Range (low/high) reflects typical judicial variance. " +
      "UNVERIFIED: confirm current income cap at nycourts.gov. Consult a New York family law attorney.",
  };
}

/**
 * New York child support — Child Support Standards Act (CSSA)
 * Source: NY DRL § 240(1-b); official CSSA chart LDSS-4515 (Rev. 03/26)
 * https://childsupport.ny.gov/pdfs/CSSA.pdf
 *
 * Income cap: $183,000 combined parental income (March 2024 – February 2026)
 * Percentages: 1 child=17%, 2=25%, 3=29%, 4=31%, 5+=35%
 * Self-support reserve: $21,128/yr (effective March 1, 2025)
 *
 * Allocation: each parent pays their pro-rata share of combined child support obligation.
 * Obligor (non-custodial) typically pays their pro-rata share.
 */
export function calcNYChildSupport(inputs: NYInputs): NYChildSupportResult {
  const {
    higherEarnerGrossAnnualIncome,
    lowerEarnerGrossAnnualIncome,
    numberOfChildren,
    childrenInCustodyOfLower,
  } = inputs;

  if (numberOfChildren === 0) {
    return {
      monthly: 0,
      combinedCapApplied: false,
      percentageApplied: 0,
      formula: "No children indicated.",
      sourceUrl: "https://childsupport.ny.gov/pdfs/CSSA.pdf",
      note: "No child support applicable.",
    };
  }

  const percentages: Record<number, number> = {
    1: 0.17,
    2: 0.25,
    3: 0.29,
    4: 0.31,
  };
  const pct = numberOfChildren >= 5 ? 0.35 : percentages[numberOfChildren] ?? 0.35;

  // Income cap: $183,000 combined (March 2024–February 2026)
  // Source: childsupport.ny.gov CSSA chart LDSS-4515 Rev. 03/26
  const NY_CSSA_CAP_2025 = 183000;
  const combined = higherEarnerGrossAnnualIncome + lowerEarnerGrossAnnualIncome;
  const cappedCombined = Math.min(combined, NY_CSSA_CAP_2025);
  const capApplied = combined > NY_CSSA_CAP_2025;

  // Total child support obligation on capped combined income
  const totalAnnualObligation = cappedCombined * pct;

  // Obligor = higher earner if children are with lower earner (most common scenario)
  // Pro-rata share = obligor income / combined income
  const obligorIncome = childrenInCustodyOfLower
    ? higherEarnerGrossAnnualIncome
    : lowerEarnerGrossAnnualIncome;
  const proRataShare = Math.min(obligorIncome, cappedCombined) / cappedCombined;
  const obligorAnnualObligation = totalAnnualObligation * proRataShare;
  const monthly = Math.round(obligorAnnualObligation / 12);

  return {
    monthly,
    combinedCapApplied: capApplied,
    percentageApplied: pct,
    formula:
      `Combined income: $${combined.toLocaleString()}${capApplied ? ` (capped at $${NY_CSSA_CAP_2025.toLocaleString()})` : ""}. ` +
      `CSSA percentage for ${numberOfChildren} child(ren): ${(pct * 100).toFixed(0)}%. ` +
      `Total obligation: $${Math.round(totalAnnualObligation).toLocaleString()}/yr. ` +
      `Obligor pro-rata share: ${(proRataShare * 100).toFixed(0)}% = $${Math.round(obligorAnnualObligation).toLocaleString()}/yr = $${monthly.toLocaleString()}/mo.`,
    sourceUrl: "https://childsupport.ny.gov/pdfs/CSSA.pdf",
    note:
      "Income cap $183,000 combined (March 2024–February 2026 per LDSS-4515 Rev. 03/26). " +
      "Self-support reserve $21,128/yr (effective March 1, 2025). " +
      "For income above cap, court has discretion. Consult a New York family law attorney.",
  };
}

/**
 * New York equitable distribution
 * NY DRL § 236(B)(5): court divides marital property "equitably" considering 14 factors.
 * NOT necessarily 50/50. Factors include marriage length, contributions, economic circumstances.
 * Source: https://www.nysenate.gov/legislation/laws/DOM/236
 */
export function calcNYEquitableDistribution(
  maritalAssets: number,
  maritalDebts: number,
  marriageYears: number
) {
  const netMarital = maritalAssets - maritalDebts;

  // Longer marriages trend closer to 50/50; shorter marriages have more variance
  // This is a very rough heuristic — actual outcome is entirely judicial
  const lowPct = marriageYears >= 20 ? 0.45 : 0.35;
  const highPct = marriageYears >= 20 ? 0.55 : 0.5;
  const midPct = (lowPct + highPct) / 2;

  return {
    netMaritalEstate: netMarital,
    estimatedLowShare: Math.round(netMarital * lowPct),
    estimatedMidShare: Math.round(netMarital * midPct),
    estimatedHighShare: Math.round(netMarital * highPct),
    formula:
      `Equitable distribution (NY DRL § 236(B)(5)). Range ${(lowPct * 100).toFixed(0)}%–${(highPct * 100).toFixed(0)}% of net marital estate based on ${marriageYears}-year marriage heuristic.`,
    sourceUrl: "https://www.nysenate.gov/legislation/laws/DOM/236",
    note:
      "New York is equitable distribution, NOT community property. Division is NOT automatically 50/50. " +
      "14 statutory factors apply including length of marriage, contributions, and economic circumstances. " +
      "This estimate is illustrative only. Consult a New York family law attorney.",
  };
}
