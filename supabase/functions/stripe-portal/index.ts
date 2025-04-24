import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'stripe';

const clientUrl = 'https://digital-estate.bg/';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST',
      },
    });
  }

  if (!STRIPE_SECRET_KEY) {
    return new Response(JSON.stringify({ error: 'Missing Stripe secret key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  let body;

  try {
    body = await req.json();

    if (!body.stripeUserId) {
      throw new Error('No user id provided');
    }
  } catch (e) {
    return new Response(
      JSON.stringify({
        detail: e instanceof Error ? e.message : 'Empty Body',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const { stripeUserId } = body;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: stripeUserId,
    return_url: clientUrl,
    locale: 'bg',
  });

  return new Response(
    JSON.stringify({
      url: portalSession.url,
    }),
    { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  );
});
