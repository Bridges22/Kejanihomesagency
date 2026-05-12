import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findUser() {
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  const testUser = users.find(u => u.email === 'test@kejanihomes.com');
  if (testUser) {
    console.log('Test User UUID:', testUser.id);
  } else {
    console.log('Test user not found in auth.users!');
  }
}

findUser();
