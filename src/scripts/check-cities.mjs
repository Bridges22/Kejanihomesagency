import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCities() {
  const { data } = await supabase.from('cities').select('*').limit(3);
  console.log(JSON.stringify(data, null, 2));
}

checkCities();
