import { createClient } from '@supabase/supabase-js';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStatus() {
  const { data, error } = await supabase.from('listings').select('status, type').limit(5);
  if (error) {
    console.error('Error fetching:', error);
  } else {
    console.log('Sample listings statuses:', data);
  }
}

checkStatus();
