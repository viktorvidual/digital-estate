import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');

Deno.serve(async (req: Request) => {
  // Define CORS headers once
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST',
      },
    });
  }

  // Check for Stripe key
  if (!STRIPE_SECRET_KEY) {
    return new Response(JSON.stringify({ error: 'Missing Stripe Key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  let accessToken;

  // Validate authorization header
  try {
    const authorization = req.headers.get('authorization');
    if (!authorization) {
      throw new Error('No bearer token in the headers');
    }
    // Note: You're not using the accessToken variable anywhere -
    // Either extract the token from authorization or remove this section
    accessToken = authorization.split(' ')[1];
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'No access token provided';
    console.error('Error in authentication:', errorMessage);
    return new Response(
      JSON.stringify({
        error: 'Authentication failed',
        details: errorMessage,
      }),
      {
        status: 401, // Using 401 for auth errors instead of 500
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }

  // Parse request body
  let body;
  try {
    body = await req.json();
    if (!body.email) {
      throw new Error('Email is required');
    }
  } catch (e) {
    console.error('Failed to parse request body', e);
    return new Response(
      JSON.stringify({
        error: 'Invalid request',
        details: e instanceof Error ? e.message : 'Invalid JSON in request body',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);

  // Process the request
  try {
    const { email } = body;
    console.log('User created successfully', email);

    // TODO: Create Stripe User
    // This section is missing the actual implementation

    const stripeCustomer = await stripe.customers.create({
      email,
    });

    console.log('created stripe customer', stripeCustomer.id);

    // Return success response
    return new Response(
      JSON.stringify({
        message: 'User created successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error) {
    console.error('Error processing request:', error instanceof Error ? error.message : error);
    return new Response(
      JSON.stringify({
        error: 'Request processing failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
