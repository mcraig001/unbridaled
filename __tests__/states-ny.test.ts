/**
 * New York formula tests
 *
 * Sources:
 * - nycourts.gov official maintenance calculator:
 *   https://ww2.nycourts.gov/divorce/MaintenanceChildSupportTools.shtml
 * - CSSA chart LDSS-4515 Rev. 03/26:
 *   https://childsupport.ny.gov/pdfs/CSSA.pdf
 * - 2025 adjustments: https://matlawyers.com/what-the-2025-new-york-child-support-adjustments-mean/
 */

import {
  calcNYMaintenance,
  calcNYChildSupport,
  calcNYEquitableDistribution,
} from "../lib/states/ny";

const BASE_NY = {
  higherEarnerGrossAnnualIncome: 120000,
  lowerEarnerGrossAnnualIncome: 40000,
  higherEarnerGrossMonthly: 10000,
  lowerEarnerGrossMonthly: 3333,
  numberOfChildren: 0,
  marriageYears: 8,
  maritalAssets: 200000,
  maritalDebts: 30000,
  hasHealthInsurance: true,
  childrenInCustodyOfLower: true,
};

describe("New York Maintenance", () => {
  test("NY-M-1: Formula Step 1 and Step 2 — lower result used", () => {
    // Higher: $120K, Lower: $40K
    // Step 1: 30% × 120K - 20% × 40K = 36K - 8K = $28K/yr = $2,333/mo
    // Step 2: 40% × 160K - 40K = 64K - 40K = $24K/yr = $2,000/mo
    // Use lower: $24K/yr = $2,000/mo
    const result = calcNYMaintenance({ ...BASE_NY });
    expect(result.monthlyAmount).toBe(2000);
  });

  test("NY-M-2: Step 1 is binding when lower than Step 2", () => {
    // Higher: $100K, Lower: $70K
    // Step 1: 30% × 100K - 20% × 70K = 30K - 14K = $16K/yr = $1,333/mo
    // Step 2: 40% × 170K - 70K = 68K - 70K = -$2K/yr → 0
    // Result: 0 (no maintenance when lower earner has high income relative to combined)
    const result = calcNYMaintenance({
      ...BASE_NY,
      higherEarnerGrossAnnualIncome: 100000,
      lowerEarnerGrossAnnualIncome: 70000,
      higherEarnerGrossMonthly: 8333,
      lowerEarnerGrossMonthly: 5833,
    });
    // Step 2 is negative so result clamps to 0
    expect(result.monthlyAmount).toBe(0);
  });

  test("NY-M-3: Income cap applied when higher earner above $228K", () => {
    const result = calcNYMaintenance({
      ...BASE_NY,
      higherEarnerGrossAnnualIncome: 300000,
      higherEarnerGrossMonthly: 25000,
    });
    expect(result.capApplied).toBe(true);
  });

  test("NY-M-4: No cap when under $228K", () => {
    const result = calcNYMaintenance({ ...BASE_NY });
    expect(result.capApplied).toBe(false);
  });

  test("NY-M-5: Range (low/high) brackets mid", () => {
    const result = calcNYMaintenance({ ...BASE_NY });
    expect(result.monthlyLow).toBeLessThanOrEqual(result.monthlyAmount);
    expect(result.monthlyHigh).toBeGreaterThanOrEqual(result.monthlyAmount);
  });

  test("NY-M-6: Source URL present", () => {
    const result = calcNYMaintenance({ ...BASE_NY });
    expect(result.sourceUrl).toContain("nycourts.gov");
  });

  test("NY-M-7: Zero incomes = zero maintenance", () => {
    const result = calcNYMaintenance({
      ...BASE_NY,
      higherEarnerGrossAnnualIncome: 0,
      lowerEarnerGrossAnnualIncome: 0,
      higherEarnerGrossMonthly: 0,
      lowerEarnerGrossMonthly: 0,
    });
    expect(result.monthlyAmount).toBe(0);
  });
});

describe("New York Child Support (CSSA)", () => {
  test("NY-CS-1: No children = zero", () => {
    const result = calcNYChildSupport({ ...BASE_NY, numberOfChildren: 0 });
    expect(result.monthly).toBe(0);
  });

  test("NY-CS-2: 1 child = 17% of combined (pro-rata share)", () => {
    // Combined: $160K. Cap: $183K → not capped. 17% of $160K = $27,200/yr
    // Obligor (higher earner, children with lower): pro-rata $120K/$160K = 75%
    // $27,200 × 75% = $20,400/yr = $1,700/mo
    const result = calcNYChildSupport({ ...BASE_NY, numberOfChildren: 1 });
    expect(result.monthly).toBe(1700);
    expect(result.percentageApplied).toBe(0.17);
  });

  test("NY-CS-3: 2 children = 25%", () => {
    // 25% × $160K = $40K/yr × 75% = $30K/yr = $2,500/mo
    const result = calcNYChildSupport({ ...BASE_NY, numberOfChildren: 2 });
    expect(result.monthly).toBe(2500);
  });

  test("NY-CS-4: 3 children = 29%", () => {
    const result = calcNYChildSupport({ ...BASE_NY, numberOfChildren: 3 });
    expect(result.percentageApplied).toBe(0.29);
  });

  test("NY-CS-5: Combined income above cap ($183K) — cap applied", () => {
    const result = calcNYChildSupport({
      ...BASE_NY,
      higherEarnerGrossAnnualIncome: 150000,
      lowerEarnerGrossAnnualIncome: 60000,
      higherEarnerGrossMonthly: 12500,
      lowerEarnerGrossMonthly: 5000,
      numberOfChildren: 1,
    });
    // Combined $210K > $183K cap
    expect(result.combinedCapApplied).toBe(true);
  });

  test("NY-CS-6: Combined income under cap — not capped", () => {
    const result = calcNYChildSupport({ ...BASE_NY, numberOfChildren: 1 });
    expect(result.combinedCapApplied).toBe(false);
  });

  test("NY-CS-7: Source URL is CSSA chart", () => {
    const result = calcNYChildSupport({ ...BASE_NY, numberOfChildren: 1 });
    expect(result.sourceUrl).toContain("childsupport.ny.gov");
  });
});

describe("New York Equitable Distribution", () => {
  test("NY-ED-1: Long marriage — range near 50/50", () => {
    const result = calcNYEquitableDistribution(400000, 50000, 25);
    // Long marriage (25 yrs): 45%-55% range
    expect(result.estimatedLowShare).toBe(Math.round(350000 * 0.45));
    expect(result.estimatedHighShare).toBe(Math.round(350000 * 0.55));
    expect(result.estimatedMidShare).toBe(
      Math.round(350000 * ((0.45 + 0.55) / 2))
    );
  });

  test("NY-ED-2: Short marriage — wider range, lower floor", () => {
    const result = calcNYEquitableDistribution(400000, 50000, 5);
    // Short marriage (5 yrs): 35%-50% range
    expect(result.estimatedLowShare).toBe(Math.round(350000 * 0.35));
    expect(result.estimatedHighShare).toBe(Math.round(350000 * 0.5));
  });

  test("NY-ED-3: Source URL present", () => {
    const result = calcNYEquitableDistribution(200000, 0, 10);
    expect(result.sourceUrl).toContain("nysenate.gov");
  });

  test("NY-ED-4: Net estate = assets minus debts", () => {
    const result = calcNYEquitableDistribution(500000, 100000, 10);
    expect(result.netMaritalEstate).toBe(400000);
  });
});
