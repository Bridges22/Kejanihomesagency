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

async function findColumns() {
  const { data, error } = await supabase.rpc('get_table_columns_v3', { table_name: 'listings' });
  if (error) {
    // Try querying a view if it exists
    const { data: cols } = await supabase.from('listings').select('*').limit(1);
    if (cols && cols.length > 0) {
      console.log('Columns:', Object.keys(cols[0]));
    } else {
      // LAST RESORT: Query the RPC list
      console.error('Error:', error.message);
    }
  } else {
    console.log('Columns:', data);
  }
}

findColumns();
