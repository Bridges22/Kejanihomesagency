const supabaseUrl = 'https://sbquxfkgkxqzhzmpyvoa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNicXV4Zmtna3hxemh6bXB5dm9hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjU4MTM2MiwiZXhwIjoyMDkyMTU3MzYyfQ.zCLXFGDPM5dYNXBcXa_a4zpR4EdjRz9iGk8t4mpRnSA';

async function checkListingDetails() {
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/listings?select=id,title,status,city_id,cities(name,slug)&id=eq.7a12e2cc-550f-4e13-addb-3d1684748b3c`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });
        const data = await response.json();
        console.log('Listing Details:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
}

checkListingDetails();
