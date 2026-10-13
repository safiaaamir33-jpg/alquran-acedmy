import React, { useState } from 'react';
import { Calendar, Tag, ExternalLink, ArrowRight } from 'lucide-react';
import { Announcement } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Lightbox } from '../../components/common/Lightbox';
import { resolveImageUrl } from '../../utils/imageHelpers';

export const AnnouncementsPage: React.FC<{
  announcements: Announcement[];
  onNavigate: (path: string) => void;
}> = ({ announcements, onNavigate }) => {
  const { isUrdu } = useLanguage();
  const [selectedPoster, setSelectedPoster] = useState<{ url: string; title: string } | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold text-[#075E46] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {isUrdu ? 'اعلانات و سرگرمیاں' : 'Latest Academy News'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#24352F] mt-3">
          Announcements & Admission Posters
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-2">
          Stay updated with current enrollment drives, special workshops, Ramadan schedules, and academy notices.
        </p>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
          <p className="text-gray-500 text-sm">No announcements posted at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {announcements.map((item) => {
            const safeImg = resolveImageUrl(item.imageUrl, 'general');
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-emerald-950/10 flex flex-col justify-between transition-all duration-300"
              >
                <div>
                  {item.imageUrl && (
                    <div
                      onClick={() => setSelectedPoster({ url: safeImg, title: item.title })}
                      className="relative h-64 overflow-hidden bg-gray-100 cursor-pointer group"
                    >
                      <img
                        src={safeImg}
                        alt={item.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/admission_poster.jpg';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-bold bg-[#075E46]/90 px-3 py-1.5 rounded-lg shadow-sm">
                          Click to Enlarge Poster
                        </span>
                      </div>
                    </div>
                  )}

                <div className="p-6 sm:p-8 space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-bold text-[#075E46] bg-emerald-50 px-2.5 py-1 rounded-md">
                      {item.category || 'Admission Poster'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{item.publishedAt || 'Active'}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-xl text-[#24352F]">
                    {isUrdu && item.titleUrdu ? item.titleUrdu : item.title}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {isUrdu && item.contentUrdu ? item.contentUrdu : item.content}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-0">
                <button
                  onClick={() => onNavigate(item.actionLink || '/admission')}
                  className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm bg-[#075E46] hover:bg-[#064e3b] text-white transition-colors flex items-center justify-center gap-2"
                >
                  <span>Apply / Learn More</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {selectedPoster && (
        <Lightbox
          imageUrl={selectedPoster.url}
          title={selectedPoster.title}
          onClose={() => setSelectedPoster(null)}
        />
      )}
    </div>
  );
};
