import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value) env[key.trim()] = value.join('=').trim().replace(/^["']|["']$/g, '');
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function finalTest() {
  console.log('--- FINAL RPC VERIFICATION ---');
  
  const payload = {
    p_city_slug: null,
    p_type: null,
    p_search: null,
    p_amenity_labels: [],
    p_amenity_mode: 'AND',
    p_min_rating: null,
    p_verified_only: false,
    p_price_min: 0,
    p_price_max: 10000000,
    p_bedrooms: [],
    p_sort_col: 'created_at',
    p_sort_desc: true
  };

  const { data, error } = await supabase.rpc('search_listings', payload).select('*, cities(name)');

  if (error) {
    console.error('❌ RPC FAILED AGAIN:', JSON.stringify(error, null, 2));
    if (error.code === 'PGRST202') {
      console.log('HINT: The developer might have dropped the wrong overload or the signature still doesn\'t match.');
    }
  } else {
    console.log(`✅ RPC SUCCESS! Database returned ${data?.length} listings.`);
    if (data && data.length > 0) {
      data.forEach((l, i) => console.log(`${i+1}. "${l.title}" (City: ${l.cities?.name || 'N/A'})`));
    } else {
      console.log('⚠️ The database is returning 0 results. This means the logic inside the developer\'s SQL function is likely filtering out your property (e.g. status != active, or city mismatch).');
    }
  }
}

finalTest();
