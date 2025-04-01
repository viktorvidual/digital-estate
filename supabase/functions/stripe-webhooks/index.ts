import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
const ENDPOINT_SECRET = Deno.env.get('STRIPE_WEBHOOKS_SECRET');

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const prices = {
  price_1R6vPpG2OXqPrYSSs4S8OPKB: {
    photos: 6,
    name: 'Yearly Basic',
  },
  price_1R6v8SG2OXqPrYSSo9Y82HQT: {
    photos: 60,
    name: 'Yearly Pro',
  },
  price_1R6v6tG2OXqPrYSSmPgFZiJl: {
    photos: 60,
    mame: 'Monthly Pro',
  },
  price_1R6v64G2OXqPrYSSg67QbnUA: {
    photos: 20,
    name: 'Standard Yearly',
  },
  price_1R6v52G2OXqPrYSSrRPCqvqD: {
    photos: 20,
    name: 'Standard Monthly',
  },
  price_1R6v3mG2OXqPrYSSVzSyONHu: {
    photos: 6,
    name: 'Yearly Basic',
  },
  price_1R6sl4G2OXqPrYSSvazdo4gk: {
    photos: 6,
    name: 'Monthly Basic',
  },
};

Deno.serve(async (request: Request) => {
  if (!STRIPE_SECRET_KEY) {
    return new Response(JSON.stringify({ error: 'Missing Stripe secret key' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const signature = request.headers.get('stripe-signature');

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

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

      case 'checkout.session.completed':
        const session = event.data.object;
        const customerStripeId = session.customer;
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

        const purchase = lineItems.data[0];

        if (purchase.price) {
          const priceId = purchase.price.id;
          const purchasedPhotos = prices[priceId]?.photos || 0;
          const subscriptionId = session.subscription;

          if (purchasedPhotos > 0) {
            const { data: user, error: userError } = await supabase
              .from('users')
              .select('id, image_count')
              .eq('stripe_customer_id', customerStripeId)
              .single();

            if (userError || !user) {
              console.error('User not found:', userError);
              throw new Error('User not found in database');
            }

            // Update the user's remaining photo credits
            const newCredits = (user.image_count || 0) + purchasedPhotos;

            const { error: updateError } = await supabase
              .from('users')
              .update({ image_count: newCredits, stripe_subscription_id: subscriptionId })
              .eq('id', user.id);

            if (updateError) {
              console.error('Error updating credits:', updateError);
              throw new Error('Failed to update user credits');
            }

            console.log(`Updated user ${user.id} credits to ${newCredits}`);
          }
        }

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
