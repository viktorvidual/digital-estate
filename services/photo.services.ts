import { supabase } from '@/lib/supabase';
import camelize from 'camelize';
import { v7 as uuidv7 } from 'uuid';

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
