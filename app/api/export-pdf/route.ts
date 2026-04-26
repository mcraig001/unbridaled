import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { ScenarioPDF } from "@/components/ScenarioPDF";
import type { ScenarioResult } from "@/lib/scenario-engine";
import type { DocumentProps } from "@react-pdf/renderer";

export async function POST(req: NextRequest) {
  if (process.env.LEGAL_REVIEW_COMPLETE !== "true") {
    return NextResponse.json({ error: "Service not yet available" }, { status: 503 });
  }

  let scenarioResult: ScenarioResult;
  try {
    scenarioResult = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // TODO: Check Stripe subscription tier (gated to Frontend/Core)
  // For now, generate PDF without paywall check (will be added in Phase 4)

  try {
    // ScenarioPDF renders a Document — cast needed for renderToBuffer type signature
    const element = React.createElement(ScenarioPDF, { result: scenarioResult });
    const buffer = await renderToBuffer(element as React.ReactElement<DocumentProps>);

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="unbridaled-scenarios-${scenarioResult.state}-${new Date().toISOString().slice(0, 10)}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "PDF generation failed";
    console.error("[export-pdf]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
