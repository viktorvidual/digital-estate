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

  const { error } = await supabase.storage.from('temporary').upload(filePath, file);

  if (error) {
    const errorMessage = error.message;

    if (errorMessage.includes('already exists')) {
      const publicUrl = supabase.storage.from('temporary').getPublicUrl(filePath).data.publicUrl;
      console.log('image already exits, returning ', publicUrl);

      return { data: publicUrl };
    }
    return { error: `${error.message}` };
  }

  const publicUrl = supabase.storage.from('temporary').getPublicUrl(filePath).data.publicUrl;

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
