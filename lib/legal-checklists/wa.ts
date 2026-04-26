// Washington State divorce document checklist
// Sources: courts.wa.gov, app.leg.wa.gov, dshs.wa.gov
// Verified: 2026-04-26

import type { ChecklistItem } from "./ca";

export const WA_CHECKLIST: ChecklistItem[] = [
  // --- Court forms ---
  {
    id: "wa-petition",
    category: "Court Forms",
    title: "Petition for Dissolution of Marriage",
    description: "Filed with the Superior Court clerk in the county of residence. RCW 26.09.010.",
    source: "https://www.courts.wa.gov/forms/?fa=forms.contribute&formID=16",
    required: true,
    notes: "Washington uses 'dissolution of marriage' not 'divorce.' The effect is the same.",
  },
  {
    id: "wa-summons",
    category: "Court Forms",
    title: "Summons (Dissolution)",
    description: "Served on the respondent along with the petition.",
    source: "https://www.courts.wa.gov/forms/?fa=forms.contribute&formID=16",
    required: true,
  },
  {
    id: "wa-decree",
    category: "Court Forms",
    title: "Decree of Dissolution",
    description: "The final court order ending the marriage and dividing property.",
    required: true,
    notes: "If both parties agree on all terms, this can be a Decree by Default or Agreed Decree.",
  },
  {
    id: "wa-financial-declaration",
    category: "Court Forms",
    title: "Financial Declaration (FL All Family 131)",
    description: "Required financial disclosure listing all income, assets, debts, and expenses.",
    source: "https://www.courts.wa.gov/forms/?fa=forms.contribute&formID=16",
    required: true,
    notes: "Must be signed under oath. Courts rely on this for maintenance and child support orders.",
  },
  {
    id: "wa-qdro",
    category: "Court Forms",
    title: "Qualified Domestic Relations Order (QDRO)",
    description: "Required to divide 401(k) or pension plans without early withdrawal penalty.",
    required: false,
    notes: "Must be approved by the retirement plan administrator separately from the Decree.",
  },

  // --- Financial documents ---
  {
    id: "wa-fin-tax",
    category: "Financial Documents",
    title: "Tax Returns (Last 2–3 Years)",
    description: "Federal and WA (no state income tax) returns for income verification.",
    required: true,
  },
  {
    id: "wa-fin-paystubs",
    category: "Financial Documents",
    title: "Pay Stubs (Last 3 Months)",
    description: "Used to establish net income for child support calculation under RCW 26.19.",
    source: "https://app.leg.wa.gov/RCW/default.aspx?cite=26.19",
    required: true,
  },
  {
    id: "wa-fin-bank",
    category: "Financial Documents",
    title: "Bank Statements (Last 12 Months)",
    description: "All accounts in both names or either name.",
    required: true,
  },
  {
    id: "wa-fin-retirement",
    category: "Financial Documents",
    title: "Retirement Account Statements",
    description: "Balance at date of marriage and current balance.",
    required: true,
    notes: "Washington is a community property state. Contributions made during marriage are community property.",
  },
  {
    id: "wa-fin-debt",
    category: "Financial Documents",
    title: "Debt Statements",
    description: "All community debts: credit cards, auto loans, mortgages, student loans.",
    required: true,
  },

  // --- Children ---
  {
    id: "wa-child-birth",
    category: "Children (if applicable)",
    title: "Children's Birth Certificates",
    description: "Required when minor children are involved.",
    required: false,
  },
  {
    id: "wa-child-parenting-plan",
    category: "Children (if applicable)",
    title: "Parenting Plan",
    description: "WA courts require a detailed Parenting Plan for all cases with minor children. RCW 26.09.181.",
    source: "https://app.leg.wa.gov/RCW/default.aspx?cite=26.09.181",
    required: false,
    notes: "The Parenting Plan must include residential schedule, decision-making authority, and dispute resolution.",
  },
  {
    id: "wa-child-support-worksheet",
    category: "Children (if applicable)",
    title: "Child Support Worksheet",
    description: "WA uses the economic table (RCW 26.19) to calculate child support. DSHS provides a calculator.",
    source: "https://www.dshs.wa.gov/esa/childsupport/child-support-schedule",
    required: false,
    notes: "Both parties must complete the worksheet. The court reviews for compliance with the schedule.",
  },

  // --- Property ---
  {
    id: "wa-prop-deed",
    category: "Property",
    title: "Real Property Deed(s)",
    description: "Deed for the marital home and any other real property.",
    required: false,
    notes: "WA is a community property state. Property acquired during marriage is presumed community. RCW 26.16.030.",
  },
  {
    id: "wa-prop-appraisal",
    category: "Property",
    title: "Real Property Appraisal",
    description: "Professional appraisal for real estate to be valued in the dissolution.",
    required: false,
  },
  {
    id: "wa-prop-business",
    category: "Property",
    title: "Business Valuation",
    description: "Forensic accountant valuation if either party owns a business.",
    required: false,
  },

  // --- Safety ---
  {
    id: "wa-safety-dv",
    category: "Safety Planning",
    title: "Domestic Violence Resources",
    description: "WA State DV Hotline: 1-800-562-6025. National DV Hotline: 1-800-799-7233.",
    source: "https://www.commerce.wa.gov/growing-the-economy/reducing-domestic-violence/",
    required: false,
  },
  {
    id: "wa-safety-order-protection",
    category: "Safety Planning",
    title: "Order for Protection (if needed)",
    description: "Can be filed in Superior or District Court. RCW 7.105. Emergency orders can be issued the same day.",
    source: "https://app.leg.wa.gov/RCW/default.aspx?cite=7.105",
    required: false,
    notes: "WA merged all civil protection order types under RCW 7.105 (effective July 2022). Courts process emergency petitions quickly.",
  },

  // --- Timeline ---
  {
    id: "wa-residency",
    category: "Timeline",
    title: "Residency Requirement",
    description: "At least one spouse must have lived in WA at the time the petition is filed. No minimum duration required by statute.",
    source: "https://app.leg.wa.gov/RCW/default.aspx?cite=26.09.010",
    required: true,
    notes: "Unlike most states, WA has no minimum residency duration — you just need to be a WA resident at the time of filing.",
  },
  {
    id: "wa-waiting",
    category: "Timeline",
    title: "90-Day Waiting Period",
    description: "WA requires a minimum 90-day waiting period from the date of service before a dissolution can be finalized. RCW 26.09.030.",
    source: "https://app.leg.wa.gov/RCW/default.aspx?cite=26.09.030",
    required: true,
    notes: "The 90-day period runs from service date, not filing date. Total process typically takes 3–12 months.",
  },
];

export const WA_CHECKLIST_META = {
  state: "WA",
  stateName: "Washington",
  lastVerified: "2026-04-26",
  primarySource: "https://www.courts.wa.gov/newsinfo/resources/?fa=newsinfo_jury.displayContent&theFile=selfHelp/dissolution",
  disclaimer:
    "This checklist is educational only. Washington court requirements vary by county. Consult a licensed Washington family law attorney.",
};
