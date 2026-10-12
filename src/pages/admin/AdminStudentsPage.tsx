import React, { useState, useEffect } from 'react';
import { Plus, GraduationCap, DollarSign, Search, Edit, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Student, StudentFee, Course } from '../../types';
import {
  getAllStudents,
  saveStudent,
  deleteStudent,
  getAllStudentFees,
  saveStudentFee,
  deleteStudentFee,
} from '../../firebase/services';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const AdminStudentsPage: React.FC<{
  courses: Course[];
  onRefresh?: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}> = ({ courses, onRefresh, showToast }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [fees, setFees] = useState<StudentFee[]>([]);
  const [activeTab, setActiveTab] = useState<'students' | 'fees'>('students');
  const [searchQuery, setSearchQuery] = useState('');

  // Student modal
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [sName, setSName] = useState('');
  const [sGuardian, setSGuardian] = useState('');
  const [sPhone, setSPhone] = useState('+92 ');
  const [sEmail, setSEmail] = useState('');
  const [sCourseTitle, setSCourseTitle] = useState('');
  const [sEnrollmentDate, setSEnrollmentDate] = useState(new Date().toISOString().slice(0, 10));
  const [sStatus, setSStatus] = useState<Student['status']>('active');
  const [sFeeStatus, setSFeeStatus] = useState<Student['feeStatus']>('paid');
  const [sMonthlyFee, setSMonthlyFee] = useState(4500);
  const [sNotes, setSNotes] = useState('');

  // Fee modal
  const [feeModalOpen, setFeeModalOpen] = useState(false);
  const [selectedStudentForFee, setSelectedStudentForFee] = useState<Student | null>(null);
  const [fMonth, setFMonth] = useState('October');
  const [fYear, setFYear] = useState(2026);
  const [fAmount, setFAmount] = useState(4500);
  const [fStatus, setFStatus] = useState<StudentFee['status']>('paid');
  const [fNotes, setFNotes] = useState('');

  const loadData = async () => {
    try {
      const [stuData, feeData] = await Promise.all([getAllStudents(), getAllStudentFees()]);
      setStudents(stuData || []);
      setFees(feeData || []);
    } catch (e: any) {
      console.warn('Could not load student records:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddStudent = () => {
    setEditingStudent(null);
    setSName('');
    setSGuardian('');
    setSPhone('+92 ');
    setSEmail('');
    setSCourseTitle(courses[0]?.title || 'Noorani Qaida for Beginners');
    setSEnrollmentDate(new Date().toISOString().slice(0, 10));
    setSStatus('active');
    setSFeeStatus('paid');
    setSMonthlyFee(4500);
    setSNotes('');
    setStudentModalOpen(true);
  };

  const openEditStudent = (s: Student) => {
    setEditingStudent(s);
    setSName(s.name);
    setSGuardian(s.guardianName || '');
    setSPhone(s.phone);
    setSEmail(s.email || '');
    setSCourseTitle(s.courseTitle);
    setSEnrollmentDate(s.enrollmentDate);
    setSStatus(s.status);
    setSFeeStatus(s.feeStatus);
    setSMonthlyFee(s.monthlyFeePkr || 4500);
    setSNotes(s.notes || '');
    setStudentModalOpen(true);
  };

  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sName.trim() || !sPhone.trim()) {
      showToast('Student name and contact phone are required.', 'error');
      return;
    }

    try {
      await saveStudent(
        {
          name: sName.trim(),
          guardianName: sGuardian.trim(),
          phone: sPhone.trim(),
          email: sEmail.trim(),
          courseTitle: sCourseTitle,
          enrollmentDate: sEnrollmentDate,
          status: sStatus,
          feeStatus: sFeeStatus,
          monthlyFeePkr: Number(sMonthlyFee),
          notes: sNotes.trim(),
        },
        editingStudent?.id
      );
      setStudentModalOpen(false);
      showToast(editingStudent ? 'Student updated.' : 'Student enrolled.');
      loadData();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to save student.', 'error');
    }
  };

  const [deleteConfirmStudent, setDeleteConfirmStudent] = useState<Student | null>(null);
  const [deleteConfirmFeeId, setDeleteConfirmFeeId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDeleteStudent = async () => {
    if (!deleteConfirmStudent) return;
    try {
      setIsDeleting(true);
      await deleteStudent(deleteConfirmStudent.id);
      showToast(`Student "${deleteConfirmStudent.name}" removed.`);
      setDeleteConfirmStudent(null);
      setIsDeleting(false);
      loadData();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setIsDeleting(false);
      showToast(err.message || 'Could not delete student.', 'error');
    }
  };

  const openAddFeeRecord = (s: Student) => {
    setSelectedStudentForFee(s);
    setFAmount(s.monthlyFeePkr || 4500);
    setFMonth('October');
    setFYear(2026);
    setFStatus('paid');
    setFNotes('');
    setFeeModalOpen(true);
  };

  const handleSaveFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForFee) return;

    try {
      await saveStudentFee({
        studentId: selectedStudentForFee.id,
        studentName: selectedStudentForFee.name,
        month: fMonth,
        year: fYear,
        amountPkr: Number(fAmount),
        status: fStatus,
        paidDate: fStatus === 'paid' ? new Date().toISOString().slice(0, 10) : '',
        receiptNotes: fNotes.trim(),
      });
      setFeeModalOpen(false);
      showToast(`Fee receipt recorded for ${selectedStudentForFee.name}.`);
      loadData();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to record fee.', 'error');
    }
  };

  const confirmDeleteFee = async () => {
    if (!deleteConfirmFeeId) return;
    try {
      setIsDeleting(true);
      await deleteStudentFee(deleteConfirmFeeId);
      showToast('Fee entry removed.');
      setDeleteConfirmFeeId(null);
      setIsDeleting(false);
      loadData();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setIsDeleting(false);
      showToast(err.message || 'Could not delete fee entry.', 'error');
    }
  };

  const filteredStudents = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.phone.toLowerCase().includes(q) || s.courseTitle.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 ${
              activeTab === 'students'
                ? 'border-[#075E46] text-[#075E46]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <GraduationCap className="w-4 h-4" /> Enrolled Students ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 ${
              activeTab === 'fees'
                ? 'border-[#075E46] text-[#075E46]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <DollarSign className="w-4 h-4" /> Monthly Fee Records ({fees.length})
          </button>
        </div>

        {activeTab === 'students' && (
          <button
            onClick={openAddStudent}
            className="px-4 py-2.5 rounded-xl bg-[#075E46] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>Enroll New Student</span>
          </button>
        )}
      </div>

      {activeTab === 'students' ? (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 bg-white"
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F3F8F4] text-gray-700 font-bold border-b border-gray-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Student & Guardian</th>
                    <th className="py-3 px-4">Enrolled Course</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Fee Status</th>
                    <th className="py-3 px-4">Monthly Fee</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-gray-400">
                        No enrolled students found. Click "Enroll New Student" to add student records.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50/60">
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900">{s.name}</div>
                          {s.guardianName && (
                            <div className="text-[11px] text-gray-400">Parent: {s.guardianName}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#075E46]">{s.courseTitle}</td>
                        <td className="py-3 px-4 text-gray-700 font-mono">{s.phone}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              s.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              s.feeStatus === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : s.feeStatus === 'partial'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {s.feeStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-gray-800">
                          Rs. {s.monthlyFeePkr?.toLocaleString() || '4,500'}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => openAddFeeRecord(s)}
                            className="px-2 py-1 text-[11px] font-semibold bg-emerald-50 text-[#075E46] hover:bg-emerald-100 rounded-md"
                            title="Record Fee Payment"
                          >
                            + Fee Record
                          </button>
                          <button
                            onClick={() => openEditStudent(s)}
                            className="p-1 text-gray-500 hover:text-[#075E46]"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmStudent(s)}
                            className="p-1 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded"
                            title="Delete student"
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
        </div>
      ) : (
        /* Fee Records List */
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F3F8F4] text-gray-700 font-bold border-b border-gray-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Paid Date</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {fees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      No fee records logged yet. Use "+ Fee Record" on a student to add receipts.
                    </td>
                  </tr>
                ) : (
                  fees.map((f) => (
                    <tr key={f.id} className="hover:bg-gray-50/60">
                      <td className="py-3 px-4 font-bold text-gray-900">{f.studentName}</td>
                      <td className="py-3 px-4 font-medium text-gray-700">
                        {f.month} {f.year}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#075E46]">
                        Rs. {f.amountPkr.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            f.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {f.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{f.paidDate || 'Pending'}</td>
                      <td className="py-3 px-4 text-gray-400 text-[11px]">{f.receiptNotes || '-'}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setDeleteConfirmFeeId(f.id)}
                          className="p-1 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded"
                          title="Delete fee record"
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
      )}

      {/* Student Modal */}
      {studentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[#075E46] mb-4">
              {editingStudent ? 'Edit Student Record' : 'Enroll New Student'}
            </h3>

            <form onSubmit={handleSaveStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={sName}
                  onChange={(e) => setSName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Parent / Guardian Name</label>
                <input
                  type="text"
                  value={sGuardian}
                  onChange={(e) => setSGuardian(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={sPhone}
                    onChange={(e) => setSPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={sEmail}
                    onChange={(e) => setSEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Assigned Quran Course</label>
                <select
                  value={sCourseTitle}
                  onChange={(e) => setSCourseTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Status</label>
                  <select
                    value={sStatus}
                    onChange={(e) => setSStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="graduated">Graduated</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Monthly Fee (PKR)</label>
                  <input
                    type="number"
                    value={sMonthlyFee}
                    onChange={(e) => setSMonthlyFee(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Private Teacher / Admin Notes</label>
                <textarea
                  rows={2}
                  value={sNotes}
                  onChange={(e) => setSNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStudentModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#075E46] text-white font-bold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fee Payment Modal */}
      {feeModalOpen && selectedStudentForFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-[#075E46] mb-1">
              Record Fee Payment
            </h3>
            <p className="text-xs text-gray-500 mb-4">{selectedStudentForFee.name}</p>

            <form onSubmit={handleSaveFee} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Month</label>
                  <select
                    value={fMonth}
                    onChange={(e) => setFMonth(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-300 bg-white"
                  >
                    {[
                      'January',
                      'February',
                      'March',
                      'April',
                      'May',
                      'June',
                      'July',
                      'August',
                      'September',
                      'October',
                      'November',
                      'December',
                    ].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={fYear}
                    onChange={(e) => setFYear(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Amount (PKR)</label>
                <input
                  type="number"
                  value={fAmount}
                  onChange={(e) => setFAmount(Number(e.target.value))}
                  className="w-full p-2 rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Fee Status</label>
                <select
                  value={fStatus}
                  onChange={(e) => setFStatus(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-gray-300 bg-white"
                >
                  <option value="paid">Paid (JazzCash / EasyPaisa / Bank)</option>
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Receipt Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Bank Ref #12345 or Cash receipt"
                  value={fNotes}
                  onChange={(e) => setFNotes(e.target.value)}
                  className="w-full p-2 rounded-xl border border-gray-300"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFeeModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#075E46] text-white font-bold"
                >
                  Save Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Delete Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmStudent)}
        title="Delete Student Record"
        message={`Are you sure you want to permanently delete student "${deleteConfirmStudent?.name}"?`}
        confirmText="Yes, Delete Student"
        isLoading={isDeleting}
        onConfirm={confirmDeleteStudent}
        onClose={() => {
          if (!isDeleting) setDeleteConfirmStudent(null);
        }}
      />

      {/* Fee Delete Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmFeeId)}
        title="Delete Fee Record"
        message="Are you sure you want to permanently delete this fee entry?"
        confirmText="Yes, Delete Fee"
        isLoading={isDeleting}
        onConfirm={confirmDeleteFee}
        onClose={() => {
          if (!isDeleting) setDeleteConfirmFeeId(null);
        }}
      />
    </div>
  );
};
