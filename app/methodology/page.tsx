import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How we calculate — Unbridaled",
  description:
    "Every formula, every source, explained in plain English. Calculation transparency is core to what we do.",
};

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-stone-900 mb-2">How we calculate</h1>
        <p className="text-stone-500 mb-10">
          Every number in Unbridaled is traceable to a primary source. Here is how each
          calculation works, in plain English.
        </p>

        <div className="prose prose-stone max-w-none text-sm leading-relaxed">
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">
              Spousal support (alimony)
            </h2>

            <h3 className="font-semibold text-stone-800 mb-2">California</h3>
            <p className="text-stone-600 mb-2">
              For temporary support (while the divorce is pending), most California counties use
              the <strong>Santa Clara formula</strong>:{" "}
              <code className="bg-stone-100 px-1.5 py-0.5 rounded text-xs">
                40% of higher earner's net income − 50% of lower earner's net income
              </code>
            </p>
            <p className="text-stone-600 mb-2">
              For long-term support, there is no formula — a judge applies 14 factors from{" "}
              <a
                href="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=FAM&sectionNum=4320."
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                California Family Code § 4320
              </a>
              . We show a range (±30%) to reflect this uncertainty.
            </p>

            <h3 className="font-semibold text-stone-800 mb-2 mt-4">Texas</h3>
            <p className="text-stone-600 mb-2">
              Texas has strict eligibility gates — the marriage must be at least 10 years, or
              there must be documented family violence or disability. If eligible, the amount is
              the <strong>lesser of $5,000/month or 20% of the payer's gross monthly income</strong>
              , per{" "}
              <a
                href="https://statutes.capitol.texas.gov/docs/fa/pdf/fa.8.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Texas Family Code § 8.055
              </a>
              .
            </p>

            <h3 className="font-semibold text-stone-800 mb-2 mt-4">New York</h3>
            <p className="text-stone-600 mb-2">
              New York uses a two-step formula, taking the lower of:
            </p>
            <ul className="list-disc list-inside text-stone-600 mb-2 space-y-1">
              <li>
                <code className="bg-stone-100 px-1.5 py-0.5 rounded text-xs">
                  30% of higher earner's income − 20% of lower earner's income
                </code>
              </li>
              <li>
                <code className="bg-stone-100 px-1.5 py-0.5 rounded text-xs">
                  40% of combined income − lower earner's income
                </code>
              </li>
            </ul>
            <p className="text-stone-600">
              Income above $228,000 is handled at judicial discretion. Source:{" "}
              <a
                href="https://ww2.nycourts.gov/divorce/MaintenanceChildSupportTools.shtml"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                NY Courts official calculator
              </a>
              .
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">Child support</h2>

            <h3 className="font-semibold text-stone-800 mb-2">California</h3>
            <p className="text-stone-600 mb-2">
              California uses a complex guideline formula:{" "}
              <code className="bg-stone-100 px-1.5 py-0.5 rounded text-xs">
                CS = K × [HN − (H% × TN)]
              </code>{" "}
              where K is an income allocation factor, HN is the high earner's net monthly income,
              H% is the high earner's custodial time, and TN is combined net income. We approximate
              K — the official calculator at{" "}
              <a
                href="https://childsupport.ca.gov/guideline-calculator/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                childsupport.ca.gov
              </a>{" "}
              gives the exact amount.
            </p>

            <h3 className="font-semibold text-stone-800 mb-2 mt-4">Texas</h3>
            <p className="text-stone-600 mb-2">
              Texas applies a percentage of the paying parent's net monthly resources:{" "}
              <strong>20% (1 child), 25% (2), 30% (3), 35% (4), 40% (5+)</strong>. The income
              cap was updated to $11,700/month net resources effective September 1, 2025. Source:{" "}
              <a
                href="https://statutes.capitol.texas.gov/GetStatute.aspx?Code=FA&Value=154.125"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Texas Family Code § 154.125
              </a>
              .
            </p>

            <h3 className="font-semibold text-stone-800 mb-2 mt-4">New York</h3>
            <p className="text-stone-600 mb-2">
              New York applies CSSA percentages to combined parental income up to $183,000 (March
              2024–February 2026): <strong>17% (1 child), 25% (2), 29% (3), 31% (4), 35%
              (5+)</strong>. Each parent pays a pro-rata share based on their income. Source:{" "}
              <a
                href="https://childsupport.ny.gov/pdfs/CSSA.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                CSSA chart LDSS-4515 Rev. 03/26
              </a>
              .
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">Property division</h2>
            <p className="text-stone-600 mb-2">
              <strong>California:</strong> Community property — all assets and debts acquired
              during marriage split 50/50. (
              <a
                href="https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=FAM&sectionNum=760."
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                CA Family Code § 760
              </a>
              )
            </p>
            <p className="text-stone-600 mb-2">
              <strong>Texas:</strong> Community property with "just and right" division — presumed
              equal but courts can deviate based on fault and circumstances. (
              <a
                href="https://statutes.capitol.texas.gov/GetStatute.aspx?Code=FA&Value=7.001"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                TX Family Code § 7.001
              </a>
              )
            </p>
            <p className="text-stone-600 mb-2">
              <strong>New York:</strong> Equitable distribution — NOT automatically 50/50. Judges
              consider 14 factors including marriage length, contributions, and economic
              circumstances. (
              <a
                href="https://www.nysenate.gov/legislation/laws/DOM/236"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                NY DRL § 236(B)(5)
              </a>
              )
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-stone-900 mb-4">Housing costs</h2>
            <p className="text-stone-600 mb-2">
              We use{" "}
              <a
                href="https://www.huduser.gov/portal/datasets/fmr.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                HUD Fair Market Rents (FY2025)
              </a>{" "}
              as a baseline for rental cost estimates. These are the 40th percentile rents by
              county, published annually by the U.S. Department of Housing and Urban Development
              for the Housing Choice Voucher program.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-stone-900 mb-4">Important caveats</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 text-sm text-amber-800">
              <p className="font-medium mb-2">Courts have significant discretion.</p>
              <p>
                Every formula in this report is a starting point, not a prediction. Judges apply
                them differently based on the specific facts of each case. Actual outcomes may
                vary substantially from these projections.
              </p>
              <p className="mt-2">
                <strong>
                  Consult a licensed family law attorney and financial advisor before making any
                  decisions based on these scenarios.
                </strong>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
