
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

async function checkSchema() {
  const { data, error } = await supabase.from('cities').select().limit(1);
  if (data && data.length > 0) {
    console.log('Cities columns:', Object.keys(data[0]));
  } else {
    console.log('No cities found or error:', error);
  }
}

checkSchema();
