import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { createClient } from '@supabase/supabase-js';

const VIRTUAL_STAGING_API_KEY = Deno.env.get('VIRTUAL_STAGING_API_KEY');
const VIRTAUL_STAGING_WEBHOOKS_URL = Deno.env.get('VIRTAUL_STAGING_WEBHOOKS_URL');

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const MAX_VARIATIONS = 20;
const DEFAULT_N_VARIATIONS = 3;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

type requestBody = {
  style: string;
  roomType: string;
  addVirtuallyStagedWatermark: boolean;
  baseVariationId?: string;
  renderId: string;
  userId: string;
};

type Variation = {
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
};

type CreateVariationsResponse = {
  variations: Variation[];
};

interface VariationsCollection {
  total_count: number;
  next_cursor: string;
  items: Variation[];
}

type RenderDetailsResponse = {
  id: string;
  created_at: number;
  queued_at: number;
  variations: VariationsCollection;
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
    if (!body) {
      return new Response('Invalid JSON', { status: 400, headers: corsHeaders });
    }

    const { userId, renderId, style, roomType, addVirtuallyStagedWatermark } = body;

    if (!userId) {
      return new Response('userId is required', { status: 400, headers: corsHeaders });
    }

    if (!style) {
      throw new Error('style is required');
    }

    if (!roomType) {
      throw new Error('roomType is required');
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
    //check how many variations are generated so far
    const renderResponse = await fetch(
      `https://api.virtualstagingai.app/v2/renders/${body.renderId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Api-Key ${VIRTUAL_STAGING_API_KEY}`,
        },
      }
    );

    const renderData: RenderDetailsResponse = await renderResponse.json();
    console.log('Variation Renders', renderData.variations.total_count);
    const variationsToCreate =
      renderData.variations.total_count <= MAX_VARIATIONS - DEFAULT_N_VARIATIONS
        ? DEFAULT_N_VARIATIONS
        : MAX_VARIATIONS - renderData.variations.total_count;

    if (variationsToCreate <= 0) {
      throw new Error('You have reached the maximum number of variations');
    }

    //Create the variations
    const hasBaseVariationId = !!body.baseVariationId;

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
              ...(hasBaseVariationId && { base_variation_id: body.baseVariationId }),
            },
            ...(!hasBaseVariationId && {
              remove_furniture: {
                mode: 'on',
              },
            }),
          },
          variation_count: variationsToCreate,
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

    const renderResponseBody: CreateVariationsResponse = await response.json();

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

    // Include the error message in the response for debugging (optional, not for production)
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
