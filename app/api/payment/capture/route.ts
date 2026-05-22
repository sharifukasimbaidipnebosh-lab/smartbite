import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.json();

  await stripe.paymentIntents.capture(body.paymentIntentId);

  return Response.json({
    success: true,
  });
}