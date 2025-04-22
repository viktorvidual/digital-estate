import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
const ENDPOINT_SECRET = Deno.env.get('STRIPE_WEBHOOKS_SECRET');

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const PRICES = {
  price_1RGb3kG2OXqPrYSSwFrFCOcY: {
    photos: 60,
    name: 'Yearly Pro',
  },
  price_1RGb2DG2OXqPrYSSOaVVvfIN: {
    photos: 60,
    mame: 'Monthly Pro',
  },
  price_1RGaxCG2OXqPrYSS2XjsxCBV: {
    photos: 20,
    name: 'Standard Yearly',
  },
  price_1RGaunG2OXqPrYSSwje4xmrt: {
    photos: 20,
    name: 'Standard Monthly',
  },
  price_1RGapHG2OXqPrYSSrQ9kAmE0: {
    photos: 6,
    name: 'Yearly Basic',
  },
  price_1RGanuG2OXqPrYSSMH9HnmgC: {
    photos: 6,
    name: 'Monthly Basic',
  },
};

Deno.serve(async (request: Request) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const signature = request.headers.get('stripe-signature');

  try {
    if (!signature) {
      throw new Error('No signature or endpoint secret found');
    }

    const body = await request.text();
    const event = await stripe.webhooks.constructEventAsync(body, signature, ENDPOINT_SECRET);

    switch (event.type) {
      case 'invoice.payment_succeeded': {
        try {
          const invoice = event.data.object;
          console.log('Invoice payment triggered with status', invoice.status);

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

            const { data: user, error: userError } = await supabase
              .from('users')
              .select('id, image_count, stripe_subscription_id')
              .eq('stripe_customer_id', customerStripeId)
              .single();

            if (userError || !user) {
              console.error('User not found:', userError);
              throw new Error('User not found in database');
            }

            const newCredits = PRICES[priceId as keyof typeof PRICES]?.photos || 0;
            const isUpdatedSubscription =
              user.stripe_subscription_id && user.stripe_subscription_id !== subscription.id;

            if (isUpdatedSubscription) {
              // Fetch the previous subscription details
              const prevSubscription = await stripe.subscriptions.retrieve(
                user.stripe_subscription_id
              );
              const prevPlan = prevSubscription.items.data[0]?.price?.id;
              const prevCredits = PRICES[prevPlan as keyof typeof PRICES]?.photos || 0;

              console.log(`Previous credits: ${prevCredits}, New credits: ${newCredits}`);

              if (newCredits > prevCredits) {
                // Upgrade → Give the higher credits immediately
                const totalCredits = user.image_count + newCredits - prevCredits;
                await supabase
                  .from('users')
                  .update({
                    image_count: totalCredits,
                    stripe_subscription_id: subscription.id,
                  })
                  .eq('id', user.id);

                console.log(`Upgrade: User ${user.id} now has ${totalCredits} credits`);
              } else {
                // Downgrade → Keep previous credits
                await supabase
                  .from('users')
                  .update({ stripe_subscription_id: subscription.id })
                  .eq('id', user.id);

                console.log(`Downgrade: User ${user.id} keeps ${user.image_count} credits`);
              }
            } else {
              // Renewal → Reset credits
              await supabase
                .from('users')
                .update({ image_count: newCredits, stripe_subscription_id: subscription.id })
                .eq('id', user.id);

              console.log(`Renewal: User ${user.id} credits reset to ${newCredits}`);
            }
          }
        } catch (e) {
          console.error('Error in invoice.payment_succeeded', e instanceof Error ? e.message : e);
        }
        break;
      }

      case 'invoice.payment_failed': {
        //update the status in the db to payment failed
        const invoice = event.data.object;
        console.log(`The payment for invoice ${invoice.id} has failed`);
        break;
      }

      case 'customer.subscription.created':
        if (event.data.object.object === 'subscription') {
          try {
            const subscription = event.data.object;
            const customerStripeId = subscription.customer;

            console.log('Subscription created event triggered', 'status:', subscription.status);

            if (subscription.status === 'active') {
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
                  console.error('Error fetching plan details:', e);
                }

                const { error: updateError } = await supabase
                  .from('users')
                  .update({
                    stripe_subscription_status: status,
                    stripe_subscription_expire_at: expiry,
                    stripe_plan_name: planName,
                    stripe_plan_description: planDescription,
                  })
                  .eq('stripe_customer_id', customerStripeId);

                if (updateError) {
                  console.error('Error updating subscription status:', updateError);
                  throw new Error('Failed to update subscription status');
                }

                console.log(
                  `Updated user ${user.id} subscription status to ${status} in subscription create`
                );
              }
              break;
            }
          } catch (e) {
            console.error(
              'Error handling subscription creation:',
              e instanceof Error ? e.message : e
            );
          }
        }

      case 'customer.subscription.updated':
        if (event.data.object.object === 'subscription') {
          try {
            const subscription = event.data.object;
            const customerStripeId = subscription.customer;
            console.log(' update subscription triggered with status:', subscription.status);

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
              const expiry = new Date(subscription.current_period_end * 1000).toISOString();

              if (status === 'canceled') {
                const { error: updateError } = await supabase
                  .from('users')
                  .update({
                    stripe_subscription_expire_at: new Date().toISOString(),
                    stripe_plan_name: '',
                    stripe_plan_description: '',
                    stripe_subscription_status: subscription.status,
                    image_count: null,
                    stripe_subscription_id: null,
                  })
                  .eq('stripe_customer_id', customerStripeId);

                console.log('subscription cancelled');

                if (updateError) {
                  console.error(updateError.code, updateError.cause, updateError.message);
                }

                break;
              }

              if (status === 'active') {
                let planName = '';
                let planDescription = '';
                let planInterval = '';

                try {
                  const firstItem = subscription.items?.data?.[0];
                  if (firstItem?.price?.product) {
                    const productId = firstItem.price.product;
                    if (typeof productId === 'string') {
                      const productDetails = await stripe.products.retrieve(productId);
                      planName = productDetails?.name || 'Unknown Plan';
                      planDescription = productDetails?.description || '';
                    }
                    planInterval = firstItem.plan.interval;
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
                    stripe_plan_description: planDescription,
                    stripe_plan_interval: planInterval,
                  })
                  .eq('stripe_customer_id', customerStripeId);

                if (updateError) {
                  console.error('Error updating subscription status:', updateError);
                  throw new Error('Failed to update subscription status');
                }

                console.log(
                  `Updated user ${user.id} subscription status to ${status} in subscription update`
                );
              }
            }
          } catch (e) {
            console.error('Error subscription update', e instanceof Error ? e.message : e);
          }

          break;
        }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const stripeUserId = subscription.customer;

        const { error } = await supabase
          .from('users')
          .update({
            stripe_subscription_expire_at: new Date().toISOString(),
            stripe_plan_name: '',
            stripe_plan_description: '',
            stripe_subscription_status: subscription.status,
            image_count: null,
            stripe_subscription_id: null,
          })
          .eq('stripe_customer_id', stripeUserId);

        if (error) {
          console.error(error);
        }

        console.log('subscription deleted');

        break;
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
