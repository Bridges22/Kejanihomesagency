
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

function getEnv() {
  try {
    const env = fs.readFileSync('.env.local', 'utf8');
    const config = {};
    env.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) config[key.trim()] = value.trim().replace(/^"|"$/g, '');
    });
    return config;
  } catch (e) { return process.env; }
}

const config = getEnv();
const supabase = createClient(config.NEXT_PUBLIC_SUPABASE_URL, config.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function diagnosticInsert() {
  console.log('--- DIAGNOSTIC INSERT ATTEMPT ---');
  
  // Try a minimal insert to see if RLS or Constraints block us
  const { data, error } = await supabase.from('listings').insert({
    title: 'Diagnostic Test',
    slug: 'diagnostic-' + Date.now(),
    type: 'rental',
    area: 'Test Area',
    city_id: '5d750e0a-6d77-441c-8a5b-8d773b27a21c', // Nairobi UUID
    host_id: '5d750e0a-6d77-441c-8a5b-8d773b27a21c', // Dummy host ID (might fail FK)
    bedrooms: 1,
    bathrooms: 1,
    status: 'pending'
  }).select();

  if (error) {
    console.error('DIAGNOSTIC FAILED:', error);
    console.log('Code:', error.code);
    console.log('Message:', error.message);
    console.log('Details:', error.details);
  } else {
    console.log('✅ DIAGNOSTIC SUCCESS! Minimal insert worked.');
  }
}

diagnosticInsert();
