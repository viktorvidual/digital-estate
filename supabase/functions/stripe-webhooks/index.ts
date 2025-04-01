import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
const ENDPOINT_SECRET = 'whsec_57e32b33306f6776c3e50d88000c993942a5ad445fe6c0e4212d143aa2d765ef';

Deno.serve(async (request: Request) => {
  if (!STRIPE_SECRET_KEY) {
    return new Response(JSON.stringify({ error: 'Missing Stripe secret key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);

  const signature = request.headers.get('stripe-signature');

  try {
    if (!signature || !ENDPOINT_SECRET) {
      throw new Error('No signature or endpoint secret found');
    }

    const body = await request.text();
    const event = await stripe.webhooks.constructEventAsync(body, signature, ENDPOINT_SECRET);

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // TODO: Implement your database logic here using Supabase client
        console.log('Payment succeeded:', paymentIntent.id);
        break;

      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        console.log('Payment method attached:', paymentMethod.id);
        break;

      // Add other event types as needed
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
