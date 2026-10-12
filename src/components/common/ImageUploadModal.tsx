import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, X, Check, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { auth } from '../../firebase/config';
import {
  compressImageFile,
  uploadImageViaApi,
  presetIslamicLogos,
  presetTeacherPhotos,
  presetCoursePhotos,
  presetPosters,
} from '../../utils/imageHelpers';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  folder?: string;
  title?: string;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  folder = 'media',
  title = 'Select or Upload Logo & Media',
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [presetCategory, setPresetCategory] = useState<'all' | 'logos' | 'teachers' | 'courses' | 'posters'>(() => {
    if (folder.includes('teacher')) return 'teachers';
    if (folder.includes('course')) return 'courses';
    if (folder.includes('poster') || folder.includes('announcement')) return 'posters';
    if (folder.includes('brand') || folder.includes('logo')) return 'logos';
    return 'all';
  });
  const [directUrl, setDirectUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setSuccessInfo(null);

    try {
      setIsUploading(true);
      setUploadProgress(25);

      // Fast, high-quality client-side compression
      const isLogo = folder === 'branding' || folder === 'logo';
      const maxDim = isLogo ? 300 : 550;
      const compressedDataUrl = await compressImageFile(file, maxDim, maxDim, 0.72);
      setUploadProgress(65);

      // Upload to fast backend server endpoint /uploads/
      let finalImageUrl = compressedDataUrl;
      try {
        finalImageUrl = await uploadImageViaApi(compressedDataUrl, folder);
      } catch (err) {
        console.warn('Backend upload notice, using compressed data URL:', err);
      }

      setUploadProgress(100);
      setIsUploading(false);
      setPreviewUrl(finalImageUrl);
      setSuccessInfo('تصویر کامیابی کے ساتھ شامل ہو گئی! (Image added successfully)');
      onSelectImage(finalImageUrl);
      setTimeout(() => onClose(), 400);
    } catch (err: any) {
      setIsUploading(false);
      setErrorMsg(err.message || 'Could not process image file. Please try another image.');
    }
  };

  const handleApplyUrl = () => {
    if (!directUrl.trim()) {
      setErrorMsg('Please enter a valid image URL.');
      return;
    }
    onSelectImage(directUrl.trim());
    onClose();
  };

  const handleSelectPreset = (url: string) => {
    setPreviewUrl(url);
    onSelectImage(url);
    onClose();
  };

  // Build combined presets based on active filter
  const allPresets = [
    ...presetTeacherPhotos.map((p) => ({ ...p, cat: 'teachers' as const })),
    ...presetCoursePhotos.map((p) => ({ ...p, titleUrdu: 'قرآنی کورس', cat: 'courses' as const })),
    ...presetPosters.map((p) => ({ ...p, titleUrdu: 'اکیڈمی پوسٹر', cat: 'posters' as const })),
    ...presetIslamicLogos.map((p) => ({ ...p, cat: 'logos' as const })),
  ];

  const displayedPresets = presetCategory === 'all'
    ? allPresets
    : allPresets.filter((p) => p.cat === presetCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-7 border border-emerald-100">
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-lg text-[#075E46]">{title}</h3>
            <p className="text-xs text-gray-500">
              Upload from your phone/PC, select a curated Islamic crest or photo, or enter a direct link.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-200 mt-4 mb-5">
          <button
            onClick={() => { setActiveTab('upload'); setErrorMsg(null); }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'upload'
                ? 'border-[#075E46] text-[#075E46]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Device File</span>
          </button>

          <button
            onClick={() => { setActiveTab('presets'); setErrorMsg(null); }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'presets'
                ? 'border-[#075E46] text-[#075E46]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Islamic Presets</span>
          </button>

          <button
            onClick={() => { setActiveTab('url'); setErrorMsg(null); }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'url'
                ? 'border-[#075E46] text-[#075E46]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Image URL</span>
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <span>{errorMsg}</span>
          </div>
        )}

        {successInfo && (
          <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
            <CheckCircle className="w-4 h-4 text-[#075E46]" />
            <span>{successInfo}</span>
          </div>
        )}

        {/* Tab 1: Upload from Device */}
        {activeTab === 'upload' && (
          <div>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#0B7A53]/30 hover:border-[#075E46] bg-[#F3F8F4] rounded-2xl p-7 text-center cursor-pointer transition-all hover:bg-emerald-50/50"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
              />
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-10 h-10 text-[#075E46] animate-spin mb-3" />
                  <p className="text-sm font-bold text-gray-800">Processing & Applying Image...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3 max-w-xs overflow-hidden">
                    <div
                      className="bg-[#0B7A53] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{uploadProgress}%</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100/60 flex items-center justify-center text-[#075E46] mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-[#24352F]">
                    Click here to choose file from your phone or computer
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supports PNG, JPG, WebP, SVG (Photos & Logos automatically optimized)
                  </p>
                  <span className="mt-3 inline-block px-3 py-1 bg-white border border-emerald-200 rounded-lg text-xs font-semibold text-[#075E46] shadow-xs">
                    Browse Files
                  </span>
                </div>
              )}
            </div>

            {previewUrl && !isUploading && (
              <div className="mt-4 p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={previewUrl} alt="Preview" className="w-12 h-12 object-contain rounded-xl bg-white p-1 border" />
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Image Selected</span>
                    <span className="text-[11px] text-gray-500">Ready to save</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectImage(previewUrl)}
                  className="px-3.5 py-1.5 bg-[#075E46] text-white text-xs font-bold rounded-xl"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Islamic Presets */}
        {activeTab === 'presets' && (
          <div className="space-y-3">
            {/* Category filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {(['all', 'teachers', 'courses', 'posters', 'logos'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setPresetCategory(cat)}
                  className={`px-3 py-1 rounded-lg font-bold capitalize transition-colors ${
                    presetCategory === cat
                      ? 'bg-[#075E46] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto p-1">
              {displayedPresets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.url)}
                  className="p-3 bg-[#F3F8F4] hover:bg-emerald-50 rounded-2xl border border-emerald-100 hover:border-[#075E46] cursor-pointer transition-all flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 rounded-xl bg-white p-1 shadow-xs flex items-center justify-center mb-2 overflow-hidden group-hover:scale-105 transition-transform">
                    <img src={preset.url} alt={preset.title} className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <span className="text-xs font-bold text-[#075E46] line-clamp-1">{preset.title}</span>
                  <span className="text-[10px] text-gray-500 line-clamp-1 font-arabic mt-0.5">{preset.titleUrdu}</span>
                  <button
                    type="button"
                    className="mt-2 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-md group-hover:bg-[#075E46] group-hover:text-white transition-colors"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Direct URL */}
        {activeTab === 'url' && (
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Paste Image Link or Data URL
            </label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/... or data:image/..."
              value={directUrl}
              onChange={(e) => {
                setDirectUrl(e.target.value);
                setPreviewUrl(e.target.value);
              }}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46]"
            />

            {previewUrl && (
              <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center">
                <p className="text-xs font-semibold text-gray-500 mb-2">Live Preview on Light & Dark:</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="p-3 bg-white rounded-xl border">
                    <img
                      src={previewUrl}
                      alt="Preview light"
                      onError={() => setErrorMsg('Could not load image from this URL.')}
                      className="max-h-20 max-w-28 object-contain"
                    />
                  </div>
                  <div className="p-3 bg-[#075E46] rounded-xl border border-[#D4AF37]/40">
                    <img
                      src={previewUrl}
                      alt="Preview dark"
                      className="max-h-20 max-w-28 object-contain"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-5 py-2 text-xs font-bold bg-[#075E46] hover:bg-[#064e3b] text-white rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Check className="w-4 h-4 text-[#D4AF37]" />
                <span>Apply URL</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
