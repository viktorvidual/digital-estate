import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export async function GET(request: Request) {
  if (!STRIPE_SECRET_KEY) {
    return Response.json({ error: 'Missing Stripe secret key' }, { status: 500 });
  }

  const body = await request.json();
  const { sessionId } = body;

  const stripe = new Stripe(STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return Response.json({ status: session.status }, { status: 200 });

  } catch (error) {
    console.error('Error retrieving session status:', error);
    return Response.json({ error: 'Failed to retrieve session status' }, { status: 500 });
  }
}
