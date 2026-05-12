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

async function repair() {
  console.log('--- REPAIRING LISTING: "3 Bedroom Apartment in Kombani" ---');

  // 1. Get the listing
  const { data: l, error: fetchError } = await supabase
    .from('listings')
    .select('*')
    .eq('title', '3 Bedroom Apartment in Kombani')
    .single();

  if (fetchError || !l) {
    console.error('Could not find the property to repair:', fetchError?.message);
    return;
  }

  // 2. Resolve Amenities from its config
  const config = l.amenities_config || {};
  const selectedLabels = Object.entries(config)
    .filter(([_, val]) => val === true)
    .map(([key, _]) => key.replace(/_/g, ' '));

  console.log(`Found selected amenities in config: ${selectedLabels.join(', ')}`);

  if (selectedLabels.length > 0) {
    // Find amenity IDs
    const { data: amenityRecords } = await supabase
      .from('amenities')
      .select('id, label')
      .in('label', selectedLabels);

    if (amenityRecords && amenityRecords.length > 0) {
      console.log(`Linking ${amenityRecords.length} amenities to the searchable index...`);
      const inserts = amenityRecords.map(a => ({
        listing_id: l.id,
        amenity_id: a.id
      }));
      
      // Clear existing first to avoid duplicates
      await supabase.from('listing_amenities').delete().eq('listing_id', l.id);
      const { error: insertError } = await supabase.from('listing_amenities').insert(inserts);
      
      if (insertError) console.error('Error linking amenities:', insertError.message);
      else console.log('✅ Amenities linked successfully!');
    }
  }

  // 3. Ensure Status is Active
  const { error: updateError } = await supabase
    .from('listings')
    .update({ status: 'active' })
    .eq('id', l.id);

  if (updateError) console.error('Error updating status:', updateError.message);
  else console.log('✅ Property set to ACTIVE!');

  console.log('\n--- REPAIR COMPLETE ---');
  console.log('As soon as the dev reloads the schema cache, this property will be visible.');
}

repair();
