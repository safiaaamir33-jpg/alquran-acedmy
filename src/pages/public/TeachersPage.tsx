import React from 'react';
import { Award, BookOpen, Clock, ShieldCheck, UserCheck } from 'lucide-react';
import { Teacher } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export const TeachersPage: React.FC<{ teachers: Teacher[]; onNavigate: (path: string) => void }> = ({
  teachers,
  onNavigate,
}) => {
  const { isUrdu } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold text-[#075E46] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {isUrdu ? 'مستند و باصلاحیت اساتذہ' : 'Distinguished Faculty'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#24352F] mt-3">
          Our Certified Quran Instructors
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-2">
          Graduates of renowned Islamic universities, certified Huffaz, and qualified Alimahs dedicated to guiding students with patience, kindness, and mastery.
        </p>
      </div>

      {/* Female Teacher Highlight Notice */}
      <div className="bg-[#F3F8F4] border border-emerald-200 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#075E46] text-white flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#075E46]">Dedicated Female Tutors Available</h4>
            <p className="text-xs text-gray-600">
              Sisters, adult female learners, and young children can study privately with certified female Alimahs.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('/admission')}
          className="px-5 py-2.5 rounded-xl bg-[#075E46] text-white text-xs font-bold hover:bg-[#064e3b] transition-colors flex-shrink-0"
        >
          Request Female Tutor
        </button>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl border border-emerald-950/10 flex flex-col justify-between transition-all duration-300"
          >
            <div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-100 flex-shrink-0 shadow-inner">
                  <img
                    src={teacher.imageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                    alt={teacher.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#24352F]">
                    {isUrdu && teacher.nameUrdu ? teacher.nameUrdu : teacher.name}
                  </h3>
                  <span className="text-xs text-emerald-700 font-semibold block mt-0.5">
                    {isUrdu && teacher.qualificationUrdu ? teacher.qualificationUrdu : teacher.qualification}
                  </span>
                  {teacher.experience && (
                    <span className="text-[11px] text-gray-500 block mt-1">
                      {teacher.experience}
                    </span>
                  )}
                </div>
              </div>

              {teacher.subjects && (
                <div className="mb-4">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                    Areas of Expertise
                  </span>
                  <p className="text-xs font-medium text-[#075E46] bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                    {teacher.subjects}
                  </p>
                </div>
              )}

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {isUrdu && teacher.bioUrdu ? teacher.bioUrdu : teacher.bio}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100">
              <button
                onClick={() => onNavigate('/admission')}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#F3F8F4] text-[#075E46] hover:bg-[#075E46] hover:text-white transition-all text-center"
              >
                Schedule Trial with this Faculty
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
