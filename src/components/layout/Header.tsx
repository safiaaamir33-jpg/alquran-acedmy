import React, { useState } from 'react';
import { Phone, MessageCircle, Globe, Menu, X, BookOpen, ShieldCheck, UserCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SiteSettings } from '../../types';

interface HeaderProps {
  settings: SiteSettings;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ settings, currentPath, onNavigate }) => {
  const { t, language, toggleLanguage, isUrdu } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.courses'), path: '/courses' },
    { label: t('nav.teachers'), path: '/teachers' },
    { label: t('nav.classes'), path: '/classes' },
    { label: t('nav.admission'), path: '/admission' },
    { label: t('nav.announcements'), path: '/announcements' },
    { label: t('nav.gallery'), path: '/gallery' },
    { label: t('nav.reviews'), path: '/reviews' },
    { label: t('nav.faq'), path: '/faq' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappClean = (settings.whatsapp || '+92 300 1234567').replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-emerald-900/10">
      {/* Dynamic Top Announcement Notice (Managed in Admin Settings) */}
      {settings.showTopNotice && settings.topNoticeText && (
        <div className="bg-[#D4AF37] text-[#24352F] text-[11px] sm:text-xs py-1.5 px-4 font-bold text-center border-b border-amber-400/40 shadow-xs flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#075E46] animate-pulse"></span>
          <span>{settings.topNoticeText}</span>
        </div>
      )}

      {/* Top Banner with Pakistan Contact Info */}
      <div className="bg-[#075E46] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <a
              href={`tel:${settings.phone || '+923001234567'}`}
              className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{settings.phone || '+92 300 1234567'}</span>
            </a>
            <a
              href={`https://wa.me/${whatsappClean}?text=${encodeURIComponent('Assalamu Alaikum, I would like to enquire about Quran admissions at ' + (settings.academyName || 'Noor Al-Quran Academy'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#D4AF37] transition-colors font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>WhatsApp Admissions: {settings.whatsapp || '+92 300 1234567'}</span>
            </a>
            <span className="hidden md:inline-block text-white/60">|</span>
            <span className="hidden md:inline-block text-white/90">
              🇵🇰 {settings.timings || 'Pakistan & Overseas Online Classes (Asia/Karachi)'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white font-medium"
              title="Toggle Urdu / English Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{language === 'en' ? 'اردو' : 'English'}</span>
            </button>

            {/* Admin portal shortcut */}
            <button
              onClick={() => handleLinkClick('/admin')}
              className="hidden sm:flex items-center gap-1 text-white/80 hover:text-[#D4AF37] transition-colors text-xs font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div
          onClick={() => handleLinkClick('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.academyName || 'Noor Al-Quran Academy'}
              className="w-11 h-11 sm:w-13 sm:h-13 object-contain rounded-xl border border-emerald-100 shadow-sm bg-white p-0.5 group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-gradient-to-br from-[#075E46] to-[#0B7A53] flex items-center justify-center text-white shadow-md border border-[#D4AF37]/30 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6 text-[#D4AF37]" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg sm:text-xl text-[#075E46] tracking-tight group-hover:text-[#0B7A53] transition-colors">
                {isUrdu && settings.academyNameUrdu ? settings.academyNameUrdu : (settings.academyName || 'Noor Al-Quran Academy')}
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-[#075E46] border border-emerald-200">
                Pakistan
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-1">
              {isUrdu && settings.taglineUrdu ? settings.taglineUrdu : (settings.tagline || 'Online Quran Education with Tajweed & Excellence')}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 lg:gap-2">
          {navLinks.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleLinkClick(item.path)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'text-[#075E46] bg-[#F3F8F4] font-semibold'
                    : 'text-[#24352F]/80 hover:text-[#075E46] hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleLinkClick('/admission')}
            className="hidden sm:inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#075E46] to-[#0B7A53] hover:from-[#064e3b] hover:to-[#075E46] text-white shadow-md shadow-emerald-900/10 hover:shadow-lg transition-all"
          >
            <UserCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>{t('nav.freeTrial')}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl text-gray-700 hover:text-[#075E46] hover:bg-gray-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 animate-in slide-in-from-top-4">
          <div className="flex flex-col gap-1">
            {navLinks.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleLinkClick(item.path)}
                  className={`text-left rtl:text-right px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#075E46] bg-[#F3F8F4] font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
              <button
                onClick={() => handleLinkClick('/admission')}
                className="w-full py-3 rounded-xl font-semibold text-center text-sm bg-[#075E46] text-white shadow-md"
              >
                {t('nav.freeTrial')}
              </button>
              <button
                onClick={() => handleLinkClick('/admin')}
                className="w-full py-2.5 rounded-xl text-sm text-center font-medium text-emerald-800 bg-emerald-50 border border-emerald-200"
              >
                Admin Management Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
