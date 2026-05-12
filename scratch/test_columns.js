
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

function getEnv() {
  try {
    const env = fs.readFileSync('.env.local', 'utf8');
    const lines = env.split('\n');
    const config = {};
    lines.forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) config[key.trim()] = value.trim().replace(/^"|"$/g, '');
    });
    return config;
  } catch (e) {
    return process.env;
  }
}

const config = getEnv();
const supabase = createClient(config.NEXT_PUBLIC_SUPABASE_URL, config.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testEach() {
  const cols = [
    'price_monthly', 'price_nightly', 'city_id',
    'price_per_month', 'price_per_night', 'city',
    'max_guests', 'total_price'
  ];
  
  console.log('--- INDIVIDUAL COLUMN TEST ---');
  for (const col of cols) {
    const { error } = await supabase.from('listings').select(col).limit(1);
    if (!error) {
      console.log(`✅ ${col} EXISTS`);
    } else {
      console.log(`❌ ${col} MISSING (${error.message})`);
    }
  }
}

testEach();
