import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.json();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: body.amount,
    currency: "aed",
    automatic_payment_methods: {
      enabled: true,
    },
    capture_method: "manual", // Uber-style hold first
  });

  return Response.json({
    clientSecret: paymentIntent.client_secret,
  });
}