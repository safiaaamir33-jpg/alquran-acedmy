import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, AlertCircle, Loader2, BookOpen, ArrowLeft, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { loginWithEmail, loginWithGoogle, authError, clearError } = useAuth();
  const [email, setEmail] = useState('safiaaamir33@gmail.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsLoading(true);

    try {
      await loginWithEmail(email.trim(), password);
      setIsLoading(false);
      onNavigate('/admin');
    } catch (err) {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    setIsLoading(true);
    try {
      await loginWithGoogle();
      setIsLoading(false);
      onNavigate('/admin');
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F8F4] flex flex-col justify-center items-center p-4 islamic-pattern-light">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <button
          onClick={() => onNavigate('/')}
          className="mb-6 flex items-center gap-1.5 text-xs font-semibold text-[#075E46] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Noor Al-Quran Academy Public Website</span>
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-emerald-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#075E46] to-[#0B7A53] flex items-center justify-center text-white mx-auto shadow-md border border-[#D4AF37]/40">
              <ShieldCheck className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#24352F]">Admin Management Sign In</h2>
            <p className="text-xs text-gray-500">
              Authorized access for Noor Al-Quran Academy management
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#075E46] border border-emerald-200 text-[11px] font-semibold mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Firebase Database: Connected & Live</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 text-[11px] text-amber-900 flex items-start gap-2">
            <Lock className="w-4 h-4 text-[#075E46] flex-shrink-0 mt-0.5" />
            <p>
              <strong>100% Private:</strong> Your admin password and dashboard are strictly hidden from clients and students. Visitors only see the public academy courses and admission portal.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 bg-red-50 text-red-700 text-xs rounded-xl flex items-start gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Admin Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="admin@nooralquran.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46]"
                />
              </div>

              {/* Quick pre-authorized email selector chips */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <span className="text-[10px] text-gray-500 font-semibold">Authorized Admins:</span>
                {[
                  'safiyamano980@gmail.com',
                  'safiaaamir33@gmail.com',
                  'safiaaamir18@gmail.com',
                ].map((admEmail) => (
                  <button
                    key={admEmail}
                    type="button"
                    onClick={() => setEmail(admEmail)}
                    className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all ${
                      email.toLowerCase() === admEmail
                        ? 'bg-emerald-100 text-[#075E46] border-emerald-300 font-bold'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {admEmail.split('@')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#075E46]/30 focus:border-[#075E46]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#075E46] hover:bg-[#064e3b] text-white shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google Admin Sign In</span>
          </button>

          {/* First-time setup info accordion */}
          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={() => setShowSetupGuide(!showSetupGuide)}
              className="w-full text-[11px] text-[#075E46] font-semibold hover:underline flex items-center justify-center gap-1"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{showSetupGuide ? 'Hide First-Admin Setup Instructions' : 'First-time Admin Setup Instructions'}</span>
            </button>

            {showSetupGuide && (
              <div className="mt-3 p-3.5 bg-emerald-50 rounded-xl text-[11px] text-gray-700 space-y-2 border border-emerald-200">
                <p className="font-bold text-[#075E46]">Initial Admin Authorization:</p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>The email <code className="bg-white px-1 py-0.5 rounded font-mono text-[10px]">safiaaamir18@gmail.com</code> is pre-authorized in the security rules.</li>
                  <li>In Firebase Console, create the user in <strong>Authentication &gt; Add user</strong> with your desired password.</li>
                  <li>Copy the user UID and create document in Firestore collection <code className="bg-white px-1 py-0.5 rounded font-mono text-[10px]">admins/{'{uid}'}</code> with <code className="bg-white px-1 py-0.5 rounded font-mono text-[10px]">role: "superadmin"</code>.</li>
                  <li>Sign in with your configured password above!</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
