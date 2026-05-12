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

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function findFunction() {
  console.log('Querying for search_listings function signature...');
  const { data, error } = await supabase.from('_rpc_definitions').select('*').limit(1); // This won't work, let's try a direct query
  
  // We can't run raw SQL easily via the client unless we have a helper function.
  // Let's try calling search_listings with various counts of parameters.
  
  const params = [
    'p_city_slug', 'p_type', 'p_search', 'p_amenity_labels', 'p_amenity_mode', 
    'p_min_rating', 'p_verified_only', 'p_price_min', 'p_price_max', 'p_bedrooms', 
    'p_sort_col', 'p_sort_desc', 'p_property_category', 'p_guests'
  ];

  for (let i = 14; i >= 0; i--) {
    const payload: any = {};
    for (let j = 0; j < i; j++) payload[params[j]] = null;
    if (i === 4) payload.p_amenity_mode = 'AND'; // Match test-rpc-minimal
    
    console.log(`Testing with ${i} parameters...`);
    const { error: rpcError } = await supabase.rpc('search_listings', payload);
    if (!rpcError) {
      console.log(`✅ Success with ${i} parameters!`);
      return;
    } else if (rpcError.code !== 'PGRST202') {
      console.log(`⚠️ Potential match with ${i} params, but got error:`, rpcError.message);
      return;
    }
  }
  console.log('❌ No match found for any parameter count.');
}

findFunction();
