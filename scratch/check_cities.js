
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

async function checkCities() {
  console.log('--- CITIES DATA CHECK ---');
  const { data, error } = await supabase.from('cities').select('id, name').limit(10);
  
  if (error) {
    console.error('Error fetching cities:', error);
    return;
  }

  console.log('Cities found in DB:');
  data.forEach(c => {
    console.log(`- ${c.name}: ID = "${c.id}" (Type: ${typeof c.id})`);
  });
}

checkCities();
