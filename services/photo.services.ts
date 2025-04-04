import { supabase } from '@/lib/supabase';
import camelize from 'camelize';

export const getAllUserPhotos = async (userId: string) => {
  const { error, data } = await supabase
    .from('images')
    .select('id, file_path, user_id')
    .eq('user_id', userId);

  if (error) {
    return {
      error: error.details,
    };
  }

  return { data: camelize(data) };
};
