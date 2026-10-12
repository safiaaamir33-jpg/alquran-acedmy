import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bg =
    type === 'success'
      ? 'bg-[#075E46] text-white'
      : type === 'error'
      ? 'bg-red-700 text-white'
      : 'bg-emerald-800 text-white';

  return (
    <div
      role="alert"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl transition-all transform animate-in fade-in slide-in-from-bottom-5 ${bg}`}
    >
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-200 flex-shrink-0" />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-black/20 text-white/80 hover:text-white transition-colors ml-2"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
