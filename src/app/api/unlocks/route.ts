import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/unlocks
 * Create a lead record (pay-to-view flow)
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { listing_id, seeker_info } = body;

    if (!listing_id || !seeker_info) {
      return NextResponse.json({ error: 'Missing listing_id or seeker_info' }, { status: 400 });
    }

    // Insert the unlock record
    // The uniqueness constraint (listing_id, seeker_info) will prevent duplicates
    const { data, error } = await supabase
      .from('unlocks')
      .insert([{
        listing_id,
        seeker_info,
        status: 'pending' // Initial status before payment confirmation
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Duplicate key
        return NextResponse.json({ message: 'Listing already unlocked for this user' }, { status: 200 });
      }
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
