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

async function testSaleInsert() {
  console.log('Testing "Sale" insert...');
  
  // Get a valid host_id
  const { data: users } = await supabase.from('profiles').select('id').limit(1);
  if (!users || users.length === 0) {
    console.error('No users found in profiles table.');
    return;
  }
  const hostId = users[0].id;

  const { data, error } = await supabase.from('listings').insert({
    title: 'Test Sale Property ' + Math.random().toString(36).substring(7),
    host_id: hostId,
    type: 'sale',
    status: 'active'
  }).select();

  if (error) {
    console.error('❌ INSERT FAILED:', error.message);
    console.error('Details:', error.details);
  } else {
    console.log('✅ INSERT SUCCESSFUL! "sale" type is accepted.');
    console.log('Columns in resulting object:', Object.keys(data[0]));
    // Clean up
    await supabase.from('listings').delete().eq('id', data[0].id);
  }
}

testSaleInsert();
