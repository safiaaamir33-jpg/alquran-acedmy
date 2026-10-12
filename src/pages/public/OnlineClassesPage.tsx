import React from 'react';
import { Video, Laptop, Headphones, Calendar, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import { SiteSettings } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export const OnlineClassesPage: React.FC<{ settings: SiteSettings; onNavigate: (path: string) => void }> = ({
  settings,
  onNavigate,
}) => {
  const { isUrdu } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold text-[#075E46] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {isUrdu ? 'آن لائن کلاسز کی تفصیلات' : 'Virtual Classroom Experience'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#24352F] mt-3">
          How Online Quran Classes Work
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-2">
          Experience world-class live Quran instruction from the comfort and safety of your home. Everything you need to know about our virtual classroom.
        </p>
      </div>

      {/* Classroom Setup Essentials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-emerald-100 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F3F8F4] text-[#075E46] flex items-center justify-center">
            <Laptop className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-[#24352F]">1. Device & Internet</h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            You can use a PC, laptop, iPad/tablet, or smartphone with a stable internet connection. A larger screen (laptop or tablet) is recommended for younger children.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-emerald-100 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F3F8F4] text-[#075E46] flex items-center justify-center">
            <Video className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-[#24352F]">2. Zoom or Google Meet</h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Our academy provides secure, personalized class meeting links. The teacher shares high-definition digital Quran text with interactive pointer guidance.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-emerald-100 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F3F8F4] text-[#075E46] flex items-center justify-center">
            <Headphones className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-[#24352F]">3. Audio & Tajweed Correction</h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Clear headphones with microphone enable crystal-clear phonetics so the teacher can accurately correct subtle Makharij and Tajweed articulation in real time.
          </p>
        </div>
      </div>

      {/* Step-by-Step Roadmap */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-100 shadow-sm space-y-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#24352F] text-center">
          Step-by-Step Process for Students & Parents
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: 'Step 1',
              title: 'Online Application',
              desc: 'Submit our free admission form specifying your course preference, age, and preferred time window in Pakistan timezone.',
            },
            {
              step: 'Step 2',
              title: 'Coordination Call',
              desc: 'Our admissions desk will contact you via WhatsApp / Phone to confirm schedule availability and send your class link.',
            },
            {
              step: 'Step 3',
              title: '3-Day Free Trial',
              desc: 'Attend 3 trial sessions with your assigned male or female tutor. Experience the interactive teaching style at no cost.',
            },
            {
              step: 'Step 4',
              title: 'Enrollment & Regular Classes',
              desc: 'Once completely satisfied, confirm your regular monthly enrollment and track weekly progress milestones.',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-[#F3F8F4] border border-emerald-200/50">
              <span className="text-xs font-bold text-[#D4AF37] uppercase">{item.step}</span>
              <h4 className="font-bold text-base text-[#075E46] mt-1 mb-2">{item.title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Class Questions */}
      <div className="max-w-3xl mx-auto space-y-4">
        <h3 className="text-xl font-bold text-center text-[#24352F]">Common Class Inquiries</h3>
        <div className="bg-white p-5 rounded-2xl border border-gray-200 text-sm space-y-3">
          <div>
            <h4 className="font-bold text-[#075E46]">Can parents sit with young children during class?</h4>
            <p className="text-xs text-gray-600 mt-1">
              Absolutely! Parents are warmly encouraged to observe classes, especially during the first few weeks, to support their child’s confidence and routine.
            </p>
          </div>
          <div className="pt-3 border-t border-gray-100">
            <h4 className="font-bold text-[#075E46]">What if I miss a scheduled class due to an emergency?</h4>
            <p className="text-xs text-gray-600 mt-1">
              Simply inform your teacher or the academy desk via WhatsApp prior to the session, and makeup classes can be scheduled based on mutual availability.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('/admission')}
          className="px-8 py-3.5 rounded-xl bg-[#075E46] hover:bg-[#064e3b] text-white font-bold text-sm shadow-md transition-all"
        >
          Book Your 3-Day Free Trial Today
        </button>
      </div>
    </div>
  );
};
