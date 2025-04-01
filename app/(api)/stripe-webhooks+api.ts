import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const ENDPOINT_SECRET = 'whsec_57e32b33306f6776c3e50d88000c993942a5ad445fe6c0e4212d143aa2d765ef';

export async function POST(request: Request) {
  if (!STRIPE_SECRET_KEY) {
    return Response.json({ error: 'Missing Stripe secret key' }, { status: 500 });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const signature = request.headers.get('stripe-signature');

  let event;

  try {
    if (!signature) {
      throw new Error('No signature found');
    }

    event = stripe.webhooks.constructEvent(await request.text(), signature, ENDPOINT_SECRET);
    console.log('signature verified');
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Unable to verify webhook endpoint' },
      { status: 500 }
    );
  }

  console.log(event.type);

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      console.log('payment intent succeeded', paymentIntent.amount, paymentIntent.currency);

      //retrieve price id from payment intent

      //write to database that the user has successfully paid for the subscription

      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    // ... handle other event types

    // default:
    //   console.log(`Unhandled event type ${event.type}`);
  }

  return Response.json({ received: true }, { status: 200 });
}
