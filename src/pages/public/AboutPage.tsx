import React from 'react';
import { Target, Compass, Award, BookOpen, Users, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { SiteSettings } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export const AboutPage: React.FC<{ settings: SiteSettings; onNavigate: (path: string) => void }> = ({
  settings,
  onNavigate,
}) => {
  const { isUrdu } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold text-[#075E46] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {isUrdu ? 'تعارف و اغراض و مقاصد' : 'About Noor Al-Quran Academy'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#24352F] mt-3">
          Illuminating Hearts & Minds with Divine Knowledge
        </h1>
        <p className="text-gray-600 text-base sm:text-lg mt-3">
          Rooted in Pakistan with a global reach, delivering authentic Quranic education with Tajweed, Ihsan, and compassion.
        </p>
      </div>

      {/* Hero Image & Intro Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white">
          <img
            src="https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=800&q=80"
            alt="Academy students studying Quran"
            className="w-full h-80 sm:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#075E46]/80 via-transparent to-transparent flex items-end p-6">
            <div className="text-white">
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">Location</span>
              <h3 className="font-bold text-lg">{settings.city || 'Islamabad, Pakistan & Worldwide Online'}</h3>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#075E46] bg-emerald-50 px-3 py-1 rounded-md">
            <Award className="w-4 h-4 text-[#D4AF37]" />
            <span>Dedicated Quranic Mission</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24352F]">
            Nurturing a Deep Connection with the Words of Allah
          </h2>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Noor Al-Quran Academy was founded with a singular noble vision: to make authentic, classical Quran learning accessible, engaging, and enjoyable for students regardless of their geographical location or prior background.
          </p>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            We understand that learning to recite the Holy Quran with correct Makharij (articulation) and Tajweed is an obligation for every Muslim. Our certified teachers guide students step-by-step from beginner Noorani Qaida through full Quran fluency and Hifz.
          </p>

          <div className="pt-2 grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-emerald-100 shadow-xs">
              <div className="text-2xl font-bold text-[#075E46]">100%</div>
              <div className="text-xs text-gray-500 mt-1">Live 1-on-1 Personalized Classes</div>
            </div>
            <div className="p-4 bg-white rounded-xl border border-emerald-100 shadow-xs">
              <div className="text-2xl font-bold text-[#D4AF37]">3 Days</div>
              <div className="text-xs text-gray-500 mt-1">Free Trial Evaluation</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission, Vision & Approach Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-[#F3F8F4] text-[#075E46] flex items-center justify-center mb-5">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#24352F] mb-3">Our Mission</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {settings.aboutMission ||
              'To provide accessible, authentic, and inspiring Quranic education based on classical Tajweed rules, fostering spiritual growth and deep understanding among students of all ages worldwide.'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-[#F3F8F4] text-[#075E46] flex items-center justify-center mb-5">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#24352F] mb-3">Our Vision</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {settings.aboutVision ||
              'To be Pakistan’s leading online Quran academy, nurturing a generation grounded in Quranic teachings, exemplary Akhlaq, and proficient recitation.'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-[#F3F8F4] text-[#075E46] flex items-center justify-center mb-5">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-[#24352F] mb-3">Our Approach</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {settings.aboutApproach ||
              'We combine interactive digital whiteboards, screen-shared mushafs, personalized 1-on-1 pacing, and certified Qaris with ijazah to provide an engaging, supportive learning journey.'}
          </p>
        </div>
      </div>

      {/* Core Educational Pillars */}
      <div className="bg-[#075E46] text-white rounded-3xl p-8 sm:p-12 islamic-pattern">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Our Core Educational Pillars</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            'Patience & Encouragement for Young Children',
            'Authentic Sanad and Classical Tajweed Rules',
            'Comfortable & Safe Sessions with Female Tutors',
            'Complete Transparency & Parental Involvement',
          ].map((pillar, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-xs">
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm text-emerald-50 font-medium">{pillar}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <h3 className="text-xl font-bold text-[#24352F] mb-3">Ready to Start with Noor Al-Quran Academy?</h3>
        <button
          onClick={() => onNavigate('/admission')}
          className="px-8 py-3.5 rounded-xl bg-[#075E46] hover:bg-[#064e3b] text-white font-bold text-sm shadow-md transition-all"
        >
          Enroll for a Free 3-Day Trial
        </button>
      </div>
    </div>
  );
};
