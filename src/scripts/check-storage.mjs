const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function checkStorage() {
    try {
        const response = await fetch(`${supabaseUrl}/storage/v1/object/list/listing-photos`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prefix: '8fa891bb-d2d0-4d7a-aec6-e31444f344b0/7a12e2cc-550f-4e13-addb-3d1684748b3c/',
                limit: 10,
                offset: 0,
                sortAttr: { column: 'name', order: 'asc' }
            })
        });
        const data = await response.json();
        console.log('Storage Objects:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
}

checkStorage();
