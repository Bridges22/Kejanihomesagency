const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function verifySync() {
    try {
        console.log('--- Verifying Schema & Data Sync ---');
        
        // 1. Check Listings with new columns
        const listingResponse = await fetch(`${supabaseUrl}/rest/v1/listings?select=id,title,status,view_count,unlock_count,avg_rating,review_count,rules,deposit_months,cities(name,slug)&limit=1`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });
        const listingData = await listingResponse.json();
        console.log('Listing Record (Check columns):', JSON.stringify(listingData, null, 2));

        // 2. Check Listing Photos
        const photoResponse = await fetch(`${supabaseUrl}/rest/v1/listing_photos?select=*&limit=1`, {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            }
        });
        const photoData = await photoResponse.json();
        console.log('Listing Photo Record:', JSON.stringify(photoData, null, 2));

    } catch (err) {
        console.error('Verification Error:', err);
    }
}

verifySync();
