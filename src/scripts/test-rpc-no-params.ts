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

async function check() {
  console.log('Testing RPC search_listings with NO parameters...');
  const { data, error } = await supabase.rpc('search_listings');
  if (error) {
    console.log('Error with no params:', error.message);
    console.log('Error code:', error.code);
  } else {
    console.log('Success with no params! Result length:', data?.length);
  }
}

check();
