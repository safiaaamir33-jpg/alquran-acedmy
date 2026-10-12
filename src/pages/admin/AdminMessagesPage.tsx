import React, { useState } from 'react';
import {
  Mail,
  CheckCircle2,
  Trash2,
  MessageCircle,
  Phone,
  Search,
  Globe,
  Eye,
  EyeOff,
  Send,
  CornerDownRight,
  RefreshCw,
  Plus,
  Loader2,
  Sparkles,
  X
} from 'lucide-react';
import { ContactMessage } from '../../types';
import {
  updateContactMessageStatus,
  deleteContactMessage,
  updateContactMessageShowOnWebsite,
  updateContactMessageReply,
  submitContactMessage,
} from '../../firebase/services';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const AdminMessagesPage: React.FC<{
  messages: ContactMessage[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}> = ({ messages, onRefresh, showToast }) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'public' | 'resolved'>('all');
  const [search, setSearch] = useState('');
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Manual inquiry modal
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [mName, setMName] = useState('');
  const [mPhone, setMPhone] = useState('+92 ');
  const [mEmail, setMEmail] = useState('');
  const [mSubject, setMSubject] = useState('');
  const [mMessage, setMMessage] = useState('');
  const [mShowOnWeb, setMShowOnWeb] = useState(false);
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName.trim() || !mMessage.trim()) {
      showToast('Client name and message are required.', 'error');
      return;
    }

    try {
      setIsSubmittingManual(true);
      await submitContactMessage({
        name: mName.trim(),
        phone: mPhone.trim(),
        email: mEmail.trim(),
        subject: mSubject.trim() || 'Direct Client Inquiry',
        message: mMessage.trim(),
        showOnWebsite: mShowOnWeb,
      });
      setIsSubmittingManual(false);
      setManualModalOpen(false);
      setMName('');
      setMPhone('+92 ');
      setMEmail('');
      setMSubject('');
      setMMessage('');
      showToast('Client message recorded successfully.');
      onRefresh();
    } catch (err: any) {
      setIsSubmittingManual(false);
      showToast(err.message || 'Failed to record message.', 'error');
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
      showToast('پیغامات اپڈیٹ ہو گئے! (Client messages synchronized)');
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const filtered = messages.filter((m) => {
    if (filter === 'unread' && m.status !== 'unread') return false;
    if (filter === 'public' && !m.showOnWebsite) return false;
    if (filter === 'resolved' && m.status !== 'resolved') return false;
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.phone && m.phone.toLowerCase().includes(q)) ||
      m.message.toLowerCase().includes(q)
    );
  });

  const handleStatus = async (id: string, status: ContactMessage['status']) => {
    try {
      await updateContactMessageStatus(id, status);
      showToast(`Inquiry marked as ${status}.`);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Could not update message.', 'error');
    }
  };

  const handleToggleShowOnWebsite = async (id: string, currentVal?: boolean) => {
    const newVal = !currentVal;
    try {
      await updateContactMessageShowOnWebsite(id, newVal);
      showToast(
        newVal
          ? 'پیغام اب ویب سائٹ پر سب کلائنٹس کو نظر آئے گا! (Message is now LIVE on public website)'
          : 'پیغام ویب سائٹ سے چھپا دیا گیا ہے۔ (Hidden from public website)'
      );
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Could not update website display.', 'error');
    }
  };

  const handleSaveReply = async (id: string) => {
    try {
      await updateContactMessageReply(id, replyInput.trim());
      setEditingReplyId(null);
      setReplyInput('');
      showToast('جواب ویب سائٹ پر محفوظ ہو گیا! (Academy reply published)');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Could not save reply.', 'error');
    }
  };

  const [deleteConfirmMsg, setDeleteConfirmMsg] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteConfirmMsg) return;
    try {
      setIsDeleting(true);
      await deleteContactMessage(deleteConfirmMsg.id);
      showToast('Message deleted.');
      setDeleteConfirmMsg(null);
      setIsDeleting(false);
      onRefresh();
    } catch (err: any) {
      setIsDeleting(false);
      showToast(err.message || 'Could not delete message.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Explaining Client Messages on Website */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs sm:text-sm text-[#075E46] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
          <div>
            <strong>ویب سائٹ پر کلائنٹ کے پیغامات دکھائیں (Client Feedback Wall):</strong>
            <p className="text-xs text-gray-600 mt-0.5">
              کسی بھی میسج کے نیچے "Show on Website" بٹن دبائیں تو وہ ویب سائٹ کے ہوم پیج، کانٹیکٹ پیج اور تاثرات میں نظر آئے گا۔
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-100/50 text-[#075E46] text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all disabled:opacity-50"
            title="Refresh from cloud database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#D4AF37]' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Live'}</span>
          </button>

          <button
            onClick={() => setManualModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#075E46] hover:bg-[#064e3b] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Record Inquiry</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search messages or inquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {(
            [
              { key: 'all', label: `All Inquiries (${messages.length})` },
              { key: 'unread', label: `Unread (${messages.filter((m) => m.status === 'unread').length})` },
              { key: 'public', label: `🌐 Live on Web (${messages.filter((m) => m.showOnWebsite).length})` },
              { key: 'resolved', label: `Resolved (${messages.filter((m) => m.status === 'resolved').length})` },
            ] as const
          ).map((st) => (
            <button
              key={st.key}
              onClick={() => setFilter(st.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === st.key
                  ? 'bg-[#075E46] text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 bg-white rounded-2xl border border-gray-200 text-xs">
            No inquiries match this filter.
          </div>
        ) : (
          filtered.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all ${
                msg.showOnWebsite
                  ? 'border-emerald-300 bg-emerald-50/20 shadow-xs'
                  : msg.status === 'unread'
                  ? 'border-blue-200 bg-blue-50/10'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      msg.showOnWebsite
                        ? 'bg-emerald-500'
                        : msg.status === 'unread'
                        ? 'bg-blue-600'
                        : 'bg-gray-300'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-[#24352F]">{msg.name}</h4>
                      {msg.showOnWebsite && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#075E46] flex items-center gap-1">
                          <Eye className="w-3 h-3 text-[#075E46]" />
                          <span>Live on Website</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {msg.phone && `${msg.phone} • `}
                      {msg.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-400">
                    {new Date(msg.createdAt).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      msg.status === 'unread'
                        ? 'bg-blue-100 text-blue-800'
                        : msg.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>
              </div>

              {msg.subject && (
                <div className="text-xs font-bold text-[#075E46] mt-3">
                  Subject: {msg.subject}
                </div>
              )}

              <p className="text-xs sm:text-sm text-gray-700 mt-2 leading-relaxed whitespace-pre-line bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                "{msg.message}"
              </p>

              {/* Academy Official Reply if exists */}
              {msg.replyText && (
                <div className="mt-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-1 font-bold text-[#075E46]">
                    <CornerDownRight className="w-3.5 h-3.5" />
                    <span>Official Academy Response (ویب سائٹ پر دکھایا گیا جواب):</span>
                  </div>
                  <p className="whitespace-pre-line italic">"{msg.replyText}"</p>
                </div>
              )}

              {/* Quick Reply Form if open */}
              {editingReplyId === msg.id && (
                <div className="mt-3 p-3.5 bg-[#F3F8F4] rounded-xl border border-emerald-200 space-y-2">
                  <label className="block text-xs font-bold text-[#075E46]">
                    Write Official Academy Response (یہ جواب بھی ویب سائٹ پر میسج کے نیچے نظر آئے گا):
                  </label>
                  <textarea
                    rows={2}
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    placeholder="e.g. وعلیکم السلام! ہماری فی میل معلمات کے اوقات صبح 9 سے رات 11 بجے تک دستیاب ہیں..."
                    className="w-full p-2.5 text-xs rounded-xl border border-gray-300 bg-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingReplyId(null)}
                      className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveReply(msg.id)}
                      className="px-4 py-1 text-xs font-bold bg-[#075E46] text-white rounded-lg flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Publish Reply to Website</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Toggle Show on Website Button */}
                  <button
                    onClick={() => handleToggleShowOnWebsite(msg.id, msg.showOnWebsite)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      msg.showOnWebsite
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        : 'bg-emerald-50 text-[#075E46] hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    {msg.showOnWebsite ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Visible on Website (ویب سائٹ پر آن ہے)</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Show on Website (ویب سائٹ پر دکھائیں)</span>
                      </>
                    )}
                  </button>

                  {/* Add Public Reply Button */}
                  <button
                    onClick={() => {
                      setEditingReplyId(editingReplyId === msg.id ? null : msg.id);
                      setReplyInput(msg.replyText || '');
                    }}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-semibold text-gray-700 flex items-center gap-1"
                  >
                    <CornerDownRight className="w-3.5 h-3.5 text-gray-500" />
                    <span>{msg.replyText ? 'Edit Reply' : 'Add Public Reply'}</span>
                  </button>

                  {/* WhatsApp Direct Reply */}
                  {msg.phone && (
                    <a
                      href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Assalamu Alaikum ${msg.name}, thank you for contacting Noor Al-Quran Academy regarding your inquiry.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-50 text-[#075E46] hover:bg-emerald-100 rounded-xl text-xs font-bold flex items-center gap-1 border border-emerald-200"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Direct</span>
                    </a>
                  )}

                  {msg.status === 'unread' ? (
                    <button
                      onClick={() => handleStatus(msg.id, 'read')}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-medium text-gray-700"
                    >
                      Mark Read
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatus(msg.id, 'unread')}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-medium text-gray-700"
                    >
                      Mark Unread
                    </button>
                  )}

                  {msg.status !== 'resolved' && (
                    <button
                      onClick={() => handleStatus(msg.id, 'resolved')}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-semibold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolved</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setDeleteConfirmMsg({ id: msg.id, name: msg.name })}
                  className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Manual Record Inquiry Modal */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-emerald-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#075E46] flex items-center justify-center font-bold">
                  <Mail className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#075E46]">Record Client Inquiry / Message</h3>
                  <p className="text-[11px] text-gray-500">Record a phone, WhatsApp, or direct visitor inquiry</p>
                </div>
              </div>
              <button
                onClick={() => setManualModalOpen(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Mehmood"
                    value={mName}
                    onChange={(e) => setMName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={mPhone}
                    onChange={(e) => setMPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="client@gmail.com"
                    value={mEmail}
                    onChange={(e) => setMEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Course / Topic</label>
                  <input
                    type="text"
                    placeholder="e.g. Noorani Qaida for Kids"
                    value={mSubject}
                    onChange={(e) => setMSubject(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Message / Question Details *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Inquiry notes or client requirements..."
                  value={mMessage}
                  onChange={(e) => setMMessage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={mShowOnWeb}
                  onChange={(e) => setMShowOnWeb(e.target.checked)}
                  className="rounded text-[#075E46]"
                />
                <span className="text-gray-700 font-semibold">
                  Show on website public client reviews & testimonials wall
                </span>
              </label>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setManualModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingManual}
                  className="px-5 py-2 rounded-xl bg-[#075E46] text-white font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isSubmittingManual ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Inquiry</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmMsg)}
        title="Delete Contact Inquiry"
        message={`Are you sure you want to permanently delete the message from "${deleteConfirmMsg?.name}"?`}
        confirmText="Yes, Delete Message"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => {
          if (!isDeleting) setDeleteConfirmMsg(null);
        }}
      />
    </div>
  );
};
