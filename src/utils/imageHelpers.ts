// Utility for client-side image compression and curated Quran Academy SVG emblems
import femaleTutorImg from '../assets/images/female_quran_tutor_1791731925907.jpg';
import qariTeacherImg from '../assets/images/qari_teacher_male_1791731899766.jpg';
import muftiScholarImg from '../assets/images/islamic_scholar_mufti_1791731957430.jpg';
import posterCampImg from '../assets/images/admission_poster_camp_1791732001454.jpg';

export async function compressImageFile(
  file: File,
  maxWidth = 500,
  maxHeight = 500,
  quality = 0.72
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image file.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available for compression.'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl = '';
        try {
          dataUrl = canvas.toDataURL('image/webp', quality);
        } catch {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        // If string is still > 60KB, downscale canvas slightly to stay well within limits
        if (dataUrl.length > 60000) {
          try {
            const smallerCanvas = document.createElement('canvas');
            smallerCanvas.width = Math.max(1, Math.round(width * 0.75));
            smallerCanvas.height = Math.max(1, Math.round(height * 0.75));
            const sCtx = smallerCanvas.getContext('2d');
            if (sCtx) {
              sCtx.drawImage(canvas, 0, 0, smallerCanvas.width, smallerCanvas.height);
              dataUrl = smallerCanvas.toDataURL('image/jpeg', 0.65);
            }
          } catch (_) {}
        }

        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// Uploads media to express backend which stores it in /uploads/
export async function uploadImageViaApi(dataUrl: string, folder = 'media'): Promise<string> {
  try {
    const res = await fetch('/api/upload-media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl, folder }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.url) {
        return data.url;
      }
    }
  } catch (err) {
    console.warn('Backend image upload fallback to optimized data URL:', err);
  }
  return dataUrl;
}

// Pre-designed authentic Quran Academy logos (SVG Data URLs)
export const presetIslamicLogos = [
  {
    id: 'crest-gold-green',
    title: 'Emerald & Gold Quran Crest',
    titleUrdu: 'سنہری و زمردی قرآنی مونوگرام',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="92" fill="#075E46" stroke="#D4AF37" stroke-width="6"/>
        <circle cx="100" cy="100" r="82" fill="none" stroke="#D4AF37" stroke-width="1.5" stroke-dasharray="4 3"/>
        <path d="M100 35 L106 50 L122 50 L109 60 L114 75 L100 65 L86 75 L91 60 L78 50 L94 50 Z" fill="#D4AF37"/>
        <path d="M50 115 C70 95 95 100 100 115 C105 100 130 95 150 115 L145 145 C125 130 105 130 100 145 C95 130 75 130 55 145 Z" fill="#D4AF37"/>
        <path d="M100 115 L100 145" stroke="#075E46" stroke-width="3"/>
        <circle cx="100" cy="100" r="4" fill="#D4AF37"/>
        <text x="100" y="172" fill="#FFFFFF" font-size="11" font-weight="bold" font-family="serif" text-anchor="middle" letter-spacing="1">NOOR AL-QURAN</text>
      </svg>
    `.trim()),
  },
  {
    id: 'rehal-quran',
    title: 'Holy Rehal & Divine Light',
    titleUrdu: 'رحل شریف اور نورِ قرآن',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <rect width="200" height="200" rx="40" fill="#0B7A53"/>
        <circle cx="100" cy="100" r="75" fill="none" stroke="#F3F8F4" stroke-width="3" opacity="0.4"/>
        <path d="M55 140 L145 140 L125 110 L75 110 Z" fill="#D4AF37"/>
        <path d="M60 85 C80 75 95 85 100 95 C105 85 120 75 140 85 L135 125 C115 115 105 125 100 130 C95 125 85 115 65 125 Z" fill="#FFFFFF"/>
        <path d="M100 45 L100 65 M75 55 L90 68 M125 55 L110 68" stroke="#D4AF37" stroke-width="3" stroke-linecap="round"/>
        <circle cx="100" cy="72" r="6" fill="#D4AF37"/>
        <text x="100" y="175" fill="#D4AF37" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">ACADEMY PAKISTAN</text>
      </svg>
    `.trim()),
  },
  {
    id: 'arabic-calligraphy-seal',
    title: 'Classic Calligraphy Seal',
    titleUrdu: 'کلاسیکی اسلامی مہر و خطاطی',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" fill="#1B2B25" stroke="#D4AF37" stroke-width="5"/>
        <circle cx="100" cy="100" r="80" fill="#075E46"/>
        <path d="M100 28 L108 42 L124 42 L111 52 L116 66 L100 56 L84 66 L89 52 L76 42 L92 42 Z" fill="#D4AF37"/>
        <text x="100" y="105" fill="#D4AF37" font-size="34" font-family="Amiri, serif" font-weight="bold" text-anchor="middle">نُور</text>
        <text x="100" y="132" fill="#FFFFFF" font-size="16" font-family="Amiri, serif" text-anchor="middle">القُرآن</text>
        <text x="100" y="165" fill="#D4AF37" font-size="10" font-family="sans-serif" text-anchor="middle" letter-spacing="2">ESTD 2024</text>
      </svg>
    `.trim()),
  },
  {
    id: 'geometric-star',
    title: '8-Point Islamic Rub el Hizb',
    titleUrdu: 'ہشت گوشہ اسلامی ستارہ (ربع الحزب)',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <rect x="40" y="40" width="120" height="120" rx="10" fill="#075E46" stroke="#D4AF37" stroke-width="4"/>
        <rect x="40" y="40" width="120" height="120" rx="10" fill="none" stroke="#D4AF37" stroke-width="4" transform="rotate(45 100 100)"/>
        <circle cx="100" cy="100" r="50" fill="#0B7A53" stroke="#D4AF37" stroke-width="2"/>
        <path d="M70 100 C85 85 95 88 100 95 C105 88 115 85 130 100 L125 118 C115 110 105 112 100 118 C95 112 85 110 75 118 Z" fill="#FFFFFF"/>
        <circle cx="100" cy="100" r="3" fill="#D4AF37"/>
      </svg>
    `.trim()),
  },
  {
    id: 'crescent-dome',
    title: 'Minaret Crescent & Dome Emblem',
    titleUrdu: 'گنبد و ہلال اکیڈمی ایمبلم',
    url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="92" fill="#F3F8F4" stroke="#075E46" stroke-width="5"/>
        <path d="M100 45 C125 45 140 70 140 95 L60 95 C60 70 75 45 100 45 Z" fill="#075E46"/>
        <path d="M100 25 L100 45 M95 30 C105 30 110 38 105 45" stroke="#D4AF37" stroke-width="3" fill="none"/>
        <rect x="70" y="95" width="60" height="45" fill="#0B7A53"/>
        <path d="M85 115 A15 20 0 0 1 115 115 L115 140 L85 140 Z" fill="#F3F8F4"/>
        <text x="100" y="168" fill="#075E46" font-size="12" font-weight="bold" font-family="sans-serif" text-anchor="middle">NOOR AL-QURAN</text>
      </svg>
    `.trim()),
  },
];

export const presetTeacherPhotos = [
  { id: 't-qari', title: 'Qari Muhammad Abdullah', titleUrdu: 'قاری محمد عبد اللہ (حفظ و تجوید)', url: qariTeacherImg },
  { id: 't-female', title: 'Ustadhah Fatima Zahra', titleUrdu: 'استاذہ فاطمہ زہراء (معلمات برائے خواتین و بچیاں)', url: femaleTutorImg },
  { id: 't-scholar', title: 'Mufti Tariq Jameel Al-Azhari', titleUrdu: 'مفتی طارق جمیل (عالم دین و فقہ)', url: muftiScholarImg },
];

export const presetCoursePhotos = [
  { id: 'c-quran-rehal', title: 'Holy Quran on Rehal', url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80' },
  { id: 'c-tajweed', title: 'Quran Recitation & Tajweed', url: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=800&q=80' },
  { id: 'c-kids', title: 'Kids Noorani Qaida Online', url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80' },
  { id: 'c-hifz', title: 'Hifz ul Quran Program', url: 'https://images.unsplash.com/photo-1597935258735-e254c183921e?auto=format&fit=crop&w=800&q=80' },
];

export const presetPosters = [
  { id: 'p-camp', title: 'Admissions Open Poster', url: posterCampImg },
  { id: 'p-online', title: 'Online Quran Classes Notice', url: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=800&q=80' },
];
