import { createClient } from '@/lib/supabase/client';

export const reviewService = {
  /**
   * Fetch reviews for a listing
   */
  async getReviews(listingId: string) {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        author:user_profiles!reviewer_id (full_name, avatar_url)
      `)
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }

    return data.map(r => ({
      id: r.id,
      authorName: r.author?.full_name || 'Verified Seeker',
      authorAvatar: r.author?.avatar_url || "https://img.rocket.new/generatedImages/rocket_gen_img_1de7f8137-1763292481221.png",
      authorAvatarAlt: 'Reviewer avatar',
      authorLocation: r.author_location || 'Kenya',
      rating: r.rating,
      date: new Date(r.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }),
      body: r.body,
      hostReply: r.host_reply,
      stayType: r.stay_type || 'Verified Stay',
      stayDuration: r.stay_duration
    }));
  },

  /**
   * Post a new review
   */
  async postReview(reviewData: {
    listing_id: string,
    rating: number,
    body: string,
    stay_type?: string,
    stay_duration?: string
  }) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Please login to write a review');

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        ...reviewData,
        reviewer_id: user.id
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') throw new Error('You have already reviewed this property');
      console.error('Error posting review:', error);
      throw error;
    }

    // Update listing aggregate rating (In production, this would be a DB trigger)
    // For now we'll let it be handled by the refresh
    return data;
  }
};
