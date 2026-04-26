import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

type Tier = "frontend" | "core";
type Interval = "month" | "year";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  return new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
}

const PRICE_MAP: Record<Tier, Record<Interval, number>> = {
  frontend: { month: 999, year: 9900 },   // $9.99/mo, $99/yr
  core: { month: 2999, year: 29900 },      // $29.99/mo, $299/yr
};

export async function POST(req: NextRequest) {
  const { tier, interval, userId } = await req.json() as {
    tier: Tier;
    interval: Interval;
    userId?: string;
  };

  if (!["frontend", "core"].includes(tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }
  if (!["month", "year"].includes(interval)) {
    return NextResponse.json({ error: "Invalid interval" }, { status: 400 });
  }

  const stripe = getStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const productId =
    tier === "core"
      ? process.env.STRIPE_CORE_PRODUCT_ID
      : process.env.STRIPE_FRONTEND_PRODUCT_ID;

  // Create a price on the fly if product IDs aren't configured (dev mode)
  let priceId: string | undefined;
  if (productId) {
    // Look for existing price for this product+interval
    const prices = await stripe.prices.list({
      product: productId,
      active: true,
      recurring: { interval },
      limit: 1,
    });
    priceId = prices.data[0]?.id;
  }

  // Fallback: create an inline price (for development without product IDs configured)
  const priceData = !priceId
    ? {
        currency: "usd",
        unit_amount: PRICE_MAP[tier][interval],
        recurring: { interval },
        ...(productId ? { product: productId } : {
          product_data: {
            name: `Unbridaled ${tier === "core" ? "Complete" : "Essential"}`,
          },
        }),
      }
    : undefined;

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    line_items: [
      priceId
        ? { price: priceId, quantity: 1 }
        : { price_data: priceData as Stripe.Checkout.SessionCreateParams["line_items"] extends Array<infer T> ? T extends { price_data?: infer PD } ? NonNullable<PD> : never : never, quantity: 1 },
    ],
    success_url: `${appUrl}/intake?checkout=success`,
    cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    subscription_data: {
      trial_period_days: 14, // 14-day trial, no credit card required for free tier
      metadata: { tier, userId: userId ?? "" },
    },
    metadata: { tier, userId: userId ?? "" },
    allow_promotion_codes: true,
  };

  const session = await stripe.checkout.sessions.create(sessionParams);

  return NextResponse.json({ url: session.url });
}
