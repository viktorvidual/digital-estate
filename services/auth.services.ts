import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { Customer } from '@/stores';
import camelize from 'camelize';
import { ENDPOINTS } from '@/constants';

export const getCustomer = async (
  userId: string
): Promise<{
  data?: Customer | undefined;
  error?: PostgrestError | undefined;
}> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    return { error };
  }

  return {
    data: camelize(data),
  };
};

export const createCustomer = async (
  accessToken: string,
  email: string,
  userId: string
): Promise<{
  data?: Customer | undefined;
  error?: string | undefined;
}> => {
  const response = await fetch(ENDPOINTS.CREATE_USER, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, userId }),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    return {
      error: errorResponse.details,
    };
  }

  const customerResponse = await response.json();

  return {
    data: camelize(customerResponse.user),
  };
};
