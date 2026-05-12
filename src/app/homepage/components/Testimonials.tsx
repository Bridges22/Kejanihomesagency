'use client';

import React, { useState, useEffect } from 'react';
import { Star, Quote, Send, Loader2, MessageSquare, Plus, X, User, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function Testimonials() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user?.user_metadata?.full_name) {
        setFullName(user.user_metadata.full_name);
      }
      
      fetchReviews();
    };
    init();
  }, []);

  const fetchReviews = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:seeker_id (avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (fullName.trim().length < 3) {
      toast.error('Please provide your real full name for transparency');
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      
      // If user is logged in, we update their profile too
      if (user) {
        await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: fullName,
            updated_at: new Date().toISOString()
          });
      }

      // Prepare payload
      const payload = {
        seeker_id: user?.id || null, // NULL for Guest reviews
        reviewer_name: fullName,
        rating,
        comment,
      };

      const { error: reviewError } = await supabase
        .from('reviews')
        .insert(payload);

      if (reviewError) throw reviewError;

      toast.success('Thank you! Your guest review has been posted.');
      setComment('');
      setShowForm(false);
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <Quote size={16} fill="currentColor" />
              </div>
              <span className="text-xs font-black text-teal-600 uppercase tracking-widest">Public Feedback Hub</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none mb-6">
              Community Reviews
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              No login required. We value every truthful voice in our ecosystem.
            </p>
          </div>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-teal-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 shrink-0"
          >
            {showForm ? <X size={20} /> : <Plus size={20} />}
            {showForm ? 'Close Form' : 'Post a Review'}
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-20 bg-slate-50 rounded-[40px] border border-slate-100 overflow-hidden"
            >
              <div className="p-8 lg:p-12 max-w-xl mx-auto text-center space-y-8">
                <h3 className="text-2xl font-black text-slate-900">Share your experience</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Input */}
                  <div className="space-y-2 text-left">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Full Name</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your name..."
                        className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-8 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-bold text-slate-800"
                      />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex justify-center gap-2 py-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className={`transition-all ${s <= rating ? 'text-amber-400' : 'text-slate-300'} hover:scale-125`}
                      >
                        <Star size={32} fill={s <= rating ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>

                  {/* Comment */}
                  <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you think..."
                    className="w-full h-40 px-6 py-4 bg-white border border-slate-200 rounded-3xl focus:ring-8 focus:ring-teal-500/10 focus:border-teal-500 transition-all font-medium text-slate-800"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-teal-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-teal-600/20 hover:bg-teal-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    {isSubmitting ? 'Posting...' : 'Post Truthful Review'}
                  </button>
                  
                  {!user && (
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                      <Globe size={12} />
                      Posting as a guest member
                    </p>
                  )}
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={40} className="text-teal-600 animate-spin" />
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => {
              const isGuest = !review.seeker_id;
              return (
                <motion.div 
                  layout
                  key={review.id} 
                  className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} size={16} className="text-amber-400" fill="currentColor" />
                      ))}
                    </div>
                    {isGuest && (
                      <span className="text-[9px] font-black bg-slate-50 text-slate-400 px-2 py-1 rounded-lg uppercase tracking-widest border border-slate-100">
                        Guest
                      </span>
                    )}
                  </div>
                  
                  <p className="text-lg font-medium text-slate-700 leading-relaxed mb-8 italic">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                  
                  <div className="flex items-center gap-4 border-t border-slate-50 pt-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-slate-400 font-black text-sm border border-slate-100">
                      {review.profiles?.avatar_url ? (
                        <img src={review.profiles.avatar_url} className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        (review.reviewer_name || 'U').substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 tracking-tight">
                        {review.reviewer_name || 'Verified Member'}
                      </p>
                      <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
                        {new Date(review.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[48px] bg-slate-50/30">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-slate-200 mx-auto mb-6">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Be the first to speak</h3>
            <p className="text-slate-500 font-medium max-w-sm mx-auto mt-2">
              Our community thrives on truth. No sign-up required, just your honest experience.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
