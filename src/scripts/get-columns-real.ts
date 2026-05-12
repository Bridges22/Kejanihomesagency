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

async function getAllColumns() {
  // First, find ANY listing ID
  const { data: anyListing } = await supabase.from('listings').select('*').limit(1);
  if (anyListing && anyListing.length > 0) {
    console.log('Columns found:', Object.keys(anyListing[0]));
    return;
  }

  // If no listings, check RPCs or other tables to see if we can find metadata
  console.log('No listings found in DB. Searching for other clues...');
}

getAllColumns();
