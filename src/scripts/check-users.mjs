import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: users, error: err1 } = await supabase.from('user_profiles').select('id').limit(1);
  console.log('users:', users, err1);
  
  const { data: profiles, error: err2 } = await supabase.from('profiles').select('id').limit(1);
  console.log('profiles:', profiles, err2);
}

check();
