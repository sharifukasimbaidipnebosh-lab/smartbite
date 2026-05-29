import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  try {
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aed",
            product_data: {
              name: "SmartBite Delivery Service",
            },
            unit_amount: 5000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Stripe session failed" },
      { status: 500 }
    );
  }
}