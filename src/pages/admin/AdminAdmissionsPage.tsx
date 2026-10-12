import React, { useState } from 'react';
import { FileCheck2, Search, Phone, Mail, Clock, Calendar, Check, X, Trash2, Edit3, RefreshCw } from 'lucide-react';
import { Admission } from '../../types';
import { updateAdmissionStatus, deleteAdmission } from '../../firebase/services';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const AdminAdmissionsPage: React.FC<{
  admissions: Admission[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}> = ({ admissions, onRefresh, showToast }) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAdmission, setActiveAdmission] = useState<Admission | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
      showToast('داخلہ درخواستیں اپڈیٹ ہو گئیں! (Admissions synchronized)');
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const filtered = admissions.filter((a) => {
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    const q = searchQuery.toLowerCase();
    return (
      a.studentName.toLowerCase().includes(q) ||
      a.phone.toLowerCase().includes(q) ||
      a.courseTitle.toLowerCase().includes(q)
    );
  });

  const handleStatusChange = async (id: string, newStatus: Admission['status'], notes?: string) => {
    try {
      await updateAdmissionStatus(id, newStatus, notes);
      showToast(`Admission application status updated to "${newStatus}".`);
      onRefresh();
      if (activeAdmission && activeAdmission.id === id) {
        setActiveAdmission({ ...activeAdmission, status: newStatus, notes: notes || activeAdmission.notes });
      }
    } catch (err: any) {
      showToast(err.message || 'Could not update status.', 'error');
    }
  };

  const [deleteConfirmAdm, setDeleteConfirmAdm] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteConfirmAdm) return;
    try {
      setIsDeleting(true);
      await deleteAdmission(deleteConfirmAdm.id);
      showToast(`Application for "${deleteConfirmAdm.name}" deleted.`);
      if (activeAdmission?.id === deleteConfirmAdm.id) setActiveAdmission(null);
      setDeleteConfirmAdm(null);
      setIsDeleting(false);
      onRefresh();
    } catch (err: any) {
      setIsDeleting(false);
      showToast(err.message || 'Could not delete application.', 'error');
    }
  };

  const openDetailModal = (a: Admission) => {
    setActiveAdmission(a);
    setAdminNotes(a.notes || '');
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by student name, phone or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Filter buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { key: 'all', label: `All (${admissions.length})` },
              { key: 'pending', label: `Pending (${admissions.filter((a) => a.status === 'pending').length})` },
              { key: 'contacted', label: `Contacted (${admissions.filter((a) => a.status === 'contacted').length})` },
              { key: 'enrolled', label: `Enrolled (${admissions.filter((a) => a.status === 'enrolled').length})` },
              { key: 'rejected', label: `Rejected (${admissions.filter((a) => a.status === 'rejected').length})` },
            ].map((st) => (
              <button
                key={st.key}
                onClick={() => setFilterStatus(st.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${
                  filterStatus === st.key
                    ? 'bg-[#075E46] text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-50 text-[#075E46] text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all flex-shrink-0 disabled:opacity-50"
            title="Refresh from cloud database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#D4AF37]' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync'}</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F3F8F4] text-gray-700 font-bold border-b border-gray-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Student & Guardian</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Submitted At</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No admission applications found.
                  </td>
                </tr>
              ) : (
                filtered.map((adm) => (
                  <tr key={adm.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900">{adm.studentName}</div>
                      {adm.guardianName && (
                        <div className="text-[11px] text-gray-400">Guardian: {adm.guardianName}</div>
                      )}
                      {adm.age && <div className="text-[10px] text-emerald-700">Age/Level: {adm.age}</div>}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      <div className="font-medium">{adm.phone}</div>
                      {adm.email && <div className="text-[11px] text-gray-400">{adm.email}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#075E46]">{adm.courseTitle}</div>
                      <div className="text-[10px] text-gray-400">{adm.classMode || 'Online'}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-[11px]">
                      {new Date(adm.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={adm.status}
                        onChange={(e) =>
                          handleStatusChange(adm.id, e.target.value as Admission['status'])
                        }
                        className={`text-[11px] font-bold uppercase rounded-lg px-2.5 py-1 border transition-colors ${
                          adm.status === 'pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : adm.status === 'contacted'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : adm.status === 'enrolled'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="enrolled">Enrolled</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => openDetailModal(adm)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-[#075E46] hover:bg-emerald-100 transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => setDeleteConfirmAdm({ id: adm.id, name: adm.studentName })}
                        className="p-1 rounded-lg text-gray-400 hover:text-red-700 hover:bg-red-50 transition-colors"
                        title="Delete application"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {activeAdmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveAdmission(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-[#075E46] uppercase bg-emerald-50 px-2.5 py-1 rounded">
              Application Details
            </span>
            <h3 className="text-2xl font-bold text-[#24352F] mt-2">
              {activeAdmission.studentName}
            </h3>

            <div className="mt-4 space-y-3 text-xs text-gray-700 bg-[#F3F8F4] p-4 rounded-2xl">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Course Applied:</span>
                <span className="font-bold text-[#075E46]">{activeAdmission.courseTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Guardian Name:</span>
                <span>{activeAdmission.guardianName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Contact Number:</span>
                <span className="font-mono font-bold text-[#24352F]">{activeAdmission.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Email:</span>
                <span>{activeAdmission.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Class Mode:</span>
                <span>{activeAdmission.classMode || 'Online'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Preferred Timings:</span>
                <span>{activeAdmission.preferredTiming || 'Flexible'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">Submitted Date:</span>
                <span>{new Date(activeAdmission.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {activeAdmission.message && (
              <div className="mt-4">
                <span className="text-xs font-bold text-gray-500 block mb-1">Applicant Message:</span>
                <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  {activeAdmission.message}
                </p>
              </div>
            )}

            {/* Admin Private Notes */}
            <div className="mt-4">
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Private Admin Notes & Trial Log:
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Called parent on 11 Oct, trial scheduled with Ustadha Ayesha for Tuesday 6 PM..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-300"
              />
            </div>

            <div className="mt-5 flex items-center justify-between pt-4 border-t border-gray-100">
              <a
                href={`https://wa.me/${activeAdmission.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Assalamu Alaikum ${activeAdmission.guardianName || activeAdmission.studentName}, contacting you from Noor Al-Quran Academy regarding your admission application for ${activeAdmission.courseTitle}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
              >
                Contact on WhatsApp
              </a>

              <button
                onClick={() => handleStatusChange(activeAdmission.id, activeAdmission.status, adminNotes)}
                className="px-5 py-2 rounded-xl bg-[#075E46] text-white text-xs font-bold hover:bg-[#064e3b]"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmAdm)}
        title="Delete Admission Application"
        message={`Are you sure you want to permanently delete the application for "${deleteConfirmAdm?.name}"?`}
        confirmText="Yes, Delete Application"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => {
          if (!isDeleting) setDeleteConfirmAdm(null);
        }}
      />
    </div>
  );
};
