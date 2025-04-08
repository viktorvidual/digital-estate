import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { createClient } from '@supabase/supabase-js';

const VIRTUAL_STAGING_API_KEY = Deno.env.get('VIRTUAL_STAGING_API_KEY');
const VIRTAUL_STAGING_WEBHOOKS_URL = Deno.env.get('VIRTAUL_STAGING_WEBHOOKS_URL');

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

Deno.serve(async (req: Request) => {
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

  let body;

  try {
    body = await req.json();

    if (!body.imageUrl) {
      throw new Error('No image url provided');
    } else if (!body.maskId) {
      throw new Error('No mask id provided');
    } else if (!body.userId) {
      throw new Error('No user id provided');
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

  const { imageUrl, maskId, userId } = body;

  try {
    fetch('https://api.virtualstagingai.app/v2/analyze', {
      method: 'POST',
      headers: {
        Authorization: `Api-key ${VIRTUAL_STAGING_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        webhook_url: `${VIRTAUL_STAGING_WEBHOOKS_URL}?maskId=${maskId}`,
      }),
    });

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { error } = await supabaseAdmin.from('masks').insert({
      mask_id: maskId,
      user_id: userId,
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({
        data: 'Mask request successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
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
});
