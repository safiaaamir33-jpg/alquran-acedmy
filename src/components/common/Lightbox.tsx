import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface LightboxProps {
  imageUrl: string;
  title?: string;
  caption?: string;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ imageUrl, title, caption, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close image viewer"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={title || 'Enlarged view'}
          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
        />
        {(title || caption) && (
          <div className="mt-3 text-center px-4">
            {title && <h4 className="text-white font-semibold text-lg">{title}</h4>}
            {caption && <p className="text-white/80 text-sm mt-1">{caption}</p>}
          </div>
        )}
      </div>
    </div>
  );
};
