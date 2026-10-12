import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe,
  CornerDownRight,
  Sparkles,
  CreditCard
} from 'lucide-react';
import { SiteSettings, ContactMessage } from '../../types';
import { submitContactMessage, subscribeToPublicClientMessages, getPublicClientMessages } from '../../firebase/services';
import { useLanguage } from '../../context/LanguageContext';

export const ContactPage: React.FC<{ settings: SiteSettings }> = ({ settings }) => {
  const { isUrdu } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+92 ');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [allowPublicDisplay, setAllowPublicDisplay] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live public messages shown on website
  const [publicMessages, setPublicMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    // Initial fetch
    getPublicClientMessages().then((msgs) => {
      if (msgs && msgs.length > 0) setPublicMessages(msgs);
    });

    // Subscribe to real-time client messages
    try {
      const unsub = subscribeToPublicClientMessages((msgs) => {
        setPublicMessages(msgs);
      });
      return () => unsub();
    } catch (_) {}
  }, []);

  const whatsappClean = (settings.whatsapp || '+92 300 1234567').replace(/[^0-9]/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !message.trim()) {
      setError('Please provide your name and message.');
      return;
    }

    try {
      setIsSubmitting(true);
      await submitContactMessage({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim(),
        showOnWebsite: allowPublicDisplay,
      });
      setIsSubmitting(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('+92 ');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to send message. Please reach out to us on WhatsApp.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold text-[#075E46] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {isUrdu ? 'ہم سے رابطہ کریں' : 'Connect with Noor Al-Quran'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#24352F] mt-3">
          {isUrdu ? 'رابطہ و داخلہ معلومات' : 'Contact Admissions & Support Desk'}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-2">
          {isUrdu
            ? 'کلاسز کے اوقات، فیس، معلمات یا ٹیسٹ کلاس کے بارے میں معلومات کے لیے ہم سے رابطہ کریں۔'
            : 'Have a question about class schedules, fees, female teachers, or technical setup? Our team is available 24/7.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-emerald-100 space-y-6">
            <h3 className="font-bold text-xl text-[#075E46]">
              {isUrdu ? 'اکیڈمی کے رابطہ نمبرز' : 'Academy Coordinates'}
            </h3>

            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#F3F8F4] text-[#075E46] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 block">Phone Support</span>
                  <a href={`tel:${settings.phone || '+923001234567'}`} className="font-bold text-[#24352F] hover:text-[#075E46]">
                    {settings.phone || '+92 300 1234567'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#F3F8F4] text-[#075E46] flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 block">WhatsApp Click-to-Chat</span>
                  <a
                    href={`https://wa.me/${whatsappClean}?text=${encodeURIComponent('Assalamu Alaikum, I would like to enquire about ' + (settings.academyName || 'Noor Al-Quran Academy'))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#075E46] hover:underline"
                  >
                    {settings.whatsapp || '+92 300 1234567'} (Online Now)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#F3F8F4] text-[#075E46] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 block">Email Inquiries</span>
                  <a href={`mailto:${settings.email || 'info@nooralquran.pk'}`} className="font-bold text-[#24352F] hover:text-[#075E46]">
                    {settings.email || 'info@nooralquran.pk'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#F3F8F4] text-[#075E46] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 block">Campus Address</span>
                  <p className="font-medium text-[#24352F]">
                    {settings.address || 'F-8 Markaz, Islamabad, Pakistan'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#F3F8F4] text-[#075E46] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 block">Operating Hours & Shifts</span>
                  <p className="font-medium text-[#24352F]">
                    {settings.timings || 'Classes: 24/7 Global | Admissions Desk: 9 AM - 11 PM (Asia/Karachi)'}
                  </p>
                </div>
              </div>

              {settings.feeStructureNote && (
                <div className="flex items-start gap-3.5 pt-2 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-[#F3F8F4] text-[#075E46] flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 block">Fee Schedule</span>
                    <p className="text-xs font-medium text-[#24352F]">
                      {settings.feeStructureNote}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp Direct Action Button */}
          <a
            href={`https://wa.me/${whatsappClean}?text=${encodeURIComponent('Assalamu Alaikum! I would like to speak with ' + (settings.academyName || 'Noor Al-Quran Academy') + ' admissions desk.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2.5"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Chat Directly on WhatsApp</span>
          </a>
        </div>

        {/* Contact Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-emerald-100">
            <h3 className="text-xl font-bold text-[#24352F] mb-1">
              {isUrdu ? 'ہمیں پیغام یا استفسار بھیجیں' : 'Send an Official Message'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-6">
              {isUrdu
                ? 'اپنا سوال یا پیغام لکھیں، ہماری ٹیم فوری طور پر آپ سے واٹس ایپ یا ای میل پر رابطہ کرے گی۔'
                : 'Fill in your inquiry and our coordinators will reply via WhatsApp or email promptly.'}
            </p>

            {success ? (
              <div className="p-6 bg-emerald-50 rounded-2xl text-center space-y-3 border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-[#075E46] mx-auto" />
                <h4 className="font-bold text-lg text-[#075E46]">
                  {isUrdu ? 'پیغام کامیابی کے ساتھ موصول ہو گیا!' : 'Message Sent Successfully!'}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  {isUrdu
                    ? 'جزاک اللہ خیراً! آپ کا پیغام ہمیں مل گیا ہے اور ویب سائٹ پر بھی شامل کر دیا گیا ہے۔'
                    : 'JazakAllah Khair! We have received your inquiry. It has also been added to our public client inquiries board.'}
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-5 py-2 text-xs font-bold bg-[#075E46] text-white rounded-xl"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name (آپ کا پورا نام) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asad Ullah"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Phone / WhatsApp (فون یا واٹس ایپ)</label>
                    <input
                      type="tel"
                      placeholder="+92 300 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address (ای میل)</label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Subject (موضوع)</label>
                  <input
                    type="text"
                    placeholder="e.g. Question about Hifz program or timing"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Message (آپ کا پیغام) *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your question, inquiry or feedback..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46]"
                  />
                </div>

                {/* Show on Website Checkbox */}
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 flex items-start gap-2.5">
                  <input
                    id="allowPublicDisplay"
                    type="checkbox"
                    checked={allowPublicDisplay}
                    onChange={(e) => setAllowPublicDisplay(e.target.checked)}
                    className="w-4 h-4 text-[#075E46] rounded focus:ring-emerald-500 mt-0.5"
                  />
                  <label htmlFor="allowPublicDisplay" className="text-xs text-gray-700 cursor-pointer">
                    <strong className="text-[#075E46]">Display my inquiry / review publicly on website:</strong> Allow Noor Al-Quran Academy to show this inquiry & response on the website feedback wall.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#075E46] hover:bg-[#064e3b] text-white shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#D4AF37]" />
                      <span>Submit Inquiry (پیغام بھیجیں)</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          PUBLIC CLIENT MESSAGES & TESTIMONIALS BOARD
          (Fulfills: "or jo mujhy msgh krein wo meri website pr show ho")
         ======================================================== */}
      {settings.showClientMessagesOnWeb !== false && (
        <div className="pt-10 border-t border-emerald-900/10 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#075E46] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{isUrdu ? 'کلائنٹس کے پیغامات و آراء' : 'Client Messages & Community Inquiries'}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24352F]">
              {isUrdu ? 'ویب سائٹ پر موصول ہونے والے پیغامات' : 'Live Inquiries & Client Feedback Wall'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              {isUrdu
                ? 'ہمارے معزز طلباء اور والدین کے سوالات و پیغامات اور اکیڈمی کے جوابات۔'
                : 'Questions, feedback, and messages submitted by our students and parents, along with responses from academy coordinators.'}
            </p>
          </div>

          {publicMessages.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-emerald-100 max-w-lg mx-auto">
              <MessageCircle className="w-10 h-10 text-emerald-300 mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                Be the first to leave an inquiry or message above! It will appear right here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-white p-6 rounded-3xl shadow-xs border border-emerald-100 hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#075E46] font-bold text-xs flex items-center justify-center border border-emerald-200">
                          {msg.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#24352F]">{msg.name}</h4>
                          <span className="text-[10px] text-gray-400">
                            {new Date(msg.createdAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Verified Inquiry
                      </span>
                    </div>

                    {msg.subject && (
                      <div className="text-xs font-bold text-[#075E46] mb-1.5">
                        {msg.subject}
                      </div>
                    )}

                    <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed whitespace-pre-line bg-[#F3F8F4] p-3 rounded-xl border border-emerald-50">
                      "{msg.message}"
                    </p>

                    {/* Official reply from academy */}
                    {msg.replyText && (
                      <div className="mt-3 p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
                        <div className="flex items-center gap-1 font-bold text-[#075E46]">
                          <CornerDownRight className="w-3.5 h-3.5" />
                          <span>Noor Al-Quran Desk Reply:</span>
                        </div>
                        <p className="italic font-medium">"{msg.replyText}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
