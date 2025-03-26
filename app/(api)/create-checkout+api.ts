import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const devUrl = 'http://localhost:8081';

export async function POST(request: Request) {
  if (!STRIPE_SECRET_KEY) {
    return Response.json({ error: 'Missing Stripe secret key' }, { status: 500 });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);

  const body = await request.json();

  console.log('body', body);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: body.priceId,
          quantity: 1,
        },
      ],
      success_url: `${devUrl}/payment-success`,
      cancel_url: `${devUrl}/pricing`,
    });

    return Response.json({ sessionId: session.id, url: session.url }, { status: 200 });
  } catch (error) {
    console.error('Error creating checkout session:', error.message);
    return Response.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
