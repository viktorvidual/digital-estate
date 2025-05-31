import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { createClient } from '@supabase/supabase-js';

const VIRTUAL_STAGING_API_KEY = Deno.env.get('VIRTUAL_STAGING_API_KEY');
const VIRTAUL_STAGING_WEBHOOKS_URL = Deno.env.get('VIRTAUL_STAGING_WEBHOOKS_URL');

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

type requestBody = {
  userId: string;
  dimensions: string;
  filePath: string;
  addFurniture: boolean;
  removeFurniture: boolean;
  addVirtuallyStagedWatermark: boolean;
  style?: string;
  roomType: string;
  imageUrl: string;
  maskUrl?: string; // Optional, if you want to include a mask URL
};

type RenderResponse = {
  id: string;
  created_at: number;
  queued_at: number;
  variations: {
    total_count: number;
    next_cursor: string;
    items: Array<{
      id: string;
      type: 'staging';
      render_id: string;
      created_at: number;
      status: 'queued' | 'done' | 'error';
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
    }>;
  };
  eta: number;
};

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

  let body: requestBody;

  try {
    body = await req.json();

    if (body.userId === undefined) {
      throw new Error('No userId provided');
    }
    if (body.dimensions === undefined) {
      throw new Error('No dimensions provided');
    }
    if (body.filePath === undefined) {
      throw new Error('No filePath provided');
    }
    if (body.imageUrl === undefined) {
      throw new Error('No imageUrl provided');
    }
    if (body.addFurniture === undefined) {
      throw new Error('No addFurniture provided');
    }

    if (body.removeFurniture === undefined) {
      throw new Error('No removeFurniture provided');
    }
    if (body.addVirtuallyStagedWatermark === undefined) {
      throw new Error('No addVirtuallyStagedWatermark provided');
    }
    if (body.addFurniture && !body.style) {
      throw new Error('Add furniture selected, but No style provided'); // Fixed error message
    }
    if (body.roomType === undefined) {
      throw new Error('No roomType provided');
    }
    if (body.imageUrl === undefined) {
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

  try {
    if (!VIRTUAL_STAGING_API_KEY || !SUPABASE_SERVICE_KEY) {
      throw new Error(
        'Missing required environment variables: VIRTUAL_STAGING_API_KEY or SUPABASE_SERVICE_KEY'
      );
    }

    //Step 1. TO-DO check if subscription is active. If yes - continue
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('image_count, stripe_subscription_status')
      .eq('user_id', body.userId)
      .single();

    if (userError) {
      console.error('Error fetching user: ', userError);
      throw new Error(`Error fetching user: ${userError.message}`);
    }

    if (user.image_count === 0) {
      return new Response(
        JSON.stringify({
          error: 'No image credits available',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    if (user.stripe_subscription_status !== 'active') {
      return new Response(
        JSON.stringify({
          error: 'Subscription is not active',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    //Step 2. Create the render with Virtual Stagin API
    const virtualStagingBody = {
      config: {
        type: 'staging',
        add_virtually_staged_watermark: body.addVirtuallyStagedWatermark,
        ...(body.addFurniture && {
          add_furniture: {
            style: body.style,
            room_type: body.roomType,
          },
        }),
        remove_furniture: {
          mode: body.removeFurniture ? 'on' : 'off',
          ...(body.maskUrl && { mask_url: body.maskUrl }), // Optional mask URL
        },
      },
      image_url: body.imageUrl,
      webhook_url: `${VIRTAUL_STAGING_WEBHOOKS_URL}?userId=${body.userId}`,
      variation_count: !body.addFurniture ? 1 : 3,
      wait_for_completion: false,
    };

    console.log('virtualStagingBody', virtualStagingBody);

    const response = await fetch('https://api.virtualstagingai.app/v2/renders', {
      method: 'POST',
      headers: {
        Authorization: `Api-Key ${VIRTUAL_STAGING_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(virtualStagingBody),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.message || 'Error Creating Virtual Staging Render';
      console.error(`Error creating render: ${errorMessage}`);
      throw new Error(`Error creating render: ${errorMessage}`);
    }

    const renderResponseBody: RenderResponse = await response.json();

    console.log('sucessfully created a render with Virtal Staging, ID: ', renderResponseBody.id);

    //Step 3. Save the render to the DB
    const { data: renderData, error: renderError } = await supabase
      .from('renders')
      .insert([
        {
          render_id: renderResponseBody.id, // The ID of the render
          user_id: body.userId, // The ID of the user uploading the image
          url: body.imageUrl, // The public URL of the file
          dimensions: body.dimensions, // If you want to store image dimensions
          file_path: body.filePath,
          base_variation_status: 'pending',
        },
      ])
      .select()
      .single();

    if (renderError) {
      console.error('Error saving image to DB: ', renderError);
      throw new Error(`Error saving image to DB: ${renderError.message}`);
    }
    console.log('Render Data Saved to DB ', renderData);

    //Step 4. Save the variations to the DB
    const variations = renderResponseBody.variations.items.map(variation => ({
      render_id: renderResponseBody.id,
      variation_id: variation.id,
      status: variation.status,
      user_id: body.userId,
      base_variation_id: variation.base_variation_id,
      room_type: body.roomType,
      style: body.style,
      is_base: false,
    }));

    //add placeholder variation for the base variation
    if (body.removeFurniture) {
      variations.unshift({
        render_id: variations[0].render_id,
        variation_id: '',
        status: 'queued',
        user_id: body.userId,
        base_variation_id: '',
        room_type: body.roomType,
        style: body.style,
        is_base: true,
      });
    }

    const { data: insertedVariations, error: variationsError } = await supabase
      .from('variations')
      .insert(variations)
      .select('*');

    if (variationsError) {
      console.error('Error saving variations to DB: ', variationsError);
      throw new Error(`Error saving variations to DB: ${variationsError.message}`);
    }

    console.log('Variations Data Saved to DB ');

    //Step 5 Reduce the user credits
    const { error: creditsError } = await supabase
      .from('users')
      .update({ image_count: user.image_count - 1 })
      .eq('user_id', body.userId);

    if (creditsError) {
      console.error('Error reducing user credits: ', creditsError);
      throw new Error(`Error reducing user credits: ${creditsError.message}`);
    }

    //TO-DO Step 6. Return renderID and variations to client
    return new Response(
      JSON.stringify({
        render_id: renderResponseBody.id,
        remaining_credits: user.image_count - 1,
        variations: insertedVariations.map(v => ({
          id: v.id, // <-- newly created DB id
          render_id: v.render_id,
          variation_id: v.variation_id,
          status: v.status,
          base_variation_id: v.base_variation_id,
          file_path: v.file_path || '', // or populate accordingly if exists
          thumbnail: v.thumbnail || '',
          url: v.url || '',
          room_type: v.room_type,
          style: v.style,
          is_base: v.is_base,
        })),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (e) {
    console.error('Error creating render: ', e);
    return new Response(
      JSON.stringify({
        error: 'Error creating render',
        details: e,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
