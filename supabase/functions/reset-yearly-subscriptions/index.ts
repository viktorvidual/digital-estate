import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

Deno.serve(async () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Get today's date components
  const today = new Date();
  const todayYear = today.getUTCFullYear();
  const todayMonth = today.getUTCMonth() + 1; // Months are 0-based, so add 1
  const todayDay = today.getUTCDate();

  try {
    // Fetch users with active yearly subscriptions
    const { data: users, error } = await supabase
      .from('users')
      .select('id, stripe_plan_description, stripe_subscription_expire_at')
      .eq('stripe_plan_interval', 'year')
      .eq('stripe_subscription_status', 'active');

    if (error) {
      throw new Error(`Supabase fetch error: ${error.message}`);
    }

    if (!users.length) {
      console.log('No users found for renewal.');
      return;
    }

    for (const user of users) {
      const expiryDate = new Date(user.stripe_subscription_expire_at);
      const expiryDay = expiryDate.getUTCDate();

      const lastDayOfMonth = new Date(todayYear, todayMonth, 0).getUTCDate();

      if (expiryDay === todayDay || (expiryDay > lastDayOfMonth && todayDay === lastDayOfMonth)) {
        const imageCount = parseInt(user.stripe_plan_description?.split(' ')[0], 10) || 0;

        const { error: updateError } = await supabase
          .from('users')
          .update({ image_count: imageCount })
          .eq('id', user.id);

        console.log(`updated user ${user.id} to ${imageCount}`);

        if (updateError) {
          console.error(`Failed to update user ${user.id}:`, updateError.message);
        } else {
          console.log(`Updated user ${user.id} with ${imageCount} image credits.`);
        }
      }
    }
  } catch (e) {
    console.error('Unexpected error:', e instanceof Error ? e.message : e);
  }
});
