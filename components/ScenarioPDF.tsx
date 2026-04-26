import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import type { ScenarioResult, ScenarioOutput } from "@/lib/scenario-engine";

const DISCLAIMER =
  "UNBRIDALED provides educational financial scenarios. This is not financial, legal, or tax advice. " +
  "Consult a licensed financial advisor and family law attorney for guidance on your specific situation.";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1c1917",
    paddingTop: 48,
    paddingBottom: 60,
    paddingHorizontal: 48,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e7e5e4",
    paddingBottom: 12,
  },
  title: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  subtitle: { fontSize: 10, color: "#78716c" },
  disclaimerBox: {
    backgroundColor: "#fefce8",
    borderWidth: 1,
    borderColor: "#fde047",
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  disclaimerText: { fontSize: 8, color: "#854d0e", lineHeight: 1.4 },
  sectionHeader: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#1c1917",
  },
  scenarioCard: {
    borderWidth: 1,
    borderColor: "#e7e5e4",
    borderRadius: 4,
    marginBottom: 12,
    overflow: "hidden",
  },
  scenarioHeader: {
    backgroundColor: "#292524",
    padding: 10,
  },
  scenarioHeaderText: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#fff",
  },
  scenarioBody: { padding: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: { color: "#78716c" },
  value: { fontFamily: "Helvetica-Bold" },
  valueGreen: { fontFamily: "Helvetica-Bold", color: "#15803d" },
  valueRed: { fontFamily: "Helvetica-Bold", color: "#dc2626" },
  divider: {
    borderTopWidth: 1,
    borderTopColor: "#e7e5e4",
    marginVertical: 6,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: "#e7e5e4",
    paddingTop: 8,
  },
  footerText: { fontSize: 7, color: "#a8a29e", textAlign: "center" },
  sourceRow: { flexDirection: "row", gap: 4, marginBottom: 3 },
  sourceDot: { color: "#a8a29e" },
  sourceLink: { fontSize: 8, color: "#1d4ed8", textDecoration: "underline" },
  note: { fontSize: 8, color: "#78716c", lineHeight: 1.3, marginTop: 3 },
  sectionNote: {
    fontSize: 8,
    color: "#78716c",
    lineHeight: 1.4,
    marginBottom: 12,
    fontStyle: "italic",
  },
  twoCol: { flexDirection: "row", gap: 12 },
  col: { flex: 1 },
  bulletItem: { fontSize: 9, color: "#44403c", marginBottom: 2 },
});

function Footer({ page }: { page?: string }) {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>{DISCLAIMER}</Text>
      {page && <Text style={[styles.footerText, { marginTop: 2 }]}>{page}</Text>}
    </View>
  );
}

function ScenarioSection({
  scenario,
  title,
  bgColor,
}: {
  scenario: ScenarioOutput;
  title: string;
  bgColor?: string;
}) {
  const net = scenario.monthlyNet;

  return (
    <View style={styles.scenarioCard}>
      <View style={[styles.scenarioHeader, bgColor ? { backgroundColor: bgColor } : {}]}>
        <Text style={styles.scenarioHeaderText}>{title}</Text>
        <Text style={{ fontSize: 8, color: "#d6d3d1", marginTop: 2 }}>
          {scenario.description}
        </Text>
      </View>
      <View style={styles.scenarioBody}>
        <View style={styles.row}>
          <Text style={styles.label}>Monthly income</Text>
          <Text style={styles.value}>${scenario.monthlyIncome.toLocaleString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Monthly expenses</Text>
          <Text style={styles.value}>${scenario.totalMonthlyExpenses.toLocaleString()}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>Monthly net</Text>
          <Text style={net >= 0 ? styles.valueGreen : styles.valueRed}>
            {net >= 0 ? "+" : ""}${net.toLocaleString()}
          </Text>
        </View>
        {scenario.propertyShareReceived > 0 && (
          <View style={styles.row}>
            <Text style={styles.label}>Est. property share (one-time)</Text>
            <Text style={styles.value}>${scenario.propertyShareReceived.toLocaleString()}</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>Runway</Text>
          <Text style={styles.value}>
            {scenario.monthsRunway === 999
              ? "Positive cash flow"
              : `${scenario.monthsRunway} months`}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function ScenarioPDF({ result }: { result: ScenarioResult }) {
  const { scenarios, state, generatedAt } = result;
  const date = new Date(generatedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const stateLabels: Record<string, string> = {
    CA: "California",
    TX: "Texas",
    NY: "New York",
  };

  return (
    <Document>
      {/* Page 1: How to use this report */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>How to use this report</Text>
          <Text style={styles.subtitle}>Unbridaled Financial Scenario Report</Text>
        </View>

        <Text style={{ fontSize: 10, lineHeight: 1.6, color: "#44403c", marginBottom: 12 }}>
          This report contains financial projections for three scenarios based on the numbers you
          entered and {stateLabels[state] ?? state} state-specific legal formulas. It is designed
          to give you a clear picture of your financial situation so you can have informed
          conversations with attorneys and financial advisors.
        </Text>

        <Text style={[styles.sectionHeader, { marginTop: 8 }]}>What this report shows</Text>
        <Text style={styles.bulletItem}>
          · Three scenarios: your current financial situation, separation with legal process, and
          separation without legal process
        </Text>
        <Text style={styles.bulletItem}>
          · Monthly cash flow projections for each scenario, including income, expenses, and net
        </Text>
        <Text style={styles.bulletItem}>
          · Estimated spousal support and child support ranges, sourced from state statutes
        </Text>
        <Text style={styles.bulletItem}>
          · Property division projections based on {stateLabels[state]} law
        </Text>
        <Text style={styles.bulletItem}>
          · Monthly financial runway (how long your savings would last)
        </Text>

        <Text style={[styles.sectionHeader, { marginTop: 8 }]}>What this report does not show</Text>
        <Text style={styles.bulletItem}>
          · A prediction of what a court will decide in your specific case
        </Text>
        <Text style={styles.bulletItem}>
          · Tax implications of support, property division, or filing status changes
        </Text>
        <Text style={styles.bulletItem}>
          · The impact of attorney fees (which can be substantial)
        </Text>
        <Text style={styles.bulletItem}>
          · Asset valuations (retirement accounts, real property) — these require appraisal
        </Text>

        <Text style={[styles.sectionHeader, { marginTop: 8 }]}>How to use it</Text>
        <Text style={{ fontSize: 10, lineHeight: 1.6, color: "#44403c", marginBottom: 8 }}>
          Take this report to your first consultation with a family law attorney and a financial
          advisor. Use the numbers as a starting point for conversation — not as a final answer.
          The scenarios show ranges because courts have discretion.
        </Text>

        <View style={styles.disclaimerBox}>
          <Text style={[styles.disclaimerText, { fontFamily: "Helvetica-Bold", marginBottom: 3 }]}>
            IMPORTANT
          </Text>
          <Text style={styles.disclaimerText}>{DISCLAIMER}</Text>
        </View>

        <Footer page="Page 1 of 7" />
      </Page>

      {/* Page 2: Scenario overview */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Scenario overview</Text>
          <Text style={styles.subtitle}>
            {stateLabels[state]} · Generated {date}
          </Text>
        </View>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>{DISCLAIMER}</Text>
        </View>

        <ScenarioSection
          scenario={scenarios.stay}
          title="Scenario A: Current situation"
        />
        <ScenarioSection
          scenario={scenarios.leaveWithDivision}
          title="Scenario B: Separation with legal process"
          bgColor="#1e3a5f"
        />
        <ScenarioSection
          scenario={scenarios.leaveWithoutDivision}
          title="Scenario C: Separation without legal process"
          bgColor="#7c2d12"
        />

        <Footer page="Page 2 of 7" />
      </Page>

      {/* Page 3: Support projections */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Support projections</Text>
          <Text style={styles.subtitle}>{stateLabels[state]} state formulas</Text>
        </View>

        <Text style={styles.sectionNote}>
          These projections use {stateLabels[state]} state formulas sourced from official statutes.
          They are estimates. Courts have significant discretion. Ranges are shown where judicial
          discretion typically applies.
        </Text>

        {scenarios.leaveWithDivision.spousalSupportReceived && (
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.sectionHeader}>Spousal support (projected receipt)</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Monthly amount</Text>
              <Text style={styles.value}>
                ${scenarios.leaveWithDivision.spousalSupportReceived.amount.toLocaleString()}/mo
              </Text>
            </View>
            {scenarios.leaveWithDivision.spousalSupportReceived.formula && (
              <Text style={styles.note}>
                Formula: {scenarios.leaveWithDivision.spousalSupportReceived.formula}
              </Text>
            )}
            {scenarios.leaveWithDivision.spousalSupportReceived.note && (
              <Text style={styles.note}>
                {scenarios.leaveWithDivision.spousalSupportReceived.note}
              </Text>
            )}
          </View>
        )}

        {scenarios.leaveWithDivision.spousalSupportPaid && (
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.sectionHeader}>Spousal support (projected payment)</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Monthly amount</Text>
              <Text style={styles.value}>
                ${scenarios.leaveWithDivision.spousalSupportPaid.amount.toLocaleString()}/mo
              </Text>
            </View>
          </View>
        )}

        {scenarios.leaveWithDivision.childSupportReceived && (
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.sectionHeader}>Child support (projected receipt)</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Monthly amount</Text>
              <Text style={styles.value}>
                ${scenarios.leaveWithDivision.childSupportReceived.amount.toLocaleString()}/mo
              </Text>
            </View>
            {scenarios.leaveWithDivision.childSupportReceived.formula && (
              <Text style={styles.note}>
                Formula: {scenarios.leaveWithDivision.childSupportReceived.formula}
              </Text>
            )}
          </View>
        )}

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>{DISCLAIMER}</Text>
        </View>

        <Footer page="Page 3 of 7" />
      </Page>

      {/* Page 4: Expense breakdown */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Expense breakdown</Text>
          <Text style={styles.subtitle}>Scenarios B and C — Separation expenses</Text>
        </View>

        <Text style={styles.sectionHeader}>Scenario B: Separation with legal process</Text>
        {scenarios.leaveWithDivision.monthlyExpenses.map((e) => (
          <View key={e.label} style={[styles.row, { marginBottom: 3 }]}>
            <Text style={[styles.label, { fontSize: 9 }]}>{e.label}</Text>
            <Text style={[styles.value, { fontSize: 9 }]}>${e.amount.toLocaleString()}</Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={[styles.label, { fontFamily: "Helvetica-Bold" }]}>Total</Text>
          <Text style={styles.value}>
            ${scenarios.leaveWithDivision.totalMonthlyExpenses.toLocaleString()}
          </Text>
        </View>

        <Text style={[styles.sectionHeader, { marginTop: 16 }]}>
          Scenario C: Separation without legal process
        </Text>
        {scenarios.leaveWithoutDivision.monthlyExpenses.map((e) => (
          <View key={e.label} style={[styles.row, { marginBottom: 3 }]}>
            <Text style={[styles.label, { fontSize: 9 }]}>{e.label}</Text>
            <Text style={[styles.value, { fontSize: 9 }]}>${e.amount.toLocaleString()}</Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={[styles.label, { fontFamily: "Helvetica-Bold" }]}>Total</Text>
          <Text style={styles.value}>
            ${scenarios.leaveWithoutDivision.totalMonthlyExpenses.toLocaleString()}
          </Text>
        </View>

        <Footer page="Page 4 of 7" />
      </Page>

      {/* Page 5: Questions for an attorney */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Questions to ask a family law attorney</Text>
          <Text style={styles.subtitle}>Use this as a guide for your first consultation</Text>
        </View>

        {[
          "What is the likely range of spousal support given our specific incomes and circumstances?",
          "How long would support last given the length of our marriage?",
          "What qualifies as separate vs. marital property in my specific situation?",
          "How would our retirement accounts be divided?",
          "What would temporary support look like during the legal process?",
          "How does our expected custody arrangement affect child support?",
          "What are the grounds for divorce in " + (stateLabels[state] ?? state) + " and how do they affect the process?",
          "What legal documents do I need to gather now?",
          "What is a realistic timeline and cost estimate for the legal process?",
          "Are there alternatives to litigation (mediation, collaborative divorce) that might fit our situation?",
        ].map((q, i) => (
          <View key={i} style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 9, color: "#44403c", lineHeight: 1.4 }}>
              {i + 1}. {q}
            </Text>
          </View>
        ))}

        <View style={[styles.disclaimerBox, { marginTop: 16 }]}>
          <Text style={styles.disclaimerText}>{DISCLAIMER}</Text>
        </View>

        <Footer page="Page 5 of 7" />
      </Page>

      {/* Page 6: Questions for a financial advisor */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Questions to ask a financial advisor</Text>
          <Text style={styles.subtitle}>Use this as a guide for your first consultation</Text>
        </View>

        {[
          "What are the tax implications of receiving spousal support under current law?",
          "How should I value and divide retirement accounts (QDRO process)?",
          "What financial records do I need to gather, and how far back should I go?",
          "How should I budget for a 6–12 month transition period?",
          "What credit accounts should I open in my own name now?",
          "How will the property division affect my tax situation?",
          "What life insurance do I need if I'm receiving support?",
          "How should I think about the health insurance gap during transition?",
          "What emergency fund do I need before beginning the legal process?",
          "What is my long-term financial plan for retirement if I take time out of the workforce?",
        ].map((q, i) => (
          <View key={i} style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 9, color: "#44403c", lineHeight: 1.4 }}>
              {i + 1}. {q}
            </Text>
          </View>
        ))}

        <View style={[styles.disclaimerBox, { marginTop: 16 }]}>
          <Text style={styles.disclaimerText}>{DISCLAIMER}</Text>
        </View>

        <Footer page="Page 6 of 7" />
      </Page>

      {/* Page 7: Sources */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Sources and methodology</Text>
          <Text style={styles.subtitle}>
            All calculations are traceable to primary legal and government sources
          </Text>
        </View>

        <Text style={{ fontSize: 10, lineHeight: 1.6, color: "#44403c", marginBottom: 12 }}>
          Every formula used in this report is sourced from official state statutes or federal
          government databases. The sources are listed below. Formulas were last reviewed on{" "}
          {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.
        </Text>

        {state === "CA" && (
          <>
            <Text style={styles.sectionHeader}>California Sources</Text>
            {[
              ["Spousal support factors", "CA Family Code § 4320", "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=FAM&sectionNum=4320."],
              ["Temporary support formula (Santa Clara)", "courts.ca.gov self-help", "https://courts.ca.gov/programs-initiatives/families-and-children/family-law"],
              ["Child support guideline", "CA Family Code § 4055 / childsupport.ca.gov", "https://childsupport.ca.gov/guideline-calculator/"],
              ["Community property", "CA Family Code § 760", "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=FAM&sectionNum=760."],
            ].map(([label, title, url]) => (
              <View key={label} style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "#44403c" }}>{label}</Text>
                <Link src={url} style={styles.sourceLink}>{title}</Link>
                <Text style={[styles.note, { marginTop: 1 }]}>{url}</Text>
              </View>
            ))}
          </>
        )}

        {state === "TX" && (
          <>
            <Text style={styles.sectionHeader}>Texas Sources</Text>
            {[
              ["Spousal maintenance", "TX Family Code Chapter 8", "https://statutes.capitol.texas.gov/docs/fa/pdf/fa.8.pdf"],
              ["Child support guidelines", "TX Family Code § 154.125", "https://statutes.capitol.texas.gov/GetStatute.aspx?Code=FA&Value=154.125"],
              ["Child support cap (2025 update)", "TX OAG / bryanfagan.com", "https://www.bryanfagan.com/2025/10/new-texas-child-support-guideline-cap-and-percentages-2025-update/"],
              ["Property division", "TX Family Code § 7.001", "https://statutes.capitol.texas.gov/GetStatute.aspx?Code=FA&Value=7.001"],
            ].map(([label, title, url]) => (
              <View key={label} style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "#44403c" }}>{label}</Text>
                <Link src={url} style={styles.sourceLink}>{title}</Link>
                <Text style={[styles.note, { marginTop: 1 }]}>{url}</Text>
              </View>
            ))}
          </>
        )}

        {state === "NY" && (
          <>
            <Text style={styles.sectionHeader}>New York Sources</Text>
            {[
              ["Maintenance formula & calculator", "NY Courts — nycourts.gov", "https://ww2.nycourts.gov/divorce/MaintenanceChildSupportTools.shtml"],
              ["Child support (CSSA)", "LDSS-4515 Rev. 03/26", "https://childsupport.ny.gov/pdfs/CSSA.pdf"],
              ["Equitable distribution", "NY DRL § 236(B)", "https://www.nysenate.gov/legislation/laws/DOM/236"],
            ].map(([label, title, url]) => (
              <View key={label} style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "#44403c" }}>{label}</Text>
                <Link src={url} style={styles.sourceLink}>{title}</Link>
                <Text style={[styles.note, { marginTop: 1 }]}>{url}</Text>
              </View>
            ))}
          </>
        )}

        <Text style={[styles.sectionHeader, { marginTop: 12 }]}>Federal Sources</Text>
        {[
          ["Fair Market Rents", "HUD USER FY2025", "https://www.huduser.gov/portal/datasets/fmr.html"],
          ["HUD API documentation", "huduser.gov", "https://www.huduser.gov/portal/dataset/fmr-api.html"],
        ].map(([label, title, url]) => (
          <View key={label} style={{ marginBottom: 6 }}>
            <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "#44403c" }}>{label}</Text>
            <Link src={url} style={styles.sourceLink}>{title}</Link>
          </View>
        ))}

        <View style={[styles.disclaimerBox, { marginTop: 16 }]}>
          <Text style={styles.disclaimerText}>{DISCLAIMER}</Text>
        </View>

        <Footer page="Page 7 of 7" />
      </Page>
    </Document>
  );
}
