import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

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

    if (!body.addFurniture === undefined) {
      throw new Error('No addFurniture provided');
    }
    if (body.removeFurniture === undefined) {
      throw new Error('No removeFurniture provided');
    }
    if (body.addVirtuallyStagedWatermark === undefined) {
      throw new Error('No addVirtuallyStagedWatermark provided');
    }
    if (body.addFurniture && !body.style === undefined) {
      throw new Error('Add furniture selected, but No style provided'); // Fixed error message
    }
    if (!body.roomType === undefined) {
      throw new Error('No roomType provided');
    }
    if (!body.imageUrl === undefined) {
      throw new Error('No imageUrl provided');
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

  return new Response(JSON.stringify({ data: body }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
});
