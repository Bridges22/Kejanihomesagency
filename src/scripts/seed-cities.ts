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

const CITIES = [
  { slug: 'diani', name: 'Diani' },
  { slug: 'mombasa', name: 'Mombasa' },
  { slug: 'nyali', name: 'Nyali' },
  { slug: 'nairobi', name: 'Nairobi' },
  { slug: 'taita-taveta', name: 'Taita Taveta' },
  { slug: 'busia', name: 'Busia' },
  { slug: 'malindi', name: 'Malindi' },
  { slug: 'kisumu', name: 'Kisumu' }
];

async function seedCities() {
  console.log('Seeding cities with slugs to the database...');
  
  for (const city of CITIES) {
    // Check if city already exists by slug
    const { data: existing } = await supabase.from('cities').select('id').eq('slug', city.slug).single();
    if (!existing) {
       const { error } = await supabase.from('cities').insert({
         id: crypto.randomUUID(),
         slug: city.slug,
         name: city.name
       });
       if (error) console.error(`Failed to seed ${city.name}:`, error.message);
       else console.log(`Seeded ${city.name}`);
    } else {
       console.log(`${city.name} already exists.`);
    }
  }
}

seedCities();
