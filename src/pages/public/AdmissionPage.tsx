import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles, Phone, User, BookOpen, Clock } from 'lucide-react';
import { Course } from '../../types';
import { submitAdmission } from '../../firebase/services';
import { useLanguage } from '../../context/LanguageContext';

export const AdmissionPage: React.FC<{
  courses: Course[];
  initialCourseTitle?: string;
  onNavigate: (path: string) => void;
}> = ({ courses, initialCourseTitle, onNavigate }) => {
  const { t, isUrdu } = useLanguage();

  const [studentName, setStudentName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [phone, setPhone] = useState('+92 ');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [courseTitle, setCourseTitle] = useState(initialCourseTitle || '');
  const [classMode, setClassMode] = useState('Online (1-on-1)');
  const [preferredTiming, setPreferredTiming] = useState('Evening (5:00 PM - 9:00 PM Asia/Karachi)');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedRefId, setSubmittedRefId] = useState<string | null>(null);

  useEffect(() => {
    if (initialCourseTitle) {
      setCourseTitle(initialCourseTitle);
    } else if (courses.length > 0 && !courseTitle) {
      setCourseTitle(courses[0].title);
    }
  }, [initialCourseTitle, courses, courseTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!studentName.trim()) {
      setErrorMessage('Please enter the student full name.');
      return;
    }

    const cleanPhone = phone.trim();
    if (!cleanPhone || cleanPhone.length < 9) {
      setErrorMessage('Please enter a valid contact phone number with country code (e.g. +92 300 1234567).');
      return;
    }

    if (!courseTitle) {
      setErrorMessage('Please select a Quran course.');
      return;
    }

    if (!consent) {
      setErrorMessage('Please provide consent to be contacted regarding your admission application.');
      return;
    }

    try {
      setIsSubmitting(true);
      const selectedCourseObj = courses.find((c) => c.title === courseTitle);

      const refId = await submitAdmission({
        studentName: studentName.trim(),
        guardianName: guardianName.trim(),
        phone: cleanPhone,
        email: email.trim(),
        age: age.trim(),
        courseId: selectedCourseObj?.id || '',
        courseTitle,
        classMode,
        preferredTiming,
        message: message.trim(),
      });

      setIsSubmitting(false);
      setSubmittedRefId(refId);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Failed to submit admission application. Please verify your internet connection or message us on WhatsApp.');
    }
  };

  if (submittedRefId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-in fade-in">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-100 space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#075E46] flex items-center justify-center mx-auto border-2 border-emerald-200">
            <CheckCircle2 className="w-10 h-10 text-[#075E46]" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#24352F]">
            {t('adm.successTitle')}
          </h2>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            {t('adm.successMsg')}
          </p>

          <div className="p-4 bg-[#F3F8F4] rounded-2xl border border-emerald-200 text-left rtl:text-right space-y-2 text-xs text-gray-700">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-500">Application Reference ID:</span>
              <span className="font-mono font-bold text-[#075E46]">{submittedRefId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-500">Student:</span>
              <span className="font-bold text-[#24352F]">{studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-500">Course Selected:</span>
              <span className="font-bold text-[#24352F]">{courseTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-500">Status:</span>
              <span className="font-bold text-amber-600 uppercase">Pending Free Trial Scheduling</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setSubmittedRefId(null);
                setStudentName('');
                setGuardianName('');
                setMessage('');
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50"
            >
              Submit Another Application
            </button>
            <button
              onClick={() => onNavigate('/')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#075E46] text-white font-bold text-sm hover:bg-[#064e3b]"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[#075E46] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {isUrdu ? 'مفت ٹرائل کلاس کا داخلہ' : '3-Day Free Trial Admission'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#24352F] mt-3">
          {t('adm.title')}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-2 leading-relaxed">
          {t('adm.sub')}
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-emerald-100">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Student Name */}
            <div>
              <label className="block text-xs font-bold text-[#24352F] mb-1.5">
                {t('adm.studentName')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Bilal"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46]"
                />
              </div>
            </div>

            {/* Guardian Name */}
            <div>
              <label className="block text-xs font-bold text-[#24352F] mb-1.5">
                {t('adm.guardianName')}
              </label>
              <input
                type="text"
                placeholder="Parent name for kids / minors"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Contact Phone (Pakistan Supported) */}
            <div>
              <label className="block text-xs font-bold text-[#24352F] mb-1.5">
                {t('adm.phone')}
              </label>
              <input
                type="tel"
                required
                placeholder="+92 300 1234567 or 03001234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46]"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                WhatsApp number preferred for class schedule confirmation.
              </span>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-[#24352F] mb-1.5">
                {t('adm.email')}
              </label>
              <input
                type="email"
                placeholder="parent@example.com (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Age / Level */}
            <div>
              <label className="block text-xs font-bold text-[#24352F] mb-1.5">
                {t('adm.age')}
              </label>
              <input
                type="text"
                placeholder="e.g. 7 years old or Adult"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46]"
              />
            </div>

            {/* Course Selection */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#24352F] mb-1.5">
                {t('adm.course')}
              </label>
              <select
                required
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46] bg-white"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title} ({c.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Class Mode */}
            <div>
              <label className="block text-xs font-bold text-[#24352F] mb-1.5">
                {t('adm.mode')}
              </label>
              <select
                value={classMode}
                onChange={(e) => setClassMode(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46] bg-white"
              >
                <option value="Online (1-on-1 Live)">Online (1-on-1 Live via Zoom / Meet)</option>
                <option value="Online (Female Tutor Requested)">Online with Female Tutor (Sisters & Kids)</option>
                <option value="On-Campus (Islamabad Academy)">On-Campus (Islamabad Academy, Pakistan)</option>
              </select>
            </div>

            {/* Preferred Timing */}
            <div>
              <label className="block text-xs font-bold text-[#24352F] mb-1.5">
                {t('adm.timing')}
              </label>
              <select
                value={preferredTiming}
                onChange={(e) => setPreferredTiming(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46] bg-white"
              >
                <option value="Morning (8:00 AM - 12:00 PM Asia/Karachi)">Morning (8:00 AM - 12:00 PM)</option>
                <option value="Afternoon (1:00 PM - 5:00 PM Asia/Karachi)">Afternoon (1:00 PM - 5:00 PM)</option>
                <option value="Evening (5:00 PM - 9:00 PM Asia/Karachi)">Evening (5:00 PM - 9:00 PM)</option>
                <option value="Night (9:00 PM - 1:00 AM Asia/Karachi)">Night (9:00 PM - 1:00 AM)</option>
                <option value="Overseas Timezone (UK / USA / Canada / Gulf)">Overseas Flexible Schedule</option>
              </select>
            </div>
          </div>

          {/* Additional Message */}
          <div>
            <label className="block text-xs font-bold text-[#24352F] mb-1.5">
              {t('adm.message')}
            </label>
            <textarea
              rows={3}
              placeholder="Any specific goals, prior knowledge of Arabic letters, or preferred starting date..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46]"
            />
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start gap-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <input
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 text-[#075E46] focus:ring-[#075E46] rounded border-gray-300"
            />
            <label htmlFor="consent" className="text-xs text-gray-700 leading-relaxed cursor-pointer">
              {t('adm.consent')}
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#075E46] to-[#0B7A53] hover:from-[#064e3b] hover:to-[#075E46] text-white shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                <span>Recording Admission in Database...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-[#D4AF37]" />
                <span>{t('adm.submit')}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
