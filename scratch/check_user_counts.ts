import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value.length > 0) {
    env[key.trim()] = value.join('=').trim().replace(/^["']|["']$/g, '');
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCounts() {
  console.log('--- Checking Database User Tables ---');
  
  // Check 'profiles' table
  const { count: profilesCount, error: profilesError } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
    
  if (profilesError) {
    console.error('Error fetching "profiles":', profilesError.message);
  } else {
    console.log(`Count in "profiles" table: ${profilesCount}`);
    
    // Get all profiles
    const { data: allProfiles, error: err } = await supabase
      .from('profiles')
      .select('id, full_name, role, created_at')
      .order('created_at', { ascending: false });
    
    if (err) console.error('Error fetching profiles:', err);
    console.log('Profiles Found:', allProfiles?.length);
    console.log(JSON.stringify(allProfiles, null, 2));
  }

  // Check 'user_profiles' table
  const { count: userProfilesCount, error: userProfilesError } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true });
    
  if (userProfilesError) {
    console.error('Error fetching "user_profiles":', userProfilesError.message);
  } else {
    console.log(`Count in "user_profiles" table: ${userProfilesCount}`);
  }
}

checkCounts().catch(console.error);
