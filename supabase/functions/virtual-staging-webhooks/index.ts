import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const VIRTUAL_STAGING_API_KEY = Deno.env.get('VIRTUAL_STAGING_API_KEY');

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

type VariationResponse = {
  id: string;
  type: 'staging';
  render_id: string;
  created_at: number;
  status: 'queued' | 'rendering' | 'completed' | 'failed';
  result: {
    url: string;
    optimized_url: string;
    thumbnail_url: string;
  };
  base_variation_id: string;
  eta: number;
  config: {
    type: 'legacy_staging';
    room_type: string;
    style: string;
  };
};

type Render = {
  base_variation_status: 'pending' | 'uploading' | 'done' | 'error';
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

      //fetch render details
      const { error: getRenderError, data: renderData } = await supabaseAdmin
        .from('renders')
        .select('base_variation_status')
        .eq('render_id', event.render_id)
        .single();

      if (getRenderError || !renderData) {
        console.log('Error fetching render details:', getRenderError);

        throw new Error(
          'Unable to fetch render during registration of a new variation' + getRenderError.message
        );
      }

      const { base_variation_status } = renderData as Render;

      //Add base variation if it exists and is not already set
      if (
        (base_variation_status === 'pending' || base_variation_status === 'error') &&
        event.base_variation_id
      ) {
        try {
          const baseFilePath = `${userId}/${event.base_variation_id}`;

          //set status to uploading
          const { error: updateRenderError } = await supabaseAdmin
            .from('renders')
            .update({ base_variation_status: 'uploading' })
            .eq('render_id', event.render_id);

          if (updateRenderError) {
            throw new Error(
              'Error updating render status to uploading: ' + updateRenderError.message
            );
          }

          //check if base has been already uploaded
          const { error: checkError } = await supabaseAdmin.storage
            .from('images')
            .createSignedUrl(baseFilePath, 60); // expires in 60s

          const fileAlreadyExists = checkError === null;

          console.log('Render status updated to uploading for render_id:', event.render_id);

          //upload base image to supabase if it doesn't already exist
          if (!fileAlreadyExists) {
            //fetch base variation details for virtual stagin
            const baseVariationRes = await fetch(
              `https://api.virtualstagingai.app/v2/renders/${event.render_id}/variations/${event.base_variation_id}`,
              {
                method: 'GET',
                headers: {
                  Authorization: `Api-Key ${VIRTUAL_STAGING_API_KEY}`,
                  Accept: '*/*',
                },
              }
            );

            if (!baseVariationRes.ok) {
              throw new Error('Failed to fetch base variation details');
            }

            const baseVariationData: VariationResponse = await baseVariationRes.json();
            console.log('Base variation details fetched:', baseVariationData);

            const { error: baseImageError } = await supabaseAdmin.storage
              .from('images')
              .upload(
                baseFilePath,
                await fetch(baseVariationData.result.url).then(res => res.blob())
              );

            if (baseImageError) {
              throw new Error('Error uploading base image to storage: ' + baseImageError.message);
            }
            console.log('Base image uploaded to storage for variation', baseVariationData.id);
          }

          //update variations row
          const basePublicUrl = supabaseAdmin.storage.from('images').getPublicUrl(baseFilePath)
            .data.publicUrl;
          console.log('Base image public url ', basePublicUrl);

          const { error: patchBaseVariationError } = await supabaseAdmin
            .from('variations')
            .update({
              status: 'done',
              url: basePublicUrl,
              file_path: baseFilePath,
              base_variation_id: event.base_variation_id,
            })
            .eq('render_id', event.render_id)
            .eq('is_base', true);

          if (patchBaseVariationError) {
            throw new Error(
              'Error saving base variation image to DB: ' + patchBaseVariationError.message
            );
          }

          //set render.base_variation_status to done or error
          const { error: updateRenderStatusError } = await supabaseAdmin
            .from('renders')
            .update({ base_variation_status: 'done' })
            .eq('render_id', event.render_id);

          if (updateRenderStatusError) {
            throw new Error(
              'Error updating render status to done: ' + updateRenderStatusError.message
            );
          }
          console.log('Render status updated to done for render_id:', event.render_id);
        } catch (error) {
          //set status to error
          const { error: updateRenderError } = await supabaseAdmin
            .from('renders')
            .update({ base_variation_status: 'error' })
            .eq('render_id', event.render_id);

          if (updateRenderError) {
            console.error('Error updating render status to error:', updateRenderError);
          }

          console.error(
            error instanceof Error ? error.message : 'Error fetching base variation details:'
          );
        }
      } else {
        console.log(
          'Base variation already set or not required, skipping base variation upload for render_id:',
          event.render_id
        );
      }

      //uploadImage complete variation to supabase storage
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
