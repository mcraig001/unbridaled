/**
 * California formula tests
 *
 * Test cases sourced from:
 * - California courts self-help: https://courts.ca.gov
 * - cristinlowelaw.com worked example (Santa Clara formula)
 * - thesandslawgroup.com worked example
 */

import {
  calcCASpousalSupport,
  calcCAChildSupport,
  calcCACommunityPropertySplit,
} from "../lib/states/ca";

describe("California Spousal Support", () => {
  test("SC-1: Basic Santa Clara formula — cited worked example", () => {
    // Source: cristinlowelaw.com / thesandslawgroup.com
    // Spouse A net: $6,000/mo, Spouse B net: $3,000/mo
    // Expected: 40% × $6,000 - 50% × $3,000 = $2,400 - $1,500 = $900/mo
    const result = calcCASpousalSupport({
      higherNetMonthlyIncome: 6000,
      lowerNetMonthlyIncome: 3000,
      combinedNetMonthlyIncome: 9000,
      numberOfChildren: 0,
      higherEarnerCustodyPct: 0.5,
      marriageYears: 8,
      maritalAssets: 100000,
      maritalDebts: 20000,
    });
    expect(result.mid).toBe(900);
    expect(result.low).toBeLessThan(result.mid);
    expect(result.high).toBeGreaterThan(result.mid);
  });

  test("SC-2: High earner with disparity", () => {
    // Higher earner: $12,000 net, lower: $2,000 net
    // Expected mid: 40% × 12000 - 50% × 2000 = 4800 - 1000 = $3,800
    const result = calcCASpousalSupport({
      higherNetMonthlyIncome: 12000,
      lowerNetMonthlyIncome: 2000,
      combinedNetMonthlyIncome: 14000,
      numberOfChildren: 2,
      higherEarnerCustodyPct: 0.3,
      marriageYears: 12,
      maritalAssets: 300000,
      maritalDebts: 50000,
    });
    expect(result.mid).toBe(3800);
  });

  test("SC-3: Equal incomes = zero temporary support", () => {
    const result = calcCASpousalSupport({
      higherNetMonthlyIncome: 5000,
      lowerNetMonthlyIncome: 5000,
      combinedNetMonthlyIncome: 10000,
      numberOfChildren: 1,
      higherEarnerCustodyPct: 0.5,
      marriageYears: 5,
      maritalAssets: 50000,
      maritalDebts: 10000,
    });
    // 40% × 5000 - 50% × 5000 = 2000 - 2500 = -500 → clamped to 0
    expect(result.mid).toBe(0);
    expect(result.low).toBe(0);
  });

  test("SC-4: Long marriage note differs from short marriage", () => {
    const long = calcCASpousalSupport({
      higherNetMonthlyIncome: 8000,
      lowerNetMonthlyIncome: 2000,
      combinedNetMonthlyIncome: 10000,
      numberOfChildren: 0,
      higherEarnerCustodyPct: 0.5,
      marriageYears: 15,
      maritalAssets: 200000,
      maritalDebts: 0,
    });
    const short = calcCASpousalSupport({
      higherNetMonthlyIncome: 8000,
      lowerNetMonthlyIncome: 2000,
      combinedNetMonthlyIncome: 10000,
      numberOfChildren: 0,
      higherEarnerCustodyPct: 0.5,
      marriageYears: 4,
      maritalAssets: 200000,
      maritalDebts: 0,
    });
    expect(long.note).toMatch(/10 years/);
    expect(short.note).toMatch(/years/);
  });

  test("SC-5: Source URL is set", () => {
    const result = calcCASpousalSupport({
      higherNetMonthlyIncome: 5000,
      lowerNetMonthlyIncome: 2000,
      combinedNetMonthlyIncome: 7000,
      numberOfChildren: 0,
      higherEarnerCustodyPct: 0.5,
      marriageYears: 7,
      maritalAssets: 0,
      maritalDebts: 0,
    });
    expect(result.sourceUrl).toContain("leginfo.legislature.ca.gov");
  });
});

describe("California Child Support", () => {
  test("CS-1: No children = zero", () => {
    const result = calcCAChildSupport({
      higherNetMonthlyIncome: 6000,
      lowerNetMonthlyIncome: 3000,
      combinedNetMonthlyIncome: 9000,
      numberOfChildren: 0,
      higherEarnerCustodyPct: 0.5,
      marriageYears: 5,
      maritalAssets: 0,
      maritalDebts: 0,
    });
    expect(result.monthly).toBe(0);
  });

  test("CS-2: One child — returns positive estimate", () => {
    // Higher earner 70% custody (low-custody-payer scenario)
    const result = calcCAChildSupport({
      higherNetMonthlyIncome: 8000,
      lowerNetMonthlyIncome: 2000,
      combinedNetMonthlyIncome: 10000,
      numberOfChildren: 1,
      higherEarnerCustodyPct: 0.2, // higher earner has 20% custody → pays more
      marriageYears: 8,
      maritalAssets: 150000,
      maritalDebts: 20000,
    });
    expect(result.monthly).toBeGreaterThan(0);
    expect(result.note).toContain("ESTIMATE");
    expect(result.sourceUrl).toContain("childsupport.ca.gov");
  });

  test("CS-3: Two children — more than one child", () => {
    const one = calcCAChildSupport({
      higherNetMonthlyIncome: 6000,
      lowerNetMonthlyIncome: 2000,
      combinedNetMonthlyIncome: 8000,
      numberOfChildren: 1,
      higherEarnerCustodyPct: 0.2,
      marriageYears: 5,
      maritalAssets: 0,
      maritalDebts: 0,
    });
    const two = calcCAChildSupport({
      higherNetMonthlyIncome: 6000,
      lowerNetMonthlyIncome: 2000,
      combinedNetMonthlyIncome: 8000,
      numberOfChildren: 2,
      higherEarnerCustodyPct: 0.2,
      marriageYears: 5,
      maritalAssets: 0,
      maritalDebts: 0,
    });
    expect(two.monthly).toBeGreaterThan(one.monthly);
  });

  test("CS-4: Full custody = higher support than 50/50", () => {
    const fullCustody = calcCAChildSupport({
      higherNetMonthlyIncome: 6000,
      lowerNetMonthlyIncome: 2000,
      combinedNetMonthlyIncome: 8000,
      numberOfChildren: 1,
      higherEarnerCustodyPct: 0.0, // lower earner has all custody
      marriageYears: 5,
      maritalAssets: 0,
      maritalDebts: 0,
    });
    const splitCustody = calcCAChildSupport({
      higherNetMonthlyIncome: 6000,
      lowerNetMonthlyIncome: 2000,
      combinedNetMonthlyIncome: 8000,
      numberOfChildren: 1,
      higherEarnerCustodyPct: 0.5,
      marriageYears: 5,
      maritalAssets: 0,
      maritalDebts: 0,
    });
    expect(fullCustody.monthly).toBeGreaterThan(splitCustody.monthly);
  });
});

describe("California Community Property", () => {
  test("CP-1: 50/50 split of net marital estate", () => {
    const result = calcCACommunityPropertySplit(500000, 100000);
    expect(result.netMaritalEstate).toBe(400000);
    expect(result.eachSpouseShare).toBe(200000);
  });

  test("CP-2: Negative equity handled", () => {
    const result = calcCACommunityPropertySplit(50000, 100000);
    expect(result.netMaritalEstate).toBe(-50000);
    expect(result.eachSpouseShare).toBe(-25000);
  });

  test("CP-3: Source URL present", () => {
    const result = calcCACommunityPropertySplit(200000, 50000);
    expect(result.sourceUrl).toContain("leginfo.legislature.ca.gov");
  });
});
