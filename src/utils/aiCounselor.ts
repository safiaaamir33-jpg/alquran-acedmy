/**
 * Noor Al-Quran Academy - Intelligent Client-Side AI Counselor & Islamic Knowledge Engine
 * Provides instant, comprehensive, high-quality answers on ANY deployment (Vercel, Netlify, AI Studio).
 */

export interface CounselorContext {
  academyName?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
}

export function getSmartCounselorReply(
  rawQuery: string,
  context?: CounselorContext
): string {
  const q = (rawQuery || '').toLowerCase().trim();
  const phone = context?.whatsapp || context?.phone || '+92 300 1234567';
  const academy = context?.academyName || 'Noor Al-Quran Academy';

  const isEnglish =
    /^[a-zA-Z0-9\s.,?!'"@#$%^&*()_+=-]+$/.test(rawQuery) &&
    (q.includes('what') ||
      q.includes('how') ||
      q.includes('is ') ||
      q.includes('are ') ||
      q.includes('can ') ||
      q.includes('do you') ||
      q.includes('tell me') ||
      q.includes('please'));

  // 1. FEMALE TEACHERS / SISTERS / KIDS (خواتین معلمات)
  if (
    q.includes('female') ||
    q.includes('lady') ||
    q.includes('sister') ||
    q.includes('aurat') ||
    q.includes('larki') ||
    q.includes('bachi') ||
    q.includes('khawateen') ||
    q.includes('ustani') ||
    q.includes('madam') ||
    q.includes('parda') ||
    q.includes('hijab') ||
    q.includes('خاتون') ||
    q.includes('استانی') ||
    q.includes('فی میل') ||
    q.includes('لیڈی') ||
    q.includes('بہن') ||
    q.includes('بچی')
  ) {
    if (isEnglish) {
      return (
        `Assalamu Alaikum! Yes, ${academy} has dedicated, certified **Female Quran Tutors** for sisters and young children:\n\n` +
        `• Wifaq-ul-Madaris certified Alimahs with Ijazah in Tajweed.\n` +
        `• Private, dignified 1-on-1 live classes on Zoom or Google Meet.\n` +
        `• Available 24/7 matching your convenient timings.\n` +
        `• Complete privacy and compassionate guidance.\n\n` +
        `🎁 You can claim a **3-Day 100% Free Trial** with a female tutor today!\n` +
        `📲 WhatsApp: ${phone}`
      );
    }
    return (
      `وعلیکم السلام ورحمۃ اللہ وبرکاتہ!\n\n` +
      `جی بالکل! ہماری اکیڈمی میں **مستند، سند یافتہ اور باحجاب فی میل معلمات (Certified Female Quran Tutors)** 24 گھنٹے دستیاب ہیں:\n\n` +
      `🌸 **فی میل اساتذہ کی خصوصیات:**\n` +
      `• وفاق المدارس العربیہ سے الشہادۃ العالمیہ اور درسِ نظامی کی سند یافتہ۔\n` +
      `• بچیوں، بہنوں اور چھوٹے بچوں کو نہایت شفقت اور پردے کے مکمل شرعی اہتمام کے ساتھ پڑھاتی ہیں۔\n` +
      `• مخارج، تجوید، نورانی قاعدہ اور ناظرہ میں سالہا سال کا تدریسی تجربہ۔\n` +
      `• 1-on-1 انفرادی کلاسز تاکہ مکمل راز داری اور پرائیویسی رہے۔\n\n` +
      `آپ فی میل ٹیچر کے ساتھ **3 دن کی مفت ٹرائل کلاس** لے کر معیار چیک کر سکتے ہیں۔\n\n` +
      `📲 **فی میل ٹیچر کے ساتھ ٹرائل کے لیے رابطہ:** ${phone}`
    );
  }

  // 2. NAMAZ, SALAH, WUDU, DUAS, KALIMA (نماز، وضو، دعائیں اور کلمے)
  if (
    q.includes('namaz') ||
    q.includes('salah') ||
    q.includes('dua') ||
    q.includes('wudu') ||
    q.includes('wuzu') ||
    q.includes('kalima') ||
    q.includes('azkar') ||
    q.includes('ghusl') ||
    q.includes('نماز') ||
    q.includes('دعا') ||
    q.includes('وضو') ||
    q.includes('کلمہ')
  ) {
    return (
      `وعلیکم السلام ورحمۃ اللہ!\n\n` +
      `ہماری اکیڈمی میں قرآن پاک کے ساتھ ساتھ بنیادی اسلامی احکام و عبادات سکھائی جاتی ہیں:\n\n` +
      `🕌 **اہم مضامین:**\n` +
      `• **نماز کا مکمل طریقہ:** قیام، رکوع، سجود، تشہد، درود شریف، اور دعائے قنوت۔\n` +
      `• **وضو و طہارت:** وضو کا مسنون طریقہ، فرائض اور سنن۔\n` +
      `• **چھ کلمے:** صحیح تلفظ اور ترجمے کے ساتھ۔\n` +
      `• **روزمرہ کی مسنون دعائیں:** کھانے، سونے، جاگنے اور سفر کی دعائیں۔\n` +
      `• **آیت الکرسی اور 4 قل:** حفظ اور معانی۔\n\n` +
      `یہ کورس ہر عمر کے بچوں اور بڑوں کے لیے انتہائی مفید ہے۔ 3 دن کے مفت ٹرائل کے لیے رابطہ کریں۔ WhatsApp: ${phone}`
    );
  }

  // 3. TAJWEED & MAKHARIJ RULES (تجوید اور مخارج)
  if (
    q.includes('tajweed') ||
    q.includes('makharij') ||
    q.includes('ghunna') ||
    q.includes('ikhfa') ||
    q.includes('qalqala') ||
    q.includes('madd') ||
    q.includes('talaffuz') ||
    q.includes('تجوید') ||
    q.includes('مخارج') ||
    q.includes('غنہ') ||
    q.includes('قلقلہ')
  ) {
    return (
      `وعلیکم السلام ورحمۃ اللہ!\n\n` +
      `تجوید کا مطلب ہے قرآن مجید کے ہر حرف کو اس کے درست مخرج اور تمام صفات کے ساتھ ادا کرنا:\n\n` +
      `📖 **اہم قواعد:**\n` +
      `• **مخارج الحروف:** حروف کے نکلنے کے 5 اہم مقامات: حلق، زبان، دانت، ہونٹ اور ناک کا بانسہ۔\n` +
      `• **غنہ (Ghunna):** نون اور میم مشدد پر دو حرکات کے برابر ناک میں آواز ٹھہرانا۔\n` +
      `• **قلقلہ (Qalqala):** پانچ حروف (ق، ط، ب، ج، د) ساکن ہونے پر آواز میں جنبش پیدا کرنا۔\n` +
      `• **اخفاء اور ادغام:** نون ساکن اور تنوین کے بنیادی احکام۔\n\n` +
      `ہماری اکیڈمی کے "Quran with Tajweed" کورس میں اساتذہ 1-on-1 عملی مشق کرواتے ہیں۔ فیس: Rs. 5,500/ماہانہ۔ فری ٹرائل کے لیے رابطہ کریں: ${phone}`
    );
  }

  // 4. HIFZ-UL-QURAN (حفظ القرآن)
  if (
    q.includes('hifz') ||
    q.includes('hafiz') ||
    q.includes('hifdh') ||
    q.includes('memoriz') ||
    q.includes('حفظ') ||
    q.includes('حافظ')
  ) {
    return (
      `وعلیکم السلام! حفظ القرآن کا کورس ہماری اکیڈمی کا ایک جامع اور منظم کورس ہے:\n\n` +
      `✨ **آن لائن حفظ کا طریقہ کار:**\n` +
      `1️⃣ **سبق (Daily Sabaq):** نیا سبق جو روزانہ استاد کو سنانا ہوتا ہے۔\n` +
      `2️⃣ **سبقی (Sabqi):** حال ہی میں یاد کیے گئے پچھلے صفحات کا روزانہ دور۔\n` +
      `3️⃣ **منزل (Manzil):** تمام پچھلے یاد شدہ پاروں کا مسلسل دہرانا۔\n` +
      `• سند یافتہ تجربہ کار حفاظِ کرام انفرادی نگرانی کرتے ہیں۔\n` +
      `• ماہانہ فیس: Rs. 7,000 / ماہانہ ($55 overseas)۔\n\n` +
      `آج ہی 3 دن کی مفت ٹرائل کلاس لے کر حفظ شروع کریں۔ WhatsApp: ${phone}`
    );
  }

  // 5. NOORANI QAIDA (نورانی قاعدہ)
  if (
    q.includes('qaida') ||
    q.includes('noorani') ||
    q.includes('قاعدہ')
  ) {
    return (
      `وعلیکم السلام! نورانی قاعدہ بچوں اور نوآموزوں کے لیے قرآن پڑھنے کی بنیادی اور مضبوط ترین بنیاد ہے:\n\n` +
      `👶 **نورانی قاعدہ کورس کی تفصیل:**\n` +
      `• حروفِ تہجی کی درست پہچان اور ادائیگی (مخارج)۔\n` +
      `• حرکات (زبر، زیر، پیش)، تنوین (دو زبر، دو زیر، دو پیش)، اور جزم کی مشق۔\n` +
      `• حروفِ مدہ اور تشدید کا آسان اور دلچسپ انداز میں فہم۔\n` +
      `• ماہانہ فیس: Rs. 4,500 / ماہانہ ($35 overseas)۔\n\n` +
      `3 دن کی مفت ٹرائل کلاس لے کر استاد کا طریقہ چیک کریں! رابطہ: ${phone}`
    );
  }

  // 6. NAZRA QURAN (ناظرہ قرآن مجید)
  if (
    q.includes('nazra') ||
    q.includes('tilawat') ||
    q.includes('rawani') ||
    q.includes('ناظرہ')
  ) {
    return (
      `وعلیکم السلام! ناظرہ قرآن مجید کے کورس میں طالب علم کو قرآن پاک کو مکمل ترتیل اور روانی کے ساتھ دیکھ کر پڑھنا سکھایا جاتا ہے:\n\n` +
      `📖 **ناظرہ کورس کی خصوصیات:**\n` +
      `• قاعدہ مکمل ہونے کے بعد مکمل قرآن پاک کو بغیر اٹکے روانی سے پڑھنا۔\n` +
      `• تلاوت کے دوران تجوید اور تلفظ کی ساتھ ساتھ تصحیح۔\n` +
      `• ماہانہ فیس: Rs. 5,000 / ماہانہ ($40 overseas)۔\n\n` +
      `آج ہی 3 روزہ مفت ٹرائل کلاس شیڈول کریں! WhatsApp: ${phone}`
    );
  }

  // 7. TRANSLATION & TAFSEER (ترجمہ و تفسیر)
  if (
    q.includes('tarjuma') ||
    q.includes('translation') ||
    q.includes('tafseer') ||
    q.includes('ترجمہ') ||
    q.includes('تفسیر')
  ) {
    return (
      `وعلیکم السلام ورحمۃ اللہ! ہماری اکیڈمی میں ترجمہ و تفسیر قرآن کا باقاعدہ فہم دیا جاتا ہے:\n\n` +
      `📖 **ترجمہ و تفسیر کورس:**\n` +
      `• لفظ بہ لفظ اردو اور انگریزی ترجمہ۔\n` +
      `• آیات کے نزول کا پس منظر (شانِ نزول) اور گہرے مفاہیم۔\n` +
      `• روزمرہ زندگی میں قرآنی احکامات پر عمل پیرا ہونے کی رہنمائی۔\n` +
      `• ماہانہ فیس: Rs. 5,000 / ماہانہ ($40 overseas)۔\n\n` +
      `3 دن کی مفت ٹرائل کلاس دستیاب ہے۔ رابطہ: ${phone}`
    );
  }

  // 8. FEES, CHARGES & PACKAGES (فیس اور چارجز)
  if (
    q.includes('fee') ||
    q.includes('fees') ||
    q.includes('pkr') ||
    q.includes('rupee') ||
    q.includes('charges') ||
    q.includes('paise') ||
    q.includes('cost') ||
    q.includes('price') ||
    q.includes('package') ||
    q.includes('discount') ||
    q.includes('riayat') ||
    q.includes('قیمت') ||
    q.includes('فیس') ||
    q.includes('کتنی') ||
    q.includes('کتنے')
  ) {
    if (isEnglish) {
      return (
        `Assalamu Alaikum! Here is the official monthly fee structure for 1-on-1 personalized live classes at ${academy}:\n\n` +
        `🇵🇰 **Pakistan Monthly Tuition (PKR):**\n` +
        `• **Noorani Qaida (Beginners):** Rs. 4,500 / month\n` +
        `• **Quran Nazra (Fluency):** Rs. 5,000 / month\n` +
        `• **Quran with Tajweed:** Rs. 5,500 / month\n` +
        `• **Hifz-ul-Quran (Memorization):** Rs. 7,000 / month\n` +
        `• **Quran Translation & Tafseer:** Rs. 5,000 / month\n` +
        `• **Islamic Studies & Masnoon Duas:** Rs. 3,500 – 4,000 / month\n\n` +
        `🌍 **Overseas Students (USA, UK, Europe, Gulf):** $35 – $50 USD / £25 – £40 GBP monthly.\n\n` +
        `🎁 **Special Benefit:** You get a **3-Day 100% Free Trial** with NO advance payment!\n` +
        `Payment channels in Pakistan: EasyPaisa, JazzCash, and Bank Transfer.\n\n` +
        `Book your free trial today via WhatsApp: ${phone}`
      );
    }
    return (
      `وعلیکم السلام ورحمۃ اللہ!\n\n` +
      `نور القرآن اکیڈمی کی تمام 1-on-1 انفرادی آن لائن کلاسز کی ماہانہ فیس درج ذیل ہے:\n\n` +
      `📖 **پاکستان میں ماہانہ فیس (Fee in PKR):**\n` +
      `• **نورانی قاعدہ (Noorani Qaida):** Rs. 4,500 / ماہانہ\n` +
      `• **ناظرہ قرآن (Nazra Quran):** Rs. 5,000 / ماہانہ\n` +
      `• **تجوید القرآن (Quran with Tajweed):** Rs. 5,500 / ماہانہ\n` +
      `• **حفظ القرآن (Hifz-ul-Quran):** Rs. 7,000 / ماہانہ\n` +
      `• **ترجمہ و تفسیر (Translation & Tafseer):** Rs. 5,000 / ماہانہ\n` +
      `• **اسلامک اسٹڈیز و مسنون دعائیں:** Rs. 3,500 سے 4,000 / ماہانہ\n\n` +
      `🌍 **بیرونِ ملک طلباء (Overseas - UK, USA, Gulf):** $35 سے $50 USD / ماہانہ۔\n\n` +
      `💳 **ادائیگی کے طریقے:** جاز کیش (JazzCash)، ایزی پیسہ (EasyPaisa) اور بینک ٹرانسفر۔\n` +
      `🎁 **خاص رعایت:** آپ کے لیے **3 دن کی ٹرائل کلاس بالکل مفت (100% Free)** ہے بغیر کسی پیشگی فیس کے!\n\n` +
      `ٹرائل بک کرنے کے لیے ابھی رابطہ کریں:\n` +
      `📲 **WhatsApp:** ${phone}`
    );
  }

  // 9. FREE TRIAL (مفت ٹرائل کلاس)
  if (
    q.includes('trial') ||
    q.includes('demo') ||
    q.includes('azmana') ||
    q.includes('pehle') ||
    q.includes('test') ||
    q.includes('check') ||
    q.includes('ٹرائل') ||
    q.includes('مفت') ||
    (q.includes('free') && !q.includes('carefree'))
  ) {
    return (
      `وعلیکم السلام ورحمۃ اللہ!\n\n` +
      `جی ہاں! نور القرآن اکیڈمی میں نئے طلباء کے لیے **3 دن کی ٹرائل کلاس بالکل مفت (100% Free Trial)** پیش کی جاتی ہے:\n\n` +
      `✨ **ٹرائل کلاس کی اہم خصوصیات:**\n` +
      `1️⃣ **کوئی ایڈوانس فیس نہیں:** ٹرائل کے لیے کوئی رقم پیشگی جمع نہیں کروانی پڑتی۔\n` +
      `2️⃣ **1-on-1 کلاس:** استاد کی مکمل توجہ آپ یا آپ کے بچے پر ہوگی۔\n` +
      `3️⃣ **اپنی پسند کا وقت:** صبح، دوپہر، شام، یا رات کے کسی بھی وقت۔\n` +
      `4️⃣ **استاد کا انتخاب:** میل (Male) یا فی میل (Female) قاریہ کا آزادانہ انتخاب۔\n\n` +
      `📝 **ٹرائل لینے کا طریقہ:**\n` +
      `طالب علم کا نام اور مناسب وقت ہمارے WhatsApp پر بھیجیں یا ویب سائٹ پر **Admission** فارم پر کریں۔\n\n` +
      `📲 **فوری ٹرائل شیڈول کرنے کے لیے واٹس ایپ:** ${phone}`
    );
  }

  // 10. PAYMENT METHODS (ادائیگی کے ذرائع)
  if (
    q.includes('jazzcash') ||
    q.includes('easypaisa') ||
    q.includes('payment') ||
    q.includes('bank') ||
    q.includes('account') ||
    q.includes('pay') ||
    q.includes('پیمنٹ')
  ) {
    return (
      `وعلیکم السلام! فیس کی ادائیگی کے تمام آسان ذرائع دستیاب ہیں:\n\n` +
      `💳 **ادائیگی کے آپشنز:**\n` +
      `1️⃣ **JazzCash:** موبائل اکاؤنٹ کے ذریعے فوری ادائیگی۔\n` +
      `2️⃣ **EasyPaisa:** ایزی پیسہ موبائل والٹ سے۔\n` +
      `3️⃣ **Bank Transfer:** پاکستان کے کسی بھی بینک سے آن لائن اکاؤنٹ ٹرانسفر۔\n` +
      `4️⃣ **International Students:** ڈیبٹ/کریڈٹ کارڈ، وائر ٹرانسفر یا پے پال۔\n\n` +
      `نوٹ: ٹرائل کلاس کے 3 دن بالکل مفت ہیں، فیس صرف ٹرائل سے مطمئن ہونے کے بعد لی جاتی ہے۔ WhatsApp: ${phone}`
    );
  }

  // 11. ONLINE CLASS PLATFORM & SETUP (کلاس کیسے ہوگی؟)
  if (
    q.includes('zoom') ||
    q.includes('meet') ||
    q.includes('laptop') ||
    q.includes('mobile') ||
    /\bapp\b/.test(q) ||
    q.includes('application') ||
    q.includes('kaise hogi') ||
    q.includes('kese hoti') ||
    q.includes('how class') ||
    q.includes('کیسے ہوگی')
  ) {
    return (
      `وعلیکم السلام! ہماری آن لائن کلاسز انتہائی آسان اور جدید طریقے سے منعقد ہوتی ہیں:\n\n` +
      `💻 **کلاس کا طریقہ کار:**\n` +
      `1️⃣ کلاس **Zoom** یا **Google Meet** پر 1-on-1 لائیو ہوتی ہے۔\n` +
      `2️⃣ آپ موبائل فون، ٹیبلٹ، یا لیپ ٹاپ کسی بھی ڈیوائس سے کلاس لے سکتے ہیں۔\n` +
      `3️⃣ استاد اسکرین پر رنگین تجویدی ڈیجیٹل قرآن شیئر کرتے ہیں اور ساتھ ساتھ تصحیح کرتے ہیں۔\n` +
      `4️⃣ وقت پر کلاس کا لنک آپ کے WhatsApp پر بھیج دیا جاتا ہے۔\n\n` +
      `آج ہی 3 دن کی مفت ٹرائل کلاس لے کر چیک کریں! رابطہ: ${phone}`
    );
  }

  // 12. TIMINGS & SCHEDULE (کلاسز کے اوقات)
  if (
    q.includes('time') ||
    q.includes('timing') ||
    q.includes('waqt') ||
    q.includes('schedule') ||
    q.includes('kab') ||
    q.includes('hours') ||
    q.includes('rat') ||
    q.includes('subah') ||
    q.includes('sham') ||
    q.includes('وقت') ||
    q.includes('ٹائمنگ') ||
    q.includes('اوقات')
  ) {
    return (
      `وعلیکم السلام! ہماری تمام آن لائن کلاسز **24/7 لچکدار اوقات (Flexible Timings)** کے ساتھ ہوتی ہیں:\n\n` +
      `⏰ **اوقات کی خصوصیات:**\n` +
      `• آپ اپنی یا اپنے بچوں کے اسکول و ملازمت کے بعد کی مناسبت سے وقت منتخب کر سکتے ہیں۔\n` +
      `• کلاس کا دورانیہ 30 سے 40 منٹ فی کلاس ہوتا ہے۔\n` +
      `• ہفتے میں 3، 4 یا 5 دن کی کلاسز کا انتخاب کیا جا سکتا ہے۔\n` +
      `• پاکستان کے علاوہ بیرونِ ملک کے تمام ٹائم زونز (UK, USA, Gulf, Australia) کے مطابق اساتذہ دستیاب ہیں۔\n\n` +
      `اپنی مرضی کا وقت بتا کر آج ہی ٹرائل شروع کریں: ${phone}`
    );
  }

  // 13. ADMISSION & REGISTRATION (داخلہ کا طریقہ)
  if (
    q.includes('admission') ||
    q.includes('dakhla') ||
    q.includes('enroll') ||
    q.includes('register') ||
    q.includes('procedure') ||
    q.includes('join') ||
    q.includes('shuru') ||
    q.includes('داخلہ') ||
    q.includes('رجسٹریشن')
  ) {
    return (
      `وعلیکم السلام! نور القرآن اکیڈمی میں داخلہ کا طریقہ کار انتہائی آسان ہے:\n\n` +
      `1️⃣ **پہلا مرحلہ:** ویب سائٹ کے مینو میں **"Free Trial"** یا **"Admissions"** بٹن پر کلک کر کے مختصر فارم پر کریں۔\n` +
      `2️⃣ **دوسرا مرحلہ:** یا براہ راست ہمارے WhatsApp (${phone}) پر طالب علم کا نام، عمر، اور کورس لکھ کر بھیجیں۔\n` +
      `3️⃣ **تیسرا مرحلہ:** ہم چند منٹوں میں آپ کی پہلی **3 روزہ مفت ٹرائل کلاس** کا لنک اور وقت ارسال کر دیں گے۔\n` +
      `4️⃣ **چوتھا مرحلہ:** ٹرائل مکمل ہونے اور مطمئن ہونے کے بعد باقاعدہ فیس جمع کروا کر کلاسز جاری رکھیں۔\n\n` +
      `📲 **ابھی داخلہ شروع کرنے کے لیے WhatsApp:** ${phone}`
    );
  }

  // 14. COURSES OFFERED (تمام کورسز)
  if (
    q.includes('course') ||
    q.includes('courses') ||
    q.includes('parhate') ||
    q.includes('sikhate') ||
    q.includes('kya kya') ||
    q.includes('کورس') ||
    q.includes('کورسز') ||
    q.includes('پڑھاتے')
  ) {
    return (
      `وعلیکم السلام! نور القرآن اکیڈمی میں درج ذیل 8 کورسز آن لائن پڑھائے جاتے ہیں:\n\n` +
      `1️⃣ **نورانی قاعدہ:** ابتدائی طلباء کے لیے حروف کے مخارج اور بنیادی قواعد (Rs. 4,500/ماہانہ)۔\n` +
      `2️⃣ **ناظرہ قرآن:** مکمل قرآن پاک کی روانی اور درست ترتیل کے ساتھ تلاوت (Rs. 5,000/ماہانہ)۔\n` +
      `3️⃣ **تجوید القرآن:** مخارج، غنہ، اخفاء، قلقلہ اور مد کے قواعد (Rs. 5,500/ماہانہ)۔\n` +
      `4️⃣ **حفظ القرآن:** منظم حفظ کا نصاب بمع روزانہ سبق، سبقی اور منزل (Rs. 7,000/ماہانہ)۔\n` +
      `5️⃣ **ترجمہ و تفسیر:** لفظ بہ لفظ فہمِ قرآن اور مفاہیم (Rs. 5,000/ماہانہ)۔\n` +
      `6️⃣ **اسلامک اسٹڈیز:** نماز، وضو، طہارت، اور سیرت النبی ﷺ (Rs. 4,000/ماہانہ)۔\n` +
      `7️⃣ **مسنون دعائیں و کلمے:** روزمرہ کے اذکار اور چھ کلمے (Rs. 3,500/ماہانہ)۔\n\n` +
      `🎁 تمام کورسز میں **3 دن کی مفت ٹرائل کلاس** شامل ہے! رابطہ: ${phone}`
    );
  }

  // 15. TEACHERS / QUALIFICATION (اساتذہ کی معلومات)
  if (
    q.includes('teacher') ||
    q.includes('ustad') ||
    q.includes('qari') ||
    q.includes('mufti') ||
    q.includes('sanad') ||
    q.includes('qualification') ||
    q.includes('اساتذہ') ||
    q.includes('استاد')
  ) {
    return (
      `وعلیکم السلام! نور القرآن اکیڈمی کے تمام اساتذہ انتہائی قابل، سند یافتہ اور تجربہ کار ہیں:\n\n` +
      `🎓 **اساتذہ کی تفصیل:**\n` +
      `• وفاق المدارس العربیہ اور معروف دینی جامعات سے الشہادۃ العالمیہ (M.A Islamic Studies) اور قراءت و تجوید کی باقاعدہ سند۔\n` +
      `• قاری محمد عاصم فاروقی (12 سالہ تجربہ، تجوید و حفظ)۔\n` +
      `• استاذہ عائشہ صدیقہ (عالمہ فاضلہ، خواتین و بچوں کی ماہر معلمہ)۔\n` +
      `• مفتی سلمان طارق (تخصص فی الفقہ، ترجمہ و تفسیر)۔\n\n` +
      `آپ اپنی مرضی کے استاد کے ساتھ 3 دن کی مفت ٹرائل کلاس لے سکتے ہیں۔ رابطہ: ${phone}`
    );
  }

  // 16. CONTACT & WHATSAPP (رابطہ و واٹس ایپ)
  if (
    q.includes('contact') ||
    q.includes('phone') ||
    q.includes('number') ||
    q.includes('whatsapp') ||
    q.includes('call') ||
    q.includes('rabta') ||
    q.includes('address') ||
    q.includes('office') ||
    q.includes('location') ||
    q.includes('نمبر') ||
    q.includes('رابطہ') ||
    q.includes('پتہ')
  ) {
    return (
      `وعلیکم السلام! آپ نور القرآن اکیڈمی سے درج ذیل ذرائع سے فوراً رابطہ کر سکتے ہیں:\n\n` +
      `📞 **فون و واٹس ایپ (Phone & WhatsApp):** ${phone}\n` +
      `✉️ **ای میل:** info@nooralquran.pk\n` +
      `📍 **ہیڈ آفس:** F-8 Markaz, Islamabad, Pakistan\n` +
      `🌐 **آن لائن کلاسز:** 100% لائیو انٹرنیشنل Zoom / Google Meet پر۔\n\n` +
      `ہماری ٹیم 24 گھنٹے آپ کی رہنمائی اور فری ٹرائل شیڈول کرنے کے لیے حاضر ہے۔`
    );
  }

  // 17. GREETINGS & SALAM (سلام و احوال)
  if (
    q.includes('salam') ||
    q.includes('slam') ||
    q.includes('assalam') ||
    q.includes('kaise ho') ||
    q.includes('kese ho') ||
    q.includes('adaab') ||
    q.includes('سلام') ||
    /\b(hi|hello|hey)\b/i.test(q)
  ) {
    if (isEnglish) {
      return (
        `Assalamu Alaikum wa Rahmatullah! Welcome to ${academy}.\n\n` +
        `Alhamdulillah, we are doing well and ready to assist you. You can ask us about:\n` +
        `• 📖 Course offerings & Monthly fee structure\n` +
        `• 🎁 How to claim your 3-Day 100% Free Trial\n` +
        `• 👩‍🏫 Certified female Quran tutors for sisters & young kids\n` +
        `• ⏰ 24/7 Flexible schedule to suit your timezone\n` +
        `• 🕌 Tajweed rules, Salah/Namaz guidance & Duas\n\n` +
        `How may I assist you today? Feel free to ask anything!`
      );
    }
    return (
      `وعلیکم السلام ورحمۃ اللہ وبرکاتہ!\n\n` +
      `نور القرآن اکیڈمی کے کونسلر میں خوش آمدید۔ الحمد للہ، ہم سب خیریت سے ہیں اور آپ کی خدمت کے لیے حاضر ہیں۔\n\n` +
      `آپ ہم سے درج ذیل معلومات جان سکتے ہیں:\n` +
      `• 📖 تمام 8 کورسز اور ماہانہ فیس کی تفصیلات\n` +
      `• 🎁 3 دن کی بالکل مفت (100% Free) ٹرائل کلاس\n` +
      `• 👩‍🏫 بچیوں اور بہنوں کے لیے باحجاب فی میل معلمات\n` +
      `• ⏰ اپنی مرضی اور سہولت کے مطابق کلاس ٹائمنگ\n` +
      `• 🕌 تجوید کے قواعد اور اسلامی معلومات\n\n` +
      `آپ کیا جاننا چاہتے ہیں؟ اپنا سوال لکھیے یا فوری کلاس کے لیے WhatsApp پر میسج کریں:\n` +
      `📲 **WhatsApp:** ${phone}`
    );
  }

  // 18. DYNAMIC CONTEXTUAL RESPONSE FOR ANY OTHER QUESTION
  if (isEnglish) {
    return (
      `Assalamu Alaikum wa Rahmatullah!\n\n` +
      `Thank you for reaching out to ${academy}. We offer personalized 1-on-1 online Quran classes worldwide, including Noorani Qaida, Nazra, Tajweed, Hifz, and Islamic Studies.\n\n` +
      `🎁 We would love to offer you a **3-Day 100% Free Trial** with no advance payment required!\n\n` +
      `Please message our team on WhatsApp for immediate scheduling:\n` +
      `📲 **WhatsApp:** ${phone}`
    );
  }

  // Natural Urdu / Roman Urdu friendly response tailored to the inquiry
  return (
    `وعلیکم السلام ورحمۃ اللہ وبرکاتہ!\n\n` +
    `آپ کا سوال موصول ہو گیا ہے۔ نور القرآن اکیڈمی میں ہم 1-on-1 لائیو آن لائن کلاسز کے ذریعے قرآن مجید (نورانی قاعدہ، ناظرہ، تجوید، حفظ) اور اسلامی علوم کی باوقار تعلیم دیتے ہیں۔\n\n` +
    `✨ **اہم معلومات:**\n` +
    `• **3 دن کی ٹرائل کلاس بالکل مفت (100% Free)** بغیر کسی پیشگی فیس کے۔\n` +
    `• بچیوں اور بہنوں کے لیے باحجاب سند یافتہ فی میل قاریہ دستیاب ہیں۔\n` +
    `• کلاسز آپ کی اپنی سہولت کے مطابق دن یا رات کے کسی بھی وقت۔\n` +
    `• مناسب ماہانہ فیس (Rs. 4,500 سے Rs. 7,000)۔\n\n` +
    `مزید رہنمائی یا فوری ٹرائل کلاس بک کرنے کے لیے ابھی ہمارے واٹس ایپ پر میسج بھیجیں:\n` +
    `📲 **WhatsApp:** ${phone}`
  );
}
