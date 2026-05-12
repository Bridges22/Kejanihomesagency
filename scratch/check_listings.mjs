
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase keys in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkListings() {
  const { data, error } = await supabase
    .from('listings')
    .select('id, title, status, city_id, property_category, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching listings:', error);
    return;
  }

  console.log('Total listings found:', data.length);
  data.forEach(l => {
    console.log(`[${l.status}] ${l.title} (ID: ${l.id}, Cat: ${l.property_category})`);
  });
}

checkListings();
