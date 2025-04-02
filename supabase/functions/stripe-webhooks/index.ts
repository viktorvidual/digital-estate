import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
const ENDPOINT_SECRET = Deno.env.get('STRIPE_WEBHOOKS_SECRET');

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const PRICES = {
  price_1R9PkeG2OXqPrYSShcpB8H4T: {
    photos: 60,
    name: 'Yearly Pro',
  },
  price_1R9PkBG2OXqPrYSSKTyORJjy: {
    photos: 60,
    mame: 'Monthly Pro',
  },
  price_1R9PjfG2OXqPrYSSovzapmXb: {
    photos: 20,
    name: 'Standard Yearly',
  },
  price_1R9PiOG2OXqPrYSSelXUORjC: {
    photos: 20,
    name: 'Standard Monthly',
  },
  price_1R9PeJG2OXqPrYSSNDZi3uzG: {
    photos: 6,
    name: 'Yearly Basic',
  },
  price_1R9PddG2OXqPrYSSIWElH4sb: {
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
      case 'invoice.payment_succeeded':
        try {
          const invoice = event.data.object;

          console.log('invoice payment triggered with status', invoice.status);

          let subscription;

          if (typeof invoice.subscription === 'string') {
            subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          } else {
            subscription = invoice.subscription;
          }

          const customerStripeId = subscription?.customer;

          if (subscription && customerStripeId) {
            const currentPlan = subscription.items.data[0];
            const priceId = currentPlan.price.id;

            const purchasedPhotos = PRICES.hasOwnProperty(priceId)
              ? PRICES[priceId as keyof typeof PRICES].photos
              : 0;

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
                .update({ image_count: newCredits, stripe_subscription_id: subscription.id })
                .eq('id', user.id);

              if (updateError) {
                console.error('Error updating credits:', updateError);
                throw new Error('Failed to update user credits');
              }

              console.log(
                `Updated user ${user.id} credits to ${newCredits} with subscription ${subscription.id}`
              );
            }
          }
        } catch (e) {
          console.error('error in invoice.payment_succeed', e instanceof Error && e.message);
        }

      case 'customer.subscription.updated':
        if (event.data.object.object === 'subscription') {
          try {
            const subscription = event.data.object;
            const customerStripeId = subscription.customer;
            console.log(
              'subscription triggered',
              'status',
              subscription.status,
              'subscription object',
              subscription
            );

            if (subscription && customerStripeId) {
              const { data: user, error: userError } = await supabase
                .from('users')
                .select('id')
                .eq('stripe_customer_id', customerStripeId)
                .single();

              if (userError || !user) {
                console.log('User not found', userError);
                throw new Error('User not found in the database');
              }

              const status = subscription.status;
              console.log('subscription expiry', subscription, subscription.current_period_end);

              const expiry = new Date(subscription.current_period_end * 1000).toISOString();

              let planName = '';
              let planDescription = '';

              try {
                const firstItem = subscription.items?.data?.[0];
                if (firstItem?.price?.product) {
                  const productId = firstItem.price.product;
                  if (typeof productId === 'string') {
                    const productDetails = await stripe.products.retrieve(productId);
                    planName = productDetails?.name || 'Unknown Plan';
                    planDescription = productDetails?.description || '';
                  }
                }
              } catch (e) {
                console.error('Error fetching plan name:', e);
              }

              const { error: updateError } = await supabase
                .from('users')
                .update({
                  stripe_subscription_status: status,
                  stripe_subscription_expire_at: expiry,
                  stripe_plan_name: planName,
                  striple_plan_description: planDescription,
                })
                .eq('stripe_customer_id', customerStripeId);

              if (updateError) {
                console.error('Error updating subscription status:', updateError);
                throw new Error('Failed to update subscription status');
              }

              console.log(
                `Updated user ${user.id} subscription status to ${status} (expires: ${expiry})`
              );
            }
            break;
          } catch (e) {
            console.error('Error subscription update', e instanceof Error ? e.message : e);
          }
        }

      case 'customer.subscription.deleted': {
        //Do I need this? Customer would have
        const subscription = event.data.object;
        const stripeUserId = subscription.customer;
        console.log(`Subscription for user ${stripeUserId} cancelled`);
      }

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
