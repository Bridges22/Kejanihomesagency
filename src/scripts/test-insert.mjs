import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const { data: cities } = await supabase.from('cities').select('id').limit(1);
  if (!cities || cities.length === 0) return;

  const { data: users } = await supabase.from('user_profiles').select('id').limit(1);
  if (!users || users.length === 0) return;

  const id = '00000000-0000-0000-0000-000000000000'; // test id

  // Try insert without status
  const { data, error } = await supabase.from('listings').insert({
    id,
    host_id: users[0].id,
    slug: 'test-slug-123',
    title: 'Test',
    type: 'rental',
    area: 'Test',
    city_id: cities[0].id,
    bedrooms: 1,
    bathrooms: 1,
    currency: 'KES'
  }).select().single();

  if (error) {
    console.log('Insert without status error:', error.message);
  } else {
    console.log('Insert succeeded! Default status was:', data.status);
    await supabase.from('listings').delete().eq('id', id);
  }

  // Also try to query the check constraints from pg_constraint if we have access
  const { data: rpcData, error: rpcError } = await supabase.rpc('get_status_constraint_or_fail_silently');
}

testInsert();
