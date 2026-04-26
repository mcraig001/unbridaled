// New York divorce document checklist
// Sources: nycourts.gov, nolo.com/new-york-divorce, NY Domestic Relations Law
// Verified: 2026-04-26

import type { ChecklistItem } from "./ca";

export const NY_CHECKLIST: ChecklistItem[] = [
  // --- Court forms ---
  {
    id: "ny-ud-1",
    category: "Court Forms",
    title: "Summons with Notice (UD-1) or Summons and Complaint",
    description: "Initiates the divorce action. Filed with the Supreme Court clerk in the county of residence.",
    source: "https://www.nycourts.gov/LegacyPDFS/divorce/UD-1.pdf",
    required: true,
    notes: "New York uncontested divorce uses the UD forms (UD-1 through UD-11). Contested divorce requires a formal Summons and Complaint.",
  },
  {
    id: "ny-ud-2",
    category: "Court Forms",
    title: "Verified Complaint for Divorce (UD-2)",
    description: "States the grounds for divorce. NY adopted no-fault (irretrievable breakdown) in 2010.",
    source: "https://www.nycourts.gov/LegacyPDFS/divorce/UD-2.pdf",
    required: true,
    notes: "Most divorces use no-fault grounds: 'irretrievable breakdown' for at least 6 months. DRL § 170(7).",
  },
  {
    id: "ny-ud-6",
    category: "Court Forms",
    title: "Affidavit of Service (UD-3)",
    description: "Confirms the defendant was served with the Summons.",
    source: "https://www.nycourts.gov/LegacyPDFS/divorce/UD-3.pdf",
    required: true,
  },
  {
    id: "ny-ud-7",
    category: "Court Forms",
    title: "Settlement Agreement (UD-7 or Separation Agreement)",
    description: "The written agreement between the parties dividing property, custody, and support.",
    source: "https://www.nycourts.gov/LegacyPDFS/divorce/UD-7.pdf",
    required: true,
    notes: "Must be signed and acknowledged (notarized) in the same manner as a deed. If oral, it is not enforceable in NY.",
  },
  {
    id: "ny-ud-9",
    category: "Court Forms",
    title: "Findings of Fact and Conclusions of Law (UD-9)",
    description: "Court form summarizing the basis for the divorce.",
    source: "https://www.nycourts.gov/LegacyPDFS/divorce/UD-9.pdf",
    required: true,
  },
  {
    id: "ny-ud-10",
    category: "Court Forms",
    title: "Judgment of Divorce (UD-10 / UD-11)",
    description: "The final court order ending the marriage.",
    source: "https://www.nycourts.gov/LegacyPDFS/divorce/UD-11.pdf",
    required: true,
  },
  {
    id: "ny-net-worth",
    category: "Court Forms",
    title: "Statement of Net Worth",
    description: "Mandatory financial disclosure filed by both parties in all contested matters and often in uncontested cases. 22 NYCRR § 202.16.",
    source: "https://www.nycourts.gov/forms/matrimonial/networth.pdf",
    required: true,
    notes: "Comprehensive: lists all income, assets, liabilities, and monthly expenses. Courts rely on this for support and equitable distribution.",
  },

  // --- Financial documents ---
  {
    id: "ny-fin-tax",
    category: "Financial Documents",
    title: "Tax Returns (Last 3 Years)",
    description: "Federal and NY state returns. NY courts often require 3 years for self-employed parties.",
    required: true,
  },
  {
    id: "ny-fin-paystubs",
    category: "Financial Documents",
    title: "Pay Stubs (Last 3 Months)",
    description: "Used to determine gross income for maintenance and CSSA child support calculations.",
    required: true,
    notes: "CSSA cap is $183,000 combined gross through February 2026. Verify current cap at OTDA.",
  },
  {
    id: "ny-fin-bank",
    category: "Financial Documents",
    title: "Bank Statements (Last 12 Months)",
    description: "All accounts in both names or either name.",
    required: true,
  },
  {
    id: "ny-fin-retirement",
    category: "Financial Documents",
    title: "Retirement Account Statements",
    description: "Balance at date of marriage and current balance. NY uses equitable distribution — not equal, but courts take marital length into account.",
    required: true,
    notes: "A QDRO is required to divide a 401(k) or pension. File separately after the Judgment of Divorce.",
  },
  {
    id: "ny-fin-debt",
    category: "Financial Documents",
    title: "Debt Statements",
    description: "All marital debts: credit cards, auto loans, mortgages, student loans, personal loans.",
    required: true,
  },
  {
    id: "ny-fin-business",
    category: "Financial Documents",
    title: "Business Records (if applicable)",
    description: "Three years of profit/loss statements, balance sheets, and corporate tax returns if either party owns a business.",
    required: false,
    notes: "NY courts can attribute income from a closely held business. Forensic accountants are commonly used.",
  },

  // --- Children ---
  {
    id: "ny-child-birth",
    category: "Children (if applicable)",
    title: "Children's Birth Certificates",
    description: "Required if minor children are involved.",
    required: false,
  },
  {
    id: "ny-child-uccjea",
    category: "Children (if applicable)",
    title: "UCCJEA Affidavit",
    description: "Required for custody proceedings — lists where children have lived for the past 5 years.",
    required: false,
  },
  {
    id: "ny-child-cs-worksheet",
    category: "Children (if applicable)",
    title: "Child Support Standards Act (CSSA) Worksheet",
    description: "LDSS-4515 form used by courts to calculate child support. Available from NY OTDA.",
    source: "https://otda.ny.gov/programs/css/forms/LDSS-4515.pdf",
    required: false,
    notes: "LDSS-4515 Rev 03/26. Current combined income cap: $183,000 (through Feb 2026). Above cap: courts have discretion.",
  },

  // --- Property ---
  {
    id: "ny-prop-deed",
    category: "Property",
    title: "Real Property Deed(s)",
    description: "Deed for any real estate owned.",
    required: false,
    notes: "NY uses equitable distribution. Property acquired before marriage is generally separate. Property acquired during marriage is generally marital. DRL § 236(B)(1)(c).",
  },
  {
    id: "ny-prop-appraisal",
    category: "Property",
    title: "Real Property Appraisal",
    description: "Professional appraisal for any real estate to be valued in equitable distribution.",
    required: false,
  },

  // --- Safety ---
  {
    id: "ny-safety-opv",
    category: "Safety Planning",
    title: "Order of Protection (if needed)",
    description: "Available through Family Court or Supreme Court. Can include 'stay away' and 'refrain from' provisions. Family Court Act § 842.",
    source: "https://www.nycourts.gov/courthelp/Safety/orderOfProtection.shtml",
    required: false,
    notes: "Emergency ex-parte orders can be issued the same day. Contact the clerk's office or a DV advocate.",
  },
  {
    id: "ny-safety-dv",
    category: "Safety Planning",
    title: "Domestic Violence Resources",
    description: "NY DV Hotline: 1-800-942-6906. NYC Safe Horizon: 212-577-7777. National DV Hotline: 1-800-799-7233.",
    source: "https://www.opdv.ny.gov",
    required: false,
  },

  // --- Residency and timing ---
  {
    id: "ny-residency",
    category: "Timeline",
    title: "Residency Requirements",
    description: "DRL § 230: Either party must have lived in NY for 2 years, OR lived in NY for 1 year AND married/separated in NY, OR the grounds occurred in NY and both parties are residents.",
    source: "https://www.nysenate.gov/legislation/laws/DOM/230",
    required: true,
  },
  {
    id: "ny-timeline",
    category: "Timeline",
    title: "No Mandatory Waiting Period",
    description: "Unlike CA and TX, New York has no mandatory waiting period. However, uncontested divorces in NY typically take 3–6 months due to court processing time.",
    required: false,
    notes: "A separation agreement executed before filing can streamline the process significantly.",
  },
];

export const NY_CHECKLIST_META = {
  state: "NY",
  stateName: "New York",
  lastVerified: "2026-04-26",
  primarySource: "https://www.nycourts.gov/courthelp/Family/divorce.shtml",
  disclaimer:
    "This checklist is educational only. New York court procedures vary by county (NYC vs. upstate). Consult a licensed New York family law attorney.",
};
