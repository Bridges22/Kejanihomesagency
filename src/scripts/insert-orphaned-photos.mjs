const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const hostId = '8fa891bb-d2d0-4d7a-aec6-e31444f344b0';
const listingId = '7a12e2cc-550f-4e13-addb-3d1684748b3c';
const photoNames = [
    '85089e90-2f3b-48ae-94a0-00d9e96e0064.jpg',
    'db7a1d2c-1474-4ee8-b089-3d34731454c3.jpg'
];

async function insertPhotos() {
    try {
        const photos = photoNames.map((name, index) => ({
            listing_id: listingId,
            url: `${supabaseUrl}/storage/v1/object/public/listing-photos/${hostId}/${listingId}/${name}`,
            is_primary: index === 0,
            sort_order: index
        }));

        const response = await fetch(`${supabaseUrl}/rest/v1/listing_photos`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(photos)
        });
        const data = await response.json();
        console.log('Inserted Photos:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error:', err);
    }
}

insertPhotos();
