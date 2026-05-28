import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const stripe = getStripe();

  const body = await req.json();

  // your payment logic here
  return Response.json({ success: true });
}