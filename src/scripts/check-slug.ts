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

async function migrate() {
  console.log('Attempting to add slug column to amenities...');
  // We can't run ALTER TABLE directly via the JS client unless we use a RPC or specialized extension
  // But we can try to update existing records if the column exists, or check first.
  
  // Let's try to fetch with slug to see if it exists
  const { error } = await supabase.from('amenities').select('slug').limit(1);
  
  if (error && error.message.includes('column "slug" does not exist')) {
    console.log('Column "slug" does not exist. We need to use SQL.');
    // In Supabase, if we don't have SQL access via API, we might be stuck.
    // However, I can try to use the 'label' as the identifier for now.
  } else {
    console.log('Column "slug" exists or other error:', error?.message);
  }
}

migrate();
