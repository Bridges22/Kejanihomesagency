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

async function test() {
  console.log('Testing RPC call...');
  const { data, error } = await supabase.rpc('search_listings', {
    p_city_slug: null,
    p_type: null,
    p_search: null,
    p_amenity_labels: null,
    p_amenity_mode: 'AND',
    p_min_rating: null,
    p_verified_only: null,
    p_price_min: null,
    p_price_max: null,
    p_bedrooms: null,
    p_sort_col: 'created_at',
    p_sort_desc: true
  }).select('*, cities(name, slug)');

  if (error) {
    console.error('RPC Error:', JSON.stringify(error, null, 2));
  } else {
    console.log(`Success! Found ${data?.length} listings`);
    if (data?.length > 0) {
      console.log('First listing:', data[0].title);
    }
  }
}

test();
