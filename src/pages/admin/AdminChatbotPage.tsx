import React, { useState, useEffect } from 'react';
import { Bot, Save, MessageSquare, Trash2, CheckCircle2, AlertTriangle, Plus, Loader2 } from 'lucide-react';
import { ChatbotSettings, ChatConversation } from '../../types';
import {
  getChatbotSettings,
  updateChatbotSettings,
  getAllChatConversations,
  updateChatConversationStatus,
  deleteChatConversation,
} from '../../firebase/services';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const AdminChatbotPage: React.FC<{
  showToast: (msg: string, type?: 'success' | 'error') => void;
}> = ({ showToast }) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'logs'>('settings');
  const [settings, setSettings] = useState<ChatbotSettings | null>(null);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [isEnabled, setIsEnabled] = useState(true);
  const [botName, setBotName] = useState('Noor AI Assistant');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [welcomeMessageUrdu, setWelcomeMessageUrdu] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [tone, setTone] = useState('Polite, Reverent, Islamic, Professional');
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [showAdmissionShortcut, setShowAdmissionShortcut] = useState(true);
  const [showContactShortcut, setShowContactShortcut] = useState(true);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [cfg, logs] = await Promise.all([getChatbotSettings(), getAllChatConversations()]);
      setSettings(cfg);
      setIsEnabled(cfg.isEnabled);
      setBotName(cfg.botName);
      setWelcomeMessage(cfg.welcomeMessage);
      setWelcomeMessageUrdu(cfg.welcomeMessageUrdu);
      setSystemPrompt(cfg.systemPrompt);
      setTone(cfg.tone || 'Polite, Reverent, Islamic, Professional');
      setSuggestedQuestions(cfg.suggestedQuestions || []);
      setShowAdmissionShortcut(cfg.showAdmissionShortcut !== false);
      setShowContactShortcut(cfg.showContactShortcut !== false);
      setConversations(logs || []);
    } catch (e: any) {
      console.warn('Could not load chatbot configs:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updateChatbotSettings({
        isEnabled,
        botName: botName.trim(),
        welcomeMessage: welcomeMessage.trim(),
        welcomeMessageUrdu: welcomeMessageUrdu.trim(),
        systemPrompt: systemPrompt.trim(),
        tone: tone.trim(),
        suggestedQuestions,
        showAdmissionShortcut,
        showContactShortcut,
      });
      setIsSaving(false);
      showToast('Chatbot settings saved. Live widget updated.');
    } catch (err: any) {
      setIsSaving(false);
      showToast(err.message || 'Failed to save chatbot settings.', 'error');
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    setSuggestedQuestions([...suggestedQuestions, newQuestion.trim()]);
    setNewQuestion('');
  };

  const handleRemoveQuestion = (idx: number) => {
    setSuggestedQuestions(suggestedQuestions.filter((_, i) => i !== idx));
  };

  const handleReviewLog = async (id: string, newStatus: ChatConversation['status']) => {
    try {
      await updateChatConversationStatus(id, newStatus);
      showToast(`Conversation marked as ${newStatus}.`);
      setConversations(
        conversations.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
    } catch (err: any) {
      showToast(err.message || 'Failed to update conversation status.', 'error');
    }
  };

  const [deleteConfirmLogId, setDeleteConfirmLogId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDeleteLog = async () => {
    if (!deleteConfirmLogId) return;
    try {
      setIsDeleting(true);
      await deleteChatConversation(deleteConfirmLogId);
      showToast('Log deleted.');
      setConversations(conversations.filter((c) => c.id !== deleteConfirmLogId));
      setDeleteConfirmLogId(null);
      setIsDeleting(false);
    } catch (err: any) {
      setIsDeleting(false);
      showToast(err.message || 'Failed to delete log.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#075E46] mb-2" />
        <p className="text-xs">Loading AI Chatbot configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'border-[#075E46] text-[#075E46]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Bot className="w-4 h-4" /> AI Chatbot Configuration
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'border-[#075E46] text-[#075E46]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Visitor Conversations ({conversations.length})
        </button>
      </div>

      {activeTab === 'settings' ? (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
          {/* Toggle Enabled */}
          <div className="flex items-center justify-between p-4 bg-[#F3F8F4] rounded-2xl border border-emerald-200">
            <div>
              <h4 className="font-bold text-sm text-[#075E46]">Enable Floating AI Chatbot</h4>
              <p className="text-xs text-gray-500">
                When enabled, prospective students and parents will see the floating AI counselor widget.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#075E46]" />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Bot Display Name</label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Tone & Persona</label>
              <input
                type="text"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Welcome Greeting (English)</label>
              <textarea
                rows={2}
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Welcome Greeting (Urdu)</label>
              <textarea
                rows={2}
                value={welcomeMessageUrdu}
                onChange={(e) => setWelcomeMessageUrdu(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              System Instruction / Behavior Guidance
            </label>
            <textarea
              rows={4}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-gray-300 leading-relaxed"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Controls Gemini's responses. The server automatically injects current course lists and academy phone numbers.
            </p>
          </div>

          {/* Suggested Questions Manager */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Suggested Question Chips (Shown in Chat Window)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Add suggested prompt, e.g. 'What is the fee for Hifz?'"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-gray-300"
              />
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-4 py-2 bg-emerald-50 text-[#075E46] hover:bg-emerald-100 rounded-xl text-xs font-bold border border-emerald-200"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3F8F4] text-[#075E46] text-xs font-medium border border-emerald-200"
                >
                  <span>{q}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(idx)}
                    className="hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 flex justify-end border-t border-gray-100">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#075E46] hover:bg-[#064e3b] text-white text-xs font-bold shadow-sm flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" /> : <Save className="w-4 h-4" />}
              <span>Save Chatbot Settings</span>
            </button>
          </div>
        </form>
      ) : (
        /* Conversation Logs */
        <div className="space-y-4">
          <p className="text-xs text-gray-500">
            Review live conversations between prospective students and the AI assistant to identify inquiries and ensure response quality.
          </p>

          {conversations.length === 0 ? (
            <div className="py-16 text-center text-gray-400 bg-white rounded-2xl border border-gray-200 text-xs">
              No conversations recorded yet. Ask a question via the floating chat widget to see logs appear here.
            </div>
          ) : (
            <div className="space-y-3">
              {conversations.map((c) => (
                <div key={c.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-400 pb-2 border-b border-gray-100">
                    <span className="font-mono text-[10px]">Session: {c.sessionId}</span>
                    <div className="flex items-center gap-2">
                      <span>{new Date(c.timestamp).toLocaleString()}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          c.status === 'reviewed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'flagged'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="bg-[#F3F8F4] p-3 rounded-xl border border-emerald-100">
                      <span className="font-bold text-[#075E46] block text-[11px] mb-0.5">Visitor:</span>
                      <p className="text-gray-800">{c.userMessage}</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                      <span className="font-bold text-gray-600 block text-[11px] mb-0.5">Noor AI Assistant:</span>
                      <p className="text-gray-700 whitespace-pre-wrap">{c.botReply}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                    <div className="flex items-center gap-2">
                      {c.status !== 'reviewed' && (
                        <button
                          onClick={() => handleReviewLog(c.id, 'reviewed')}
                          className="px-2.5 py-1 rounded-md bg-emerald-50 text-[#075E46] font-semibold text-[11px] hover:bg-emerald-100"
                        >
                          Mark Reviewed
                        </button>
                      )}
                      {c.status !== 'flagged' && (
                        <button
                          onClick={() => handleReviewLog(c.id, 'flagged')}
                          className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-semibold text-[11px] hover:bg-amber-100"
                        >
                          Flag for Follow-up
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => setDeleteConfirmLogId(c.id)}
                      className="p-1 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      title="Delete log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteConfirmLogId)}
        title="Delete Conversation Log"
        message="Are you sure you want to permanently delete this AI chat conversation log?"
        confirmText="Yes, Delete Log"
        isLoading={isDeleting}
        onConfirm={confirmDeleteLog}
        onClose={() => {
          if (!isDeleting) setDeleteConfirmLogId(null);
        }}
      />
    </div>
  );
};
