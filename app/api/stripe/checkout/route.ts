import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      mode: "payment",

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

      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,

      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Stripe checkout failed" },
      { status: 500 }
    );
  }
}