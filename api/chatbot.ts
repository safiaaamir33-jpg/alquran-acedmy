import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: { 'User-Agent': 'aistudio-build' },
  },
});

function getInstantReply(rawQuery: string): string {
  const q = (rawQuery || '').toLowerCase();

  if (q.includes('fee') || q.includes('fees') || q.includes('pkr') || q.includes('charges') || q.includes('فیس') || q.includes('کتنی')) {
    return `وعلیکم السلام ورحمۃ اللہ! نور القرآن اکیڈمی کی فیس کی تفصیلات:\n\n` +
      `• نورانی قاعدہ: Rs. 4,500 / ماہانہ\n` +
      `• ناظرہ قرآن: Rs. 5,000 / ماہانہ\n` +
      `• تجوید القرآن: Rs. 5,500 / ماہانہ\n` +
      `• حفظ القرآن: Rs. 7,000 / ماہانہ\n` +
      `• اوورسیز طلباء: $35 - $50 USD / ماہانہ\n\n` +
      `🎁 3 دن کی ٹرائل کلاس بالکل مفت (100% Free) ہے! ٹرائل کے لیے WhatsApp: +92 300 1234567 پر رابطہ کریں۔`;
  }

  if (q.includes('trial') || q.includes('free') || q.includes('ٹرائل') || q.includes('مفت')) {
    return `وعلیکم السلام! جی ہاں، 3 دن کی ٹرائل کلاس بالکل مفت ہے بغیر کسی پیشگی فیس کے۔ اپنی پسند کے استاد کے ساتھ 1-on-1 کلاس کے لیے WhatsApp: +92 300 1234567 پر رابطہ کریں۔`;
  }

  if (q.includes('female') || q.includes('lady') || q.includes('خاتون') || q.includes('فی میل') || q.includes('استانی')) {
    return `وعلیکم السلام! جی ہاں، بچیوں، خواتین، اور چھوٹے بچوں کے لیے باحجاب اور سند یافتہ فی میل قاریہ دستیاب ہیں۔ 3 دن کے مفت ٹرائل کے لیے رابطہ کریں۔`;
  }

  return `وعلیکم السلام ورحمۃ اللہ! نور القرآن اکیڈمی میں خوش آمدید۔ ہم 1-on-1 آن لائن کلاسز برائے نورانی قاعدہ، ناظرہ، تجوید اور حفظ فراہم کرتے ہیں۔ 3 دن کا مفت ٹرائل لینے کے لیے WhatsApp: +92 300 1234567 پر رابطہ کریں۔`;
}

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body || {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction: `You are the official AI Counselor for Noor Al-Quran Academy, Pakistan. Answer questions about Quran courses, fees (PKR 4,500/mo Qaida, Nazra 5,000, Tajweed 5,500, Hifz 7,000), 3-day free trial, female tutors, and timings in polite Urdu, Roman Urdu, or English. WhatsApp: +92 300 1234567.`,
      },
    });

    const reply = response.text || getInstantReply(message);
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(200).json({ reply: getInstantReply(message) });
  }
}
