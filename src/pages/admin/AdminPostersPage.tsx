import React, { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { Announcement } from '../../types';
import { saveAnnouncement, deleteAnnouncement } from '../../firebase/services';
import { ImageUploadModal } from '../../components/common/ImageUploadModal';
import { Lightbox } from '../../components/common/Lightbox';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { resolveImageUrl } from '../../utils/imageHelpers';

const posterCampImg = '/images/admission_poster.jpg';

export const AdminPostersPage: React.FC<{
  announcements: Announcement[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}> = ({ announcements, onRefresh, showToast }) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState<{ url: string; title: string } | null>(null);

  // Quick poster upload state
  const [posterTitle, setPosterTitle] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Filter announcements with images (posters)
  const posters = announcements.filter((a) => !!a.imageUrl);

  const handleAddPoster = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!posterTitle.trim() || !posterUrl.trim()) {
      showToast('Poster title and image are required.', 'error');
      return;
    }

    try {
      setIsSaving(true);
      await saveAnnouncement({
        title: posterTitle.trim(),
        content: 'Official admission program poster for Noor Al-Quran Academy.',
        category: 'Admission Poster',
        imageUrl: posterUrl.trim(),
        actionLink: '/admission',
        isPublished: true,
        publishedAt: new Date().toLocaleDateString([], { month: 'short', year: 'numeric' }),
      });
      setIsSaving(false);
      setPosterTitle('');
      setPosterUrl('');
      showToast('Admission poster published.');
      onRefresh();
    } catch (err: any) {
      setIsSaving(false);
      showToast(err.message || 'Failed to publish poster.', 'error');
    }
  };

  const handleTogglePublish = async (p: Announcement) => {
    try {
      await saveAnnouncement({ ...p, isPublished: !p.isPublished }, p.id);
      showToast(`Poster is now ${!p.isPublished ? 'Published' : 'Hidden'}.`);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Could not update status.', 'error');
    }
  };

  const [deleteConfirmPoster, setDeleteConfirmPoster] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteConfirmPoster) return;
    try {
      setIsDeleting(true);
      await deleteAnnouncement(deleteConfirmPoster.id);
      showToast('Poster deleted.');
      setDeleteConfirmPoster(null);
      setIsDeleting(false);
      onRefresh();
    } catch (err: any) {
      setIsDeleting(false);
      showToast(err.message || 'Could not delete poster.', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm">
        <h3 className="font-bold text-lg text-[#075E46] mb-2">Publish New Admission Poster</h3>
        <p className="text-xs text-gray-500 mb-4">
          Upload promotional posters for new batches, holiday programs, or course campaigns.
        </p>

        <form onSubmit={handleAddPoster} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Poster Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Summer Quran Camp 2026 Admissions"
                value={posterTitle}
                onChange={(e) => setPosterTitle(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Poster Image *</label>
              
              <div className="mb-2">
                <button
                  type="button"
                  onClick={() => {
                    setPosterUrl(posterCampImg);
                    if (!posterTitle) setPosterTitle('Noor Al-Quran Academy Admissions Open');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-[#075E46] border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Use Noor Al-Quran Islamic Poster Template</span>
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Image URL or choose template/upload"
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setImageModalOpen(true)}
                  className="px-3 py-2 bg-emerald-50 text-[#075E46] rounded-xl text-xs font-bold flex items-center gap-1 border border-emerald-200"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Upload</span>
                </button>
              </div>
            </div>
          </div>

          {posterUrl && (
            <div className="mt-2">
              <img src={posterUrl} alt="Preview" className="h-32 object-contain rounded-xl border border-gray-200" />
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#075E46] hover:bg-[#064e3b] text-white text-xs font-bold shadow-sm"
            >
              {isSaving ? 'Publishing...' : 'Publish Poster'}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Posters Grid */}
      <div>
        <h4 className="font-bold text-base text-[#24352F] mb-4">Active & Archived Posters</h4>
        {posters.length === 0 ? (
          <p className="text-xs text-gray-400 py-6 text-center bg-white rounded-2xl border border-gray-200">
            No posters uploaded yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posters.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div
                    onClick={() => setSelectedPoster({ url: p.imageUrl!, title: p.title })}
                    className="h-48 overflow-hidden bg-gray-100 cursor-pointer group relative"
                  >
                    <img
                      src={resolveImageUrl(p.imageUrl, 'general')}
                      alt={p.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/admission_poster.jpg';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-bold bg-black/60 px-3 py-1 rounded-lg">View Full</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h5 className="font-bold text-sm text-[#24352F] line-clamp-1">{p.title}</h5>
                    <span className="text-[11px] text-gray-400 block mt-0.5">{p.publishedAt}</span>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => handleTogglePublish(p)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      p.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {p.isPublished ? 'Published' : 'Hidden'}
                  </button>

                  <button
                    onClick={() => setDeleteConfirmPoster({ id: p.id, title: p.title })}
                    className="p-1 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    title="Delete poster"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ImageUploadModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onSelectImage={(url) => setPosterUrl(url)}
        folder="posters"
        title="Upload Admission Poster"
      />

      {selectedPoster && (
        <Lightbox
          imageUrl={selectedPoster.url}
          title={selectedPoster.title}
          onClose={() => setSelectedPoster(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmPoster)}
        title="Delete Poster"
        message={`Are you sure you want to permanently delete the poster "${deleteConfirmPoster?.title}"?`}
        confirmText="Yes, Delete Poster"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => {
          if (!isDeleting) setDeleteConfirmPoster(null);
        }}
      />
    </div>
  );
};
