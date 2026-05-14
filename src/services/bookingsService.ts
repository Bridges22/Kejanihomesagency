import { createClient } from '@/lib/supabase/client';

export interface BookingPayload {
  listing_id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  guest_id?: string | null;
  check_in_date: string;
  check_out_date: string;
  guests_count: number;
  price_per_night: number;
  total_amount: number;
}

export const bookingsService = {
  /**
   * Create a new booking
   */
  async createBooking(payload: BookingPayload) {
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        ...payload,
        // Legacy column compatibility
        check_in: payload.check_in_date,
        check_out: payload.check_out_date,
        total_price: payload.total_amount,
        guest_id: authData.user?.id || null,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Booking Error:', error);
      throw new Error(error.message);
    }
    
    return data;
  },

  /**
   * Get bookings for a specific host's listings
   */
  async getHostBookings() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Not authenticated");

    // RLS handles the filtering automatically if policy is set correctly,
    // but we can also explicitly fetch via listing relation.
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        listings!inner(title, area, host_id)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Get all bookings (Admin only)
   */
  async getAllBookings() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        listings!inner(title, area)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Update booking status
   */
  async updateStatus(id: string, status: 'Pending' | 'Confirmed' | 'Cancelled') {
    const supabase = createClient();
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};
