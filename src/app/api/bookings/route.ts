import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/bookings
 * Initialize a booking (Airbnb flow)
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { listing_id, check_in, check_out, total_price } = body;

    // 1. Basic Availability Check (simplified)
    // In a real app, you'd check if these dates overlap with existing bookings
    
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        listing_id,
        guest_id: session.user.id,
        check_in,
        check_out,
        total_price,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: 'Booking request sent successfully',
      booking: data
    }, { status: 201 });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
