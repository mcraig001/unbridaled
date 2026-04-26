import { NextRequest, NextResponse } from "next/server";
import { runScenarios, type HouseholdFinancials } from "@/lib/scenario-engine";

export async function POST(req: NextRequest) {
  // Legal gate check
  if (process.env.LEGAL_REVIEW_COMPLETE !== "true") {
    return NextResponse.json({ error: "Service not yet available" }, { status: 503 });
  }

  let inputs: HouseholdFinancials;
  try {
    inputs = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Validate required fields
  const supportedStates = ["CA", "TX", "NY", "WA"];
  if (!supportedStates.includes(inputs.state)) {
    return NextResponse.json({ error: "Unsupported state. Supported: CA, TX, NY, WA" }, { status: 400 });
  }

  if (typeof inputs.yourNetMonthlyIncome !== "number" || inputs.yourNetMonthlyIncome < 0) {
    return NextResponse.json({ error: "yourNetMonthlyIncome must be a non-negative number" }, { status: 400 });
  }

  // Run scenarios (pure computation — no external calls)
  const result = runScenarios(inputs);

  // Audit log (fire and forget)
  logAuditEvent("scenario_run", { state: inputs.state }).catch(() => {});

  return NextResponse.json(result);
}

async function logAuditEvent(action: string, metadata: Record<string, unknown>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return;

  await fetch(`${supabaseUrl}/rest/v1/ub_audit_log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({ action, metadata }),
  });
}
