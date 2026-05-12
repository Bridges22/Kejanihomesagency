import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/listings
 * Advanced search with FTS and filters
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const supabase = await createClient();

    const city = searchParams.get('city');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const bedrooms = searchParams.get('bedrooms');

    let query = supabase
      .from('listings')
      .select(`
        *,
        cities (name, slug),
        amenities:listing_amenities (
          amenity:amenities (*)
        )
      `)
      .eq('status', 'active');

    if (search) {
      query = query.textSearch('search_vector', search, {
        type: 'websearch',
        config: 'english'
      });
    }

    if (city && city !== 'all') {
      query = query.filter('cities.slug', 'eq', city.toLowerCase());
    }

    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    if (minPrice) {
      query = query.or(`price_per_month.gte.${minPrice},price_per_night.gte.${minPrice}`);
    }

    if (maxPrice) {
      query = query.or(`price_per_month.lte.${maxPrice},price_per_night.lte.${maxPrice}`);
    }

    if (bedrooms) {
      const bedroomList = bedrooms.split(',').map(Number);
      query = query.in('bedrooms', bedroomList);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/listings
 * Create a new listing (Requires Authentication)
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // In a real app, you'd validate the body with Zod here
    const { data, error } = await supabase
      .from('listings')
      .insert([{
        ...body,
        host_id: session.user.id,
        status: 'active'
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
