// California divorce document checklist
// Sources: courts.ca.gov, selfhelp.courts.ca.gov, California Family Code
// Verified: 2026-04-26

export interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  source?: string;
  required: boolean;
  notes?: string;
}

export const CA_CHECKLIST: ChecklistItem[] = [
  // --- Court forms ---
  {
    id: "ca-fl-100",
    category: "Court Forms",
    title: "Petition for Dissolution (FL-100)",
    description: "The initial divorce petition filed by the petitioner.",
    source: "https://www.courts.ca.gov/documents/fl100.pdf",
    required: true,
  },
  {
    id: "ca-fl-110",
    category: "Court Forms",
    title: "Summons – Family Law (FL-110)",
    description: "Served on the respondent along with FL-100. Includes automatic restraining orders (ATROs) that prevent either party from moving assets.",
    source: "https://www.courts.ca.gov/documents/fl110.pdf",
    required: true,
    notes: "ATROs take effect the moment FL-110 is served. Do not transfer or dissipate assets after service.",
  },
  {
    id: "ca-fl-115",
    category: "Court Forms",
    title: "Proof of Service of Summons (FL-115)",
    description: "Filed after respondent is served to confirm service.",
    source: "https://www.courts.ca.gov/documents/fl115.pdf",
    required: true,
  },
  {
    id: "ca-fl-141",
    category: "Court Forms",
    title: "Declaration of Disclosure (FL-141)",
    description: "Confirms you have completed your financial disclosures. Both parties must file.",
    source: "https://www.courts.ca.gov/documents/fl141.pdf",
    required: true,
  },
  {
    id: "ca-fl-140",
    category: "Court Forms",
    title: "Schedule of Assets and Debts (FL-142)",
    description: "Complete list of all assets and debts, community and separate.",
    source: "https://www.courts.ca.gov/documents/fl142.pdf",
    required: true,
  },
  {
    id: "ca-fl-150",
    category: "Court Forms",
    title: "Income and Expense Declaration (FL-150)",
    description: "Detailed monthly income and expense statement required for any support request.",
    source: "https://www.courts.ca.gov/documents/fl150.pdf",
    required: true,
    notes: "Must be updated when circumstances change. Courts rely on this for spousal and child support.",
  },

  // --- Financial documents ---
  {
    id: "ca-fin-tax",
    category: "Financial Documents",
    title: "Tax Returns (Last 2–3 Years)",
    description: "Federal and state returns for both parties. Courts use these to verify income.",
    required: true,
  },
  {
    id: "ca-fin-paystubs",
    category: "Financial Documents",
    title: "Pay Stubs (Last 2–3 Months)",
    description: "Recent pay stubs for both parties to document current gross and net income.",
    required: true,
  },
  {
    id: "ca-fin-bank",
    category: "Financial Documents",
    title: "Bank Statements (Last 12 Months)",
    description: "All checking, savings, and investment accounts in both names or either name.",
    required: true,
  },
  {
    id: "ca-fin-retirement",
    category: "Financial Documents",
    title: "Retirement Account Statements",
    description: "401(k), IRA, pension statements showing balance on date of marriage and current balance.",
    required: true,
    notes: "Community property portion = contributions made during marriage. A QDRO is needed to divide retirement accounts without penalty.",
  },
  {
    id: "ca-fin-mortgage",
    category: "Financial Documents",
    title: "Mortgage Statement / Deed of Trust",
    description: "Current mortgage balance, property address, and both names on title if applicable.",
    required: false,
    notes: "California is a community property state — real property acquired during marriage is presumed community property.",
  },
  {
    id: "ca-fin-debt",
    category: "Financial Documents",
    title: "Debt Statements (Credit Cards, Loans)",
    description: "All debts: credit cards, auto loans, student loans, personal loans.",
    required: true,
  },

  // --- Children (if applicable) ---
  {
    id: "ca-child-birth",
    category: "Children (if applicable)",
    title: "Children's Birth Certificates",
    description: "Required if minor children are involved.",
    required: false,
  },
  {
    id: "ca-child-school",
    category: "Children (if applicable)",
    title: "School Records / Medical Records",
    description: "May be needed if custody or child support is contested.",
    required: false,
  },
  {
    id: "ca-child-fl-105",
    category: "Children (if applicable)",
    title: "Declaration Under UCCJEA (FL-105)",
    description: "Required when minor children are involved — establishes jurisdiction.",
    source: "https://www.courts.ca.gov/documents/fl105.pdf",
    required: false,
  },

  // --- Property ---
  {
    id: "ca-prop-appraisal",
    category: "Property",
    title: "Real Property Appraisals",
    description: "Professional appraisal of any real estate owned.",
    required: false,
    notes: "Both parties can hire their own appraisers. Courts average disputed appraisals.",
  },
  {
    id: "ca-prop-vehicle",
    category: "Property",
    title: "Vehicle Titles and Values (Kelley Blue Book)",
    description: "For all vehicles acquired during marriage.",
    required: false,
  },
  {
    id: "ca-prop-business",
    category: "Property",
    title: "Business Valuation",
    description: "If either party owns a business, a formal valuation by a forensic accountant is typically required.",
    required: false,
    notes: "Community property includes the business income earned during the marriage.",
  },

  // --- Safety and timing ---
  {
    id: "ca-safety-dv",
    category: "Safety Planning",
    title: "Domestic Violence Resources",
    description: "If there is any risk, contact the National DV Hotline (1-800-799-7233) or local DV shelter before filing.",
    source: "https://www.thehotline.org",
    required: false,
    notes: "Filing first does not prevent you from seeking a domestic violence restraining order (DVRO). CA courts have emergency procedures.",
  },
  {
    id: "ca-safety-atro",
    category: "Safety Planning",
    title: "Understand Automatic Temporary Restraining Orders",
    description: "ATROs prevent both parties from hiding or selling assets, changing insurance, or moving children out of state once FL-110 is served.",
    source: "https://selfhelp.courts.ca.gov/divorce/starting-divorce/automatic-restraining-orders",
    required: true,
    notes: "Violation of ATROs can result in contempt of court findings.",
  },

  // --- Waiting period ---
  {
    id: "ca-timeline",
    category: "Timeline",
    title: "6-Month Waiting Period",
    description: "California requires a minimum 6-month waiting period from the date the respondent is served before a divorce can be finalized. Cal. Fam. Code § 2339.",
    source: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=2339.&lawCode=FAM",
    required: true,
    notes: "The process often takes longer. Start as early as possible.",
  },
];

export const CA_CHECKLIST_META = {
  state: "CA",
  stateName: "California",
  lastVerified: "2026-04-26",
  primarySource: "https://selfhelp.courts.ca.gov/divorce",
  disclaimer:
    "This checklist is educational only. California court requirements vary by county. Consult a licensed California family law attorney.",
};
