import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual env parsing
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

async function check() {
  const { count: airbnbCount } = await supabase.from('listings').select('*', { count: 'exact', head: true }).eq('type', 'airbnb');
  const { count: totalCount } = await supabase.from('listings').select('*', { count: 'exact', head: true });
  const { data: cities } = await supabase.from('cities').select('name');

  console.log(`Airbnb listings: ${airbnbCount}`);
  console.log(`Total listings: ${totalCount}`);
  console.log(`Cities in DB: ${cities?.map(c => c.name).join(', ')}`);
}

check();
