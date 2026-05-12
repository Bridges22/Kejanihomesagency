const supabaseUrl = 'https://sbquxfkgkxqzhzmpyvoa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNicXV4Zmtna3hxemh6bXB5dm9hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjU4MTM2MiwiZXhwIjoyMDkyMTU3MzYyfQ.zCLXFGDPM5dYNXBcXa_a4zpR4EdjRz9iGk8t4mpRnSA';

async function checkListings() {
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/listings?select=id,title,status,created_at&order=created_at.desc&limit=5`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });
        const data = await response.json();

        console.log('Recent Listings:');
        data.forEach(l => {
            console.log(`- [${l.status}] ${l.title} (${l.id}) Created: ${l.created_at}`);
        });
    } catch (err) {
        console.error('Error:', err);
    }
}

checkListings();
