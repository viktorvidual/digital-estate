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
        },
      },
      image_url: body.imageUrl,
      webhook_url: `${VIRTAUL_STAGING_WEBHOOKS_URL}?userId=${body.userId}`,
      variation_count: 3,
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
      room_type: variation.config.room_type,
      style: variation.config.style,
    }));

    const { error: variationsError } = await supabase.from('variations').insert(variations);

    if (variationsError) {
      console.error('Error saving variations to DB: ', variationsError);
      throw new Error(`Error saving variations to DB: ${variationsError.message}`);
    }

    console.log('Variations Data Saved to DB ');

    //TO-DO Step 5. Return renderID and variations to client
    return new Response(
      JSON.stringify({
        data: {
          render_id: renderResponseBody.id,
          variations: renderResponseBody.variations.items.map(variation => ({
            id: variation.id,
            status: variation.status,
            base_variation_id: variation.base_variation_id,
          })),
        },
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
