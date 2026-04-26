/**
 * Washington State Formulas — SOURCED
 *
 * Sources:
 * - Spousal maintenance: RCW 26.09.090 (court discretion — no fixed formula)
 *   https://app.leg.wa.gov/RCW/default.aspx?cite=26.09.090
 * - Child support: RCW 26.19 (economic table) + DSHS Schedule
 *   https://app.leg.wa.gov/RCW/default.aspx?cite=26.19
 *   https://www.dshs.wa.gov/esa/childsupport/child-support-schedule
 * - Property division: RCW 26.09.080 (just and equitable)
 *   https://app.leg.wa.gov/RCW/default.aspx?cite=26.09.080
 *
 * IMPORTANT: Washington spousal maintenance has NO statutory formula.
 * RCW 26.09.090 lists factors courts consider. The estimate below is
 * a guideline range only — mark as ESTIMATE throughout.
 *
 * lastReviewed: 2026-04-26
 */

export const WA_STATE = {
  code: "WA",
  name: "Washington",
  propertySystem: "community_property" as const,
  lastReviewed: "2026-04-26",
  sources: {
    spousalMaintenance: "https://app.leg.wa.gov/RCW/default.aspx?cite=26.09.090",
    childSupport: "https://www.dshs.wa.gov/esa/childsupport/child-support-schedule",
    propertyDivision: "https://app.leg.wa.gov/RCW/default.aspx?cite=26.09.080",
  },
};

export interface WAInputs {
  higherNetMonthlyIncome: number;
  lowerNetMonthlyIncome: number;
  combinedNetMonthlyIncome: number;
  numberOfChildren: number;
  marriageYears: number;
  maritalAssets: number;
  maritalDebts: number;
}

export interface WASpousalMaintenanceResult {
  mid: number;
  low: number;
  high: number;
  formula: string;
  sourceUrl: string;
  note: string;
  isEstimate: true;
}

/**
 * WA spousal maintenance — ESTIMATE ONLY
 * RCW 26.09.090 specifies factors; courts have broad discretion with no formula.
 * Guideline range: 15-25% of income difference for marriages >= 5 years.
 * Duration: typically 1 year per 3 years of marriage (judicial practice, not statute).
 */
export function calcWASpousalMaintenance(inputs: WAInputs): WASpousalMaintenanceResult {
  const { higherNetMonthlyIncome, lowerNetMonthlyIncome, marriageYears } = inputs;
  const diff = Math.max(0, higherNetMonthlyIncome - lowerNetMonthlyIncome);

  // Short marriage (< 5 years): courts rarely award maintenance
  if (marriageYears < 5) {
    return {
      mid: 0,
      low: 0,
      high: 0,
      formula: "Marriage under 5 years — WA courts rarely award maintenance (RCW 26.09.090).",
      sourceUrl: "https://app.leg.wa.gov/RCW/default.aspx?cite=26.09.090",
      note: "ESTIMATE — courts have full discretion. This is a common outcome, not a rule.",
      isEstimate: true,
    };
  }

  const mid = Math.round(diff * 0.20);
  const low = Math.round(diff * 0.15);
  const high = Math.round(diff * 0.25);

  const durationEstimate =
    marriageYears >= 25
      ? "indefinite (long marriage)"
      : `~${Math.round(marriageYears / 3)} years`;

  return {
    mid,
    low,
    high,
    formula:
      `ESTIMATE: 15–25% of income difference ($${diff.toLocaleString()}/mo). ` +
      `Mid estimate: $${mid.toLocaleString()}/mo. ` +
      `Duration estimate: ${durationEstimate} (informal judicial practice).`,
    sourceUrl: "https://app.leg.wa.gov/RCW/default.aspx?cite=26.09.090",
    note:
      `ESTIMATE — RCW 26.09.090 gives no formula. WA courts consider: financial resources of each party, ` +
      `ability to meet needs independently, length of marriage (${marriageYears} years), ` +
      `standard of living during marriage, time needed for education/employment. ` +
      `Consult a WA family law attorney for realistic range.`,
    isEstimate: true,
  };
}

export interface WAChildSupportResult {
  monthly: number;
  percentageApplied: number;
  combinedNetMonthly: number;
  formula: string;
  sourceUrl: string;
  note: string;
  isEstimate: true;
}

// WA economic table approximation — actual schedule from DSHS.
// The table gives "basic support obligation" based on combined net income.
// Approximate percentage of combined net income by number of children:
//   1 child: ~21%, 2: ~30%, 3: ~36%, 4: ~41%, 5+: ~45%
// Source: DSHS child support schedule, verified to WA avg across income bands.
const WA_CS_PERCENTAGES: Record<number, number> = {
  1: 0.21,
  2: 0.30,
  3: 0.36,
  4: 0.41,
};

/**
 * WA child support — ESTIMATE based on DSHS economic table approximation.
 * Actual support uses a lookup table based on combined net income.
 * This returns a percentage-based approximation for illustrative purposes.
 */
export function calcWAChildSupport(inputs: WAInputs): WAChildSupportResult {
  const { combinedNetMonthlyIncome, higherNetMonthlyIncome, numberOfChildren } = inputs;

  if (numberOfChildren === 0) {
    return {
      monthly: 0,
      percentageApplied: 0,
      combinedNetMonthly: combinedNetMonthlyIncome,
      formula: "No children.",
      sourceUrl: "https://www.dshs.wa.gov/esa/childsupport/child-support-schedule",
      note: "No child support applicable.",
      isEstimate: true,
    };
  }

  const pct = numberOfChildren >= 5 ? 0.45 : WA_CS_PERCENTAGES[numberOfChildren] ?? 0.45;
  const totalObligation = combinedNetMonthlyIncome * pct;

  // Higher earner's pro-rata share = their income / combined income
  const proRataShare =
    combinedNetMonthlyIncome > 0 ? higherNetMonthlyIncome / combinedNetMonthlyIncome : 0;
  const monthly = Math.round(totalObligation * proRataShare);

  return {
    monthly,
    percentageApplied: pct,
    combinedNetMonthly: combinedNetMonthlyIncome,
    formula:
      `ESTIMATE: ${(pct * 100).toFixed(0)}% of combined net income ($${combinedNetMonthlyIncome.toLocaleString()}/mo). ` +
      `Total obligation: $${Math.round(totalObligation).toLocaleString()}/mo. ` +
      `Higher earner pro-rata share (${(proRataShare * 100).toFixed(0)}%): $${monthly.toLocaleString()}/mo.`,
    sourceUrl: "https://www.dshs.wa.gov/esa/childsupport/child-support-schedule",
    note:
      "ESTIMATE — actual WA child support uses an economic table lookup. " +
      "For an exact figure, use the DSHS Child Support Schedule calculator at dshs.wa.gov.",
    isEstimate: true,
  };
}

export interface WAPropertyDivisionResult {
  netMaritalEstate: number;
  estimatedLowShare: number;
  estimatedHighShare: number;
  estimatedMidShare: number;
  formula: string;
  sourceUrl: string;
  note: string;
}

/**
 * WA property division — "just and equitable" under RCW 26.09.080.
 * Washington is a community property state but the divorce statute grants
 * equitable (not equal) discretion. In practice, courts start at 50/50
 * and adjust for marriage length, economic circumstances, and misconduct.
 */
export function calcWAPropertyDivision(
  maritalAssets: number,
  maritalDebts: number,
  marriageYears: number
): WAPropertyDivisionResult {
  const net = maritalAssets - maritalDebts;

  // Range based on marriage length — courts start at 50/50
  const lowPct = marriageYears >= 10 ? 0.45 : 0.40;
  const highPct = marriageYears >= 10 ? 0.55 : 0.60;
  const midPct = (lowPct + highPct) / 2;

  return {
    netMaritalEstate: net,
    estimatedLowShare: Math.round(net * lowPct),
    estimatedHighShare: Math.round(net * highPct),
    estimatedMidShare: Math.round(net * midPct),
    formula:
      `Just and equitable division (RCW 26.09.080). ` +
      `Net marital estate: $${net.toLocaleString()}. ` +
      `Estimated range: ${(lowPct * 100).toFixed(0)}%–${(highPct * 100).toFixed(0)}% of net estate.`,
    sourceUrl: "https://app.leg.wa.gov/RCW/default.aspx?cite=26.09.080",
    note:
      "WA courts start near 50/50 and adjust for economic circumstances, marriage length, " +
      "and other factors. Not a community property equal-split guarantee.",
  };
}
