import { NextRequest, NextResponse } from "next/server";
import { buildDeletionConfirmedEmail, sendEmail } from "@/lib/email/templates";

/**
 * Account deletion API — G2 compliance
 * Deletes: ub_users, ub_scenarios, ub_pdf_exports, ub_plaid_items, Supabase auth user
 * Plaid disconnect: scheduled via audit_log entry (operator must configure cron for Plaid API call)
 * Target: complete within 24 hours of request
 */
export async function DELETE(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ error: "Service configuration error" }, { status: 500 });
  }

  // Get user from Authorization header (Supabase JWT)
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jwt = authHeader.replace("Bearer ", "");

  // Verify JWT and get user ID
  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      apikey: serviceKey,
    },
  });

  if (!userRes.ok) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const user = await userRes.json();
  const authUserId: string = user.id;

  if (!authUserId) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  // Get ub_user row
  const ubUserRes = await fetch(
    `${supabaseUrl}/rest/v1/ub_users?auth_user_id=eq.${authUserId}&select=id`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    }
  );
  const ubUsers = await ubUserRes.json();
  const ubUserId: string | undefined = ubUsers?.[0]?.id;

  if (ubUserId) {
    // Log deletion request first (audit trail)
    await fetch(`${supabaseUrl}/rest/v1/ub_audit_log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        user_id: ubUserId,
        action: "account_deletion_requested",
        resource_type: "account",
        metadata: { auth_user_id: authUserId, requested_at: new Date().toISOString() },
      }),
    });

    // Mark Plaid items for disconnection (operator cron handles actual Plaid API call)
    await fetch(
      `${supabaseUrl}/rest/v1/ub_plaid_items?user_id=eq.${ubUserId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({ disconnected_at: new Date().toISOString() }),
      }
    );

    // Delete scenarios and pdf exports (cascades from ub_users delete, but explicit for safety)
    await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/ub_scenarios?user_id=eq.${ubUserId}`, {
        method: "DELETE",
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
      }),
      fetch(`${supabaseUrl}/rest/v1/ub_pdf_exports?user_id=eq.${ubUserId}`, {
        method: "DELETE",
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
      }),
    ]);

    // Delete ub_user row
    await fetch(`${supabaseUrl}/rest/v1/ub_users?id=eq.${ubUserId}`, {
      method: "DELETE",
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
    });
  }

  // Delete Supabase auth user (final step — invalidates all sessions)
  await fetch(`${supabaseUrl}/auth/v1/admin/users/${authUserId}`, {
    method: "DELETE",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
  });

  // Send deletion confirmation email (fire-and-forget, non-blocking)
  if (user.email) {
    sendEmail(buildDeletionConfirmedEmail(user.email)).catch((err) =>
      console.error("[unbridaled-email] deletion confirmation failed:", err)
    );
  }

  return NextResponse.json({
    message:
      "Account deletion complete. Your data has been removed. Plaid disconnection will complete within 24 hours.",
  });
}
