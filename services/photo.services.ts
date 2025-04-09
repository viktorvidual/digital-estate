import { supabase } from '@/lib/supabase';
import camelize from 'camelize';
import { v7 as uuidv7 } from 'uuid';
import { RoomType, FurnitureStyle } from '@/constants';

export const getAllUserPhotos = async (userId: string) => {
  const { error, data } = await supabase
    .from('renders')
    .select('id, file_path, user_id')
    .eq('user_id', userId);

  if (error) {
    return {
      error: error.details,
    };
  }

  return { data: camelize(data) };
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

export type CreateRenderParams = {
  addFurniture: boolean;
  removeFurniture: boolean;
  addVirtuallyStagedWatermark: boolean;
  style?: FurnitureStyle;
  roomType: RoomType;
  imageUrl: string;
};

export const createRender = async (reqBody: CreateRenderParams) => {
  console.log('creating render');

  const { error, data } = await supabase.functions.invoke('create-render', {
    body: reqBody,
  });

  if (error) {
    console.error(error.details);
    return { error };
  }

  console.log('render created', data);

  return { data };
};
