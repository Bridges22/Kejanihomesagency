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

async function testFullInsert() {
  console.log('Testing full property insert...');
  
  // Get a valid host_id
  const { data: users } = await supabase.from('profiles').select('id').limit(1);
  if (!users || users.length === 0) {
    console.error('No users found in profiles table.');
    return;
  }
  const hostId = users[0].id;

  const listingId = crypto.randomUUID();
  const slug = `test-listing-${Math.random().toString(36).substring(2, 7)}`;

  const safeNum = (val: any) => null;

  const insertPayload = {
    id: listingId,
    host_id: hostId,
    slug: slug,
    title: 'Test Full Insert',
    type: 'sale',
    property_category: 'Apartment', 
    description: 'test',
    short_description: 'test',
    area: 'test',
    city_id: 'diani',
    county: 'Mombasa',
    landmark: 'test',
    latitude: null,
    longitude: null,
    bedrooms: 1,
    bathrooms: 1,
    toilets: 1,
    kitchens: 1,
    balconies: 0,
    size_sqft: null,
    floor_number: '1',
    total_floors: null,
    year_built: null,
    furnishing_status: 'unfurnished',
    parking_spaces: 0,
    has_sq: false,
    price_per_month: null,
    price_per_night: null,
    total_price: 5000000,
    currency: 'KES',
    is_negotiable: false,
    deposit_months: null,
    lease_period: '',
    service_charge_included: false,
    available_from: '',
    has_title_deed: false,
    tenure_type: 'freehold',
    remaining_lease_years: null,
    property_condition: 'new',
    agent_name: 'test',
    agency_name: 'test',
    agent_phone: '123',
    agent_whatsapp: '123',
    agent_email: 'test@test.com',
    show_contact_publicly: true,
    amenities_config: {},
    status: 'active'
  };

  const { data, error } = await supabase.from('listings').insert(insertPayload).select();

  if (error) {
    console.error('❌ INSERT FAILED:', error.message);
    console.error('Details:', error.details);
    console.error('Hint:', error.hint);
  } else {
    console.log('✅ INSERT SUCCESSFUL!');
    if (data) await supabase.from('listings').delete().eq('id', data[0].id);
  }
}

testFullInsert();
