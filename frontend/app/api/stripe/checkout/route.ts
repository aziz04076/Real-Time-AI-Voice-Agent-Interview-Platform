import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || stripeKey === "your_stripe_key") {
      return NextResponse.json(
        { error: "Stripe is not configured yet. Please configure STRIPE_SECRET_KEY in environment variables." },
        { status: 503 }
      );
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-02-24-preview" as any,
    });

    const { userId, email } = await req.json();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID || "price_H5ggY9K2x6x6x6",
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?status=success`,
      cancel_url: `${baseUrl}/pricing?status=cancelled`,
      metadata: { userId },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
