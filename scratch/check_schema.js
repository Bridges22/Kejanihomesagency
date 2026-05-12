
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

const supabase = createClient(
  config.NEXT_PUBLIC_SUPABASE_URL,
  config.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkSchema() {
  console.log('Checking listings table schema...');
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching sample listing:', error);
    // Try to get column names via an error if table is empty but exists
    return;
  }

  if (data && data.length > 0) {
    console.log('Columns found in listings table:', Object.keys(data[0]));
  } else {
    console.log('No listings found. Trying to fetch column names from RPC metadata...');
    // Fallback: try to fetch one row with no filter
    const { data: allData, error: allErr } = await supabase.from('listings').select().limit(1);
    if (allData && allData.length > 0) {
       console.log('Columns found:', Object.keys(allData[0]));
    } else {
       console.log('The table exists but is empty. Please check the schema manually or add one row.');
    }
  }
}

checkSchema();
