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

async function fix() {
  console.log('Updating Kombani city record...');
  // Using the exact UUID from the previous run
  const { error: cityError } = await supabase
    .from('cities')
    .update({ name: 'Nyali', slug: 'nyali' } as any)
    .eq('id', '3a827505-97e0-4bc2-89c7-e4c9a1cc5711');
    
  if (cityError) console.error('Error updating city:', cityError);
  else console.log('Successfully updated city record.');

  console.log('Updating listings with area Kombani...');
  const { error: listError } = await supabase
    .from('listings')
    .update({ area: 'Nyali' })
    .ilike('area', 'kombani');
    
  if (listError) console.error('Error updating listings:', listError);
  else console.log('Successfully updated listings.');
}

fix();
