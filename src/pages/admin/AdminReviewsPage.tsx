import React, { useState } from 'react';
import { Star, Check, X, Trash2, Filter } from 'lucide-react';
import { Review } from '../../types';
import { updateReviewStatus, deleteReview } from '../../firebase/services';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const AdminReviewsPage: React.FC<{
  reviews: Review[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}> = ({ reviews, onRefresh, showToast }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filtered = reviews.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const handleUpdateStatus = async (id: string, status: Review['status']) => {
    try {
      await updateReviewStatus(id, status);
      showToast(`Review ${status === 'approved' ? 'approved for public display' : 'updated'}.`);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Could not update review.', 'error');
    }
  };

  const [deleteConfirmReview, setDeleteConfirmReview] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteConfirmReview) return;
    try {
      setIsDeleting(true);
      await deleteReview(deleteConfirmReview.id);
      showToast('Review deleted.');
      setDeleteConfirmReview(null);
      setIsDeleting(false);
      onRefresh();
    } catch (err: any) {
      setIsDeleting(false);
      showToast(err.message || 'Could not delete review.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <p className="text-xs text-gray-500">
          Moderate reviews submitted by visitors. Only approved reviews appear on the live website.
        </p>

        <div className="flex items-center gap-1.5">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                filter === st
                  ? 'bg-[#075E46] text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-200 text-xs">
            No reviews match the selected filter.
          </div>
        ) : (
          filtered.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      rev.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rev.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {rev.status}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="mt-4 pt-3 border-t border-gray-100">
                  <h5 className="font-bold text-xs text-gray-900">{rev.name}</h5>
                  <div className="text-[11px] text-gray-400 flex justify-between mt-0.5">
                    <span>{rev.relation || 'Parent'}</span>
                    <span>{rev.courseTitle}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {rev.status !== 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(rev.id, 'approved')}
                      className="px-3 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}
                  {rev.status !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(rev.id, 'rejected')}
                      className="px-2.5 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-xs font-semibold"
                    >
                      Hide
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setDeleteConfirmReview({ id: rev.id, name: rev.name })}
                  className="p-1 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  title="Delete review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmReview)}
        title="Delete Review"
        message={`Are you sure you want to permanently delete this review from "${deleteConfirmReview?.name}"?`}
        confirmText="Yes, Delete Review"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => {
          if (!isDeleting) setDeleteConfirmReview(null);
        }}
      />
    </div>
  );
};
