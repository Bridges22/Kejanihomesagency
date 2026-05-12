const supabaseUrl = 'https://sbquxfkgkxqzhzmpyvoa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNicXV4Zmtna3hxemh6bXB5dm9hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjU4MTM2MiwiZXhwIjoyMDkyMTU3MzYyfQ.zCLXFGDPM5dYNXBcXa_a4zpR4EdjRz9iGk8t4mpRnSA';

async function checkActiveListings() {
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/listings?select=count&status=eq.active`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Prefer': 'count=exact'
            }
        });
        console.log('Active listings count:', response.headers.get('content-range'));
        
        const dataResponse = await fetch(`${supabaseUrl}/rest/v1/listings?select=id,title,status,city_id,cities(slug)&status=eq.active`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });
        const data = await dataResponse.json();
        console.log('Active listings data:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
}

checkActiveListings();
