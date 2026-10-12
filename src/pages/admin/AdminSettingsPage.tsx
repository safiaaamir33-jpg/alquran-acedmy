import React, { useState, useEffect } from 'react';
import {
  Save,
  Image as ImageIcon,
  Loader2,
  BookOpen,
  Sparkles,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  CreditCard,
  Globe,
  Bell,
  CheckCircle,
  Eye,
  Trash2,
  Share2
} from 'lucide-react';
import { SiteSettings } from '../../types';
import { updateSiteSettings } from '../../firebase/services';
import { ImageUploadModal } from '../../components/common/ImageUploadModal';
import { presetIslamicLogos } from '../../utils/imageHelpers';

export const AdminSettingsPage: React.FC<{
  settings: SiteSettings;
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}> = ({ settings, onRefresh, showToast }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [activeMediaTarget, setActiveMediaTarget] = useState<'logo' | 'hero' | null>(null);

  // Form states
  const [academyName, setAcademyName] = useState(settings.academyName || 'Noor Al-Quran Academy');
  const [academyNameUrdu, setAcademyNameUrdu] = useState(settings.academyNameUrdu || 'نور القرآن اکیڈمی پاکستان');
  const [tagline, setTagline] = useState(settings.tagline || 'Online Quran Education with Tajweed & Excellence');
  const [taglineUrdu, setTaglineUrdu] = useState(settings.taglineUrdu || 'آن لائن قرآن تعلیم تجوید و حفظ کے ساتھ');
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  const [topNoticeText, setTopNoticeText] = useState(settings.topNoticeText || '🌟 Admissions Open for New Quran & Tajweed Sessions! 3-Days Free Trial Available (Male & Female Tutors)');
  const [showTopNotice, setShowTopNotice] = useState(settings.showTopNotice ?? true);

  const [heroTitle, setHeroTitle] = useState(settings.heroTitle || 'Learn the Holy Quran with Tajweed & Excellence');
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle || 'Certified Quran tutors, personalized 1-on-1 live classes, flexible timings, and dedicated female teachers for sisters and young children. Start your 3-day free trial today.');
  const [heroImageUrl, setHeroImageUrl] = useState(settings.heroImageUrl || 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80');

  const [phone, setPhone] = useState(settings.phone || '+92 300 1234567');
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp || '+92 300 1234567');
  const [email, setEmail] = useState(settings.email || 'info@nooralquran.pk');
  const [address, setAddress] = useState(settings.address || 'F-8 Markaz, Islamabad, Pakistan');
  const [city, setCity] = useState(settings.city || 'Islamabad, Pakistan');
  const [country, setCountry] = useState(settings.country || 'Pakistan & Overseas');
  const [timings, setTimings] = useState(settings.timings || '24/7 Available (Flexible 1-on-1 slots for Pakistan, UK, USA, Gulf)');

  const [feeStructureNote, setFeeStructureNote] = useState(settings.feeStructureNote || 'Rs. 3,500 – 5,500 / Month (Pakistan) | $35 – $65 / Month (Overseas Students)');
  const [bankDetails, setBankDetails] = useState(settings.bankDetails || 'Bank: Meezan Bank / EasyPaisa / JazzCash / Raast ID | Account Title: Noor Al-Quran Academy | Available on request after trial class');
  const [freeTrialDays, setFreeTrialDays] = useState(settings.freeTrialDays || '3 Days Free Trial');
  const [showClientMessagesOnWeb, setShowClientMessagesOnWeb] = useState(settings.showClientMessagesOnWeb ?? true);

  const [aboutMission, setAboutMission] = useState(settings.aboutMission || '');
  const [aboutVision, setAboutVision] = useState(settings.aboutVision || '');
  const [aboutApproach, setAboutApproach] = useState(settings.aboutApproach || '');

  const [facebookUrl, setFacebookUrl] = useState(settings.facebookUrl || '');
  const [youtubeUrl, setYoutubeUrl] = useState(settings.youtubeUrl || '');
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl || '');
  const [whatsappChannelUrl, setWhatsappChannelUrl] = useState(settings.whatsappChannelUrl || '');

  useEffect(() => {
    setAcademyName(settings.academyName || 'Noor Al-Quran Academy');
    setAcademyNameUrdu(settings.academyNameUrdu || 'نور القرآن اکیڈمی پاکستان');
    setTagline(settings.tagline || 'Online Quran Education with Tajweed & Excellence');
    setTaglineUrdu(settings.taglineUrdu || 'آن لائن قرآن تعلیم تجوید و حفظ کے ساتھ');
    setLogoUrl(settings.logoUrl || '');
    setTopNoticeText(settings.topNoticeText || '🌟 Admissions Open for New Quran & Tajweed Sessions! 3-Days Free Trial Available (Male & Female Tutors)');
    setShowTopNotice(settings.showTopNotice ?? true);

    setHeroTitle(settings.heroTitle || 'Learn the Holy Quran with Tajweed & Excellence');
    setHeroSubtitle(settings.heroSubtitle || 'Certified Quran tutors, personalized 1-on-1 live classes, flexible timings, and dedicated female teachers for sisters and young children. Start your 3-day free trial today.');
    setHeroImageUrl(settings.heroImageUrl || '');

    setPhone(settings.phone || '+92 300 1234567');
    setWhatsapp(settings.whatsapp || '+92 300 1234567');
    setEmail(settings.email || 'info@nooralquran.pk');
    setAddress(settings.address || 'F-8 Markaz, Islamabad, Pakistan');
    setCity(settings.city || 'Islamabad, Pakistan');
    setCountry(settings.country || 'Pakistan & Overseas');
    setTimings(settings.timings || '24/7 Available (Flexible 1-on-1 slots for Pakistan, UK, USA, Gulf)');

    setFeeStructureNote(settings.feeStructureNote || '');
    setBankDetails(settings.bankDetails || '');
    setFreeTrialDays(settings.freeTrialDays || '3 Days Free Trial');
    setShowClientMessagesOnWeb(settings.showClientMessagesOnWeb ?? true);

    setAboutMission(settings.aboutMission || '');
    setAboutVision(settings.aboutVision || '');
    setAboutApproach(settings.aboutApproach || '');

    setFacebookUrl(settings.facebookUrl || '');
    setYoutubeUrl(settings.youtubeUrl || '');
    setInstagramUrl(settings.instagramUrl || '');
    setWhatsappChannelUrl(settings.whatsappChannelUrl || '');
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await updateSiteSettings({
        academyName: academyName.trim(),
        academyNameUrdu: academyNameUrdu.trim(),
        tagline: tagline.trim(),
        taglineUrdu: taglineUrdu.trim(),
        logoUrl: logoUrl.trim(),
        topNoticeText: topNoticeText.trim(),
        showTopNotice,
        heroTitle: heroTitle.trim(),
        heroSubtitle: heroSubtitle.trim(),
        heroImageUrl: heroImageUrl.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        country: country.trim(),
        timings: timings.trim(),
        feeStructureNote: feeStructureNote.trim(),
        bankDetails: bankDetails.trim(),
        freeTrialDays: freeTrialDays.trim(),
        showClientMessagesOnWeb,
        aboutMission: aboutMission.trim(),
        aboutVision: aboutVision.trim(),
        aboutApproach: aboutApproach.trim(),
        facebookUrl: facebookUrl.trim(),
        youtubeUrl: youtubeUrl.trim(),
        instagramUrl: instagramUrl.trim(),
        whatsappChannelUrl: whatsappChannelUrl.trim(),
      });
      setIsSaving(false);
      showToast('تمام ترتیبات اور مونوگرام محفوظ ہوگئے! (All site settings & logo updated successfully)');
      onRefresh();
    } catch (err: any) {
      setIsSaving(false);
      showToast(err.message || 'Failed to update settings.', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Status */}
      <div className="bg-gradient-to-r from-[#075E46] to-[#0B7A53] text-white p-6 sm:p-8 rounded-3xl shadow-md border border-[#D4AF37]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#24352F] text-[10px] font-extrabold uppercase">
              Full Admin Control
            </span>
            <span className="text-xs text-emerald-200">Live Real-time Website Updates</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            مکمل ویب سائٹ سیٹنگز اور مونوگرام (Site Settings & Branding)
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl mt-1">
            یہاں سے آپ اکیڈمی کا نام، لوگو (مونوگرام)، بینر، فون نمبر، واٹس ایپ، فیس اور تمام مواد تبدیل کرسکتے ہیں۔ جو کچھ آپ تبدیل کریں گے وہ فوراً آپ کے کلائنٹس کو نظر آئے گا۔
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-[#D4AF37] hover:bg-[#c29f31] text-[#24352F] font-extrabold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 hover:scale-105 transition-all flex-shrink-0"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#075E46]" />
          ) : (
            <Save className="w-4 h-4 text-[#075E46]" />
          )}
          <span>Save Changes (سیو کریں)</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* ========================================================
            1. DEDICATED LOGO & BRAND IDENTITY MANAGER
           ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#075E46] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-[#075E46]">
                  Academy Logo & Crest (اکیڈمی کا لوگو / مونوگرام)
                </h3>
                <p className="text-xs text-gray-500">
                  آپ کسی بھی وقت نیا لوگو اپلوڈ کرسکتے ہیں یا تبدیل کرسکتے ہیں۔ یہ پوری ویب سائٹ پر نظر آئے گا۔
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveMediaTarget('logo')}
                className="px-4 py-2 bg-[#075E46] text-white hover:bg-[#064e3b] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                <span>Upload / Change Logo (لوگو لگائیں)</span>
              </button>

              {logoUrl && (
                <button
                  type="button"
                  onClick={() => setLogoUrl('')}
                  className="px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-xs font-bold flex items-center gap-1 border border-red-200 transition-all"
                  title="Remove custom logo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Logo</span>
                </button>
              )}
            </div>
          </div>

          {/* Logo Visual Live Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F3F8F4] p-5 sm:p-6 rounded-2xl border border-emerald-100">
            {/* Header Preview */}
            <div className="bg-white p-4 rounded-2xl border shadow-xs">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Header Navigation Bar Preview:
              </span>
              <div className="flex items-center gap-3 p-3 bg-white border rounded-xl">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo Preview"
                    className="w-12 h-12 object-contain rounded-xl border border-emerald-100 shadow-xs p-0.5"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#075E46] to-[#0B7A53] flex items-center justify-center text-white shadow-xs border border-[#D4AF37]/30">
                    <BookOpen className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                )}
                <div>
                  <h4 className="font-extrabold text-sm text-[#075E46]">{academyName || 'Noor Al-Quran Academy'}</h4>
                  <p className="text-[11px] text-gray-500 line-clamp-1">{tagline || 'Online Quran Education with Tajweed'}</p>
                </div>
              </div>
            </div>

            {/* Footer Dark Preview */}
            <div className="bg-[#1B2B25] text-white p-4 rounded-2xl border border-emerald-900/40 shadow-xs">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Footer Dark Bar Preview:
              </span>
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo Footer Preview"
                    className="w-12 h-12 object-contain rounded-xl bg-white p-1"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-[#075E46] flex items-center justify-center text-white border border-[#D4AF37]">
                    <BookOpen className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                )}
                <div>
                  <h4 className="font-extrabold text-sm text-white">{academyName || 'Noor Al-Quran Academy'}</h4>
                  <p className="text-[11px] text-gray-300 line-clamp-1">{taglineUrdu || 'آن لائن قرآنی تعلیم'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Preset Emblems Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Or Select from Beautiful Pre-Designed Quran Emblems (یا نیچے دیئے گئے خوبصورت مونوگرام میں سے چنیں):</span>
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {presetIslamicLogos.map((preset) => {
                const isSelected = logoUrl === preset.url;
                return (
                  <button
                    type="button"
                    key={preset.id}
                    onClick={() => setLogoUrl(preset.url)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center ${
                      isSelected
                        ? 'border-[#075E46] bg-emerald-50 ring-2 ring-[#075E46]/30'
                        : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-gray-50'
                    }`}
                  >
                    <img src={preset.url} alt={preset.title} className="w-12 h-12 object-contain mb-1.5" />
                    <span className="text-[11px] font-bold text-[#24352F] line-clamp-1">{preset.title}</span>
                    <span className="text-[10px] text-emerald-800 font-bold mt-1">
                      {isSelected ? '✓ Selected' : 'Use This'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Academy Identity Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Academy Name (English) *
              </label>
              <input
                type="text"
                required
                value={academyName}
                onChange={(e) => setAcademyName(e.target.value)}
                placeholder="Noor Al-Quran Academy"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Academy Name (اردو نام) *
              </label>
              <input
                type="text"
                dir="rtl"
                value={academyNameUrdu}
                onChange={(e) => setAcademyNameUrdu(e.target.value)}
                placeholder="نور القرآن اکیڈمی پاکستان"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46] font-urdu"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Slogan / Tagline (English)
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Online Quran Education with Tajweed & Excellence"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Slogan / Tagline (اردو سلوگن)
              </label>
              <input
                type="text"
                dir="rtl"
                value={taglineUrdu}
                onChange={(e) => setTaglineUrdu(e.target.value)}
                placeholder="آن لائن قرآن تعلیم تجوید و حفظ کے ساتھ"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46] font-urdu"
              />
            </div>
          </div>
        </div>

        {/* ========================================================
            2. TOP ANNOUNCEMENT BAR & CLIENT NOTICES
           ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#D4AF37]" />
              <h4 className="font-bold text-sm sm:text-base text-[#075E46]">
                Top Alert & Announcement Bar (سب سے اوپر والی پٹی)
              </h4>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showTopNotice}
                onChange={(e) => setShowTopNotice(e.target.checked)}
                className="w-4 h-4 text-[#075E46] rounded focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-gray-700">Show Announcement Bar</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Top Notification Bar Text (داخلے شروع ہیں / خصوصی رعایت وغیرہ)
            </label>
            <input
              type="text"
              value={topNoticeText}
              onChange={(e) => setTopNoticeText(e.target.value)}
              placeholder="🌟 Admissions Open for New Quran & Tajweed Sessions! 3-Days Free Trial Available"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46]"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              یہ پٹی ویب سائٹ کے اوپر سب سے پہلے تمام آنے والے وزٹرز اور کلائنٹس کو نظر آتی ہے۔
            </p>
          </div>
        </div>

        {/* ========================================================
            3. PAKISTAN & GLOBAL CONTACT COORDINATES
           ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b pb-3">
            <Phone className="w-5 h-5 text-[#D4AF37]" />
            <h4 className="font-bold text-sm sm:text-base text-[#075E46]">
              Contact Coordinates (فون نمبرز، واٹس ایپ اور پتہ)
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Phone Number (فون نمبر)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                WhatsApp Number (واٹس ایپ نمبر) *
              </label>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Official Email (ای میل ایڈریس)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@nooralquran.pk"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Campus Address (کیمپس کا پتہ)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="F-8 Markaz, Islamabad, Pakistan"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                City / Country (شہر / ملک)
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Islamabad, Pakistan"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Class Timings / Flexible Shifts (کلاسز کے اوقات)
              </label>
              <input
                type="text"
                value={timings}
                onChange={(e) => setTimings(e.target.value)}
                placeholder="24/7 Available (Flexible 1-on-1 slots for Pakistan, UK, USA, Gulf)"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Free Trial Duration (مفت آزمائشی کلاسز)
              </label>
              <input
                type="text"
                value={freeTrialDays}
                onChange={(e) => setFreeTrialDays(e.target.value)}
                placeholder="3 Days Free Trial Evaluation"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* ========================================================
            4. FEE STRUCTURE & BANK / PAYMENT DETAILS
           ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <CreditCard className="w-5 h-5 text-[#D4AF37]" />
            <h4 className="font-bold text-sm sm:text-base text-[#075E46]">
              Fee Structure & Payment Details (فیس کا شیڈول اور بینک تفصیلات)
            </h4>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Monthly Fee Structure Note (فیس کی معلومات)
            </label>
            <input
              type="text"
              value={feeStructureNote}
              onChange={(e) => setFeeStructureNote(e.target.value)}
              placeholder="Rs. 3,500 – 5,500 / Month (Pakistan) | $35 – $65 / Month (Overseas Students)"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Bank / EasyPaisa / JazzCash / Raast Payment Details (بینک و آن لائن فیس ادائیگی)
            </label>
            <textarea
              rows={2}
              value={bankDetails}
              onChange={(e) => setBankDetails(e.target.value)}
              placeholder="Meezan Bank | A/C Title: Noor Al-Quran Academy | EasyPaisa / JazzCash: 0300-1234567 | Raast ID: 03001234567"
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-300"
            />
          </div>
        </div>

        {/* ========================================================
            5. PUBLIC CLIENT MESSAGES & TESTIMONIALS CONTROL
           ======================================================== */}
        <div className="bg-emerald-50/70 rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#075E46]" />
              <h4 className="font-bold text-sm sm:text-base text-[#075E46]">
                Client Messages on Website (ویب سائٹ پر کلائنٹ کے پیغامات کی نمائش)
              </h4>
            </div>

            <label className="flex items-center gap-2 cursor-pointer bg-white px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-xs">
              <input
                type="checkbox"
                checked={showClientMessagesOnWeb}
                onChange={(e) => setShowClientMessagesOnWeb(e.target.checked)}
                className="w-4 h-4 text-[#075E46] rounded focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-[#075E46]">Show Client Messages on Website</span>
            </label>
          </div>

          <p className="text-xs text-gray-700 leading-relaxed">
            <strong>آپ کی خواہش کے مطابق:</strong> جب یہ آپشن آن ہو گا، تو جو بھی کلائنٹس یا طلباء آپ کو رابطہ فارم یا ریویو کے ذریعے پیغام بھیجیں گے، وہ آپ کی ویب سائٹ پر کلائنٹ فیڈ بیک وال پر نمایاں ہوں گے۔ آپ ایڈمن پینل کے <strong>Messages</strong> سیکشن سے کسی بھی میسج کو 1-کلک میں چھپا یا دکھا سکتے ہیں۔
          </p>
        </div>

        {/* ========================================================
            6. HOME PAGE HERO BANNER
           ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Globe className="w-5 h-5 text-[#D4AF37]" />
            <h4 className="font-bold text-sm sm:text-base text-[#075E46]">
              Home Page Hero Banner (ہوم پیج بینر و ہیڈلائن)
            </h4>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Main Banner Title (اہم سرخی)</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Banner Subtitle / Description (وضاحت)</label>
            <textarea
              rows={2}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Banner Photo (بینر تصویر)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={heroImageUrl}
                onChange={(e) => setHeroImageUrl(e.target.value)}
                placeholder="Image URL or upload..."
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-300"
              />
              <button
                type="button"
                onClick={() => setActiveMediaTarget('hero')}
                className="px-4 py-2 bg-emerald-50 text-[#075E46] rounded-xl text-xs font-bold flex items-center gap-1.5 border border-emerald-200"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Upload Banner</span>
              </button>
            </div>
            {heroImageUrl && (
              <img
                src={heroImageUrl}
                alt="Banner Preview"
                className="h-32 w-auto object-cover rounded-xl mt-2 border"
              />
            )}
          </div>
        </div>

        {/* ========================================================
            7. MISSION, VISION & PEDAGOGY
           ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
          <h4 className="font-bold text-sm sm:text-base text-[#075E46] border-b pb-3">
            Mission, Vision & Methodology (مشن اور تدریسی طریقہ کار)
          </h4>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Mission Statement (مشن)</label>
            <textarea
              rows={2}
              value={aboutMission}
              onChange={(e) => setAboutMission(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Vision Statement (ویژن)</label>
            <textarea
              rows={2}
              value={aboutVision}
              onChange={(e) => setAboutVision(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Teaching Approach (تدریسی انداز)</label>
            <textarea
              rows={2}
              value={aboutApproach}
              onChange={(e) => setAboutApproach(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-300"
            />
          </div>
        </div>

        {/* ========================================================
            8. SOCIAL MEDIA LINKS
           ======================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Share2 className="w-5 h-5 text-[#D4AF37]" />
            <h4 className="font-bold text-sm sm:text-base text-[#075E46]">
              Social Channels (سوشل میڈیا لنکس)
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Facebook URL</label>
              <input
                type="text"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">YouTube URL</label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/@..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Instagram URL</label>
              <input
                type="text"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp Channel Link</label>
              <input
                type="text"
                value={whatsappChannelUrl}
                onChange={(e) => setWhatsappChannelUrl(e.target.value)}
                placeholder="https://whatsapp.com/channel/..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Big Save Button */}
        <div className="sticky bottom-4 z-20 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-10 py-4 rounded-2xl bg-[#075E46] hover:bg-[#064e3b] text-white font-extrabold text-sm sm:text-base shadow-2xl flex items-center gap-2 hover:scale-105 transition-all border-2 border-[#D4AF37]"
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37]" />
            ) : (
              <Save className="w-5 h-5 text-[#D4AF37]" />
            )}
            <span>Save All Academy Settings (سیو کریں)</span>
          </button>
        </div>
      </form>

      {/* Media Manager Upload Modal */}
      <ImageUploadModal
        isOpen={activeMediaTarget !== null}
        onClose={() => setActiveMediaTarget(null)}
        onSelectImage={(url) => {
          if (activeMediaTarget === 'logo') setLogoUrl(url);
          if (activeMediaTarget === 'hero') setHeroImageUrl(url);
          setActiveMediaTarget(null);
        }}
        folder={activeMediaTarget === 'logo' ? 'branding' : 'hero'}
        title={activeMediaTarget === 'logo' ? 'Select or Upload Academy Logo (مونوگرام لگائیں)' : 'Upload Hero Banner Image'}
      />
    </div>
  );
};
