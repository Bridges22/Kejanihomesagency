import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase.from('listings').select('*').limit(1);
  if (error) {
    console.error('Error fetching:', error);
  } else if (data && data.length > 0) {
    console.log('Columns in listings table:', Object.keys(data[0]).join(', '));
  } else {
    // If no data, let's try to query with an invalid column to see the error
    const { error: invalidErr } = await supabase.from('listings').select('city_id').limit(1);
    console.log('Error when selecting city_id:', invalidErr?.message);
    const { error: cityErr } = await supabase.from('listings').select('city').limit(1);
    console.log('Error when selecting city:', cityErr?.message);
  }
}

checkSchema();
