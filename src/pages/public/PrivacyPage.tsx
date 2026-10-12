import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const PrivacyPage: React.FC = () => {
  const { isUrdu } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[#075E46] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Privacy & Trust
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#24352F] mt-3">
          Privacy Policy
        </h1>
        <p className="text-gray-600 text-sm mt-2">
          How Noor Al-Quran Academy protects student and parent data with utmost Islamic trust (Amanah).
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-emerald-100 space-y-8 text-sm text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#075E46] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
            <span>1. Information We Collect</span>
          </h2>
          <p>
            When you submit an online admission or inquiry form, we collect the student’s name, parent/guardian name, phone/WhatsApp number, optional email, age, and course preferences. This information is gathered solely for scheduling trial classes and managing student enrollments.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#075E46] flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#D4AF37]" />
            <span>2. Security & Confidentiality</span>
          </h2>
          <p>
            All submitted student records, parent contact details, and financial fees are stored securely in Google Cloud Firestore with strict Attribute-Based Access Control (ABAC). Unauthenticated visitors and third parties can never inspect or scrape student data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#075E46] flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-[#D4AF37]" />
            <span>3. No Selling or Sharing of Data</span>
          </h2>
          <p>
            We strictly treat all student and guardian information as an Islamic Amanah (sacred trust). We never sell, rent, or distribute personal information to advertisers or external commercial marketing agencies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#075E46] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#D4AF37]" />
            <span>4. Class Privacy for Sisters & Children</span>
          </h2>
          <p>
            Classes are conducted 1-on-1 in dedicated, secure virtual meeting rooms. Video camera sharing is optional and strictly controlled according to the family’s preference and Islamic modesty requirements.
          </p>
        </section>
      </div>
    </div>
  );
};
