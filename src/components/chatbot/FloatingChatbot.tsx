import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, BookOpen, UserCheck, PhoneCall, Loader2, Bot, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { ChatbotSettings, SiteSettings } from '../../types';
import { getChatbotSettings, logChatConversation } from '../../firebase/services';
import { useLanguage } from '../../context/LanguageContext';

interface Message {
  role: 'bot' | 'user';
  text: string;
  timestamp: string;
}

interface FloatingChatbotProps {
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ settings, onNavigate }) => {
  const { isUrdu } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [botConfig, setBotConfig] = useState<ChatbotSettings | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Stop speech when closing or unmounting
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeak = (text: string, idx: number) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#•]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isUrdu || /[\u0600-\u06FF]/.test(text) ? 'ur-PK' : 'en-US';
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingIdx(null);
    utterance.onerror = () => setSpeakingIdx(null);
    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  // Load chatbot settings on mount
  useEffect(() => {
    getChatbotSettings()
      .then((cfg) => {
        setBotConfig(cfg);
        const greeting = isUrdu
          ? (cfg.welcomeMessageUrdu || 'السلام علیکم ورحمۃ اللہ! نور القرآن اکیڈمی میں خوش آمدید۔ آپ آن لائن قرآن کلاسز، فیس، مفت ٹرائل، یا کسی بھی اسلامی سوال کے بارے میں فوراً پوچھ سکتے ہیں!')
          : (cfg.welcomeMessage || 'Assalamu Alaikum! Welcome to Noor Al-Quran Academy. Ask anything about courses, fees, female teachers, free trial, or Quran learning, and I will answer you right away!');
        setMessages([
          {
            role: 'bot',
            text: greeting,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      })
      .catch((e) => console.warn('Could not load chatbot settings:', e));
  }, [isUrdu]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (userPrompt?: string) => {
    const textToSend = userPrompt || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          context: `
Academy: ${settings.academyName || 'Noor Al-Quran Academy'}
Phone: ${settings.phone || '+92 300 1234567'}
WhatsApp: ${settings.whatsapp || '+92 300 1234567'}
Address: ${settings.address || 'Islamabad, Pakistan'}
Features: Certified Tutors, 1-on-1 Classes, Female Tutors for Sisters, 3-Day Free Trial
`,
        }),
      });

      const data = await response.json();
      const botReply = data.reply || data.fallback || 'Assalamu Alaikum. Please contact our admissions team on WhatsApp for prompt assistance.';

      const botMsg: Message = {
        role: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);

      // Log conversation to Firestore in background for admin review
      logChatConversation({
        sessionId,
        userMessage: textToSend.trim(),
        botReply,
        userLanguage: isUrdu ? 'ur' : 'en',
      }).catch((e) => console.warn('Failed to log chat:', e));
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: Message = {
        role: 'bot',
        text: 'Assalamu Alaikum. Our admissions team is available via WhatsApp at ' + (settings.whatsapp || '+92 300 1234567') + ' to assist you immediately.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (botConfig && !botConfig.isEnabled) {
    return null; // Disabled in admin settings
  }

  const suggestedQuestions = botConfig?.suggestedQuestions || [
    'How do I enroll in a free trial?',
    'What Quran courses are available?',
    'Are female tutors available?',
    'What is the fee for Noorani Qaida?',
  ];

  const whatsappClean = (settings.whatsapp || '+92 300 1234567').replace(/[^0-9]/g, '');

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating launcher button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-[#075E46] to-[#0B7A53] hover:from-[#064e3b] hover:to-[#075E46] text-white shadow-2xl shadow-emerald-950/30 hover:scale-105 transition-all duration-300 border-2 border-[#D4AF37]"
          aria-label="Open Quran Academy AI Counselor"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-[#D4AF37]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
          </div>
          <div className="text-left rtl:text-right hidden sm:block">
            <span className="block text-xs font-bold text-white tracking-wide">
              {botConfig?.botName || 'Noor AI Assistant'}
            </span>
            <span className="block text-[10px] text-emerald-100">Ask about courses & trial</span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[400px] h-[550px] max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col border border-emerald-900/15 overflow-hidden animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#075E46] to-[#0B7A53] text-white p-4 flex items-center justify-between border-b border-[#D4AF37]/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-[#D4AF37]/50">
                <Bot className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="font-semibold text-sm flex items-center gap-1.5">
                  <span>{botConfig?.botName || 'Noor AI Assistant'}</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                </h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Online • Powered by Gemini AI
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action shortcuts bar */}
          <div className="bg-[#F3F8F4] px-3 py-2 border-b border-emerald-100 flex items-center gap-2 overflow-x-auto text-xs">
            <button
              onClick={() => { onNavigate('/admission'); setIsOpen(false); }}
              className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-emerald-200 text-[#075E46] font-medium hover:bg-emerald-50 transition-colors"
            >
              <UserCheck className="w-3 h-3 text-[#D4AF37]" />
              <span>3-Day Free Trial</span>
            </button>
            <a
              href={`https://wa.me/${whatsappClean}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-emerald-200 text-[#075E46] font-medium hover:bg-emerald-50 transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-[#D4AF37]" />
              <span>WhatsApp Us</span>
            </a>
            <button
              onClick={() => { onNavigate('/courses'); setIsOpen(false); }}
              className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-emerald-200 text-[#075E46] font-medium hover:bg-emerald-50 transition-colors"
            >
              <BookOpen className="w-3 h-3 text-[#D4AF37]" />
              <span>Courses</span>
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gray-50/60">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-[#075E46] text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-[#24352F] border border-emerald-100 rounded-bl-xs shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className="text-[10px] text-gray-400">{m.timestamp}</span>
                  {m.role === 'bot' && (
                    <button
                      type="button"
                      onClick={() => toggleSpeak(m.text, idx)}
                      className="p-0.5 rounded text-gray-400 hover:text-[#075E46] hover:bg-emerald-50 transition-colors flex items-center gap-0.5 text-[10px]"
                      title={speakingIdx === idx ? 'Stop Voice' : 'Listen Voice'}
                    >
                      {speakingIdx === idx ? (
                        <>
                          <VolumeX className="w-3 h-3 text-red-500 animate-pulse" />
                          <span className="text-red-500 font-semibold">Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 text-emerald-700" />
                          <span className="text-emerald-700">سنیں</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#075E46] bg-emerald-50/90 p-3 rounded-2xl border border-emerald-200/60 w-fit animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-[#075E46]" />
                <span className="font-semibold">نور اے آئی فوری جواب تیار کر رہا ہے...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Instant Inquiry Topics */}
          {!isLoading && (
            <div className="px-3 py-2 bg-white border-t border-gray-100">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                <button
                  type="button"
                  onClick={() => handleSendMessage('Noorani Qaida aur tamam courses ki fees kitni hai?')}
                  className="flex-shrink-0 px-2.5 py-1 rounded-full bg-emerald-50 text-[#075E46] hover:bg-emerald-100 border border-emerald-200/70 font-semibold transition-colors"
                >
                  💳 فیس (Fees)
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('3 din ki free trial class kesy lein?')}
                  className="flex-shrink-0 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 font-semibold transition-colors"
                >
                  🎁 مفت ٹرائل (Trial)
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('Kya bachiyon aur khawateen k liye female Quran teacher dastiyab hain?')}
                  className="flex-shrink-0 px-2.5 py-1 rounded-full bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200 font-semibold transition-colors"
                >
                  👩‍🏫 فی میل ٹیچرز
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('Online class ki timings kya hain aur schedule kesy banta hai?')}
                  className="flex-shrink-0 px-2.5 py-1 rounded-full bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200 font-semibold transition-colors"
                >
                  ⏰ ٹائمنگز (Timings)
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('Tajweed ke bunyadi qawaneen aur makharij kya hain?')}
                  className="flex-shrink-0 px-2.5 py-1 rounded-full bg-emerald-50 text-[#075E46] hover:bg-emerald-100 border border-emerald-200 font-semibold transition-colors"
                >
                  📖 تجوید کے اصول
                </button>
              </div>
            </div>
          )}

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={isUrdu ? 'اپنا کوئی بھی سوال پوچھیں، فوراً جواب ملے گا...' : 'Ask anything, get instant response...'}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46] disabled:bg-gray-100 placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 rounded-xl bg-[#075E46] hover:bg-[#064e3b] text-white disabled:opacity-40 disabled:hover:bg-[#075E46] shadow-sm transition-all"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
