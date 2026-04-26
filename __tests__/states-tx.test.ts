/**
 * Texas formula tests
 *
 * Sources:
 * - texaslawhelp.org: https://texaslawhelp.org/article/spousal-maintenance-alimony
 * - TX Family Code § 8.055, § 154.125
 *   https://statutes.capitol.texas.gov/docs/fa/pdf/fa.8.pdf
 *   https://statutes.capitol.texas.gov/GetStatute.aspx?Code=FA&Value=154.125
 * - Cap update Sept 2025: https://www.bryanfagan.com/2025/10/new-texas-child-support-guideline-cap-and-percentages-2025-update/
 */

import {
  calcTXSpousalMaintenance,
  calcTXChildSupport,
  calcTXPropertyDivision,
} from "../lib/states/tx";

const BASE_TX = {
  payorGrossMonthlyIncome: 8000,
  payeeGrossMonthlyIncome: 3000,
  payorNetMonthlyResources: 6500,
  numberOfChildren: 0,
  marriageYears: 12,
  familyViolence: false,
  payeeDisabled: false,
  caresForDisabledChild: false,
  maritalAssets: 200000,
  maritalDebts: 30000,
};

describe("Texas Spousal Maintenance", () => {
  test("TX-SM-1: Eligible — marriage ≥ 10 years", () => {
    const result = calcTXSpousalMaintenance({ ...BASE_TX, marriageYears: 12 });
    expect(result.eligible).toBe(true);
    expect(result.eligibilityReason).toContain("10 years");
  });

  test("TX-SM-2: Ineligible — marriage < 10 years, no other grounds", () => {
    const result = calcTXSpousalMaintenance({
      ...BASE_TX,
      marriageYears: 7,
      familyViolence: false,
      payeeDisabled: false,
    });
    expect(result.eligible).toBe(false);
    expect(result.monthlyAmount).toBe(0);
  });

  test("TX-SM-3: Amount = lesser of $5,000 or 20% of gross income", () => {
    // Payor gross $8,000/mo → 20% = $1,600 → lesser of $5,000 and $1,600 = $1,600
    const result = calcTXSpousalMaintenance({ ...BASE_TX });
    expect(result.eligible).toBe(true);
    expect(result.monthlyAmount).toBe(1600);
  });

  test("TX-SM-4: Cap at $5,000 when 20% exceeds cap", () => {
    // Payor gross $30,000/mo → 20% = $6,000 → capped at $5,000
    const result = calcTXSpousalMaintenance({
      ...BASE_TX,
      payorGrossMonthlyIncome: 30000,
    });
    expect(result.eligible).toBe(true);
    expect(result.monthlyAmount).toBe(5000);
  });

  test("TX-SM-5: Family violence — eligible even under 10 years", () => {
    const result = calcTXSpousalMaintenance({
      ...BASE_TX,
      marriageYears: 3,
      familyViolence: true,
    });
    expect(result.eligible).toBe(true);
    expect(result.eligibilityReason).toContain("family violence");
  });

  test("TX-SM-6: Duration — 10-20 year marriage = 60 months", () => {
    const result = calcTXSpousalMaintenance({ ...BASE_TX, marriageYears: 15 });
    expect(result.durationMonths).toBe(60);
  });

  test("TX-SM-7: Duration — 20-30 year marriage = 84 months", () => {
    const result = calcTXSpousalMaintenance({ ...BASE_TX, marriageYears: 25 });
    expect(result.durationMonths).toBe(84);
  });

  test("TX-SM-8: Duration — 30+ year marriage = 120 months", () => {
    const result = calcTXSpousalMaintenance({ ...BASE_TX, marriageYears: 32 });
    expect(result.durationMonths).toBe(120);
  });

  test("TX-SM-9: Source URL present", () => {
    const result = calcTXSpousalMaintenance({ ...BASE_TX });
    expect(result.sourceUrl).toContain("statutes.capitol.texas.gov");
  });
});

describe("Texas Child Support", () => {
  test("TX-CS-1: No children = zero", () => {
    const result = calcTXChildSupport({ ...BASE_TX, numberOfChildren: 0 });
    expect(result.monthly).toBe(0);
  });

  test("TX-CS-2: 1 child = 20% of net resources", () => {
    // Net resources $6,500 → 20% = $1,300
    const result = calcTXChildSupport({ ...BASE_TX, numberOfChildren: 1 });
    expect(result.monthly).toBe(1300);
    expect(result.percentageApplied).toBe(0.2);
  });

  test("TX-CS-3: 2 children = 25%", () => {
    // Net $6,500 → 25% = $1,625
    const result = calcTXChildSupport({ ...BASE_TX, numberOfChildren: 2 });
    expect(result.monthly).toBe(1625);
  });

  test("TX-CS-4: 3 children = 30%", () => {
    const result = calcTXChildSupport({ ...BASE_TX, numberOfChildren: 3 });
    expect(result.monthly).toBe(1950);
  });

  test("TX-CS-5: 4 children = 35%", () => {
    const result = calcTXChildSupport({ ...BASE_TX, numberOfChildren: 4 });
    expect(result.monthly).toBe(2275);
  });

  test("TX-CS-6: 5+ children = 40%", () => {
    const result = calcTXChildSupport({ ...BASE_TX, numberOfChildren: 5 });
    expect(result.monthly).toBe(2600);
  });

  test("TX-CS-7: Income cap at $11,700 (2025 update)", () => {
    // Net resources $15,000 → capped at $11,700 → 20% = $2,340
    const result = calcTXChildSupport({
      ...BASE_TX,
      payorNetMonthlyResources: 15000,
      numberOfChildren: 1,
    });
    expect(result.capApplied).toBe(true);
    expect(result.monthly).toBe(2340); // $11,700 × 20%
  });

  test("TX-CS-8: Below cap — no cap applied", () => {
    const result = calcTXChildSupport({ ...BASE_TX, numberOfChildren: 1 });
    expect(result.capApplied).toBe(false);
  });

  test("TX-CS-9: Source URL present", () => {
    const result = calcTXChildSupport({ ...BASE_TX, numberOfChildren: 1 });
    expect(result.sourceUrl).toContain("statutes.capitol.texas.gov");
  });
});

describe("Texas Property Division", () => {
  test("TX-PD-1: Net estate calculation", () => {
    const result = calcTXPropertyDivision(200000, 30000);
    expect(result.netMaritalEstate).toBe(170000);
    expect(result.presumptiveSplit).toBe(85000);
  });

  test("TX-PD-2: Source URL present", () => {
    const result = calcTXPropertyDivision(100000, 0);
    expect(result.sourceUrl).toContain("statutes.capitol.texas.gov");
  });
});
