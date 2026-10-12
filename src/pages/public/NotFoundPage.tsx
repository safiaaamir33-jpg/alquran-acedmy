import React from 'react';
import { BookOpen, Home, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#075E46] flex items-center justify-center mx-auto border border-emerald-200">
        <BookOpen className="w-8 h-8 text-[#075E46]" />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-[#24352F]">Page Not Found</h1>
        <p className="text-gray-600 text-sm">
          The requested page could not be located. It may have been moved or updated.
        </p>
      </div>

      <button
        onClick={() => onNavigate('/')}
        className="px-6 py-3 rounded-xl bg-[#075E46] text-white font-bold text-sm shadow-md hover:bg-[#064e3b] transition-all inline-flex items-center gap-2"
      >
        <Home className="w-4 h-4" />
        <span>Back to Home</span>
      </button>
    </div>
  );
};
