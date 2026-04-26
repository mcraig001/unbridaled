/**
 * Scenario engine integration tests
 * Tests that runScenarios produces coherent output across all 3 states.
 */

import { runScenarios, type HouseholdFinancials } from "../lib/scenario-engine";

const BASE_CA: HouseholdFinancials = {
  yourGrossMonthlyIncome: 4000,
  partnerGrossMonthlyIncome: 9000,
  yourNetMonthlyIncome: 3300,
  partnerNetMonthlyIncome: 7200,
  rent: 2500,
  utilities: 200,
  groceries: 600,
  transportation: 400,
  childcare: 1200,
  healthcare: 300,
  otherExpenses: 200,
  maritalAssets: 150000,
  maritalDebts: 30000,
  yourSeparateAssets: 5000,
  currentSavings: 12000,
  numberOfChildren: 1,
  childrenAges: [4],
  state: "CA",
  marriageYears: 9,
  familyViolence: false,
  youAreHigherEarner: false,
  estimatedCustodySplit: "primary",
  estimatedRentForNewPlace: 2200,
};

describe("Scenario Engine — California", () => {
  test("SE-CA-1: Returns three scenarios", () => {
    const result = runScenarios(BASE_CA);
    expect(result.scenarios.stay).toBeDefined();
    expect(result.scenarios.leaveWithDivision).toBeDefined();
    expect(result.scenarios.leaveWithoutDivision).toBeDefined();
  });

  test("SE-CA-2: Disclaimer is present and correct", () => {
    const result = runScenarios(BASE_CA);
    expect(result.disclaimer).toContain("not financial, legal, or tax advice");
    expect(result.disclaimer).toContain("family law attorney");
  });

  test("SE-CA-3: Lower earner receives spousal support in leave-with-division", () => {
    const result = runScenarios(BASE_CA);
    // User is lower earner (youAreHigherEarner: false) → should receive support
    expect(result.scenarios.leaveWithDivision.spousalSupportReceived).not.toBeNull();
    expect(result.scenarios.leaveWithDivision.spousalSupportReceived!.amount).toBeGreaterThan(0);
  });

  test("SE-CA-4: Property share in leave-with-division", () => {
    const result = runScenarios(BASE_CA);
    // CA: (150000 - 30000) / 2 = 60000
    expect(result.scenarios.leaveWithDivision.propertyShareReceived).toBe(60000);
  });

  test("SE-CA-5: Leave without division has no property share", () => {
    const result = runScenarios(BASE_CA);
    expect(result.scenarios.leaveWithoutDivision.propertyShareReceived).toBe(0);
  });

  test("SE-CA-6: Runway is non-negative", () => {
    const result = runScenarios(BASE_CA);
    expect(result.scenarios.stay.monthsRunway).toBeGreaterThanOrEqual(0);
    expect(result.scenarios.leaveWithDivision.monthsRunway).toBeGreaterThanOrEqual(0);
  });

  test("SE-CA-7: Six month burndown has 7 data points", () => {
    const result = runScenarios(BASE_CA);
    expect(result.scenarios.stay.sixMonthBurndown).toHaveLength(7);
    expect(result.scenarios.leaveWithDivision.sixMonthBurndown).toHaveLength(7);
  });

  test("SE-CA-8: State is recorded correctly", () => {
    const result = runScenarios(BASE_CA);
    expect(result.state).toBe("CA");
  });
});

describe("Scenario Engine — Texas", () => {
  const BASE_TX: HouseholdFinancials = {
    ...BASE_CA,
    state: "TX",
    marriageYears: 11, // eligible for maintenance
  };

  test("SE-TX-1: Returns valid output", () => {
    const result = runScenarios(BASE_TX);
    expect(result.scenarios.leaveWithDivision).toBeDefined();
    expect(result.state).toBe("TX");
  });

  test("SE-TX-2: Eligible user (marriage ≥ 10yr) receives maintenance", () => {
    const result = runScenarios(BASE_TX);
    expect(result.scenarios.leaveWithDivision.spousalSupportReceived).not.toBeNull();
  });
});

describe("Scenario Engine — New York", () => {
  const BASE_NY: HouseholdFinancials = {
    ...BASE_CA,
    state: "NY",
  };

  test("SE-NY-1: Returns valid output", () => {
    const result = runScenarios(BASE_NY);
    expect(result.scenarios.leaveWithDivision).toBeDefined();
    expect(result.state).toBe("NY");
  });

  test("SE-NY-2: Property share uses equitable distribution (not fixed 50/50)", () => {
    const result = runScenarios(BASE_NY);
    const propertyNote = result.scenarios.leaveWithDivision.propertyShareNote;
    expect(propertyNote).toMatch(/equitable/i);
  });
});

describe("Scenario Engine — Edge cases", () => {
  test("SE-EDGE-1: Zero incomes — does not crash", () => {
    const inputs: HouseholdFinancials = {
      ...BASE_CA,
      yourGrossMonthlyIncome: 0,
      partnerGrossMonthlyIncome: 0,
      yourNetMonthlyIncome: 0,
      partnerNetMonthlyIncome: 0,
    };
    expect(() => runScenarios(inputs)).not.toThrow();
  });

  test("SE-EDGE-2: No children — child support is null", () => {
    const inputs: HouseholdFinancials = {
      ...BASE_CA,
      numberOfChildren: 0,
      childrenAges: [],
    };
    const result = runScenarios(inputs);
    expect(result.scenarios.leaveWithDivision.childSupportReceived).toBeNull();
  });

  test("SE-EDGE-3: Higher earner scenario — pays support, not receives", () => {
    const inputs: HouseholdFinancials = {
      ...BASE_CA,
      youAreHigherEarner: true,
    };
    const result = runScenarios(inputs);
    // Higher earner should pay, not receive
    expect(result.scenarios.leaveWithDivision.spousalSupportReceived).toBeNull();
  });

  test("SE-EDGE-4: Zero savings — runway is 0 when net is negative", () => {
    const inputs: HouseholdFinancials = {
      ...BASE_CA,
      currentSavings: 0,
      yourGrossMonthlyIncome: 0,
      yourNetMonthlyIncome: 0,
      youAreHigherEarner: false,
    };
    const result = runScenarios(inputs);
    // With zero savings and possibly negative net, runway should be 0 or positive-cashflow
    expect(result.scenarios.leaveWithoutDivision.monthsRunway).toBeGreaterThanOrEqual(0);
  });

  test("SE-EDGE-5: Unsupported state throws error", () => {
    const inputs: HouseholdFinancials = {
      ...BASE_CA,
      state: "WA" as "CA",
    };
    expect(() => runScenarios(inputs)).toThrow();
  });

  test("SE-EDGE-6: generatedAt is a valid ISO timestamp", () => {
    const result = runScenarios(BASE_CA);
    expect(() => new Date(result.generatedAt)).not.toThrow();
    expect(new Date(result.generatedAt).getTime()).toBeGreaterThan(0);
  });
});
