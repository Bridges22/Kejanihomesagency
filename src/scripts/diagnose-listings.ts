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

async function diagnose() {
  console.log('--- DIAGNOSING LISTING VISIBILITY ---');
  
  // 1. Check RPC accessibility
  const { error: rpcError } = await supabase.rpc('search_listings', { p_city_slug: null });
  if (rpcError?.code === 'PGRST202') {
    console.log('❌ CRITICAL ERROR: The search function is HIDDEN from the website (Schema Cache Error).');
    console.log('   Reason: Your developer created the function, but the database API hasn\'t refreshed yet.');
  }

  // 2. Check Listing Status
  const { data: listings, error: listError } = await supabase
    .from('listings')
    .select('id, title, status, city_id');
  
  if (listError) {
    console.error('Error fetching listings:', listError);
    return;
  }

  console.log(`\nFound ${listings?.length} total listings in DB:`);
  listings?.forEach(l => {
    console.log(`- "${l.title}" | Status: ${l.status} | City: ${l.city_id}`);
    if (l.status !== 'active') {
      console.log(`  ⚠️ This will NOT show on the site because status is not "active".`);
    }
  });

  // 3. Check Amenity Links
  if (listings && listings.length > 0) {
    const { count } = await supabase
      .from('listing_amenities')
      .select('*', { count: 'exact', head: true })
      .eq('listing_id', listings[0].id);
    console.log(`\nFirst listing has ${count} linked amenities.`);
    if (count === 0) {
      console.log('  ⚠️ This listing might be hidden if users apply any filters, because it has no searchable amenities linked.');
    }
  }
}

diagnose();
