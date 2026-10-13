import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Image as ImageIcon, Loader2, Check } from 'lucide-react';
import { Teacher } from '../../types';
import { saveTeacher, deleteTeacher } from '../../firebase/services';
import { ImageUploadModal } from '../../components/common/ImageUploadModal';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const AdminTeachersPage: React.FC<{
  teachers: Teacher[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}> = ({ teachers, onRefresh, showToast }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [nameUrdu, setNameUrdu] = useState('');
  const [qualification, setQualification] = useState('');
  const [qualificationUrdu, setQualificationUrdu] = useState('');
  const [subjects, setSubjects] = useState('');
  const [experience, setExperience] = useState('5+ Years Experience');
  const [gender, setGender] = useState('Male');
  const [bio, setBio] = useState('');
  const [bioUrdu, setBioUrdu] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const openCreateModal = () => {
    setEditingTeacher(null);
    setName('');
    setNameUrdu('');
    setQualification('');
    setQualificationUrdu('');
    setSubjects('');
    setExperience('5+ Years Experience');
    setGender('Male');
    setBio('');
    setBioUrdu('');
    setImageUrl('/images/qari_teacher_male.jpg');
    setIsPublished(true);
    setModalOpen(true);
  };

  const openEditModal = (t: Teacher) => {
    setEditingTeacher(t);
    setName(t.name);
    setNameUrdu(t.nameUrdu || '');
    setQualification(t.qualification);
    setQualificationUrdu(t.qualificationUrdu || '');
    setSubjects(t.subjects || '');
    setExperience(t.experience || '');
    setGender(t.gender || 'Male');
    setBio(t.bio || '');
    setBioUrdu(t.bioUrdu || '');
    setImageUrl(t.imageUrl || (t.gender === 'Female' ? '/images/female_quran_tutor.jpg' : '/images/qari_teacher_male.jpg'));
    setIsPublished(t.isPublished);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !qualification.trim()) {
      showToast('Please enter the teacher name and qualification.', 'error');
      return;
    }

    try {
      setIsSaving(true);
      await saveTeacher(
        {
          name: name.trim(),
          nameUrdu: nameUrdu.trim(),
          qualification: qualification.trim(),
          qualificationUrdu: qualificationUrdu.trim(),
          subjects: subjects.trim(),
          experience: experience.trim(),
          gender,
          bio: bio.trim(),
          bioUrdu: bioUrdu.trim(),
          imageUrl: imageUrl.trim() || (gender === 'Female' ? '/images/female_quran_tutor.jpg' : '/images/qari_teacher_male.jpg'),
          isPublished,
        },
        editingTeacher?.id
      );
      setIsSaving(false);
      setModalOpen(false);
      showToast(editingTeacher ? 'Teacher profile updated.' : 'Teacher profile created.');
      onRefresh();
    } catch (err: any) {
      setIsSaving(false);
      showToast(err.message || 'Failed to save teacher profile.', 'error');
    }
  };

  const handleTogglePublish = async (t: Teacher) => {
    try {
      await saveTeacher({ ...t, isPublished: !t.isPublished }, t.id);
      showToast(`Teacher profile is now ${!t.isPublished ? 'Published' : 'Hidden'}.`);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Could not update status.', 'error');
    }
  };

  const [deleteConfirmTeacher, setDeleteConfirmTeacher] = useState<Teacher | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteConfirmTeacher) return;
    try {
      setIsDeleting(true);
      await deleteTeacher(deleteConfirmTeacher.id);
      showToast(`Teacher "${deleteConfirmTeacher.name}" profile deleted.`);
      setDeleteConfirmTeacher(null);
      setIsDeleting(false);
      onRefresh();
    } catch (err: any) {
      setIsDeleting(false);
      showToast(err.message || 'Could not delete teacher profile.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">Manage published instructors and private staff credentials.</p>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-[#075E46] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Add New Teacher</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    teacher.imageUrl
                      ? teacher.imageUrl.replace('/src/assets/images/', '/images/')
                      : teacher.gender === 'Female' || teacher.name.toLowerCase().includes('ayesha')
                      ? '/images/female_quran_tutor.jpg'
                      : '/images/qari_teacher_male.jpg'
                  }
                  alt={teacher.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    if (teacher.gender === 'Female' || teacher.name.toLowerCase().includes('ayesha')) {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80';
                    } else {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80';
                    }
                  }}
                  className="w-16 h-16 rounded-xl object-cover border border-emerald-100"
                />
                <div>
                  <h4 className="font-bold text-sm text-[#24352F]">{teacher.name}</h4>
                  <span className="text-xs text-emerald-700 font-medium block">{teacher.qualification}</span>
                  <span className="text-[10px] text-gray-400 block">{teacher.gender} • {teacher.experience}</span>
                </div>
              </div>

              {teacher.subjects && (
                <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl mb-3">
                  <span className="font-bold text-[#075E46] block text-[11px]">Specialties:</span>
                  {teacher.subjects}
                </div>
              )}

              <p className="text-xs text-gray-500 line-clamp-3">{teacher.bio}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => handleTogglePublish(teacher)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1 ${
                  teacher.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {teacher.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>{teacher.isPublished ? 'Published' : 'Hidden'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(teacher)}
                  className="p-1.5 text-gray-600 hover:text-[#075E46] hover:bg-emerald-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmTeacher(teacher)}
                  className="p-1.5 text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                  title="Delete Teacher"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[#075E46] mb-4">
              {editingTeacher ? 'Edit Teacher Profile' : 'Add New Instructor'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Teacher Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Teacher Name (Urdu)</label>
                  <input
                    type="text"
                    value={nameUrdu}
                    onChange={(e) => setNameUrdu(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Qualification *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hafiz-ul-Quran & Alim"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female (Sisters & Kids Tutor)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Specialties & Subjects</label>
                <input
                  type="text"
                  placeholder="e.g. Noorani Qaida, Advanced Tajweed, Hifz"
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Biography</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Teacher Photograph / Quranic Avatar</label>
                
                {/* Presets */}
                <div className="mb-2 p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200">
                  <span className="block text-[11px] font-bold text-[#075E46] mb-1.5">
                    Click to select dignified Quranic teacher portrait:
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setImageUrl('/images/qari_teacher_male.jpg')}
                      className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                        imageUrl === '/images/qari_teacher_male.jpg'
                          ? 'border-[#075E46] bg-white text-[#075E46] ring-2 ring-[#075E46]/30 font-bold'
                          : 'border-gray-200 bg-white hover:bg-emerald-50 text-gray-700'
                      }`}
                    >
                      <img src="/images/qari_teacher_male.jpg" className="w-6 h-6 rounded-md object-cover" alt="Qari" />
                      <span>Qari (Male)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUrl('/images/female_quran_tutor.jpg')}
                      className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                        imageUrl === '/images/female_quran_tutor.jpg'
                          ? 'border-[#075E46] bg-white text-[#075E46] ring-2 ring-[#075E46]/30 font-bold'
                          : 'border-gray-200 bg-white hover:bg-emerald-50 text-gray-700'
                      }`}
                    >
                      <img src="/images/female_quran_tutor.jpg" className="w-6 h-6 rounded-md object-cover" alt="Ustadha" />
                      <span>Ustadha (Female)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUrl('/images/islamic_scholar_mufti.jpg')}
                      className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                        imageUrl === '/images/islamic_scholar_mufti.jpg'
                          ? 'border-[#075E46] bg-white text-[#075E46] ring-2 ring-[#075E46]/30 font-bold'
                          : 'border-gray-200 bg-white hover:bg-emerald-50 text-gray-700'
                      }`}
                    >
                      <img src="/images/islamic_scholar_mufti.jpg" className="w-6 h-6 rounded-md object-cover" alt="Mufti" />
                      <span>Mufti / Scholar</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Image URL or choose preset above"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setImageModalOpen(true)}
                    className="px-3 py-2 bg-emerald-50 text-[#075E46] rounded-xl text-xs font-bold flex items-center gap-1 border border-emerald-200"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Upload File</span>
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 pt-1">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded text-[#075E46]"
                />
                <span>Publish on Public Faculty Page</span>
              </label>

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
                  className="px-6 py-2 rounded-xl text-xs font-bold bg-[#075E46] text-white hover:bg-[#064e3b] disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Teacher Profile'}
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
        folder="teachers"
        title="Upload Teacher Photograph"
      />

      <ConfirmModal
        isOpen={Boolean(deleteConfirmTeacher)}
        title="Delete Teacher Profile"
        message={`Are you sure you want to permanently delete the profile of "${deleteConfirmTeacher?.name}"? This action cannot be undone.`}
        confirmText="Yes, Delete Profile"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => {
          if (!isDeleting) setDeleteConfirmTeacher(null);
        }}
      />
    </div>
  );
};
