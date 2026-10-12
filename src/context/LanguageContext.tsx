import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  isUrdu: boolean;
}

const translations: Record<string, { en: string; ur: string }> = {
  // Navigation
  'nav.home': { en: 'Home', ur: 'صفحۂ اول' },
  'nav.about': { en: 'About Us', ur: 'ہمارے متعلق' },
  'nav.courses': { en: 'Courses', ur: 'قرآنی کورسز' },
  'nav.teachers': { en: 'Teachers', ur: 'اساتذہ کرام' },
  'nav.classes': { en: 'Online Classes', ur: 'آن لائن کلاسز' },
  'nav.admission': { en: 'Admissions', ur: 'آن لائن داخلہ' },
  'nav.announcements': { en: 'Announcements', ur: 'اعلانات و پوسٹرز' },
  'nav.gallery': { en: 'Gallery', ur: 'تصویری جھلکیاں' },
  'nav.reviews': { en: 'Reviews', ur: 'آراء و تاثرات' },
  'nav.faq': { en: 'FAQs', ur: 'عام سوالات' },
  'nav.contact': { en: 'Contact Us', ur: 'رابطہ کریں' },
  'nav.admin': { en: 'Admin Portal', ur: 'انتظامی پورٹل' },
  'nav.enrollNow': { en: 'Enroll Now', ur: 'داخلہ لیں' },
  'nav.freeTrial': { en: '3-Day Free Trial', ur: '3 روزہ مفت ٹرائل' },

  // Hero & General
  'hero.badge': { en: '★ Pakistan’s Trusted Online Quran Academy', ur: '★ پاکستان کی معتبر آن لائن قرآن اکیڈمی' },
  'hero.exploreCourses': { en: 'Explore Courses', ur: 'کورسز دیکھیں' },
  'hero.callUs': { en: 'Call Admissions', ur: 'رابطہ کریں' },

  // Sections
  'section.courses': { en: 'Our Quran Courses', ur: 'ہمارے قرآنی کورسز' },
  'section.coursesSub': { en: 'Carefully curated programs for kids, adult beginners, and advanced students.', ur: 'بچوں، نو آموز اور جدید طلبہ کے لیے جامع نصاب۔' },
  'section.whyUs': { en: 'Why Choose Noor Al-Quran?', ur: 'نور القرآن اکیڈمی کا انتخاب کیوں؟' },
  'section.teachers': { en: 'Our Certified Faculty', ur: 'ہمارے مستند اساتذہ کرام' },
  'section.announcements': { en: 'Latest Announcements & Posters', ur: 'تازہ ترین اعلانات اور پوسٹرز' },
  'section.gallery': { en: 'Academy Life & Achievements', ur: 'اکیڈمی کی تصویری جھلکیاں' },
  'section.reviews': { en: 'What Parents & Students Say', ur: 'طلبہ اور والدین کے تاثرات' },
  'section.faq': { en: 'Frequently Asked Questions', ur: 'اکثر پوچھے جانے والے سوالات' },

  // Admissions
  'adm.title': { en: 'Online Admission Application', ur: 'آن لائن داخلہ فارم' },
  'adm.sub': { en: 'Fill out this quick form to reserve a free 3-day trial class. Our team will contact you within 24 hours.', ur: 'مفت 3 روزہ ٹرائل کے لیے فارم مکمل کریں۔ ہماری ٹیم 24 گھنٹے میں رابطہ کرے گی۔' },
  'adm.studentName': { en: 'Student Full Name *', ur: 'طالب علم کا مکمل نام *' },
  'adm.guardianName': { en: 'Parent / Guardian Name', ur: 'والد یا سرپرست کا نام' },
  'adm.phone': { en: 'Contact Phone / WhatsApp *', ur: 'فون یا واٹس ایپ نمبر *' },
  'adm.email': { en: 'Email Address (Optional)', ur: 'ای میل ایڈریس (اختیاری)' },
  'adm.age': { en: 'Student Age / Level', ur: 'طالب علم کی عمر یا درجہ' },
  'adm.course': { en: 'Select Quran Course *', ur: 'کورس کا انتخاب کریں *' },
  'adm.mode': { en: 'Preferred Learning Mode', ur: 'کلاس کا طریقہ کار' },
  'adm.timing': { en: 'Preferred Timings (Asia/Karachi)', ur: 'پسندیدہ اوقاتِ کار' },
  'adm.message': { en: 'Special Requests or Prior Knowledge', ur: 'کوئی خصوصی پیغام یا سابقہ تعلیم' },
  'adm.consent': { en: 'I consent to being contacted by Noor Al-Quran Academy regarding admission and class schedules.', ur: 'میں داخلے اور کلاس اوقات کے سلسلے میں رابطے کی اجازت دیتا/دیتی ہوں۔' },
  'adm.submit': { en: 'Submit Admission Form', ur: 'داخلہ فارم جمع کرائیں' },
  'adm.successTitle': { en: 'Application Received Successfully!', ur: 'درخواست کامیابی کے ساتھ موصول ہو گئی!' },
  'adm.successMsg': { en: 'JazakAllah Khair! Our admissions counselor will reach out via WhatsApp/Phone shortly.', ur: 'جزاک اللہ خیر! ہمارا داخلہ مشیر جلد ہی آپ سے واٹس ایپ پر رابطہ کرے گا۔' },

  // Footer & Contact
  'contact.getInTouch': { en: 'Get In Touch With Us', ur: 'ہم سے رابطہ کریں' },
  'contact.sendMsg': { en: 'Send Inquiry', ur: 'پیغام بھیجیں' },
  'contact.whatsappDirect': { en: 'Chat on WhatsApp', ur: 'واٹس ایپ پر رابطہ' },
  'footer.rights': { en: 'All rights reserved.', ur: 'جملہ حقوق محفوظ ہیں۔' },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string) => key,
  isUrdu: false,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('noor_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('noor_lang', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ur' : 'en');
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    const item = translations[key];
    if (!item) return key;
    return language === 'ur' ? item.ur : item.en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isUrdu: language === 'ur' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
