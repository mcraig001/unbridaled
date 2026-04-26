// Texas divorce document checklist
// Sources: texaslawhelp.org, statutes.capitol.texas.gov, oag.texas.gov
// Verified: 2026-04-26

import type { ChecklistItem } from "./ca";

export const TX_CHECKLIST: ChecklistItem[] = [
  // --- Court forms ---
  {
    id: "tx-original-petition",
    category: "Court Forms",
    title: "Original Petition for Divorce",
    description: "Filed with the district clerk to initiate the divorce. Texas Family Code § 6.001.",
    source: "https://statutes.capitol.texas.gov/Docs/FA/htm/FA.6.htm",
    required: true,
  },
  {
    id: "tx-citation",
    category: "Court Forms",
    title: "Citation / Waiver of Service",
    description: "The respondent must be served or must sign a waiver. Process server or constable typically serves.",
    required: true,
    notes: "A spouse cannot serve the other spouse personally — must use a disinterested adult.",
  },
  {
    id: "tx-final-decree",
    category: "Court Forms",
    title: "Final Decree of Divorce",
    description: "The court order that ends the marriage and divides property. Drafted by the parties or their attorneys.",
    required: true,
    notes: "Must be specific enough that a third party could enforce it without additional court orders.",
  },
  {
    id: "tx-qdro",
    category: "Court Forms",
    title: "Qualified Domestic Relations Order (QDRO)",
    description: "Required to divide 401(k) or pension accounts without early withdrawal penalty.",
    required: false,
    notes: "Must be approved by the plan administrator. File separately from the Final Decree.",
  },

  // --- Financial documents ---
  {
    id: "tx-fin-tax",
    category: "Financial Documents",
    title: "Tax Returns (Last 2–3 Years)",
    description: "Federal returns (and Texas franchise returns if self-employed) for income verification.",
    required: true,
  },
  {
    id: "tx-fin-paystubs",
    category: "Financial Documents",
    title: "Pay Stubs (Last 3 Months)",
    description: "Used to establish net resources for child support calculation under TFC § 154.062.",
    source: "https://statutes.capitol.texas.gov/Docs/FA/htm/FA.154.htm",
    required: true,
  },
  {
    id: "tx-fin-bank",
    category: "Financial Documents",
    title: "Bank Statements (Last 12 Months)",
    description: "All accounts in both names or either name.",
    required: true,
  },
  {
    id: "tx-fin-retirement",
    category: "Financial Documents",
    title: "Retirement Account Statements",
    description: "Balance at date of marriage and current balance for each account.",
    required: true,
    notes: "Texas is a community property state. Contributions made during marriage are community property. Contributions made before marriage are separate property.",
  },
  {
    id: "tx-fin-inventory",
    category: "Financial Documents",
    title: "Inventory and Appraisement",
    description: "A sworn list of all property (community and separate) with values. Required by most Texas courts.",
    required: true,
    notes: "Each party typically prepares their own. Values are contested separately.",
  },
  {
    id: "tx-fin-debt",
    category: "Financial Documents",
    title: "Debt Statements",
    description: "All community debts: credit cards, auto loans, medical bills, student loans.",
    required: true,
    notes: "Texas courts divide both assets AND debts in the Final Decree. Community debt incurred during marriage is presumed community debt.",
  },

  // --- Children ---
  {
    id: "tx-child-birth",
    category: "Children (if applicable)",
    title: "Children's Birth Certificates",
    description: "Required when suit affects parent-child relationship (SAPCR).",
    required: false,
  },
  {
    id: "tx-child-parenting-plan",
    category: "Children (if applicable)",
    title: "Proposed Parenting Plan",
    description: "Outline of proposed conservatorship arrangement, visitation schedule, and decision-making authority.",
    required: false,
    notes: "Joint managing conservatorship is the Texas default. Courts favor frequent contact with both parents unless domestic violence is involved.",
  },
  {
    id: "tx-child-cs-worksheet",
    category: "Children (if applicable)",
    title: "Child Support Calculation Worksheet",
    description: "Documents the net resources calculation and percentage applied. OAG provides a calculator.",
    source: "https://www.oag.texas.gov/child-support/calculating",
    required: false,
  },

  // --- Property ---
  {
    id: "tx-prop-deed",
    category: "Property",
    title: "Real Property Deed(s)",
    description: "Deed for the marital home and any other real property.",
    required: false,
    notes: "Texas community property presumption: any property acquired during marriage is presumed community unless proven separate. Tex. Fam. Code § 3.003.",
  },
  {
    id: "tx-prop-appraisal",
    category: "Property",
    title: "Real Property Appraisal",
    description: "Professional appraisal for any real estate being divided or retained by one party.",
    required: false,
  },
  {
    id: "tx-prop-business",
    category: "Property",
    title: "Business Valuation",
    description: "Forensic accountant valuation for any business owned or operated during marriage.",
    required: false,
    notes: "Goodwill and business income earned during marriage may be community property.",
  },

  // --- Safety ---
  {
    id: "tx-safety-protective-order",
    category: "Safety Planning",
    title: "Protective Order (if needed)",
    description: "Texas courts issue emergency protective orders (EPOs) and longer-term protective orders for family violence. Tex. Fam. Code § 71.004.",
    source: "https://statutes.capitol.texas.gov/Docs/FA/htm/FA.71.htm",
    required: false,
    notes: "An EPO can be issued the same day by a magistrate. Contact local DV shelter or OAG's Family Violence Unit.",
  },
  {
    id: "tx-safety-dv",
    category: "Safety Planning",
    title: "Domestic Violence Resources",
    description: "National DV Hotline: 1-800-799-7233. Texas DV Hotline: 1-800-525-1978.",
    source: "https://www.txstate-dv.org",
    required: false,
  },

  // --- Waiting period ---
  {
    id: "tx-timeline",
    category: "Timeline",
    title: "60-Day Waiting Period",
    description: "Texas requires at least 60 days from the date the petition is filed before a divorce can be granted. Tex. Fam. Code § 6.702.",
    source: "https://statutes.capitol.texas.gov/Docs/FA/htm/FA.6.htm#6.702",
    required: true,
    notes: "Exception: the 60-day waiting period is waived if the respondent has been convicted of or has a protective order for family violence.",
  },
  {
    id: "tx-residency",
    category: "Timeline",
    title: "Residency Requirement",
    description: "At least one spouse must have been a Texas resident for 6 months AND a resident of the county where the petition is filed for 90 days. Tex. Fam. Code § 6.301.",
    source: "https://statutes.capitol.texas.gov/Docs/FA/htm/FA.6.htm#6.301",
    required: true,
  },
];

export const TX_CHECKLIST_META = {
  state: "TX",
  stateName: "Texas",
  lastVerified: "2026-04-26",
  primarySource: "https://texaslawhelp.org/topics/family/divorce",
  disclaimer:
    "This checklist is educational only. Texas court requirements vary by county. Consult a licensed Texas family law attorney.",
};
