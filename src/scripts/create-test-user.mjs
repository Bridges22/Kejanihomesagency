import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in environment');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTestUser() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'test@kejanihomes.com',
    password: 'Kejani123!',
    email_confirm: true,
    user_metadata: { full_name: 'Test Agent' }
  });

  if (error) {
    if (error.message.includes('already registered')) {
      console.log('✅ User already exists. You can use: test@kejanihomes.com / Kejani123!');
    } else {
      console.error('❌ Error creating user:', error.message);
    }
  } else {
    console.log('✅ Successfully created test user!');
    console.log('📧 Email: test@kejanihomes.com');
    console.log('🔑 Password: Kejani123!');
  }
}

createTestUser();
