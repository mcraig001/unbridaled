// Resend email templates for Unbridaled
// Usage: import { buildEmail } from "@/lib/email/templates"
// All templates: plain text fallback + HTML, no tracking pixels

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://getunbridaled.com";

function baseHtml(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fafaf9; margin: 0; padding: 32px 16px; color: #1c1917; }
  .card { background: white; border: 1px solid #e7e5e4; border-radius: 8px; max-width: 520px; margin: 0 auto; padding: 40px 36px; }
  .logo { font-size: 15px; font-weight: 600; color: #1c1917; margin-bottom: 32px; letter-spacing: -0.02em; }
  h1 { font-size: 20px; font-weight: 600; margin: 0 0 12px; }
  p { font-size: 14px; line-height: 1.6; color: #44403c; margin: 0 0 16px; }
  .btn { display: inline-block; background: #1c1917; color: white; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 500; text-decoration: none; margin: 8px 0 24px; }
  .note { font-size: 12px; color: #78716c; line-height: 1.5; margin-top: 24px; padding-top: 24px; border-top: 1px solid #e7e5e4; }
  .disclaimer { font-size: 11px; color: #a8a29e; margin-top: 12px; }
</style>
</head>
<body>
<div class="card">
  <div class="logo">Unbridaled</div>
  ${content}
  <p class="disclaimer">Not financial, legal, or tax advice. Consult a licensed attorney and financial advisor.</p>
</div>
</body>
</html>`;
}

// --- Welcome email ---

export function buildWelcomeEmail(email: string) {
  const subject = "You're in — here's how to start";
  const html = baseHtml(`
    <h1>Welcome to Unbridaled</h1>
    <p>You now have access to financial scenario planning built specifically for your situation. Every number is sourced from official state statutes and explained.</p>
    <p>Start by answering a few questions about your household — takes about 5 minutes.</p>
    <a href="${APP_URL}/intake" class="btn">Start my scenarios</a>
    <p>A few things to know:</p>
    <ul style="font-size:14px; color:#44403c; line-height:1.8; padding-left:20px; margin:0 0 16px;">
      <li>Your financial inputs stay in your browser until you save them</li>
      <li>Every formula is explained and sourced</li>
      <li>Use the Quick Exit button (top right) anytime to leave immediately</li>
    </ul>
    <p class="note">
      You received this because you created an account at Unbridaled. If this wasn't you, ignore this email — no action needed.
    </p>
  `);

  const text = `Welcome to Unbridaled.

You now have access to financial scenario planning built for your situation.

Start here: ${APP_URL}/intake

A few things to know:
- Your financial inputs stay in your browser until you save them
- Every formula is explained and sourced
- Use the Quick Exit button (top right) anytime to leave immediately

Not financial, legal, or tax advice. Consult a licensed attorney and financial advisor.

If this wasn't you, ignore this email.`;

  return { to: email, subject, html, text };
}

// --- Email verification ---

export function buildVerifyEmail(email: string, verifyUrl: string) {
  const subject = "Verify your Unbridaled email";
  const html = baseHtml(`
    <h1>Verify your email</h1>
    <p>Click the button below to verify your email address. This link expires in 24 hours.</p>
    <a href="${verifyUrl}" class="btn">Verify email</a>
    <p class="note">
      If you didn't create an Unbridaled account, ignore this email. The link will expire on its own.
    </p>
  `);

  const text = `Verify your Unbridaled email.

Click this link to verify (expires in 24 hours):
${verifyUrl}

If you didn't create an account, ignore this email.`;

  return { to: email, subject, html, text };
}

// --- Scenario ready email ---

export function buildScenarioReadyEmail(
  email: string,
  scenarioState: string,
  scenarioCount: number
) {
  const subject = "Your financial scenarios are ready";
  const html = baseHtml(`
    <h1>Your ${scenarioCount} scenarios are ready</h1>
    <p>Your financial scenario projections for <strong>${scenarioState}</strong> have been calculated and saved to your account.</p>
    <p>Each scenario shows projected monthly income, expenses, and financial runway based on the numbers you entered and official state formulas.</p>
    <a href="${APP_URL}/results" class="btn">View my scenarios</a>
    <p>You can also download a PDF report to share with your attorney or financial advisor.</p>
    <p class="note">
      Every formula is sourced from official state statutes. Courts have significant discretion — these are estimates, not guarantees. Work with a licensed family law attorney before making any decisions.
    </p>
  `);

  const text = `Your ${scenarioCount} financial scenarios for ${scenarioState} are ready.

View them here: ${APP_URL}/results

You can also download a PDF report for your attorney or financial advisor.

Every formula is sourced from official state statutes. Courts have discretion — these are estimates, not guarantees. Consult a licensed attorney.

Not financial, legal, or tax advice.`;

  return { to: email, subject, html, text };
}

// --- Account deletion confirmed ---

export function buildDeletionConfirmedEmail(email: string) {
  const subject = "Your Unbridaled account has been deleted";
  const html = baseHtml(`
    <h1>Account deleted</h1>
    <p>Your Unbridaled account and all associated data have been permanently deleted. This includes:</p>
    <ul style="font-size:14px; color:#44403c; line-height:1.8; padding-left:20px; margin:0 0 16px;">
      <li>Your scenario inputs and results</li>
      <li>Any saved PDF reports</li>
      <li>Your bank connection data (Plaid access revoked)</li>
      <li>Your account credentials</li>
    </ul>
    <p>If you change your mind, you can create a new account at any time.</p>
    <p class="note">
      This is a one-time confirmation. You will not receive further emails from Unbridaled unless you create a new account.
    </p>
  `);

  const text = `Your Unbridaled account has been permanently deleted.

Deleted data includes:
- Your scenario inputs and results
- Any saved PDF reports
- Bank connection data (Plaid access revoked)
- Your account credentials

You will not receive further emails from Unbridaled unless you create a new account.`;

  return { to: email, subject, html, text };
}

// --- Send helper ---

export async function sendEmail(payload: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[unbridaled-email] RESEND_API_KEY not configured — skipping send");
    return;
  }

  const from = process.env.EMAIL_FROM ?? "Unbridaled <noreply@getunbridaled.com>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend API error ${res.status}: ${body}`);
  }

  return res.json();
}
