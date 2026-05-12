import { createClient } from '@/lib/supabase/client';

export const paymentService = {
  /**
   * Trigger an M-Pesa STK Push
   */
  async triggerStkPush(phoneNumber: string, amount: number, listingId: string) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Please login to unlock listings');
    }

    // Call the Supabase Edge Function (to be implemented by the backend dev)
    // This function will handle the Safaricom Daraja API logic
    const { data, error } = await supabase.functions.invoke('mpesa-stk-push', {
      body: {
        phoneNumber: phoneNumber.replace(/\+/g, '').replace(/\s/g, ''), // Clean phone number
        amount,
        listingId,
        userId: session.user.id
      }
    });

    if (error) {
      console.error('STK Push Error:', error);
      throw new Error('Failed to trigger payment. Please try again or use another method.');
    }

    return data;
  },

  /**
   * Check if a listing is already unlocked by the user
   */
  async checkUnlockStatus(listingId: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data, error } = await supabase
      .from('unlocks')
      .select('id')
      .eq('listing_id', listingId)
      .eq('seeker_id', user.id)
      .maybeSingle();

    if (error) return false;
    return !!data;
  },

  /**
   * Poll for payment confirmation (Optional: since we use webhooks, but good for UI)
   */
  async verifyPayment(transactionId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('unlocks')
      .select('payment_status')
      .eq('id', transactionId)
      .single();

    if (error) return 'pending';
    return data.payment_status;
  }
};
