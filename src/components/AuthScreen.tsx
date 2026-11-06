import React, { useState } from 'react';
import {
  Stethoscope,
  Users,
  User,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Building2,
  KeyRound,
  ShieldCheck,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SAAS_LOGO_URL = "https://i.postimg.cc/HkFdgvmz/Screenshot-2026-11-05-062500.png";

export const AuthScreen: React.FC = () => {
  const { login, signup, signInWithGoogle, demoLogin, error, clearError, isPlaceholderAuth } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Extra signup fields
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'doctor' | 'receptionist' | 'patient'>('doctor');
  const [department, setDepartment] = useState('General Medicine');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    clearError();
    setSuccessNotice(null);
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed';
      setLocalError(msg);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();
    setSuccessNotice(null);

    if (!email.trim() || !password.trim()) {
      setLocalError('Please enter both email and password.');
      return;
    }

    if (isSignUp && password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isSignUp) {
        const defaultName = fullName.trim() || email.split('@')[0];
        await signup(email.trim(), password, {
          name: defaultName,
          role,
          department: department.trim() || (role === 'receptionist' ? 'Front Desk & Billing' : 'General Medicine'),
        });
        setSuccessNotice('Account created successfully! Connecting to your portal...');
      } else {
        await login(email.trim(), password);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setLocalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = (newRole: 'doctor' | 'receptionist' | 'patient') => {
    setRole(newRole);
    if (newRole === 'doctor') {
      setDepartment('General Medicine');
    } else if (newRole === 'receptionist') {
      setDepartment('Front Desk & Billing');
    } else {
      setDepartment('Outpatient Clinic');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F9FF] via-[#E0F2FE] to-[#F8FCFF] relative flex items-center justify-center p-4 sm:p-6 font-sans text-sky-950 selection:bg-sky-200 selection:text-sky-900 overflow-hidden">
      
      {/* Soft Ambient Light Blue Glowing Blobs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white p-2 shadow-xl mb-3 border border-sky-100">
            <img src={SAAS_LOGO_URL} alt="عيادتي حالا Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-sky-950 tracking-tight">
            عيادتي حالا <span className="text-sky-400 font-light">•</span> Ayadati Halan
          </h1>
          <p className="text-xs sm:text-sm text-sky-700 mt-1 font-medium">
            Medical Clinic Portal • Firebase Authentication & Cloud Firestore
          </p>
        </div>

        {/* Firebase Live Status Badge */}
        {!isPlaceholderAuth ? (
          <div className="mb-4 bg-white/80 border border-sky-200 text-sky-800 p-3 rounded-2xl text-xs flex items-center justify-between shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
              <span className="font-semibold text-sky-900">Firebase Active:</span>
              <code className="bg-sky-50 px-2 py-0.5 rounded text-sky-700 font-mono text-[11px] border border-sky-200">calm-plate-hkm2h</code>
            </div>
            <span className="text-[10px] bg-sky-100 text-sky-700 font-bold px-2.5 py-0.5 rounded-full border border-sky-200">
              Live Cloud Firestore
            </span>
          </div>
        ) : (
          <div className="mb-4 bg-white/80 border border-sky-200 text-sky-800 p-3.5 rounded-2xl text-xs flex items-start gap-2.5 shadow-sm backdrop-blur-md">
            <Info size={18} className="text-sky-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sky-900">Medical Portal Ready</p>
              <p className="text-[11px] text-sky-700 mt-0.5 leading-relaxed">
                Enter your credentials or click any role in <strong>Instant Demo Access</strong> below to begin.
              </p>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(14,165,233,0.15)] border border-sky-100 overflow-hidden">
          
          {/* Top Toggle: Sign In vs Sign Up */}
          <div className="grid grid-cols-2 p-1.5 bg-sky-50/70 border-b border-sky-100 gap-1 text-center font-bold text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setLocalError(null);
                clearError();
              }}
              className={`py-3 rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                !isSignUp
                  ? 'bg-white text-sky-800 shadow-sm border border-sky-100 font-extrabold'
                  : 'text-sky-600 hover:text-sky-900'
              }`}
            >
              <KeyRound size={15} className="text-sky-500" />
              <span>Sign In (دخول)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setLocalError(null);
                clearError();
              }}
              className={`py-3 rounded-2xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isSignUp
                  ? 'bg-sky-500 text-white shadow-sm font-extrabold'
                  : 'text-sky-600 hover:text-sky-900'
              }`}
            >
              <Sparkles size={15} />
              <span>Sign Up (تسجيل جديد)</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            
            {/* Context Heading */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-sky-950 flex items-center gap-2">
                {isSignUp ? (
                  <>
                    <ShieldCheck size={22} className="text-sky-500" />
                    <span>Create User Account</span>
                  </>
                ) : (
                  <>
                    <Lock size={20} className="text-sky-600" />
                    <span>Portal Sign In</span>
                  </>
                )}
              </h2>
              <p className="text-xs text-sky-700/80 mt-1">
                {isSignUp
                  ? 'New doctor and clinic staff registration synchronized with Cloud Firestore.'
                  : 'Enter your medical credentials to access your dashboard.'}
              </p>
            </div>

            {/* Error Message Alert */}
            {(localError || error) && (
              <div className="mb-5 bg-sky-50 border border-sky-200 text-sky-800 px-4 py-3 rounded-xl text-xs flex items-start gap-2.5">
                <AlertCircle size={17} className="text-sky-600 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium leading-relaxed">
                  {localError || error}
                </div>
              </div>
            )}

            {/* Success Message Alert */}
            {successNotice && (
              <div className="mb-5 bg-sky-50 border border-sky-200 text-sky-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 size={17} className="text-sky-600 shrink-0" />
                <span>{successNotice}</span>
              </div>
            )}

            {/* Google Sign In Action Button */}
            <div className="mb-5">
              <button
                type="button"
                disabled={isSubmitting || isGoogleLoading}
                onClick={handleGoogleSignIn}
                className="w-full py-3.5 px-4 bg-white hover:bg-sky-50/80 active:bg-sky-100 border-2 border-sky-200 hover:border-sky-300 text-sky-950 rounded-2xl font-bold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 group"
              >
                {isGoogleLoading ? (
                  <div className="inline-flex items-center gap-2 text-sky-700">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-sky-600 border-t-transparent" />
                    <span>Connecting to Google...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
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
                    <span className="font-bold text-sky-900">
                      {isSignUp ? 'Sign up with Google (تسجيل جديد بحساب جوجل)' : 'Sign in with Google (دخول بحساب جوجل)'}
                    </span>
                  </>
                )}
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-sky-100 w-full" />
                <span className="bg-white px-3 text-[11px] font-semibold text-sky-400 uppercase tracking-wider">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Extra Fields for Sign Up */}
              {isSignUp && (
                <>
                  {/* Role Selector */}
                  <div>
                    <label className="block text-xs font-bold text-sky-900 mb-1.5">
                      Assigned Role (الدور الوظيفي) *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleRoleChange('doctor')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          role === 'doctor'
                            ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                            : 'border-sky-200 bg-sky-50/50 text-sky-800 hover:bg-sky-100/60'
                        }`}
                      >
                        <Stethoscope size={16} />
                        <span>Doctor (طبيب)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRoleChange('receptionist')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          role === 'receptionist'
                            ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                            : 'border-sky-200 bg-sky-50/50 text-sky-800 hover:bg-sky-100/60'
                        }`}
                      >
                        <Users size={16} />
                        <span>Reception (استقبال)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRoleChange('patient')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          role === 'patient'
                            ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                            : 'border-sky-200 bg-sky-50/50 text-sky-800 hover:bg-sky-100/60'
                        }`}
                      >
                        <User size={16} />
                        <span>Patient (مريض)</span>
                      </button>
                    </div>
                  </div>

                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-bold text-sky-900 mb-1">
                      Full Name (الاسم بالكامل)
                      <span className="text-sky-500/70 font-normal ml-1">(Optional - defaults to email prefix)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-400">
                        <User size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Dr. Alexander Wright"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-sky-50/30 border border-sky-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 focus:bg-white outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Department field */}
                  <div>
                    <label className="block text-xs font-bold text-sky-900 mb-1">
                      Department / Specialty (القسم / التخصص)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-400">
                        <Building2 size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="e.g., Internal Medicine, Cardiology, Front Desk"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-sky-50/30 border border-sky-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 focus:bg-white outline-none transition"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email field */}
              <div>
                <label className="block text-xs font-bold text-sky-900 mb-1">
                  Email Address (البريد الإلكتروني) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="doctor@ayadatihala.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-sky-50/30 border border-sky-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 focus:bg-white outline-none transition"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-sky-900">
                    Password (كلمة المرور) *
                  </label>
                  {isSignUp && (
                    <span className="text-[11px] text-sky-600">Min. 6 characters</span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sky-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-sky-50/30 border border-sky-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 focus:bg-white outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-sky-400 hover:text-sky-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-xl font-bold text-sm shadow-md shadow-sky-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <div className="inline-flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>{isSignUp ? 'Creating User & Firestore Record...' : 'Authenticating...'}</span>
                  </div>
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Account in Firebase' : 'Sign In to Portal'}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Buttons */}
            <div className="mt-8 pt-6 border-t border-sky-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
                  Instant Demo Access (One-Click Testing)
                </span>
                <span className="text-[10px] bg-sky-100 text-sky-700 font-semibold px-2 py-0.5 rounded-full border border-sky-200">
                  Offline Ready
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => demoLogin('doctor', 'Dr. Alexander Wright', 'Internal Medicine')}
                  className="p-2.5 bg-white hover:bg-sky-50/60 border border-sky-200/80 rounded-xl text-left transition flex items-center gap-2 group cursor-pointer shadow-sm hover:border-sky-300"
                >
                  <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Stethoscope size={14} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[11px] font-bold text-sky-950 truncate">Dr. Wright</p>
                    <p className="text-[10px] text-sky-600">Doctor</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => demoLogin('receptionist', 'Maryam Ahmed', 'Front Desk & Reception')}
                  className="p-2.5 bg-white hover:bg-sky-50/60 border border-sky-200/80 rounded-xl text-left transition flex items-center gap-2 group cursor-pointer shadow-sm hover:border-sky-300"
                >
                  <div className="w-7 h-7 rounded-lg bg-sky-400 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Users size={14} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[11px] font-bold text-sky-950 truncate">Maryam</p>
                    <p className="text-[10px] text-sky-600">Reception</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => demoLogin('patient', 'Samir Mansour', 'Outpatient Consultation')}
                  className="p-2.5 bg-white hover:bg-sky-50/60 border border-sky-200/80 rounded-xl text-left transition flex items-center gap-2 group cursor-pointer shadow-sm hover:border-sky-300"
                >
                  <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <User size={14} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[11px] font-bold text-sky-950 truncate">Samir M.</p>
                    <p className="text-[10px] text-sky-600">Patient</p>
                  </div>
                </button>
              </div>
            </div>

          </div>

          {/* Footer Card Info */}
          <div className="bg-sky-50/50 px-6 py-4 border-t border-sky-100 text-center">
            <p className="text-[11px] text-sky-700/80">
              Users registered here automatically synchronize with Firestore <code className="bg-white px-1.5 py-0.5 rounded text-sky-800 font-mono border border-sky-200">users/{'{uid}'}</code>.
            </p>
          </div>

        </div>

        {/* Bottom subtle copyright */}
        <p className="text-center text-xs text-sky-700/60 mt-6">
          &copy; {new Date().getFullYear()} Ayadati Halan • Light Blue & White Medical Theme
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
