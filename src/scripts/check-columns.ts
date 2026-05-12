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

async function checkColumns() {
  const { data, error } = await supabase.from('listings').select('*').limit(1);
  if (error) {
    console.error('Error fetching listing:', error);
    return;
  }
  if (data && data.length > 0) {
    console.log('Listing Columns:', Object.keys(data[0]));
  } else {
    console.log('No listings found to inspect columns.');
    // Try to get columns from a query
    const { data: cols } = await supabase.rpc('get_table_columns', { table_name: 'listings' });
    console.log('Columns from RPC (if exists):', cols);
  }
}

checkColumns();
