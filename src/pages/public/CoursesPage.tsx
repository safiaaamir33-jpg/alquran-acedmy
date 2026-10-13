import React, { useState } from 'react';
import { BookOpen, Clock, Users, Calendar, ArrowRight, Check, X, Shield } from 'lucide-react';
import { Course } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { resolveImageUrl } from '../../utils/imageHelpers';

export const CoursesPage: React.FC<{ courses: Course[]; onNavigate: (path: string) => void }> = ({
  courses,
  onNavigate,
}) => {
  const { isUrdu } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);

  const categories = [
    'All',
    'Noorani Qaida',
    'Quran Nazra',
    'Quran with Tajweed',
    'Hifz-ul-Quran',
    'Quran Translation',
    'Tafseer',
    'Islamic Studies',
    'Daily Duas and basic Islamic education',
  ];

  const filteredCourses = courses.filter((c) => {
    if (selectedCategory === 'All') return true;
    return c.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold text-[#075E46] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {isUrdu ? 'جامع نصابِ تعلیم' : 'Academic Curriculum'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#24352F] mt-3">
          Quran & Islamic Studies Courses
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-2">
          Structured courses tailored for kids, sisters, adult beginners, and advanced students. Conducted live 1-on-1 by certified teachers.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#075E46] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-emerald-950/10 flex flex-col justify-between transition-all duration-300 group"
          >
            <div>
              <div className="relative h-52 overflow-hidden bg-gray-100">
                <img
                  src={resolveImageUrl(c.imageUrl, 'course')}
                  alt={c.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#075E46]/95 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-lg">
                  {c.category}
                </div>
                {c.isFeatured && (
                  <div className="absolute top-3 right-3 bg-[#D4AF37] text-[#24352F] text-[11px] font-bold px-2.5 py-0.5 rounded-lg shadow-sm">
                    Featured
                  </div>
                )}
              </div>

              <div className="p-6 space-y-3">
                <h3 className="font-bold text-xl text-[#24352F] group-hover:text-[#075E46] transition-colors">
                  {isUrdu && c.titleUrdu ? c.titleUrdu : c.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {isUrdu && c.descriptionUrdu ? c.descriptionUrdu : c.description}
                </p>

                <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#075E46]" />
                    <span>{c.duration || 'Flexible'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#075E46]" />
                    <span>{c.classMode || '1-on-1 Live'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 space-y-3">
              <div className="flex items-center justify-between text-sm py-2 px-3 bg-[#F3F8F4] rounded-xl">
                <span className="text-xs text-gray-500">Monthly Tuition:</span>
                <span className="font-bold text-[#075E46]">{c.feePkr || 'Contact for details'}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveCourseModal(c)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  View Curriculum
                </button>
                <button
                  onClick={() => onNavigate(`/admission?course=${encodeURIComponent(c.title)}`)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-[#075E46] hover:bg-[#064e3b] text-white transition-colors"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course Detail Modal */}
      {activeCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveCourseModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-[#075E46] uppercase bg-emerald-50 px-2.5 py-1 rounded">
              {activeCourseModal.category}
            </span>
            <h3 className="text-2xl font-extrabold text-[#24352F] mt-2">
              {activeCourseModal.title}
            </h3>

            <div className="mt-4 rounded-xl overflow-hidden h-48 bg-gray-100">
              <img
                src={resolveImageUrl(activeCourseModal.imageUrl, 'course')}
                alt={activeCourseModal.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-4 space-y-4 text-sm text-gray-700 leading-relaxed">
              <p>{activeCourseModal.description}</p>

              <div className="p-4 bg-[#F3F8F4] rounded-2xl space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-gray-500">Duration:</span>
                  <span className="font-bold text-[#24352F]">{activeCourseModal.duration || 'Flexible according to student pace'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-gray-500">Class Mode:</span>
                  <span className="font-bold text-[#24352F]">{activeCourseModal.classMode || '1-on-1 Live Online (Zoom / Meet)'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-gray-500">Timings:</span>
                  <span className="font-bold text-[#24352F]">{activeCourseModal.timing || 'Flexible (Morning / Afternoon / Evening)'}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-emerald-200">
                  <span className="font-semibold text-gray-500">Fee in Pakistan (PKR):</span>
                  <span className="font-bold text-[#075E46]">{activeCourseModal.feePkr || 'Contact Admissions Desk'}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setActiveCourseModal(null)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const courseTitle = activeCourseModal.title;
                  setActiveCourseModal(null);
                  onNavigate(`/admission?course=${encodeURIComponent(courseTitle)}`);
                }}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#075E46] hover:bg-[#064e3b] text-white shadow-md"
              >
                Enroll with 3-Day Free Trial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
