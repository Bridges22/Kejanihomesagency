import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/cities
 * Returns active cities with listing counts
 */
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Fetch cities that are marked as active
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select('*')
      .order('name', { ascending: true });

    if (citiesError) throw citiesError;

    // Get counts for each city
    const { data: counts, error: countsError } = await supabase
      .from('listings')
      .select('city_id, count()')
      .eq('status', 'active');
    
    // Note: In a production app with high traffic, 
    // you might use a Database View or a cached count column.
    
    const citiesWithCounts = cities.map(city => {
      const countObj = (counts as any)?.find((c: any) => c.city_id === city.id);
      return {
        ...city,
        listing_count: countObj ? parseInt(countObj.count) : 0
      };
    });

    return NextResponse.json(citiesWithCounts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
