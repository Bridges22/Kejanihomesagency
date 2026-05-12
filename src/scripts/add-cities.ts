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

async function updateCities() {
  const citiesToUpsert = [
    { name: 'Nairobi', slug: 'nairobi', is_featured: true },
    { name: 'Taita Taveta', slug: 'taita-taveta', is_featured: true },
    { name: 'Busia', slug: 'busia', is_featured: true },
    { name: 'Malindi', slug: 'malindi', is_featured: true },
    { name: 'Kisumu', slug: 'kisumu', is_featured: true }
  ];

  console.log('Upserting cities...');
  
  for (const city of citiesToUpsert) {
    // Check if exists by slug
    const { data: existing } = await supabase
      .from('cities')
      .select('id')
      .eq('slug', city.slug)
      .single();
      
    if (existing) {
      console.log(`Updating ${city.name}...`);
      await supabase.from('cities').update(city).eq('id', existing.id);
    } else {
      console.log(`Inserting ${city.name}...`);
      await supabase.from('cities').insert({
        id: crypto.randomUUID(),
        ...city
      });
    }
  }
  console.log('Done!');
}

updateCities();
