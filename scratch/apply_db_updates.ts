import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

async function main() {
  // Read .env.local manually
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('.env.local not found');
    return;
  }
  
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
    console.error('Missing Supabase credentials in .env.local');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('--- Applying Database Updates ---');

  // Since we cannot run raw SQL via the standard client without a custom RPC,
  // we will try to use the 'exec_sql' RPC if it exists. 
  // If it doesn't, we will inform the user.
  
  const sqlCommands = [
    {
      name: 'Add email column to profiles',
      sql: 'ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;'
    },
    {
      name: 'Sync existing emails',
      sql: 'UPDATE profiles p SET email = u.email FROM auth.users u WHERE p.id = u.id AND p.email IS NULL;'
    },
    {
      name: 'Fix spatial_ref_sys RLS',
      sql: 'ALTER TABLE public.spatial_ref_sys ENABLE ROW LEVEL SECURITY;'
    },
    {
      name: 'Add spatial_ref_sys policy',
      sql: 'CREATE POLICY "spatial_ref_sys_select_public" ON public.spatial_ref_sys FOR SELECT TO public USING (true);'
    }
  ];

  for (const cmd of sqlCommands) {
    console.log(`Executing: ${cmd.name}...`);
    const { error } = await supabase.rpc('exec_sql', { sql: cmd.sql });
    
    if (error) {
      if (error.message.includes('function exec_sql(sql => text) does not exist')) {
        console.warn('⚠️  ERROR: The "exec_sql" helper function is not installed in your Supabase project.');
        console.warn('I cannot run schema changes (ALTER TABLE) directly via the API for security reasons.');
        console.warn('Please run the following SQL manually in the Supabase SQL Editor:');
        console.log('\n' + sqlCommands.map(c => c.sql).join('\n') + '\n');
        return;
      } else if (error.message.includes('already exists')) {
        console.log(`✅ ${cmd.name} already applied.`);
      } else {
        console.error(`❌ Failed: ${cmd.name}`, error.message);
      }
    } else {
      console.log(`✅ Success: ${cmd.name}`);
    }
  }

  console.log('--- Database Updates Finished ---');
}

main().catch(console.error);
