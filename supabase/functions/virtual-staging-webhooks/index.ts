import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

Deno.serve(async (req: Request) => {
  let body;

  try {
    body = await req.json();
    if (!body) {
      throw new Error('No image url provided');
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Invalid request body';
    console.log(errorMessage);

    return new Response(
      JSON.stringify({
        error: 'Invalid request',
        details: errorMessage,
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const eventType = body.event_type;
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  switch (eventType) {
    case 'analysis_completion': {
      const url = new URL(req.url);
      const maskId = url.searchParams.get('maskId');
      console.log('analysis completed', 'maskId', maskId, body.result_url);

      const { error } = await supabaseAdmin
        .from('masks')
        .update({
          mask_id: maskId,
          status: 'success',
          url: body.result_url,
        })
        .eq('mask_id', maskId);

      if (error) throw error;
    }

    case 'analysis_error': {
      const url = new URL(req.url);
      const maskId = url.searchParams.get('maskId');
      const errorMessage = body.error_message;
      if (errorMessage) {
        const { error } = await supabaseAdmin.from('masks').insert({
          mask_id: maskId,
          status: 'error',
          error_message: errorMessage,
          url: '',
        });

        if (error) throw error;
      }
    }
  }

  return new Response(null, {
    status: 200,
  });
});
