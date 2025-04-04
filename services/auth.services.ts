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
    console.error(error);
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

export const getStripePortalUrl = async (stripeUserId: string, accessToken: string) => {
  try {
    const response = await fetch(ENDPOINTS.STRIPE_PORTAL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stripeUserId }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();

      throw new Error(errorResponse.detail || 'Error fetching Stripe portal Url');
    }

    const { url } = await response.json();

    return {
      data: {
        url,
      },
    };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : 'General Error Fetching Stripe Portal',
    };
  }
};
