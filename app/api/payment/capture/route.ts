import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { paymentIntentId } = await req.json();

    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId
    );

    return NextResponse.json({
      status: paymentIntent.status,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}