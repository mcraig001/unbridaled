/**
 * Washington State formula tests
 *
 * Sources:
 * - RCW 26.09.090: https://app.leg.wa.gov/RCW/default.aspx?cite=26.09.090
 * - RCW 26.19 (child support economic table): https://app.leg.wa.gov/RCW/default.aspx?cite=26.19
 * - DSHS Child Support Schedule: https://www.dshs.wa.gov/esa/childsupport/child-support-schedule
 * - RCW 26.09.080 (property division): https://app.leg.wa.gov/RCW/default.aspx?cite=26.09.080
 *
 * NOTE: WA spousal maintenance and child support are ESTIMATE-based.
 * Tests verify the estimation logic and disclosure language, not statutory exactness.
 */

import {
  calcWASpousalMaintenance,
  calcWAChildSupport,
  calcWAPropertyDivision,
} from "../lib/states/wa";
import { runScenarios } from "../lib/scenario-engine";

const BASE_WA = {
  higherNetMonthlyIncome: 7000,
  lowerNetMonthlyIncome: 2500,
  combinedNetMonthlyIncome: 9500,
  numberOfChildren: 1,
  marriageYears: 10,
  maritalAssets: 200000,
  maritalDebts: 30000,
};

describe("Washington Spousal Maintenance", () => {
  test("WA-SM-1: Long marriage → positive estimate", () => {
    const result = calcWASpousalMaintenance({ ...BASE_WA, marriageYears: 10 });
    expect(result.mid).toBeGreaterThan(0);
    expect(result.isEstimate).toBe(true);
  });

  test("WA-SM-2: Short marriage (< 5 years) → zero", () => {
    const result = calcWASpousalMaintenance({ ...BASE_WA, marriageYears: 3 });
    expect(result.mid).toBe(0);
    expect(result.low).toBe(0);
    expect(result.high).toBe(0);
  });

  test("WA-SM-3: Mid = 20% of income difference", () => {
    // Higher $7000, lower $2500 → diff $4500 → 20% = $900
    const result = calcWASpousalMaintenance({ ...BASE_WA });
    expect(result.mid).toBe(900);
  });

  test("WA-SM-4: Low < Mid < High", () => {
    const result = calcWASpousalMaintenance({ ...BASE_WA });
    expect(result.low).toBeLessThan(result.mid);
    expect(result.high).toBeGreaterThan(result.mid);
  });

  test("WA-SM-5: Source URL is RCW 26.09.090", () => {
    const result = calcWASpousalMaintenance({ ...BASE_WA });
    expect(result.sourceUrl).toContain("app.leg.wa.gov");
    expect(result.sourceUrl).toContain("26.09.090");
  });

  test("WA-SM-6: Note discloses ESTIMATE", () => {
    const result = calcWASpousalMaintenance({ ...BASE_WA });
    expect(result.note).toContain("ESTIMATE");
  });

  test("WA-SM-7: Equal incomes → zero maintenance", () => {
    const result = calcWASpousalMaintenance({
      ...BASE_WA,
      higherNetMonthlyIncome: 5000,
      lowerNetMonthlyIncome: 5000,
      combinedNetMonthlyIncome: 10000,
    });
    expect(result.mid).toBe(0);
  });
});

describe("Washington Child Support", () => {
  test("WA-CS-1: No children = zero", () => {
    const result = calcWAChildSupport({ ...BASE_WA, numberOfChildren: 0 });
    expect(result.monthly).toBe(0);
  });

  test("WA-CS-2: 1 child — higher earner pays ~21% combined net pro-rated", () => {
    // Combined $9500 → 21% = $1995 → higher earner share $7000/$9500 = 73.7% → ~$1470
    const result = calcWAChildSupport({ ...BASE_WA, numberOfChildren: 1 });
    expect(result.monthly).toBeGreaterThan(0);
    expect(result.percentageApplied).toBe(0.21);
  });

  test("WA-CS-3: 2 children → 30% applied", () => {
    const result = calcWAChildSupport({ ...BASE_WA, numberOfChildren: 2 });
    expect(result.percentageApplied).toBe(0.30);
  });

  test("WA-CS-4: 5+ children → 45%", () => {
    const result = calcWAChildSupport({ ...BASE_WA, numberOfChildren: 5 });
    expect(result.percentageApplied).toBe(0.45);
  });

  test("WA-CS-5: Source URL is DSHS schedule", () => {
    const result = calcWAChildSupport({ ...BASE_WA, numberOfChildren: 1 });
    expect(result.sourceUrl).toContain("dshs.wa.gov");
  });

  test("WA-CS-6: Zero combined income → zero child support (no NaN)", () => {
    const result = calcWAChildSupport({
      ...BASE_WA,
      higherNetMonthlyIncome: 0,
      lowerNetMonthlyIncome: 0,
      combinedNetMonthlyIncome: 0,
      numberOfChildren: 1,
    });
    expect(result.monthly).toBe(0);
    expect(isNaN(result.monthly)).toBe(false);
  });
});

describe("Washington Property Division", () => {
  test("WA-PD-1: Net estate calculated correctly", () => {
    const result = calcWAPropertyDivision(200000, 30000, 10);
    expect(result.netMaritalEstate).toBe(170000);
  });

  test("WA-PD-2: Long marriage (≥10yr) — range 45%-55%", () => {
    const result = calcWAPropertyDivision(200000, 0, 15);
    expect(result.estimatedLowShare).toBe(Math.round(200000 * 0.45));
    expect(result.estimatedHighShare).toBe(Math.round(200000 * 0.55));
  });

  test("WA-PD-3: Short marriage (<10yr) — wider range 40%-60%", () => {
    const result = calcWAPropertyDivision(200000, 0, 5);
    expect(result.estimatedLowShare).toBe(Math.round(200000 * 0.40));
    expect(result.estimatedHighShare).toBe(Math.round(200000 * 0.60));
  });

  test("WA-PD-4: Source URL is RCW 26.09.080", () => {
    const result = calcWAPropertyDivision(100000, 0, 10);
    expect(result.sourceUrl).toContain("26.09.080");
  });
});

describe("Scenario Engine — Washington", () => {
  const WA_HOUSEHOLD = {
    yourGrossMonthlyIncome: 3000,
    partnerGrossMonthlyIncome: 8500,
    yourNetMonthlyIncome: 2500,
    partnerNetMonthlyIncome: 7000,
    rent: 2200,
    utilities: 180,
    groceries: 550,
    transportation: 350,
    childcare: 1000,
    healthcare: 250,
    otherExpenses: 150,
    maritalAssets: 200000,
    maritalDebts: 30000,
    yourSeparateAssets: 3000,
    currentSavings: 8000,
    numberOfChildren: 1,
    childrenAges: [3],
    state: "WA" as const,
    marriageYears: 10,
    familyViolence: false,
    youAreHigherEarner: false,
    estimatedCustodySplit: "primary" as const,
    estimatedRentForNewPlace: 2000,
  };

  test("WA-SE-1: WA state runs without error", () => {
    expect(() => runScenarios(WA_HOUSEHOLD)).not.toThrow();
  });

  test("WA-SE-2: Returns three scenarios", () => {
    const result = runScenarios(WA_HOUSEHOLD);
    expect(result.scenarios.stay).toBeDefined();
    expect(result.scenarios.leaveWithDivision).toBeDefined();
    expect(result.scenarios.leaveWithoutDivision).toBeDefined();
  });

  test("WA-SE-3: Lower earner receives spousal support", () => {
    const result = runScenarios(WA_HOUSEHOLD);
    expect(result.scenarios.leaveWithDivision.spousalSupportReceived).not.toBeNull();
    expect(result.scenarios.leaveWithDivision.spousalSupportReceived!.amount).toBeGreaterThan(0);
  });

  test("WA-SE-4: State is recorded as WA", () => {
    const result = runScenarios(WA_HOUSEHOLD);
    expect(result.state).toBe("WA");
  });
});
