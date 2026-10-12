import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { FAQ } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export const FaqPage: React.FC<{ faqs: FAQ[]; onNavigate: (path: string) => void }> = ({ faqs, onNavigate }) => {
  const { isUrdu } = useLanguage();
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Classes', 'Admissions', 'Teachers', 'Fees'];

  const filteredFaqs = faqs.filter((f) => {
    if (selectedCategory === 'All') return true;
    return f.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[#075E46] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {isUrdu ? 'اکثر پوچھے جانے والے سوالات' : 'Help & Answers'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#24352F] mt-3">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-2">
          Everything you need to know about class schedules, trial classes, female teachers, and payments.
        </p>
      </div>

      {/* Filter Tabs */}
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

      {/* Accordion */}
      <div className="space-y-3.5">
        {filteredFaqs.map((faq) => {
          const isOpen = activeFaq === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left rtl:text-right hover:bg-gray-50/80 transition-colors"
              >
                <span className="font-bold text-sm sm:text-base text-[#24352F] pr-4 rtl:pr-0 rtl:pl-4">
                  {isUrdu && faq.questionUrdu ? faq.questionUrdu : faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#075E46] transition-transform duration-200 flex-shrink-0 ${
                    isOpen ? 'transform rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3.5">
                  {isUrdu && faq.answerUrdu ? faq.answerUrdu : faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions Box */}
      <div className="bg-[#F3F8F4] p-8 rounded-3xl border border-emerald-200 text-center space-y-3">
        <h3 className="font-bold text-lg text-[#075E46]">Still have questions?</h3>
        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
          Our admissions desk is available on WhatsApp to assist you directly or guide you through scheduling a trial class.
        </p>
        <button
          onClick={() => onNavigate('/contact')}
          className="px-6 py-2.5 rounded-xl bg-[#075E46] text-white font-bold text-xs hover:bg-[#064e3b] transition-colors"
        >
          Contact Our Admissions Desk
        </button>
      </div>
    </div>
  );
};
