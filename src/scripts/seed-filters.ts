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

async function seed() {
  const allFeatures = [
    // Popular
    { label: 'Beach', category: 'popular' },
    { label: 'Hotels', category: 'property_type' },
    { label: 'Resorts', category: 'property_type' },
    { label: 'Swimming pool', category: 'popular' },
    { label: '5 stars', category: 'popular' },
    { label: 'Free WiFi', category: 'popular' },
    { label: 'Villas', category: 'property_type' },
    { label: 'Superb: 9+', category: 'popular' },
    
    // Accessibility
    { label: 'Toilet with grab rails', category: 'accessibility' },
    { label: 'Emergency cord in bathroom', category: 'accessibility' },
    { label: 'Raised toilet', category: 'accessibility' },
    { label: 'Lower bathroom sink', category: 'accessibility' },
    { label: 'Upper floors accessible by elevator', category: 'accessibility' },
    { label: 'Entire unit wheelchair accessible', category: 'accessibility' },
    { label: 'Walk-in shower', category: 'accessibility' },
    
    // Fun
    { label: 'Windsurfing', category: 'fun' },
    { label: 'Snorkelling', category: 'fun' },
    { label: 'Diving', category: 'fun' },
    { label: 'Fishing', category: 'fun' }
  ];

  console.log('Seeding new filter features with UUIDs...');
  
  for (const feature of allFeatures) {
    // Check if already exists by label
    const { data: existing } = await supabase
      .from('amenities')
      .select('id')
      .eq('label', feature.label)
      .single();
      
    if (!existing) {
      const { error } = await supabase
        .from('amenities')
        .insert({
          id: crypto.randomUUID(),
          ...feature
        });
      if (error) console.error(`Error seeding ${feature.label}:`, error);
      else console.log(`Seeded ${feature.label}`);
    } else {
      console.log(`${feature.label} already exists.`);
    }
  }
}

seed();
