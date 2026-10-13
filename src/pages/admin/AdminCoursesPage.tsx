import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Image as ImageIcon, Loader2, Check } from 'lucide-react';
import { Course } from '../../types';
import { saveCourse, deleteCourse } from '../../firebase/services';
import { ImageUploadModal } from '../../components/common/ImageUploadModal';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { resolveImageUrl } from '../../utils/imageHelpers';

export const AdminCoursesPage: React.FC<{
  courses: Course[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}> = ({ courses, onRefresh, showToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [titleUrdu, setTitleUrdu] = useState('');
  const [category, setCategory] = useState('Noorani Qaida');
  const [description, setDescription] = useState('');
  const [descriptionUrdu, setDescriptionUrdu] = useState('');
  const [duration, setDuration] = useState('3 to 4 Months');
  const [classMode, setClassMode] = useState('1-on-1 Live Online');
  const [timing, setTiming] = useState('Flexible Timings');
  const [feePkr, setFeePkr] = useState('Rs. 4,500 / month');
  const [imageUrl, setImageUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const openCreateModal = () => {
    setEditingCourse(null);
    setTitle('');
    setTitleUrdu('');
    setCategory('Noorani Qaida');
    setDescription('');
    setDescriptionUrdu('');
    setDuration('3 to 4 Months');
    setClassMode('1-on-1 Live Online');
    setTiming('Flexible Timings');
    setFeePkr('Rs. 4,500 / month');
    setImageUrl('https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80');
    setIsPublished(true);
    setIsFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (c: Course) => {
    setEditingCourse(c);
    setTitle(c.title);
    setTitleUrdu(c.titleUrdu || '');
    setCategory(c.category);
    setDescription(c.description);
    setDescriptionUrdu(c.descriptionUrdu || '');
    setDuration(c.duration || '');
    setClassMode(c.classMode || '');
    setTiming(c.timing || '');
    setFeePkr(c.feePkr || '');
    setImageUrl(c.imageUrl || '');
    setIsPublished(c.isPublished);
    setIsFeatured(c.isFeatured || false);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Please provide a course title and description.', 'error');
      return;
    }

    try {
      setIsSaving(true);
      await saveCourse(
        {
          title: title.trim(),
          titleUrdu: titleUrdu.trim(),
          category,
          description: description.trim(),
          descriptionUrdu: descriptionUrdu.trim(),
          duration: duration.trim(),
          classMode: classMode.trim(),
          timing: timing.trim(),
          feePkr: feePkr.trim(),
          imageUrl: imageUrl.trim(),
          isPublished,
          isFeatured,
          order: editingCourse?.order || courses.length + 1,
        },
        editingCourse?.id
      );
      setIsSaving(false);
      setModalOpen(false);
      showToast(editingCourse ? 'Course updated successfully.' : 'New course created successfully.');
      onRefresh();
    } catch (err: any) {
      setIsSaving(false);
      showToast(err.message || 'Failed to save course.', 'error');
    }
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      await saveCourse({ ...course, isPublished: !course.isPublished }, course.id);
      showToast(`Course "${course.title}" is now ${!course.isPublished ? 'Published' : 'Unpublished'}.`);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Could not update status.', 'error');
    }
  };

  const [deleteConfirmCourse, setDeleteConfirmCourse] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteConfirmCourse) return;
    try {
      setIsDeleting(true);
      await deleteCourse(deleteConfirmCourse.id);
      showToast(`Course "${deleteConfirmCourse.title}" deleted.`);
      setDeleteConfirmCourse(null);
      setIsDeleting(false);
      onRefresh();
    } catch (err: any) {
      setIsDeleting(false);
      showToast(err.message || 'Could not delete course.', 'error');
    }
  };

  const filtered = courses.filter((c) => {
    const q = searchQuery.toLowerCase();
    return c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search courses by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46]"
          />
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-[#075E46] hover:bg-[#064e3b] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Courses Table / Cards */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F3F8F4] text-gray-700 font-bold border-b border-gray-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Duration & Mode</th>
                <th className="py-3 px-4">Fee (PKR)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={resolveImageUrl(c.imageUrl, 'course')}
                        alt={c.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=200&q=80';
                        }}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <div>
                        <div className="font-bold text-gray-900">{c.title}</div>
                        {c.isFeatured && (
                          <span className="text-[10px] font-bold text-[#D4AF37] uppercase">Featured</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-50 text-[#075E46] px-2 py-0.5 rounded font-medium">
                      {c.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    <div>{c.duration || 'Flexible'}</div>
                    <div className="text-[11px] text-gray-400">{c.classMode || '1-on-1 Live'}</div>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#075E46]">
                    {c.feePkr || 'Contact desk'}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleTogglePublish(c)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                        c.isPublished
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {c.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{c.isPublished ? 'Published' : 'Hidden'}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(c)}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-[#075E46] hover:bg-emerald-50 transition-colors"
                      title="Edit Course"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmCourse(c)}
                      className="p-1.5 rounded-lg text-gray-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Edit/Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[#075E46] mb-4">
              {editingCourse ? 'Edit Course Record' : 'Create New Quran Course'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Course Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Course Title (Urdu)</label>
                  <input
                    type="text"
                    placeholder="مثال: نورانی قاعدہ"
                    value={titleUrdu}
                    onChange={(e) => setTitleUrdu(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="Noorani Qaida">Noorani Qaida</option>
                    <option value="Quran Nazra">Quran Nazra</option>
                    <option value="Quran with Tajweed">Quran with Tajweed</option>
                    <option value="Hifz-ul-Quran">Hifz-ul-Quran</option>
                    <option value="Quran Translation">Quran Translation</option>
                    <option value="Tafseer">Tafseer</option>
                    <option value="Islamic Studies">Islamic Studies</option>
                    <option value="Daily Duas and basic Islamic education">Daily Duas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Monthly Fee (PKR)</label>
                  <input
                    type="text"
                    placeholder="e.g. Rs. 4,500 / month"
                    value={feePkr}
                    onChange={(e) => setFeePkr(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 3 to 4 Months"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description (English) *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description (Urdu)</label>
                <textarea
                  rows={2}
                  value={descriptionUrdu}
                  onChange={(e) => setDescriptionUrdu(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300"
                />
              </div>

              {/* Image URL with Media Manager Upload modal trigger */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Course Thumbnail Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Image URL or upload..."
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setImageModalOpen(true)}
                    className="px-3 py-2 bg-emerald-50 text-[#075E46] hover:bg-emerald-100 rounded-xl text-xs font-bold flex items-center gap-1 border border-emerald-200"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Upload/Select</span>
                  </button>
                </div>
                {imageUrl && (
                  <img src={imageUrl} alt="Preview" className="h-20 w-32 object-cover rounded-lg mt-2 border border-gray-200" />
                )}
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded text-[#075E46]"
                  />
                  <span>Published on Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-[#075E46]"
                  />
                  <span>Featured on Homepage</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl text-xs font-bold bg-[#075E46] text-white hover:bg-[#064e3b] disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{editingCourse ? 'Save Changes' : 'Create Course'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Manager Upload Modal */}
      <ImageUploadModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onSelectImage={(url) => setImageUrl(url)}
        folder="courses"
        title="Upload Course Image"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmCourse)}
        title="Delete Course Record"
        message={`Are you sure you want to permanently delete the course "${deleteConfirmCourse?.title}"? This action cannot be undone.`}
        confirmText="Yes, Delete Course"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => {
          if (!isDeleting) setDeleteConfirmCourse(null);
        }}
      />
    </div>
  );
};
