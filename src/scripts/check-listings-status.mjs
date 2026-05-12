import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkListings() {
    const { data, error } = await supabase
        .from('listings')
        .select('id, title, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Error fetching listings:', error);
        return;
    }

    console.log('Recent Listings:');
    data.forEach(l => {
        console.log(`- [${l.status}] ${l.title} (${l.id}) Created: ${l.created_at}`);
    });
}

checkListings();
