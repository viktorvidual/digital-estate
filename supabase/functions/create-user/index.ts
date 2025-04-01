import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

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

  // Parse request body
  let body;
  try {
    body = await req.json();
    if (!body.email) {
      throw new Error('Email is required');
    }

    if (!body.userId) {
      throw new Error('User ID is required');
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Invalid request body';
    console.error(errorMessage);
    return new Response(
      JSON.stringify({
        error: 'Invalid request',
        details: errorMessage,
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Process the request
  try {
    const { email, userId } = body;

    // TODO: Create Stripe User
    // This section is missing the actual implementation
    const stripeCustomer = await stripe.customers.create({
      email,
    });

    //TODO: Create new user in supabase DB
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        user_id: userId,
        email,
        stripe_customer_id: stripeCustomer.id,
      })
      .select()
      .maybeSingle();

    if (error) throw error;

    // Return success response with the created client data
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Client created successfully',
        user: data,
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
