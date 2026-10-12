import React, { useState } from 'react';
import { GalleryItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Lightbox } from '../../components/common/Lightbox';
import { Maximize2 } from 'lucide-react';

export const GalleryPage: React.FC<{ gallery: GalleryItem[] }> = ({ gallery }) => {
  const { isUrdu } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Classes', 'Academy', 'Hifz', 'Graduation'];

  const filteredItems = gallery.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold text-[#075E46] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {isUrdu ? 'تصویری جھلکیاں' : 'Photo Gallery'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#24352F] mt-3">
          Moments from Noor Al-Quran Academy
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-2">
          Glimpses into our online classroom milestones, graduation certificates, student recitations, and campus life.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-[#075E46] text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveItem(item)}
            className="group relative rounded-3xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-xl cursor-pointer h-64 border border-emerald-950/10 transition-all duration-300"
          >
            <img
              src={item.imageUrl}
              alt={item.title || 'Academy photo'}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
              <span className="text-[10px] font-bold uppercase text-[#D4AF37] tracking-wider">
                {item.category || 'Academy'}
              </span>
              <h4 className="font-bold text-sm line-clamp-1">{item.title || 'Quran Study'}</h4>
              {item.caption && <p className="text-xs text-gray-200 line-clamp-2 mt-1">{item.caption}</p>}
              <div className="mt-2 flex items-center gap-1 text-[11px] text-white/80">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Click to expand</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {activeItem && (
        <Lightbox
          imageUrl={activeItem.imageUrl}
          title={activeItem.title}
          caption={activeItem.caption}
          onClose={() => setActiveItem(null)}
        />
      )}
    </div>
  );
};
