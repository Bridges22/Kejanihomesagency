'use client';

import React, { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import { Star, ChevronDown, MessageSquare, Loader2, Send } from 'lucide-react';
import { reviewService } from '@/services/reviewService';
import { toast } from 'sonner';

interface ReviewsSectionProps {
  listing: any;
}

export default function ReviewsSection({ listing }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await reviewService.getReviews(listing.id);
        setReviews(data);
      } catch (err) {
        console.error('Error loading reviews:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, [listing.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setSubmitting(true);
    try {
      await reviewService.postReview({
        listing_id: listing.id,
        rating,
        body: comment,
        stay_type: 'Verified Seeker',
        stay_duration: 'N/A'
      });
      
      toast.success('Review posted successfully!');
      setComment('');
      setShowForm(false);
      
      // Refresh reviews
      const data = await reviewService.getReviews(listing.id);
      setReviews(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to post review');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleReply = (id: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const displayed = showAll ? reviews : reviews.slice(0, 3);

  if (loading) {
    return (
      <div className="border-t border-gray-100 pt-8 flex items-center justify-center p-20">
        <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="border-t border-gray-100 pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Star size={20} className="text-amber-400" fill="currentColor" />
            <span className="font-display text-2xl font-bold text-gray-900 tabular-nums">
              {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
            </span>
          </div>
          <span className="text-gray-400">·</span>
          <span className="font-display text-xl font-bold text-gray-900">{reviews.length} reviews</span>
        </div>

        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-900 hover:bg-gray-50 transition-all shadow-sm"
        >
          <MessageSquare size={16} className="text-teal-600" />
          Write a review
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="mb-10 p-6 bg-teal-50/50 border border-teal-100 rounded-[32px] animate-fade-in">
          <h3 className="text-sm font-black text-teal-900 uppercase tracking-widest mb-4">Your Feedback</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-teal-800 mb-2 block">Rating</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      size={24}
                      className={s <= rating ? 'text-amber-400' : 'text-gray-300'}
                      fill={s <= rating ? 'currentColor' : 'none'}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-teal-800 mb-2 block">Comment</label>
              <point className="block mb-2 text-xs text-teal-600 italic">Please be honest. Your review helps others make informed decisions.</point>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this property..."
                className="w-full h-32 p-4 rounded-2xl bg-white border border-teal-100 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all resize-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-8 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 disabled:opacity-70 transition-all shadow-lg shadow-teal-600/10"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {displayed.map((review) => (
              <div key={review.id} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                      <AppImage
                        src={review.authorAvatar}
                        alt={review.authorAvatarAlt}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <div className="font-display text-sm font-black text-gray-900">{review.authorName}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{review.authorLocation}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-0.5 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={`rev-star-${review.id}-${i}`}
                          size={12}
                          className={i < review.rating ? 'text-amber-400' : 'text-gray-200'}
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{review.date}</div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed italic">"{review.body}"</p>

                {review.hostReply && (
                  <div className="pl-4 border-l-2 border-teal-100">
                    <div className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">Agent Response</div>
                    <p className="text-xs text-gray-500 leading-relaxed italic">{review.hostReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {reviews.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-6 flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 hover:bg-gray-50 transition-all"
            >
              {showAll ? (
                <>Show fewer reviews <ChevronDown size={16} className="rotate-180" /></>
              ) : (
                <>Show all {reviews.length} reviews <ChevronDown size={16} /></>
              )}
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <MessageSquare size={20} className="text-gray-300" />
          </div>
          <h4 className="text-base font-bold text-gray-900 mb-1">No reviews yet</h4>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            Be the first to share your experience with this property and help others make a better decision.
          </p>
        </div>
      )}
    </div>
  );
}
