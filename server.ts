import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Generous body limit for image payloads
app.use(express.json({ limit: '25mb' }));

// Ensure upload directory exists
const UPLOADS_DIR = path.resolve(__dirname, 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded media statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Initialize Google Gen AI client with 'aistudio-build' header per telemetry requirements
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    academy: 'Noor Al-Quran Academy',
    country: 'Pakistan',
    timestamp: new Date().toISOString(),
  });
});

// Fast, reliable local media upload endpoint
app.post('/api/upload-media', (req: Request, res: Response) => {
  try {
    const { dataUrl, folder = 'media' } = req.body;
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      res.status(400).json({ error: 'Valid image data URL is required' });
      return;
    }

    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (!matches) {
      res.status(400).json({ error: 'Malformed base64 image data' });
      return;
    }

    const rawExt = matches[1].toLowerCase();
    const ext = rawExt === 'jpeg' ? 'jpg' : rawExt === 'svg+xml' ? 'svg' : rawExt;
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const cleanFolder = (folder || 'media').replace(/[^a-zA-Z0-9_-]/g, '');
    const filename = `${cleanFolder}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    fs.writeFileSync(filePath, buffer);

    res.json({
      url: `/uploads/${filename}`,
      size: buffer.length,
      success: true,
    });
  } catch (error: any) {
    console.error('Upload media error:', error);
    res.status(500).json({ error: error.message || 'Failed to save media asset' });
  }
});

// Smart instant rule-based fallback answering engine if API is ever delayed or under 503 high demand
function getInstantSmartReply(rawQuery: string): string {
  const q = rawQuery.toLowerCase();

  // 1. Fees & Pricing
  if (q.includes('fee') || q.includes('fees') || q.includes('pkr') || q.includes('rupee') || q.includes('charges') || q.includes('paise') || q.includes('قیمت') || q.includes('فیس') || q.includes('کتنی')) {
    return `وعلیکم السلام ورحمۃ اللہ! نور القرآن اکیڈمی کی فیس انتہائی مناسب ہے:\n\n` +
      `📖 **کورسز کی فیس کی تفصیلات (Monthly Fee Structure):**\n` +
      `• نورانی قاعدہ (Noorani Qaida): Rs. 4,500 / ماہانہ\n` +
      `• ناظرہ قرآن (Nazra Quran): Rs. 5,000 / ماہانہ\n` +
      `• تجوید القرآن (Quran with Tajweed): Rs. 5,500 / ماہانہ\n` +
      `• حفظ القرآن (Hifz-ul-Quran): Rs. 7,000 / ماہانہ\n` +
      `• ترجمہ و تفسیر (Tarjuma & Tafseer): Rs. 5,000 / ماہانہ\n` +
      `• اسلامی اسٹڈیز و مسنون دعائیں: Rs. 3,500 - 4,000 / ماہانہ\n\n` +
      `🌍 **Overseas Students:** $35 - $50 USD / ماہانہ\n` +
      `💳 **ادائیگی کے طریقے:** JazzCash, EasyPaisa, اور Bank Transfer\n\n` +
      `✨ سب سے خاص بات یہ کہ آپ کے لیے **3 دن کی ٹرائل کلاس بالکل مفت (Free)** ہے! ابھی ٹرائل بک کرنے کے لیے WhatsApp: +92 300 1234567 پر رابطہ کریں یا Admission فارم فل کریں۔`;
  }

  // 2. Free Trial
  if (q.includes('trial') || q.includes('free') || q.includes('test') || q.includes('demo') || q.includes('ٹرائل') || q.includes('مفت') || q.includes('check')) {
    return `وعلیکم السلام! جی ہاں، نور القرآن اکیڈمی میں **3 دن کی ٹرائل کلاس بالکل مفت (100% Free)** فراہم کی جاتی ہے!\n\n` +
      `📌 **طریقہ کار:**\n` +
      `1. آپ کوئی بھی ایڈوانس فیس جمع نہیں کروائیں گے۔\n` +
      `2. طالب علم کا نام اور مناسب وقت بتائیں۔\n` +
      `3. اپنی پسند کے مطابق میل (Male) یا فی میل (Female) قاری منتخب کریں۔\n` +
      `4. Zoom / Google Meet پر 1-on-1 لائیو کلاس ہوگی۔\n\n` +
      `مطمئن ہونے کے بعد باقاعدہ داخلہ لیا جا سکتا ہے۔ ٹرائل شروع کرنے کے لیے ہمارے ایڈمیشن فارم پر جائیں یا WhatsApp (+92 300 1234567) پر میسج بھیجیں۔`;
  }

  // 3. Female Tutors / Sisters / Kids
  if (q.includes('female') || q.includes('lady') || q.includes('teacher') || q.includes('madam') || q.includes('sister') || q.includes('aurat') || q.includes('larki') || q.includes('bachi') || q.includes('خاتون') || q.includes('استانی') || q.includes('فی میل') || q.includes('لیڈی')) {
    return `وعلیکم السلام ورحمۃ اللہ! جی ہاں، ہماری اکیڈمی میں **مستند اور باحجاب فی میل قاریہ و معلمات (Certified Female Tutors)** موجود ہیں:\n\n` +
      `• ہماری فی میل اساتذہ الشہادۃ العالمیہ اور تجوید میں سند یافتہ ہیں۔\n` +
      `• چھوٹی بچیوں، خواتین، اور چھوٹے بچوں کے لیے مکمل پردے اور باوقار ماحول میں 1-on-1 کلاسز ہوتی ہیں۔\n` +
      `• آپ اپنی سہولت کے مطابق وقت منتخب کر سکتی ہیں۔\n\n` +
      `آپ فی میل ٹیچر کے ساتھ **3 دن کی مفت ٹرائل کلاس** لے کر معیار چیک کر سکتے ہیں۔ WhatsApp: +92 300 1234567 پر رابطہ کریں۔`;
  }

  // 4. Admission Process
  if (q.includes('admission') || q.includes('dakhla') || q.includes('enroll') || q.includes('register') || q.includes('procedure') || q.includes('tariqa') || q.includes('داخلہ') || q.includes('رجسٹریشن')) {
    return `وعلیکم السلام! نور القرآن اکیڈمی میں داخلہ کا طریقہ کار بہت آسان ہے:\n\n` +
      `1️⃣ ہماری ویب سائٹ پر **Admission** پیج پر جائیں اور مختصر فارم پر کریں۔\n` +
      `2️⃣ یا براہ راست ہمارے WhatsApp نمبر (+92 300 1234567) پر طالب علم کا نام، عمر، اور کورس میسج کریں۔\n` +
      `3️⃣ ہم اسی دن آپ کی پہلی **مفت ٹرائل کلاس (Free Trial Class)** شیڈول کر دیں گے۔\n` +
      `4️⃣ کلاسز 100% آن لائن Zoom / Google Meet پر ایک استاد اور ایک طالب علم (1-on-1) ہوتی ہیں۔`;
  }

  // 5. Timings & Classes
  if (q.includes('time') || q.includes('timing') || q.includes('waqt') || q.includes('schedule') || q.includes('kab') || q.includes('online') || q.includes('وقت') || q.includes('ٹائمنگ')) {
    return `وعلیکم السلام! ہماری تمام آن لائن کلاسز **فلیکسیبل ٹائمنگز (Flexible 24/7 Timings)** پر ہوتی ہیں:\n\n` +
      `• آپ صبح، دوپہر، شام، یا رات کا جو وقت منتخب کریں گے، کلاس اسی وقت ہوگی۔\n` +
      `• پاکستان کے علاوہ دنیا بھر (USA, UK, Canada, UAE, Saudi Arabia, Australia) کے ٹائم زون کے مطابق کلاسز دستیاب ہیں۔\n` +
      `• کلاس کا دورانیہ 30 سے 40 منٹ 1-on-1 لائیو ہوتا ہے۔\n\n` +
      `آپ اپنا مطلوبہ وقت ہمیں WhatsApp (+92 300 1234567) پر بتا کر آج ہی ٹرائل شروع کر سکتے ہیں۔`;
  }

  // 6. Tajweed / Makharij / Recitation rules
  if (q.includes('tajweed') || q.includes('makharij') || q.includes('ghunna') || q.includes('ikhfa') || q.includes('qalqala') || q.includes('talaffuz') || q.includes('تجوید') || q.includes('مخارج') || q.includes('غنہ') || q.includes('اخفاء')) {
    return `وعلیکم السلام ورحمۃ اللہ! تجوید کا مطلب ہے قرآن پاک کے ہر حرف کو اس کے صحیح مخرج اور صفات کے ساتھ ادا کرنا:\n\n` +
      `📖 **تجوید کے اہم قواعد:**\n` +
      `• **غنہ (Ghunna):** ناک کے بانسے سے نکلنے والی خوبصورت آواز جو نون اور میم مشدد پر 2 حرکات کے برابر کی جاتی ہے۔\n` +
      `• **اخفاء (Ikhfa):** نون ساکن یا تنوین کے بعد حروف اخفاء (15 حروف) آئیں تو آواز کو ناک میں چھپا کر پڑھنا۔\n` +
      `• **قلقلہ (Qalqala):** حروف قطب جد (ق، ط، ب، ج، د) پر سکون کی حالت میں جنبش پیدا کرنا۔\n` +
      `• **مخارج الحروف:** حلق، زبان، دانتوں اور ہونٹوں سے حروف کی درست ادائیگی۔\n\n` +
      `ہماری اکیڈمی کے "Quran with Tajweed" کورس میں اساتذہ 1-on-1 مشق کرواتے ہیں۔ 3 دن کے مفت ٹرائل کے لیے WhatsApp: +92 300 1234567 پر رابطہ کریں۔`;
  }

  // 7. Hifz-ul-Quran
  if (q.includes('hifz') || q.includes('hafiz') || q.includes('حفظ') || q.includes('حافظ')) {
    return `وعلیکم السلام! نور القرآن اکیڈمی میں **حفظ القرآن (Online Hifz Course)** کا خصوصی نصاب رائج ہے:\n\n` +
      `• **روزانہ سبق (Daily Sabaq):** نیا سبق استاد کو سنانا۔\n` +
      `• **سبقی (Sabqi):** پچھلے پارے کا حصہ یاد کر کے سنانا۔\n` +
      `• **منزل (Manzil):** یاد شدہ تمام پاروں کا باقاعدہ روزانہ دور۔\n` +
      `• ماہر حافظ و قاری اساتذہ انفرادی نگرانی کرتے ہیں۔\n` +
      `• ماہانہ فیس: Rs. 7,000 ($55/mo overseas)۔\n\n` +
      `آپ 3 دن کی مفت ٹرائل کلاس لے کر استاد کی رہنمائی دیکھ سکتے ہیں۔ WhatsApp: +92 300 1234567۔`;
  }

  // 8. Nazra Quran & Noorani Qaida
  if (q.includes('nazra') || q.includes('qaida') || q.includes('ناظرہ') || q.includes('قاعدہ')) {
    return `وعلیکم السلام! نورانی قاعدہ اور ناظرہ قرآن بنیادی کورسز ہیں:\n\n` +
      `• **نورانی قاعدہ:** حروف کی پہچان، حرکات، تنوین، اور جزم کی ادائیگی۔ فیس: Rs. 4,500/ماہانہ۔\n` +
      `• **ناظرہ قرآن:** قرآن پاک کی روانی اور ترتیل کے ساتھ تلاوت۔ فیس: Rs. 5,000/ماہانہ۔\n` +
      `• چھوٹے بچوں اور نوآموزوں کے لیے آسان اور پرلطف انداز میں تدریس۔\n\n` +
      `آج ہی 3 دن کا مفت ٹرائل شروع کریں!`;
  }

  // 9. Namaz, Salah, Wudu, Duas & Islamic Knowledge
  if (q.includes('namaz') || q.includes('salah') || q.includes('dua') || q.includes('wudu') || q.includes('kalima') || q.includes('نماز') || q.includes('دعا') || q.includes('وضو')) {
    return `وعلیکم السلام ورحمۃ اللہ! ہماری اکیڈمی میں قرآن کے ساتھ ساتھ بنیادی اسلامی تعلیمات بھی سکھائی جاتی ہیں:\n\n` +
      `✨ **اسلامک اسٹڈیز و مسنون دعائیں:**\n` +
      `• نماز کا مکمل طریقہ، فرائض، واجبات اور سنتیں\n` +
      `• وضو اور طہارت کے مسائل\n` +
      `• روزمرہ کی مسنون دعائیں (کھانے، سونے، جاگنے، سفر کی دعائیں)\n` +
      `• چھ کلمے اور ایمان مفصل و مجمل\n` +
      `• سیرت النبی ﷺ اور اسلامی اخلاقیات\n\n` +
      `یہ کورس ہر عمر کے بچوں اور بڑوں کے لیے انتہائی مفید ہے۔ 3 دن کے فری ٹرائل کے لیے رابطہ کریں۔`;
  }

  // 10. Contact Info / Phone / WhatsApp
  if (q.includes('contact') || q.includes('phone') || q.includes('number') || q.includes('whatsapp') || q.includes('rabta') || q.includes('address') || q.includes('office') || q.includes('نمبر') || q.includes('رابطہ')) {
    return `وعلیکم السلام! آپ نور القرآن اکیڈمی سے درج ذیل ذرائع سے فوراً رابطہ کر سکتے ہیں:\n\n` +
      `📞 **فون و واٹس ایپ:** +92 300 1234567\n` +
      `✉️ **ای میل:** info@nooralquran.pk\n` +
      `📍 **ہیڈ آفس:** F-8 Markaz, Islamabad, Pakistan\n` +
      `🌐 **کلاسز:** 100% لائیو آن لائن (Zoom / Google Meet پر دنیا بھر میں)\n\n` +
      `ہماری سپورٹ ٹیم 24 گھنٹے آپ کی رہنمائی کے لیے تیار ہے۔`;
  }

  // Default Universal Friendly Islamic Counselor Reply
  return `وعلیکم السلام ورحمۃ اللہ وبرکاتہ! نور القرآن اکیڈمی میں خوش آمدید۔\n\n` +
    `آپ کا سوال ہمارے علم میں آ گیا ہے۔ ہم قرآن مجید کی تعلیم، ناظرہ، حفظ، نورانی قاعدہ، تجوید، اور اسلامی علوم 1-on-1 لائیو آن لائن فراہم کرتے ہیں۔\n\n` +
    `✨ **اہم سہولیات:**\n` +
    `• 3 دن کی مفت ٹرائل کلاس بغیر کسی پیشگی فیس کے\n` +
    `• بچیوں اور بہنوں کے لیے ماہر فی میل قاریہ\n` +
    `• آپ کی مرضی کے مطابق ٹائمنگز\n` +
    `• مناسب فیس اور انفرادی توجہ\n\n` +
    `مزید کسی بھی سوال یا رہنمائی کے لیے آپ ابھی ہمارے واٹس ایپ نمبر **+92 300 1234567** پر میسج کر سکتے ہیں یا ایڈمیشن فارم پر جا سکتے ہیں۔ جزاک اللہ خیراً!`;
}

// AI Chatbot endpoint - Ultra-fast, responsive & knowledgeable
app.post('/api/chatbot', async (req: Request, res: Response) => {
  try {
    const { message, history, context } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const academyContext = context || `
Academy Name: Noor Al-Quran Academy, Pakistan
Tagline: Illuminating Hearts & Minds with the Noble Quran across Pakistan & Worldwide
Phone & WhatsApp: +92 300 1234567
Email: info@nooralquran.pk
Address: F-8 Markaz, Islamabad, Pakistan (Classes available 100% online worldwide)
Offered Courses & Fees:
1. Noorani Qaida for Beginners - Arabic letters, Makharij, beginner Tajweed. Rs. 4,500/month ($35/mo overseas).
2. Quran Nazra - Fluent recitation with correct rules. Rs. 5,000/month ($40/mo overseas).
3. Quran with Tajweed - Deep rules, Noon/Meem Sakin, Madd, Sifaat. Rs. 5,500/month ($45/mo overseas).
4. Hifz-ul-Quran - Daily Sabaq, Sabqi, Manzil. Rs. 7,000/month ($55/mo overseas).
5. Quran Translation & Tarjuma - Word-by-word Urdu/English understanding. Rs. 5,000/month ($40/mo overseas).
6. Tafseer-ul-Quran - Scholarly thematic commentary. Rs. 4,500/month ($35/mo overseas).
7. Islamic Studies - Fiqh, Salah, Taharah, Seerah of Prophet (PBUH). Rs. 4,000/month ($35/mo overseas).
8. Daily Duas & Masnoon Azkar - Morning/Evening supplications. Rs. 3,500/month ($30/mo overseas).
Key Highlights:
- 1-on-1 personalized live classes on Zoom / Google Meet (1 student, 1 teacher).
- Dedicated certified female Quran tutors available for sisters and young kids with complete privacy.
- 3-day 100% free trial with NO upfront payment required.
- Flexible timings in Asia/Karachi timezone, 24/7 matching student convenience globally.
- Pakistani payments accepted via Bank Transfer, JazzCash, EasyPaisa.
`;

    const systemInstruction = `
You are the official, dignified, and extremely knowledgeable AI Counselor & Islamic Scholar for Noor Al-Quran Academy, Pakistan.
Your mission is to provide INSTANT, helpful, accurate, and inspiring answers to WHATEVER question parents, students, or visitors ask.

CRITICAL INSTRUCTIONS:
1. RESPONSE SPEED & TONE: Be direct, warm, concise, and helpful. Always greet with "Assalamu Alaikum wa Rahmatullah" or Islamic warmth.
2. ANSWER ANY QUESTION:
   - If the user asks about academy details (courses, fees, 3-day free trial, admission process, female tutors, schedule, payments, contact info), answer with exact numbers and clear guidance.
   - If the user asks about the Quran, Islam, Hadith, Tajweed rules (Makharij, Ghunna, Ikhfa, Qalqala, Madd), Salah/Namaz, Duas, Wudu, or general Islamic knowledge, answer authoritatively, accurately, and respectfully.
   - If the user asks general or life questions, answer courteously, connect them to Islamic wisdom, and warmly invite them to learn the Quran with us.
3. LANGUAGE MATCHING:
   - If asked in Roman Urdu (e.g. "bhai admission kesy lena hai", "fees kitni hai", "bachi ko parhana hai"), respond in natural, friendly, fluent Roman Urdu.
   - If asked in Urdu script (اردو), respond in polite Urdu script.
   - If asked in English, respond in professional English.
4. CALL TO ACTION:
   - Always encourage them to take advantage of the 3-Day Free Trial (no upfront fee).
   - Mention WhatsApp (+92 300 1234567) or the online admission form for instant registration.

Context Data:
${academyContext}
`;

    const conversationPrompt = `
User Query: "${message}"

Recent Conversation:
${(history || [])
  .slice(-4)
  .map((h: any) => `${h.role === 'user' ? 'Student' : 'Academy Assistant'}: ${h.text}`)
  .join('\n')}

Respond immediately, accurately, and warmly in the appropriate language (Roman Urdu, Urdu, or English).
`;

    let replyText = '';

    const timeoutPromise = <T>(promise: Promise<T>, ms: number): Promise<T> => {
      return Promise.race([
        promise,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error('AI Request timeout')), ms)),
      ]);
    };

    // Primary fast attempt: gemini-3.8-flash (Standard model for quick, high-intelligence text Q&A)
    try {
      const response = await timeoutPromise(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: conversationPrompt,
          config: {
            systemInstruction,
          },
        }),
        5000
      );
      replyText = response.text || '';
    } catch (_primaryErr: any) {
      // Secondary fast attempt: gemini-flash-latest
      try {
        const fallbackRes = await timeoutPromise(
          ai.models.generateContent({
            model: 'gemini-flash-latest',
            contents: conversationPrompt,
            config: {
              systemInstruction,
            },
          }),
          6000
        );
        replyText = fallbackRes.text || '';
      } catch (_secErr: any) {
        // If external API has temporary high demand spike or timeout, instantly serve high-precision smart answer
        replyText = getInstantSmartReply(message);
      }
    }

    if (!replyText || replyText.trim().length === 0) {
      replyText = getInstantSmartReply(message);
    }

    res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Chatbot API notice:', error);
    const fallbackReply = getInstantSmartReply(req.body?.message || '');
    res.json({ reply: fallbackReply });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
});
