import React, { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { GalleryItem } from '../../types';
import { saveGalleryItem, deleteGalleryItem } from '../../firebase/services';
import { deleteImageFromStorage } from '../../firebase/storage';
import { ImageUploadModal } from '../../components/common/ImageUploadModal';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const AdminGalleryPage: React.FC<{
  gallery: GalleryItem[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}> = ({ gallery, onRefresh, showToast }) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Classes');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      showToast('Image URL is required.', 'error');
      return;
    }

    try {
      setIsSaving(true);
      await saveGalleryItem({
        title: title.trim(),
        category,
        imageUrl: imageUrl.trim(),
        caption: caption.trim(),
        isPublished: true,
        order: gallery.length + 1,
      });
      setIsSaving(false);
      setModalOpen(false);
      setTitle('');
      setImageUrl('');
      setCaption('');
      showToast('Gallery image added.');
      onRefresh();
    } catch (err: any) {
      setIsSaving(false);
      showToast(err.message || 'Failed to add image.', 'error');
    }
  };

  const [deleteConfirmGallery, setDeleteConfirmGallery] = useState<GalleryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteConfirmGallery) return;
    try {
      setIsDeleting(true);
      await deleteGalleryItem(deleteConfirmGallery.id);
      if (deleteConfirmGallery.imageUrl) {
        deleteImageFromStorage(deleteConfirmGallery.imageUrl).catch(() => {});
      }
      showToast('Photo removed.');
      setDeleteConfirmGallery(null);
      setIsDeleting(false);
      onRefresh();
    } catch (err: any) {
      setIsDeleting(false);
      showToast(err.message || 'Could not delete image.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">
          Upload and manage photos showcased in the public academy gallery.
        </p>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#075E46] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Upload Photo</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-xs flex flex-col justify-between"
          >
            <div className="h-44 overflow-hidden bg-gray-100">
              <img src={item.imageUrl} alt={item.title || 'Photo'} className="w-full h-full object-cover" />
            </div>

            <div className="p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#075E46] uppercase bg-emerald-50 px-2 py-0.5 rounded">
                  {item.category || 'Academy'}
                </span>
                <button
                  onClick={() => setDeleteConfirmGallery(item)}
                  className="p-1 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  title="Delete Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <h5 className="font-bold text-xs text-[#24352F] mt-1.5 line-clamp-1">
                {item.title || 'Quran Study'}
              </h5>
              {item.caption && <p className="text-[11px] text-gray-400 line-clamp-1">{item.caption}</p>}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-[#075E46] mb-3">Add Photo to Gallery</h3>

            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Photo Title</label>
                <input
                  type="text"
                  placeholder="e.g. Annual Hifz Ceremony"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                >
                  <option value="Classes">Classes</option>
                  <option value="Academy">Academy</option>
                  <option value="Hifz">Hifz</option>
                  <option value="Graduation">Graduation</option>
                  <option value="Events">Events</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Image *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Image URL or upload..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setImageModalOpen(true)}
                    className="px-3 py-2 bg-emerald-50 text-[#075E46] rounded-xl font-bold flex items-center gap-1 border border-emerald-200"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                </div>
                {imageUrl && (
                  <img src={imageUrl} alt="Preview" className="h-24 w-full object-cover rounded-xl mt-2 border border-gray-200" />
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Caption</label>
                <textarea
                  rows={2}
                  placeholder="Short caption describing the event or activity..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#075E46] text-white font-bold"
                >
                  {isSaving ? 'Adding...' : 'Add to Gallery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ImageUploadModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onSelectImage={(url) => setImageUrl(url)}
        folder="gallery"
        title="Upload Photo to Gallery"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmGallery)}
        title="Delete Gallery Photo"
        message={`Are you sure you want to permanently delete this photo${deleteConfirmGallery?.title ? ` ("${deleteConfirmGallery.title}")` : ''}?`}
        confirmText="Yes, Delete Photo"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => {
          if (!isDeleting) setDeleteConfirmGallery(null);
        }}
      />
    </div>
  );
};
