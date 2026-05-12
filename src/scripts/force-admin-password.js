const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://sbquxfkgkxqzhzmpyvoa.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNicXV4Zmtna3hxemh6bXB5dm9hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjU4MTM2MiwiZXhwIjoyMDkyMTU3MzYyfQ.zCLXFGDPM5dYNXBcXa_a4zpR4EdjRz9iGk8t4mpRnSA';

async function forceUpdatePassword() {
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const email = 'bridgesmwashighadi2@gmail.com';
  const newPassword = '40233095';

  console.log(`Searching for user: ${email}...`);
  
  // 1. Get the user ID
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Error listing users:', listError.message);
    return;
  }

  const user = users.find(u => u.email === email);

  if (!user) {
    console.error(`User ${email} not found in Supabase Auth!`);
    console.log('Available users:', users.map(u => u.email).join(', '));
    return;
  }

  console.log(`Found user ID: ${user.id}. Force-updating password...`);

  // 2. Update the password and confirm the email
  const { data, error } = await supabase.auth.admin.updateUserById(
    user.id,
    { 
        password: newPassword,
        email_confirm: true 
    }
  );

  if (error) {
    console.error('Error updating password:', error.message);
    return;
  }

  console.log('SUCCESS! Password has been force-updated to 40233095.');
  console.log('You can now log in at http://localhost:4028/admin/login');
}

forceUpdatePassword();
