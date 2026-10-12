import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import { Review, ContactMessage } from '../../types';
import { submitReview } from '../../firebase/services';
import { useLanguage } from '../../context/LanguageContext';

export const ReviewsPage: React.FC<{ reviews: Review[]; clientMessages?: ContactMessage[] }> = ({
  reviews,
  clientMessages = [],
}) => {
  const { isUrdu } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Parent');
  const [courseTitle, setCourseTitle] = useState('Noorani Qaida for Beginners');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice(null);

    if (!name.trim() || !comment.trim()) {
      setErrorNotice('Please complete your name and feedback comment.');
      return;
    }

    try {
      setIsSubmitting(true);
      await submitReview({
        name: name.trim(),
        relation,
        courseTitle,
        rating,
        comment: comment.trim(),
      });
      setIsSubmitting(false);
      setSuccessNotice(true);
      setName('');
      setComment('');
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorNotice(err.message || 'Failed to submit review.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold text-[#075E46] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {isUrdu ? 'تاثرات و آراء' : 'Community Testimonials & Inquiries'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#24352F] mt-3">
          Reviews & Messages from Students & Parents
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-2">
          Read genuine feedback and questions from families across Pakistan and worldwide who have experienced our personalized Quran learning.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => { setModalOpen(true); setSuccessNotice(false); }}
            className="px-6 py-3 rounded-xl bg-[#075E46] hover:bg-[#064e3b] text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#D4AF37]" />
            <span>Submit Your Review (رائے درج کریں)</span>
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-emerald-100 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < rev.rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <p className="text-sm sm:text-base text-gray-700 italic leading-relaxed">
                "{rev.comment}"
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <h4 className="font-bold text-base text-[#24352F]">{rev.name}</h4>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                <span>{rev.relation || 'Student'}</span>
                {rev.courseTitle && <span className="text-[#075E46] font-medium">{rev.courseTitle}</span>}
              </div>
            </div>
          </div>
        ))}

        {/* Public Client Inquiries */}
        {clientMessages.map((msg) => (
          <div
            key={msg.id}
            className="bg-emerald-50/50 p-6 sm:p-8 rounded-3xl shadow-sm border border-emerald-200 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-[#075E46]">
                  Verified Client Message
                </span>
                <span className="text-[11px] text-gray-400">
                  {new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <p className="text-sm sm:text-base text-gray-800 italic leading-relaxed">
                "{msg.message}"
              </p>
              {msg.replyText && (
                <div className="mt-3 p-3 bg-white rounded-xl text-xs text-emerald-950 border border-emerald-100">
                  <strong className="text-[#075E46] block text-[11px] mb-0.5">Academy Response:</strong>
                  <p className="italic">"{msg.replyText}"</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-200/60">
              <h4 className="font-bold text-base text-[#075E46]">{msg.name}</h4>
              <div className="text-xs text-gray-500 mt-0.5">
                {msg.subject || 'Inquiry / Feedback'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            {successNotice ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#075E46] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-[#075E46]" />
                </div>
                <h3 className="font-bold text-xl text-[#24352F]">Thank You for Your Feedback!</h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  JazakAllah Khair! Your review has been submitted for moderation and will appear publicly once verified by academy administration.
                </p>
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#075E46] text-white text-xs font-bold"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 className="font-bold text-xl text-[#075E46]">Submit Student / Parent Review</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Your sincere testimonial helps other families find the right Quranic guidance.
                  </p>
                </div>

                {errorNotice && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorNotice}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Mehmood"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Relation</label>
                    <select
                      value={relation}
                      onChange={(e) => setRelation(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46] bg-white"
                    >
                      <option value="Parent">Parent</option>
                      <option value="Student">Student</option>
                      <option value="Guardian">Guardian</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Star Rating</label>
                    <div className="flex items-center gap-1 py-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className="p-1 focus:outline-none"
                        >
                          <Star
                            className={`w-5 h-5 ${star <= rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Enrolled Course</label>
                  <input
                    type="text"
                    placeholder="e.g. Noorani Qaida or Quran Nazra"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Review / Experience *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Share how the classes helped your Quran recitation, the teacher's patience, punctuality..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#075E46] text-white hover:bg-[#064e3b] disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Review</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
