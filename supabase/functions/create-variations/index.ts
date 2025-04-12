import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { createClient } from '@supabase/supabase-js';

const VIRTUAL_STAGING_API_KEY = Deno.env.get('VIRTUAL_STAGING_API_KEY');
const VIRTAUL_STAGING_WEBHOOKS_URL = Deno.env.get('VIRTAUL_STAGING_WEBHOOKS_URL');

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

type requestBody = {
  style: string;
  roomType: string;
  addVirtuallyStagedWatermark: boolean;
  baseVariationId: string;
  renderId: string;
  userId: string;
};

type VariationsResponse = {
  variations: Array<{
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
    if (!body) {
      return new Response('Invalid JSON', { status: 400, headers: corsHeaders });
    }

    const { userId, renderId, style, roomType, addVirtuallyStagedWatermark, baseVariationId } =
      body;

    if (!userId) {
      return new Response('userId is required', { status: 400, headers: corsHeaders });
    }

    if (!style) {
      throw new Error('style is required');
    }

    if (!roomType) {
      throw new Error('roomType is required');
    }
    if (!baseVariationId) {
      throw new Error('baseVariationId is required');
    }

    if (!renderId) {
      throw new Error('renderId is required');
    }

    if (!VIRTUAL_STAGING_API_KEY) {
      throw new Error('VIRTUAL_STAGING_API_KEY is required');
    }
    if (!VIRTAUL_STAGING_WEBHOOKS_URL) {
      throw new Error('VIRTAUL_STAGING_WEBHOOKS_URL is required');
    }

    if (typeof addVirtuallyStagedWatermark !== 'boolean') {
      throw new Error('addVirtuallyStagedWatermark must be a boolean');
    }
  } catch (e) {
    return new Response('Invalid JSON', { status: 400, headers: corsHeaders });
  }

  try {
    const response = await fetch(
      `https://api.virtualstagingai.app/v2/renders/${body.renderId}/variations`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${VIRTUAL_STAGING_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            type: 'staging',
            add_virtually_staged_watermark: body.addVirtuallyStagedWatermark,
            add_furniture: {
              style: body.style,
              room_type: body.roomType,
              base_variation_id: body.baseVariationId,
            },
          },
          variation_count: 1,
          wait_for_completion: false,
        }),
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.message || 'Error Creating Virtual Staging Render';
      console.error(`Error creating render: ${errorMessage}`);
      throw new Error(`Error creating render: ${errorMessage}`);
    }

    console.log('variations created at Virutal Staging API');

    const renderResponseBody: VariationsResponse = await response.json();

    //Step 4. Save the variations to the DB
    const variations = renderResponseBody.variations.map(variation => ({
      render_id: variation.render_id,
      variation_id: variation.id,
      status: variation.status,
      user_id: body.userId,
      base_variation_id: variation.base_variation_id,
      room_type: body.roomType,
      style: body.style,
    }));

    const { error: variationsError } = await supabase.from('variations').insert(variations);

    if (variationsError) {
      console.error('Error saving variations to DB: ', variationsError);
      throw new Error(`Error saving variations to DB: ${variationsError.message}`);
    }
    console.log('Variations Data Saved to DB ');

    return new Response(
      JSON.stringify(
        renderResponseBody.variations.map(variation => ({
          render_id: body.renderId,
          variation_id: variation.id,
          status: variation.status,
          base_variation_id: variation.base_variation_id,
          file_path: '',
          url: '',
          thumbnail: '',
          room_type: body.roomType,
          style: body.style,
        }))
      ),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

    //Return the variations
  } catch (e) {
    console.error('Unexpected error:', e);
    return new Response('Internal Server Error', { status: 500, headers: corsHeaders });
  }
});
