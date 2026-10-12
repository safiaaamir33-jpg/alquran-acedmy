import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Announcement } from '../../types';
import { saveAnnouncement, deleteAnnouncement } from '../../firebase/services';
import { ImageUploadModal } from '../../components/common/ImageUploadModal';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const AdminAnnouncementsPage: React.FC<{
  announcements: Announcement[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}> = ({ announcements, onRefresh, showToast }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [titleUrdu, setTitleUrdu] = useState('');
  const [content, setContent] = useState('');
  const [contentUrdu, setContentUrdu] = useState('');
  const [category, setCategory] = useState('Admissions');
  const [imageUrl, setImageUrl] = useState('');
  const [actionLink, setActionLink] = useState('/admission');
  const [isPublished, setIsPublished] = useState(true);

  const openCreate = () => {
    setEditingAnn(null);
    setTitle('');
    setTitleUrdu('');
    setContent('');
    setContentUrdu('');
    setCategory('Admissions');
    setImageUrl('');
    setActionLink('/admission');
    setIsPublished(true);
    setModalOpen(true);
  };

  const openEdit = (a: Announcement) => {
    setEditingAnn(a);
    setTitle(a.title);
    setTitleUrdu(a.titleUrdu || '');
    setContent(a.content);
    setContentUrdu(a.contentUrdu || '');
    setCategory(a.category || 'Admissions');
    setImageUrl(a.imageUrl || '');
    setActionLink(a.actionLink || '/admission');
    setIsPublished(a.isPublished);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast('Title and content are required.', 'error');
      return;
    }

    try {
      setIsSaving(true);
      await saveAnnouncement(
        {
          title: title.trim(),
          titleUrdu: titleUrdu.trim(),
          content: content.trim(),
          contentUrdu: contentUrdu.trim(),
          category,
          imageUrl: imageUrl.trim(),
          actionLink: actionLink.trim(),
          isPublished,
          publishedAt: new Date().toLocaleDateString([], { month: 'short', year: 'numeric' }),
        },
        editingAnn?.id
      );
      setIsSaving(false);
      setModalOpen(false);
      showToast(editingAnn ? 'Announcement updated.' : 'Announcement created.');
      onRefresh();
    } catch (err: any) {
      setIsSaving(false);
      showToast(err.message || 'Failed to save announcement.', 'error');
    }
  };

  const [deleteConfirmAnn, setDeleteConfirmAnn] = useState<Announcement | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteConfirmAnn) return;
    try {
      setIsDeleting(true);
      await deleteAnnouncement(deleteConfirmAnn.id);
      showToast('Announcement removed.');
      setDeleteConfirmAnn(null);
      setIsDeleting(false);
      onRefresh();
    } catch (err: any) {
      setIsDeleting(false);
      showToast(err.message || 'Failed to delete announcement.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">Publish academy notices, Ramadan programs, and admission updates.</p>
        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-[#075E46] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>New Announcement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span className="font-bold text-[#075E46] bg-emerald-50 px-2 py-0.5 rounded">
                  {a.category}
                </span>
                <span>{a.publishedAt}</span>
              </div>
              <h4 className="font-bold text-base text-[#24352F]">{a.title}</h4>
              <p className="text-xs text-gray-600 line-clamp-3 mt-2">{a.content}</p>
              {a.imageUrl && (
                <img src={a.imageUrl} alt="Poster" className="h-32 w-full object-cover rounded-xl mt-3" />
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  a.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {a.isPublished ? 'Published' : 'Hidden'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(a)}
                  className="p-1.5 text-gray-600 hover:text-[#075E46] rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmAnn(a)}
                  className="p-1.5 text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[#075E46] mb-4">
              {editingAnn ? 'Edit Announcement' : 'Create New Announcement'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Title (English) *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Title (Urdu)</label>
                <input
                  type="text"
                  value={titleUrdu}
                  onChange={(e) => setTitleUrdu(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Content (English) *</label>
                <textarea
                  rows={3}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Content (Urdu)</label>
                <textarea
                  rows={2}
                  value={contentUrdu}
                  onChange={(e) => setContentUrdu(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Image or Poster</label>
                <div className="flex gap-2">
                  <input
                    type="text"
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
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700 pt-1">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded text-[#075E46]"
                />
                <span>Published on Website</span>
              </label>

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
                  {isSaving ? 'Saving...' : 'Save'}
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
        folder="announcements"
        title="Upload Announcement Poster"
      />

      <ConfirmModal
        isOpen={Boolean(deleteConfirmAnn)}
        title="Delete Announcement"
        message={`Are you sure you want to permanently delete the announcement "${deleteConfirmAnn?.title}"?`}
        confirmText="Yes, Delete Announcement"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => {
          if (!isDeleting) setDeleteConfirmAnn(null);
        }}
      />
    </div>
  );
};
