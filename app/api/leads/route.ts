import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const state = String(formData.get("state") ?? "").toUpperCase();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  // Store lead in Supabase via service role (no user auth needed for leads)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    // Fail silently in dev — log for ops
    console.error("[leads] Supabase env not configured");
    return NextResponse.redirect(new URL("/?subscribed=1", req.url));
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/ub_leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: "return=minimal,resolution=ignore-duplicates",
    },
    body: JSON.stringify({
      email,
      state: ["CA", "TX", "NY"].includes(state) ? state : null,
      source: "landing",
      marketing_opt_in: false,
    }),
  });

  if (!res.ok && res.status !== 409) {
    console.error("[leads] Supabase insert failed:", res.status);
  }

  // Redirect back to landing with success flag
  const redirectUrl = new URL("/", req.url);
  redirectUrl.searchParams.set("subscribed", "1");
  return NextResponse.redirect(redirectUrl);
}
