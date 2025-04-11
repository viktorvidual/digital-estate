import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

type DoneResponse = {
  render_id: string; // the parent render id
  variation_id: string;
  variation_type: 'staging';
  base_variation_id?: string; // optional, if using a base variation from a removal
  timestamp: number; // Unix timestamp in milliseconds
  event_type: 'done';
  result: {
    url: string; // URL of the result image
    optimized_url: string; // URL of the optimized result image
    thumbnail_url: string; // URL of the thumbnail image
  };
};

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

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

  switch (eventType) {
    case 'analysis_completion': {
      const url = new URL(req.url);
      const maskId = url.searchParams.get('maskId');

      if (!maskId) {
        throw new Error('No maskId provided in the URL');
      }

      const { error } = await supabaseAdmin
        .from('masks')
        .update({
          mask_id: maskId,
          status: 'success',
          url: body.result_url,
        })
        .eq('mask_id', maskId);

      if (error) throw error;

      console.log('analysis completed', 'maskId', maskId, body.result_url);
      break;
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
      break;
    }

    case 'done': {
      const url = new URL(req.url);
      const userId = url.searchParams.get('userId');

      if (!userId) {
        throw new Error('No userId provided in the URL');
      }

      const event = body as DoneResponse;
      const variationId = event.variation_id;
      const filePath = `${userId}/${event.variation_id}`;

      //uploadImage to supabase storage
      const { error: imageError } = await supabaseAdmin.storage
        .from('images')
        .upload(filePath, await fetch(event.result.url).then(res => res.blob()));

      if (imageError) {
        throw new Error('Error uploading image to storage: ' + imageError.message);
      }
      console.log('Image uploaded to storage for variantion', variationId);

      const publicUrl = supabaseAdmin.storage.from('images').getPublicUrl(filePath).data.publicUrl;
      console.log('image public url ', publicUrl);

      //insert into renders table
      const { error: renderError } = await supabaseAdmin
        .from('variations')
        .update([
          {
            status: 'done',
            url: publicUrl,
            base_variation_id: body.base_variation_id ?? null,
            file_path: filePath,
          },
        ])
        .eq('variation_id', variationId);

      if (renderError) {
        throw new Error('Error saving image to DB: ' + renderError.message);
      }

      console.log('Image saved to DB: ');
      break;
    }

    case 'error': {
      const url = new URL(req.url);
      const userId = url.searchParams.get('userId');
      const variationId = url.searchParams.get('variationId');
      const errorMessage = body.error_message;
      if (!userId) {
        throw new Error('No userId provided in the URL');
      }
      if (!variationId) {
        throw new Error('No variationId provided in the URL');
      }
      if (errorMessage) {
        const { error } = await supabaseAdmin
          .from('variations')
          .update({
            status: 'error',
            error_message: errorMessage,
          })
          .eq('variation_id', variationId);

        if (error) throw error;
      }
      console.log('error event', body);
    }

    case 'update': {
      console.log('update event', body);
      break;
    }
  }

  return new Response(null, {
    status: 200,
  });
});
