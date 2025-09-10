export * from './Render';
export * from './Variation';
import { Database } from './supabase';

export type PriceCategory = Database['public']['Tables']['prices']['Row'];
