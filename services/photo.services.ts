import { supabase } from '@/lib/supabase';
import { Render } from '@/types';
import { Variation } from '@/types/Variation';
import { getSupabaseError } from '@/utils/handleSupabaseFunctionError';
import camelize from 'camelize';
import { v7 as uuidv7 } from 'uuid';

type CreateVariationsParams = {
  style: string;
  roomType: string;
  addVirtuallyStagedWatermark: boolean;
  baseVariationId?: string;
  renderId: string;
  userId: string;
};

export type CreateRenderParams = {
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

export const getAllRenders = async (
  userId: string
): Promise<{
  error?: string;
  data?: Render[];
}> => {
  const { error, data } = await supabase
    .from('renders')
    .select('file_path, render_id, dimensions, url')
    .eq('user_id', userId);

  if (error) {
    return {
      error: error.details,
    };
  }

  return { data: camelize(data) };
};

export const getRender = async (renderId: string): Promise<{ data?: Render; error?: string }> => {
  const { error, data } = await supabase
    .from('renders')
    .select('file_path, render_id, dimensions, url')
    .eq('render_id', renderId)
    .single();

  if (error) {
    return {
      error: error.details,
    };
  }

  return {
    data: camelize(data),
  };
};

export const getRenderVariations = async (
  renderId: string
): Promise<{ data?: Variation[]; error?: string }> => {
  console.log(renderId);

  const { error, data } = await supabase
    .from('variations')
    .select(
      'id, variation_id, render_id, url, file_path, status, room_type, style, base_variation_id'
    )
    .eq('render_id', renderId)
    .order('created_at', { ascending: false });

  if (error) {
    return {
      error: error.details,
    };
  }

  const variationsWithThumbnails = data?.map(el => {
    const thumbnailUrl = el.file_path
      ? supabase.storage.from('images').getPublicUrl(el.file_path, {
          transform: {
            width: 200,
            height: 200,
          },
        })
      : null;

    return {
      ...el,
      thumbnail: thumbnailUrl ? thumbnailUrl.data.publicUrl : '',
    };
  });

  const variantions = camelize(variationsWithThumbnails);
  console.log('variantions', variantions);

  return {
    data: variantions,
  };
};

export const saveTemporaryImage = async (userId: string, file: File) => {
  const filePath = `${userId}/${file.name}`;
  const storage = supabase.storage.from('temporary');

  const { error } = await storage.upload(filePath, file);

  if (error) {
    if (error.message.includes('already exists')) {
      const { publicUrl } = storage.getPublicUrl(filePath).data;
      console.log('Image already exists, returning', publicUrl);
      return { data: publicUrl };
    }

    return { error: error.message };
  }

  const { publicUrl } = storage.getPublicUrl(filePath).data;
  return { data: publicUrl };
};

//Genrate a mask uploads image to VIRTUAL STAGIN, and saves the mask ID to the database
export const generateMask = async (imageUrl: string, userId: string) => {
  const maskId = uuidv7();

  const { error } = await supabase.functions.invoke('generate-mask', {
    body: {
      imageUrl,
      maskId,
      userId,
    },
  });

  if (error) {
    console.error('generate mask error', error);
    return { error };
  }

  return {
    data: maskId,
  };
};

export const createRender = async (
  reqBody: CreateRenderParams
): Promise<{
  error?: string;
  data?: {
    renderId: string;
    variations: Variation[];
    remainingCredits: number;
  };
}> => {
  console.log('creating render');

  const { error, data } = await supabase.functions.invoke('create-render', {
    body: reqBody,
  });

  if (error) {
    const errorMessage = await getSupabaseError(error);
    return { error: errorMessage || 'Error creating render' };
  }

  return { data: camelize(data) };
};

export const createVariations = async (
  reqBody: CreateVariationsParams
): Promise<{
  error?: string;
  data?: Variation[];
}> => {
  console.log('creating variations');

  const response = await supabase.functions.invoke('create-variations', {
    body: reqBody,
  });

  if (response.error) {
    // Read the ReadableStream body

    const error = await getSupabaseError(response.error);

    return { error: error || 'Error creating variations' };
  }

  return { data: camelize(response.data) };
};
