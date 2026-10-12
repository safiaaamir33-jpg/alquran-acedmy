import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  GraduationCap,
  Calendar,
  Clock,
  Star,
  Users,
  Award,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  PhoneCall,
  Video
} from 'lucide-react';
import { Course, Teacher, Announcement, GalleryItem, Review, FAQ, SiteSettings, ContactMessage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Lightbox } from '../../components/common/Lightbox';

interface HomePageProps {
  settings: SiteSettings;
  courses: Course[];
  teachers: Teacher[];
  announcements: Announcement[];
  gallery: GalleryItem[];
  reviews: Review[];
  faqs: FAQ[];
  clientMessages?: ContactMessage[];
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  courses,
  teachers,
  announcements,
  gallery,
  reviews,
  faqs,
  clientMessages = [],
  onNavigate,
}) => {
  const { t, isUrdu } = useLanguage();
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ url: string; title?: string; caption?: string } | null>(null);

  const featuredCourses = courses.filter((c) => c.isFeatured).slice(0, 4);
  const publishedTeachers = teachers.slice(0, 3);
  const recentAnnouncements = announcements.slice(0, 2);
  const galleryPreview = gallery.slice(0, 4);
  const approvedReviews = reviews.slice(0, 3);
  const topFaqs = faqs.slice(0, 5);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#075E46]/90 via-[#075E46] to-[#0B7A53] text-white pt-12 pb-20 sm:pt-16 sm:pb-28 islamic-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left rtl:lg:text-right">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/40 text-xs sm:text-sm font-medium text-[#D4AF37]">
                <Sparkles className="w-4 h-4" />
                <span>{t('hero.badge')}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight">
                {settings.heroTitle || 'Learn the Holy Quran with Tajweed & Excellence'}
              </h1>

              <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {settings.heroSubtitle ||
                  'Certified Quran tutors, personalized 1-on-1 live classes, flexible timings, and dedicated female teachers for sisters and young children. Start your 3-day free trial today.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => onNavigate('/admission')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-[#D4AF37] hover:bg-[#c29f31] text-[#24352F] shadow-xl shadow-black/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <span>{t('nav.freeTrial')}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>

                <button
                  onClick={() => onNavigate('/courses')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                  <span>{t('hero.exploreCourses')}</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-white/15 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-[#D4AF37]">1-on-1</div>
                  <div className="text-xs text-emerald-200">Personalized Classes</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-[#D4AF37]">Female Tutors</div>
                  <div className="text-xs text-emerald-200">For Sisters & Kids</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-[#D4AF37]">3 Days Free</div>
                  <div className="text-xs text-emerald-200">Trial Class Evaluation</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-white/5">
                  <img
                    src={
                      settings.heroImageUrl ||
                      'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80'
                    }
                    alt="Quran Study"
                    className="w-full h-80 sm:h-96 object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-emerald-100 flex items-center justify-between text-[#24352F]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#075E46] text-white flex items-center justify-center">
                        <Video className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-[#075E46]">Live Interactive Learning</div>
                        <div className="text-[11px] text-gray-500">Zoom & Google Meet Screen Sharing</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                      24/7 Available
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY CHOOSE OUR ACADEMY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#075E46] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {isUrdu ? 'ہماری خصوصیات' : 'Excellence in Quranic Education'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#24352F] mt-3">
            {t('section.whyUs')}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            We provide a peaceful, structured environment adhering to authentic Quranic principles and classical Tajweed rules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <GraduationCap className="w-6 h-6 text-[#075E46]" />,
              title: 'Certified Faculty with Ijazah',
              desc: 'Graduates from recognized Islamic institutions and certified Huffaz with profound knowledge in Tajweed.',
            },
            {
              icon: <Users className="w-6 h-6 text-[#075E46]" />,
              title: 'Dedicated Female Tutors',
              desc: 'Qualified Alimahs and Tajweed teachers specifically for female students and young children in comfortable sessions.',
            },
            {
              icon: <Clock className="w-6 h-6 text-[#075E46]" />,
              title: 'Flexible Timings (Pakistan & Overseas)',
              desc: 'Custom schedules designed around school, work, and family routines in Asia/Karachi and overseas timezones.',
            },
            {
              icon: <Award className="w-6 h-6 text-[#075E46]" />,
              title: 'Parental Progress Reports',
              desc: 'Regular evaluations, attendance logs, and Quran recitation milestones communicated directly to parents.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-emerald-950/10 hover:border-[#075E46]/40 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F3F8F4] flex items-center justify-center mb-4 group-hover:bg-[#075E46] group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <h3 className="font-bold text-lg text-[#24352F] mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED COURSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-[#075E46] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {isUrdu ? 'مقبول کورسز' : 'Featured Programs'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#24352F] mt-2">
              {t('section.courses')}
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/courses')}
            className="text-sm font-bold text-[#075E46] hover:text-[#0B7A53] flex items-center gap-1.5 transition-colors"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCourses.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 flex flex-col transition-all duration-300 group"
            >
              <div className="relative h-44 overflow-hidden bg-gray-100">
                <img
                  src={c.imageUrl || 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=600&q=80'}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#075E46] text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs">
                  {c.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-[#24352F] group-hover:text-[#075E46] transition-colors">
                    {isUrdu && c.titleUrdu ? c.titleUrdu : c.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2 mt-1.5">
                    {isUrdu && c.descriptionUrdu ? c.descriptionUrdu : c.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{c.duration || 'Flexible'}</span>
                    </span>
                    <span className="font-bold text-[#075E46]">
                      {c.feePkr || 'Contact for fee'}
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigate(`/admission?course=${encodeURIComponent(c.title)}`)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#F3F8F4] text-[#075E46] hover:bg-[#075E46] hover:text-white transition-all text-center"
                  >
                    Enroll in this Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TEACHERS PREVIEW */}
      <section className="bg-[#F3F8F4] py-16 islamic-pattern-light border-y border-emerald-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#075E46] uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-emerald-200">
              {isUrdu ? 'مستند اساتذہ' : 'Certified Instructors'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#24352F] mt-2">
              {t('section.teachers')}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Experienced teachers equipped with pedagogical expertise and authentic Islamic ijazah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {publishedTeachers.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 flex flex-col items-center text-center hover:shadow-md transition-shadow"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#075E46]/20 mb-4 shadow-inner">
                  <img
                    src={t.imageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                    alt={t.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-lg text-[#24352F]">
                  {isUrdu && t.nameUrdu ? t.nameUrdu : t.name}
                </h3>
                <span className="text-xs font-semibold text-[#0B7A53] mt-0.5">
                  {isUrdu && t.qualificationUrdu ? t.qualificationUrdu : t.qualification}
                </span>
                <p className="text-xs text-gray-500 mt-2.5 line-clamp-3">
                  {isUrdu && t.bioUrdu ? t.bioUrdu : (t.bio || 'Dedicated Quran and Tajweed mentor with extensive teaching experience.')}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => onNavigate('/teachers')}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-white text-[#075E46] hover:bg-[#075E46] hover:text-white border border-[#075E46] transition-colors"
            >
              Meet All Teachers
            </button>
          </div>
        </div>
      </section>

      {/* 5. HOW ONLINE CLASSES WORK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#075E46] to-[#0B7A53] rounded-3xl text-white p-8 sm:p-12 shadow-xl relative overflow-hidden islamic-pattern">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
              Simple 3-Step Enrollment
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-3">
              How Do Online Quran Classes Work?
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base mt-2">
              Starting your Quranic journey with Noor Al-Quran Academy is seamless and convenient from anywhere in Pakistan or abroad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/15">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#24352F] font-bold text-lg flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Request 3-Day Trial</h3>
              <p className="text-emerald-100 text-xs leading-relaxed">
                Fill out our simple admission form. No upfront fees or payment card required.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/15">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#24352F] font-bold text-lg flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Meet Your Tutor Online</h3>
              <p className="text-emerald-100 text-xs leading-relaxed">
                Connect via Zoom or Google Meet. The teacher evaluates your current level and customizes a plan.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/15">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#24352F] font-bold text-lg flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Begin Regular Classes</h3>
              <p className="text-emerald-100 text-xs leading-relaxed">
                Choose your schedule, learn at your pace, and receive monthly progress updates.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('/admission')}
              className="px-6 py-3 rounded-xl bg-[#D4AF37] text-[#24352F] font-bold text-sm hover:bg-[#c29f31] transition-all"
            >
              Apply For Free Trial Now
            </button>
            <button
              onClick={() => onNavigate('/classes')}
              className="px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium text-sm transition-all"
            >
              Learn More About Class Setup
            </button>
          </div>
        </div>
      </section>

      {/* 6. ANNOUNCEMENTS & ADMISSION POSTERS */}
      {recentAnnouncements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-[#075E46] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {isUrdu ? 'اعلانات' : 'Notices & Posters'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24352F] mt-2">
                {t('section.announcements')}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/announcements')}
              className="text-xs sm:text-sm font-bold text-[#075E46] hover:text-[#0B7A53] flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-emerald-100 flex flex-col sm:flex-row hover:shadow-md transition-shadow"
              >
                {ann.imageUrl && (
                  <div
                    onClick={() => setSelectedImage({ url: ann.imageUrl!, title: ann.title })}
                    className="sm:w-48 h-48 sm:h-auto overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer"
                  >
                    <img
                      src={ann.imageUrl}
                      alt={ann.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span className="font-semibold text-[#075E46] bg-emerald-50 px-2 py-0.5 rounded">
                        {ann.category || 'Announcement'}
                      </span>
                      <span>{ann.publishedAt || 'Active'}</span>
                    </div>
                    <h3 className="font-bold text-base text-[#24352F]">
                      {isUrdu && ann.titleUrdu ? ann.titleUrdu : ann.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-3 mt-2">
                      {isUrdu && ann.contentUrdu ? ann.contentUrdu : ann.content}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => onNavigate(ann.actionLink || '/admission')}
                      className="text-xs font-bold text-[#075E46] hover:underline"
                    >
                      Learn More / Apply →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. GALLERY PREVIEW */}
      {galleryPreview.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-[#075E46] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {isUrdu ? 'تصویری گیلری' : 'Photo Highlights'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24352F] mt-2">
                {t('section.gallery')}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/gallery')}
              className="text-xs sm:text-sm font-bold text-[#075E46] hover:text-[#0B7A53] flex items-center gap-1"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryPreview.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage({ url: item.imageUrl, title: item.title, caption: item.caption })}
                className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-lg transition-all"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title || 'Gallery item'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-xs text-white font-medium line-clamp-1">{item.caption || item.title}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. APPROVED REVIEWS */}
      {approvedReviews.length > 0 && (
        <section className="bg-[#F3F8F4] py-16 border-y border-emerald-900/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-[#075E46] uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-emerald-200">
                {isUrdu ? 'والدین اور طلبہ کے تاثرات و پیغامات' : 'Parent & Student Testimonials & Client Messages'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#24352F] mt-2">
                {t('section.reviews')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {approvedReviews.map((rev) => (
                <div key={rev.id} className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < rev.rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-gray-100">
                    <h4 className="font-bold text-sm text-[#24352F]">{rev.name}</h4>
                    <span className="text-xs text-gray-500">{rev.relation || rev.courseTitle}</span>
                  </div>
                </div>
              ))}

              {/* Show live client messages on website */}
              {clientMessages.slice(0, 3).map((msg) => (
                <div key={msg.id} className="bg-emerald-50/50 p-6 rounded-2xl shadow-sm border border-emerald-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-[#075E46]">
                        Client Inquiry
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 italic leading-relaxed">
                      "{msg.message}"
                    </p>
                    {msg.replyText && (
                      <div className="mt-3 p-2.5 bg-white rounded-xl text-xs text-emerald-900 border border-emerald-100">
                        <strong className="text-[#075E46] block text-[11px]">Academy Response:</strong>
                        <p className="italic">{msg.replyText}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-5 pt-3 border-t border-emerald-200/60">
                    <h4 className="font-bold text-sm text-[#075E46]">{msg.name}</h4>
                    <span className="text-xs text-gray-500">{msg.subject || 'Verified Client'}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('/reviews')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#075E46] text-white hover:bg-[#064e3b] transition-colors shadow-sm"
              >
                Read All Reviews or Submit Yours
              </button>
              <button
                onClick={() => onNavigate('/contact')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-[#075E46] border border-emerald-300 hover:bg-emerald-50 transition-colors"
              >
                Send Us a Message (ہمیں پیغام بھیجیں)
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#075E46] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {isUrdu ? 'عمومی سوالات' : 'Got Questions?'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#24352F] mt-2">
            {t('section.faq')}
          </h2>
        </div>

        <div className="space-y-3">
          {topFaqs.map((faq) => {
            const isOpen = activeFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left rtl:text-right hover:bg-gray-50/80 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-[#24352F]">
                    {isUrdu && faq.questionUrdu ? faq.questionUrdu : faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#075E46] transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {isUrdu && faq.answerUrdu ? faq.answerUrdu : faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#075E46] text-white rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden islamic-pattern">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Begin Your Quran Journey Today
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base">
              Experience our gentle, structured teaching with a 3-day free trial. Female tutors available for sisters and children.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <button
                onClick={() => onNavigate('/admission')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-[#D4AF37] hover:bg-[#c29f31] text-[#24352F] shadow-lg transition-all"
              >
                Reserve Your Free Trial
              </button>
              <button
                onClick={() => onNavigate('/contact')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-medium text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
              >
                Contact Admissions Desk
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox for Image Enlargement */}
      {selectedImage && (
        <Lightbox
          imageUrl={selectedImage.url}
          title={selectedImage.title}
          caption={selectedImage.caption}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};
