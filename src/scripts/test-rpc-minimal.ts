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

async function testRpc() {
  console.log('Testing RPC search_listings with minimal payload (like the website does)...');
  
  const payload = {
    p_amenity_labels: [],
    p_amenity_mode: 'AND',
    p_sort_col: 'relevance',
    p_sort_desc: true
  };

  const { data, error } = await supabase.rpc('search_listings', payload).select('id, title');

  if (error) {
    console.error('❌ RPC Error:', error);
  } else {
    console.log('✅ RPC Success! Data length:', data ? data.length : 0);
    console.log(data);
  }
}

testRpc();
