import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/reviews?listing_id=...
 * Fetch reviews for a specific listing
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get('listing_id');

    if (!listingId) {
      return NextResponse.json({ error: 'listing_id required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        user:profiles (full_name, avatar_url)
      `)
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/reviews
 * Submit a new review
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { listing_id, rating, comment } = body;

    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        listing_id,
        user_id: session.user.id,
        rating,
        comment
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
