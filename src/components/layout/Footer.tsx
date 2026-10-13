import React from 'react';
import { BookOpen, Phone, MessageCircle, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { SiteSettings } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { resolveImageUrl } from '../../utils/imageHelpers';

interface FooterProps {
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  const { t, isUrdu } = useLanguage();
  const currentYear = new Date().getFullYear();
  const whatsappClean = (settings.whatsapp || '+92 300 1234567').replace(/[^0-9]/g, '');

  const quickLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.courses'), path: '/courses' },
    { label: t('nav.teachers'), path: '/teachers' },
    { label: t('nav.classes'), path: '/classes' },
    { label: t('nav.admission'), path: '/admission' },
  ];

  const exploreLinks = [
    { label: t('nav.announcements'), path: '/announcements' },
    { label: t('nav.gallery'), path: '/gallery' },
    { label: t('nav.reviews'), path: '/reviews' },
    { label: t('nav.faq'), path: '/faq' },
    { label: t('nav.contact'), path: '/contact' },
    { label: 'Privacy Policy', path: '/privacy' },
  ];

  return (
    <footer className="bg-[#1B2B25] text-white border-t border-emerald-900/30">
      {/* Decorative Islamic top accent */}
      <div className="h-1.5 bg-gradient-to-r from-[#075E46] via-[#D4AF37] to-[#0B7A53]" />

      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand & Bio */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {settings.logoUrl ? (
                <img
                  src={resolveImageUrl(settings.logoUrl, 'logo')}
                  alt={settings.academyName || 'Noor Al-Quran Academy'}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/logo.svg';
                  }}
                  className="w-12 h-12 object-contain rounded-xl bg-white p-1 border border-emerald-800 shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[#075E46] flex items-center justify-center text-white border border-[#D4AF37] shadow-sm">
                  <BookOpen className="w-6 h-6 text-[#D4AF37]" />
                </div>
              )}
              <div>
                <h3 className="font-extrabold text-lg text-white tracking-tight">
                  {isUrdu && settings.academyNameUrdu ? settings.academyNameUrdu : (settings.academyName || 'Noor Al-Quran Academy')}
                </h3>
                <span className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider block">
                  Pakistan & Worldwide
                </span>
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {isUrdu && settings.taglineUrdu
                ? settings.taglineUrdu
                : (settings.tagline || 'Illuminating Hearts & Minds with the Noble Quran across Pakistan and Worldwide with certified tutors and 1-on-1 personalized sessions.')}
            </p>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-[#D4AF37] font-serif italic">
              "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ"
              <p className="text-gray-400 not-italic text-[11px] mt-1 font-sans">
                "The best of you are those who learn the Quran and teach it." (Bukhari)
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              {isUrdu ? 'اہم روابط' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => { onNavigate(link.path); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-gray-300 hover:text-[#D4AF37] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Academy Exploration */}
          <div>
            <h4 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              {isUrdu ? 'مزید معلومات' : 'Explore Academy'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {exploreLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => { onNavigate(link.path); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-gray-300 hover:text-[#D4AF37] transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => { onNavigate('/admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Control Center</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div>
            <h4 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              {isUrdu ? 'رابطہ کی تفصیلات' : 'Admissions Desk'}
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                <a href={`tel:${settings.phone || '+923001234567'}`} className="hover:text-white">
                  {settings.phone || '+92 300 1234567'}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                <a
                  href={`https://wa.me/${whatsappClean}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  WhatsApp: {settings.whatsapp || '+92 300 1234567'}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                <a href={`mailto:${settings.email || 'info@nooralquran.pk'}`} className="hover:text-white">
                  {settings.email || 'info@nooralquran.pk'}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                <span>{settings.address || 'F-8 Markaz, Islamabad, Pakistan'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>
            © {currentYear} {settings.academyName || 'Noor Al-Quran Academy'}. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-1 text-gray-400">
            <span>Serving Quranic students worldwide with devotion</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 mx-1" />
            <span>from Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
