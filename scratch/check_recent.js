
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

async function checkRecentActivity() {
  console.log('--- RECENT LISTINGS CHECK ---');
  const { data, error } = await supabase
    .from('listings')
    .select('id, title, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error checking listings:', error);
    return;
  }

  if (data.length === 0) {
    console.log('No listings found in the database yet.');
  } else {
    console.log('Most recent listings:');
    data.forEach(l => {
      console.log(`- [${l.created_at}] ${l.title} (Status: ${l.status})`);
    });
  }
}

checkRecentActivity();
