import React, { useState, useEffect } from 'react';
import { 
  User, 
  Users, 
  Phone, 
  Calendar, 
  Clock, 
  MapPin, 
  Lock, 
  Unlock, 
  Star, 
  FileText, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  LogOut, 
  Info, 
  CheckCircle2, 
  CheckCircle, 
  XCircle, 
  CreditCard, 
  Settings, 
  MessageCircle, 
  MessageSquare, 
  Smartphone, 
  Stethoscope, 
  DollarSign, 
  Briefcase, 
  Key, 
  FilePlus, 
  Send, 
  Menu, 
  X, 
  Search, 
  FileSpreadsheet, 
  Globe,
  HeartPulse,
  Droplet,
  Heart,
  Moon,
  Mail,
  ArrowRight,
  Shield,
  Monitor,
  ArrowLeft,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Building2,
  Copy,
  Plus,
  Sparkles,
  Share2,
  Layers,
  Image as ImageIcon,
  Check,
  Mic
} from 'lucide-react';
import { AmbientDemoTab } from './components/AmbientDemoTab';
import { useAuth } from './context/AuthContext';
import { AuthScreen } from './components/AuthScreen';
import { DynamicCursor } from './components/DynamicCursor';

// ==========================================
// 0. INITIAL SAAS TENANTS & STRUCTURE
// ==========================================
export interface ClinicLocation {
  id: number;
  name: string;
  days: string;
  hours: string;
}

export interface Tenant {
  id: string;
  slug: string;
  clinicName: string;
  doctorName: string;
  specialty: string;
  tagline: string;
  bio: string;
  qualifications: string[];
  rating: string;
  reviewScore: string;
  consultationFee: number;
  address: string;
  phone: string;
  secretaryPhone: string;
  email: string;
  portraitText: string;
  paymentMethods: string[];
  clinicLocations: ClinicLocation[];
  links: {
    facebook: string;
    whatsapp: string;
    telegram: string;
  };
  reviews: string[];
  tips: string[];
}

const SAAS_LOGO_URL = "https://i.postimg.cc/HkFdgvmz/Screenshot-2026-11-05-062500.png";
const HERO_LOGO_URL = "https://i.postimg.cc/HkFdgvmz/Screenshot-2026-11-05-062500.png";

const INITIAL_SAAS_TENANTS: Tenant[] = [
  {
    id: 'dr-wright',
    slug: 'dr-wright',
    clinicName: 'عيادتي حالا',
    doctorName: 'Dr. Alexander Wright',
    specialty: 'Internal Medicine',
    tagline: 'Excellence in Medical Care, Tailored for You.',
    bio: 'Chief Medical Officer with over 15 years of experience in internal medicine, dedicated to providing holistic and preventative care.',
    qualifications: [
      'MD, Harvard Medical School',
      'Board Certified in Internal Medicine',
      'Fellow of the American College of Physicians'
    ],
    rating: '5.0 / 5.0',
    reviewScore: '4.9/5',
    consultationFee: 500,
    address: 'Virtual Medical Platform (Online & Clinic Coordination)',
    phone: '+20 100 123 4567 | Support: 19011',
    secretaryPhone: '+20 100 987 6543',
    email: 'contact@ayadatihala.com',
    portraitText: 'Dr.+Alexander+Wright',
    paymentMethods: ['Cash', 'Vodafone Cash', 'Credit Card'],
    clinicLocations: [
      { id: 1, name: 'Main Clinic (Maadi)', days: 'Mon, Wed, Thu', hours: '09:00 AM - 02:00 PM' },
      { id: 2, name: 'Branch (Zayed)', days: 'Tue, Sat', hours: '04:00 PM - 09:00 PM' }
    ],
    links: {
      facebook: 'facebook.com/drwrightclinic',
      whatsapp: '01000000001',
      telegram: 't.me/drwrightclinic'
    },
    reviews: [
      '"Dr. Wright is incredibly attentive and takes the time to explain everything clearly. Highly recommend!"',
      '"The best clinic experience I\'ve had. Professional, clean, and compassionate care."'
    ],
    tips: [
      'Drink at least 8 glasses of water daily to maintain optimal hydration and energy levels.',
      'Incorporate 30 minutes of moderate exercise into your daily routine to support heart health.',
      'Ensure 7-8 hours of quality sleep to boost immune function and cognitive performance.'
    ]
  },
  {
    id: 'dr-youssef',
    slug: 'dr-youssef',
    clinicName: 'Cairo Heart & Vascular Center',
    doctorName: 'Dr. Youssef Ibrahim',
    specialty: 'Cardiology',
    tagline: 'Advanced Cardiac Care With Compassion.',
    bio: 'Consultant Cardiologist with 18+ years specializing in interventional cardiology, preventative heart care, and echocardiography.',
    qualifications: [
      'MD & PhD in Cardiovascular Medicine, Cairo University',
      'Fellow of the European Society of Cardiology (FESC)',
      'Consultant of Interventional Cardiology'
    ],
    rating: '5.0 / 5.0',
    reviewScore: '5.0/5',
    consultationFee: 750,
    address: '45 Corniche El Nil, Maadi, Cairo',
    phone: '+20 100 123 4567 | Hotline: 19011',
    secretaryPhone: '+20 100 999 8888',
    email: 'info@cairoheartclinic.com',
    portraitText: 'Dr.+Youssef+Ibrahim',
    paymentMethods: ['Cash', 'Vodafone Cash'],
    clinicLocations: [
      { id: 1, name: 'Maadi Cardiac Center', days: 'Sun, Tue, Thu', hours: '10:00 AM - 03:00 PM' },
      { id: 2, name: 'Sheikh Zayed Medical Hub', days: 'Mon, Wed', hours: '05:00 PM - 09:30 PM' }
    ],
    links: {
      facebook: 'facebook.com/dryoussefcardio',
      whatsapp: '01001234567',
      telegram: 't.me/dryoussefclinic'
    },
    reviews: [
      '"Dr. Youssef saved my father\'s life with an early diagnosis. Extremely thorough and kind."',
      '"Very organized queue system and accurate appointment times at the Maadi branch."'
    ],
    tips: [
      'Monitor your blood pressure weekly and reduce daily sodium intake for optimal arterial health.',
      'A brisk 30-minute walk five times a week reduces cardiovascular risk by over 35%.',
      'Avoid smoking and secondhand smoke to protect your coronary arteries.'
    ]
  },
  {
    id: 'dr-laila',
    slug: 'dr-laila',
    clinicName: 'Nour Kids & Family Clinic',
    doctorName: 'Dr. Laila Mansour',
    specialty: 'Pediatrics',
    tagline: 'Gentle, Expert Healthcare for Your Little Ones.',
    bio: 'Dedicated pediatrician focused on child growth, immunizations, pediatric nutrition, and newborn care in a stress-free environment.',
    qualifications: [
      'MD in Pediatrics, Ain Shams University',
      'Member of the Royal College of Paediatrics (MRCPCH)',
      'Certified Pediatric Nutrition Specialist'
    ],
    rating: '4.9 / 5.0',
    reviewScore: '4.9/5',
    consultationFee: 450,
    address: '88 El-Merghany St, Heliopolis, Cairo',
    phone: '+20 112 987 6543 | Emergency: 123',
    secretaryPhone: '+20 112 333 4444',
    email: 'care@nourkidsclinic.com',
    portraitText: 'Dr.+Laila+Mansour',
    paymentMethods: ['Cash', 'InstaPay', 'Vodafone Cash'],
    clinicLocations: [
      { id: 1, name: 'Heliopolis Main Clinic', days: 'Sat, Mon, Wed', hours: '11:00 AM - 04:00 PM' },
      { id: 2, name: 'New Cairo Fifth Settlement', days: 'Sun, Tue, Thu', hours: '04:00 PM - 08:00 PM' }
    ],
    links: {
      facebook: 'facebook.com/drlailapediatrics',
      whatsapp: '01129876543',
      telegram: 't.me/nourkidsclinic'
    },
    reviews: [
      '"My kids actually love visiting Dr. Laila! She is so patient and reassuring with parents."',
      '"The digital turn tracker lets us wait comfortably until our turn approaches."'
    ],
    tips: [
      'Keep your child\'s vaccination schedule up to date to build strong lifelong immunity.',
      'Limit screen time before bedtime to help children achieve deep, restorative growth sleep.',
      'Include fresh fruits and iron-rich vegetables in every school lunchbox.'
    ]
  }
];

const AVAILABLE_SPECIALTIES = [
  'Internal Medicine',
  'Cardiology',
  'Pediatrics',
  'Dermatology',
  'Orthopedics',
  'Ophthalmology',
  'Dentistry',
  'Neurology'
];

// ==========================================
// 1. SASS AUTHENTICATION & ONBOARDING MODAL
// ("عيادتي حالاً" - Doctor First, then Receptionist, then Patients)
// ==========================================
interface SaasAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterDoctor: (newTenant: Tenant) => void;
  onRegisterReceptionist: () => void;
  onSelectPatientView: () => void;
  initialTab?: 'doctor' | 'receptionist' | 'patient';
}

const SaasAuthModal: React.FC<SaasAuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onRegisterDoctor, 
  onRegisterReceptionist, 
  onSelectPatientView,
  initialTab = 'doctor'
}) => {
  const [tab, setTab] = useState<'doctor' | 'receptionist' | 'patient'>(initialTab);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialTab) {
      setTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // 1. Doctor Signup Form State (Made First)
  const [docForm, setDocForm] = useState({
    doctorName: '',
    specialty: 'Internal Medicine',
    clinicAddress: '',
    clinicPhone: '',
    secretaryPhone: '',
    qualifications: '',
    consultationFee: 500,
    portraitUrl: ''
  });

  // 2. Receptionist Signup Form State
  const [recForm, setRecForm] = useState({
    secretaryName: '',
    doctorName: '',
    clinicPhone: '',
    additionalQualifications: '',
    consultationFee: 500,
    paymentMethods: 'Cash, Vodafone Cash'
  });

  if (!isOpen) return null;

  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = docForm.doctorName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newTenant: Tenant = {
      id: slug || `doc-${Date.now()}`,
      slug: slug || `doc-${Date.now()}`,
      clinicName: `${docForm.doctorName}'s Clinic`,
      doctorName: docForm.doctorName,
      specialty: docForm.specialty,
      tagline: `Professional ${docForm.specialty} Care by ${docForm.doctorName}`,
      bio: `Experienced specialist in ${docForm.specialty} committed to advanced clinical treatments and compassionate care.`,
      qualifications: docForm.qualifications ? docForm.qualifications.split(',').map((s: string) => s.trim()) : ['MD Specialist', 'Board Certified'],
      rating: '5.0 / 5.0',
      reviewScore: '5.0/5',
      consultationFee: Number(docForm.consultationFee) || 500,
      address: docForm.clinicAddress || 'Main Medical Center, Cairo',
      phone: docForm.clinicPhone || '+20 100 000 0000',
      secretaryPhone: docForm.secretaryPhone || '+20 100 111 2222',
      email: `${slug}@careclinic.com`,
      portraitText: encodeURIComponent(docForm.doctorName),
      paymentMethods: ['Cash', 'Vodafone Cash'],
      clinicLocations: [
        { id: 1, name: `${docForm.specialty} Main Branch`, days: 'Sun, Tue, Thu', hours: '10:00 AM - 04:00 PM' }
      ],
      links: { facebook: 'facebook.com/clinic', whatsapp: docForm.clinicPhone, telegram: 't.me/clinic' },
      reviews: ['"Outstanding clinic organization and precise doctor consultation."'],
      tips: ['Maintain regular checkups and follow prescribed dosages carefully.']
    };

    onRegisterDoctor(newTenant);
    setSuccessMsg(`Doctor profile for ${docForm.doctorName} registered successfully! Clinic SaaS instance active.`);
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 2000);
  };

  const handleReceptionistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(`Secretary account linked to ${recForm.doctorName} successfully! Opening reception desk.`);
    setTimeout(() => {
      setSuccessMsg(null);
      onRegisterReceptionist();
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-sky-950/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-sky-100 my-8">
        
        {/* Header with Logo */}
        <div className="bg-gradient-to-r from-sky-500 to-sky-600 text-white p-6 text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white p-2 cursor-pointer">
            <X size={24} />
          </button>
          
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center overflow-hidden border border-sky-200">
              <img src={SAAS_LOGO_URL} alt="عيادتي حالاً Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">عيادتي حالا — بوابة العيادات</h2>
          <p className="text-white/80 text-xs mt-1">Multi-Tenant Medical Clinic Engine & Doctor Management</p>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div className="bg-sky-500 text-white p-4 text-center text-sm font-semibold flex items-center justify-center gap-2 animate-pulse">
            <Check size={18} /> {successMsg}
          </div>
        )}

        {/* Role Tab Switcher (1. Doctor made first, 2. Receptionist, 3. Patient) */}
        <div className="grid grid-cols-3 bg-sky-50/70 p-1.5 gap-1 border-b border-sky-100 text-center text-xs font-bold">
          <button
            onClick={() => setTab('doctor')}
            className={`py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'doctor' ? 'bg-sky-600 text-white shadow-sm' : 'text-sky-800 hover:bg-sky-100/60'
            }`}
          >
            <Stethoscope size={15} /> 1. Doctor (أنت طبيب)
          </button>
          <button
            onClick={() => setTab('receptionist')}
            className={`py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'receptionist' ? 'bg-sky-500 text-white shadow-sm' : 'text-sky-800 hover:bg-sky-100/60'
            }`}
          >
            <Users size={15} /> 2. Receptionist (سكرتير)
          </button>
          <button
            onClick={() => setTab('patient')}
            className={`py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'patient' ? 'bg-sky-400 text-white shadow-sm' : 'text-sky-800 hover:bg-sky-100/60'
            }`}
          >
            <User size={15} /> 3. Patient (مريض)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          
          {/* 1. DOCTOR SIGN UP (Made First) */}
          {tab === 'doctor' && (
            <form onSubmit={handleDoctorSubmit} className="space-y-4">
              <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl text-xs text-sky-900">
                💡 <strong>Doctor Onboarding:</strong> Register your medical specialty and clinic details to instantly spin up your dedicated web app instance.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Doctor Full Name (اسم الطبيب) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., د. أحمد الشريف"
                    value={docForm.doctorName}
                    onChange={e => setDocForm({...docForm, doctorName: e.target.value})}
                    className="w-full p-2.5 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Specialty (التخصص) *</label>
                  <select
                    value={docForm.specialty}
                    onChange={e => setDocForm({...docForm, specialty: e.target.value})}
                    className="w-full p-2.5 border rounded-lg text-sm bg-white"
                  >
                    {AVAILABLE_SPECIALTIES.map(sp => (
                      <option key={sp} value={sp}>{sp}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Clinic Address (عنوان العيادة) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 12 شارع التحرير، الدقي"
                    value={docForm.clinicAddress}
                    onChange={e => setDocForm({...docForm, clinicAddress: e.target.value})}
                    className="w-full p-2.5 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Clinic Phone (رقم التليفون للعيادة) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g., 01012345678"
                    value={docForm.clinicPhone}
                    onChange={e => setDocForm({...docForm, clinicPhone: e.target.value})}
                    className="w-full p-2.5 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Secretary Phone (رقم تليفون السكرتير)</label>
                  <input
                    type="tel"
                    placeholder="e.g., 01198765432"
                    value={docForm.secretaryPhone}
                    onChange={e => setDocForm({...docForm, secretaryPhone: e.target.value})}
                    className="w-full p-2.5 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Consultation Fee (قيمة الكشف - EGP)</label>
                  <input
                    type="number"
                    value={docForm.consultationFee}
                    onChange={e => setDocForm({...docForm, consultationFee: Number(e.target.value) || 0})}
                    className="w-full p-2.5 border rounded-lg text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Credentials & Qualifications (مؤهلات الاعتماد)</label>
                  <input
                    type="text"
                    placeholder="e.g., دكتوراه الكبد والجهاز الهضمي، جامعة قصر العيني، استشاري باطنة"
                    value={docForm.qualifications}
                    onChange={e => setDocForm({...docForm, qualifications: e.target.value})}
                    className="w-full p-2.5 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-sm shadow-md shadow-sky-500/20 transition-all mt-4 cursor-pointer"
              >
                Create Doctor Clinic App (تسجيل العيادة)
              </button>
            </form>
          )}

          {/* 2. RECEPTIONIST SIGN UP ("For those to be around") */}
          {tab === 'receptionist' && (
            <form onSubmit={handleReceptionistSubmit} className="space-y-4">
              <div className="bg-sky-50 border border-sky-200 p-3 rounded-xl text-xs text-sky-900 flex items-center gap-3">
                <ImageIcon size={28} className="shrink-0 text-sky-500" />
                <span><strong>Reception Desk Setup:</strong> Link your secretary account to a specific doctor and configure clinic payment options.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Secretary Name (اسم السكرتير/ة)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., مريم أحمد"
                    value={recForm.secretaryName}
                    onChange={e => setRecForm({...recForm, secretaryName: e.target.value})}
                    className="w-full p-2.5 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Affiliated Doctor (سكرتير لدى دكتور) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., د. أحمد الشريف"
                    value={recForm.doctorName}
                    onChange={e => setRecForm({...recForm, doctorName: e.target.value})}
                    className="w-full p-2.5 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Clinic Phone (رقم تلفون العيادة)</label>
                  <input
                    type="tel"
                    required
                    placeholder="01000000000"
                    value={recForm.clinicPhone}
                    onChange={e => setRecForm({...recForm, clinicPhone: e.target.value})}
                    className="w-full p-2.5 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Consultation Fee (قيمة الكشف)</label>
                  <input
                    type="number"
                    value={recForm.consultationFee}
                    onChange={e => setRecForm({...recForm, consultationFee: Number(e.target.value) || 0})}
                    className="w-full p-2.5 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Available Payment Methods (وسائل الدفع المتاحة)</label>
                  <input
                    type="text"
                    placeholder="Cash, Vodafone Cash, InstaPay"
                    value={recForm.paymentMethods}
                    onChange={e => setRecForm({...recForm, paymentMethods: e.target.value})}
                    className="w-full p-2.5 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Additional Doctor Qualifications (مؤهلات إضافية)</label>
                  <input
                    type="text"
                    placeholder="Fellowship of London"
                    value={recForm.additionalQualifications}
                    onChange={e => setRecForm({...recForm, additionalQualifications: e.target.value})}
                    className="w-full p-2.5 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-sm shadow-md shadow-sky-500/20 transition-all mt-4 cursor-pointer"
              >
                Access Reception Desk Portal
              </button>
            </form>
          )}

          {/* 3. PATIENTS SIGN UP (+4 Specialty & Doctor Discovery) */}
          {tab === 'patient' && (
            <div className="space-y-6 text-center py-4">
              <div className="w-20 h-20 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner border border-sky-100">
                <Users size={36} />
              </div>
              <h3 className="text-xl font-bold text-sky-950">Patient Discovery & Booking</h3>
              <p className="text-gray-600 text-sm max-w-md mx-auto">
                Patients can browse medical specialties, inspect available doctors, view clinic locations and schedules, and book instantly.
              </p>

              <button
                onClick={() => {
                  onClose();
                  onSelectPatientView();
                }}
                className="px-8 py-3.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-sm shadow-md shadow-sky-500/20 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                Browse Specialties & Doctors <ArrowRight size={16} />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. GLOBAL LANDING PAGE PORTAL
// ==========================================
interface LandingPortalProps {
  onSelectPortal: (portal: string) => void;
  tenant: Tenant;
  onOpenSaasModal: (tab?: 'doctor' | 'receptionist' | 'patient') => void;
}

const LandingPortal: React.FC<LandingPortalProps> = ({ onSelectPortal, tenant, onOpenSaasModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalRole, setLoginModalRole] = useState<string | null>(null);

  // Fix: Use useEffect for handling the modal timeout and portal navigation safely
  useEffect(() => {
    if (!loginModalRole) return;
    const timer = setTimeout(() => {
      onSelectPortal(loginModalRole.toLowerCase());
      setLoginModalRole(null);
    }, 1200);
    return () => clearTimeout(timer);
  }, [loginModalRole, onSelectPortal]);

  const handleLoginClick = (role: string) => {
    setLoginModalRole(role);
  };

  return (
    <div className="font-sans antialiased text-sky-950 bg-white selection:bg-sky-200 selection:text-sky-900 min-h-screen">

      {/* Navigation Bar */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-sky-100 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div 
              className="flex-shrink-0 flex items-center gap-3 cursor-pointer" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-12 h-12 rounded-2xl bg-white p-1.5 shadow border border-sky-100 flex items-center justify-center overflow-hidden">
                <img src={SAAS_LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-bold text-xl sm:text-2xl tracking-tight text-sky-950 block leading-none">{tenant.clinicName}</span>
                <span className="text-xs text-sky-600 font-medium">عيادتي حالا • منصة العيادات الرقمية</span>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#doctor-profile" className="text-sky-800 hover:text-sky-600 font-medium transition-colors">Our Specialist</a>
              <a href="#clinic-info" className="text-sky-800 hover:text-sky-600 font-medium transition-colors">Information</a>
              <button
                onClick={() => onOpenSaasModal('doctor')}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20 transition-all cursor-pointer"
              >
                <Layers size={14} />
                <span>Sign Up / Sign In</span>
              </button>
              <a href="#login-hub" className="bg-white text-sky-800 hover:bg-sky-50 border border-sky-200 px-6 py-2.5 rounded-full font-semibold transition-all shadow-sm">
                Login Hub
              </a>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-sky-900 p-2">
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-sky-100 px-4 py-4 space-y-3 text-center shadow-lg">
            <a href="#doctor-profile" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sky-900 font-medium">Our Specialist</a>
            <a href="#clinic-info" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sky-900 font-medium">Information</a>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenSaasModal('doctor'); }}
              className="w-full py-2.5 bg-sky-500 text-white rounded-lg font-bold text-xs"
            >
              <span>Sign Up / Sign In</span>
            </button>
            <a href="#login-hub" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 bg-sky-50 text-sky-800 rounded-lg font-medium border border-sky-200">Login Hub</a>
          </div>
        )}
      </nav>


      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-to-b from-[#F0F8FF] via-[#E8F4FC] to-white text-sky-950 border-b border-sky-100 overflow-hidden relative">
        {/* Soft Ambient Light Blue Background Elements */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-100/60 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="z-10 text-center lg:text-left">
              <span className="inline-block py-1.5 px-4 rounded-full bg-white text-sky-700 border border-sky-200 text-xs font-bold tracking-wider mb-6 shadow-sm">
                منظومة العيادات الرقمية • عيادتي حالا
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-sky-950 leading-tight mb-6">
                عيادتي حالا — الرعاية الطبية الرقمية المتكاملة
              </h1>
              <p className="text-lg sm:text-xl text-sky-800/80 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                منصة افتراضية حديثة تجمع نخبة من الأطباء والاستشاريين المعتمدين، وتوفر نظاماً ذكياً لإدارة عيادات الأطباء، ومكاتب الاستقبال، وحجز المواعيد وتتبع أدوار الكشف للمرضى.
              </p>

              {/* Display Signup as Doctor, Receptionist, or Patient */}
              <div className="bg-white/80 backdrop-blur-md p-5 sm:p-6 rounded-3xl border border-sky-200 shadow-[0_15px_35px_rgba(14,165,233,0.08)] mb-6">
                <p className="text-xs uppercase tracking-wider text-sky-800 font-bold mb-3 text-center lg:text-left flex items-center justify-center lg:justify-start gap-2">
                  <Sparkles size={14} className="text-sky-500" />
                  <span>انضم إلينا الآن — اختر نوع الحساب (Sign Up):</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => onOpenSaasModal('doctor')}
                    className="p-3.5 bg-white text-sky-950 hover:bg-sky-50 rounded-2xl font-bold text-xs shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-1.5 border border-sky-200 hover:border-sky-400 hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-sm">
                      <Stethoscope size={18} />
                    </div>
                    <span className="font-bold text-xs text-sky-950">Sign Up as Doctor</span>
                    <span className="text-[10px] text-sky-600 font-semibold">تسجيل طبيب جديد</span>
                  </button>

                  <button
                    onClick={() => onOpenSaasModal('receptionist')}
                    className="p-3.5 bg-white text-sky-950 hover:bg-sky-50 rounded-2xl font-bold text-xs shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-1.5 border border-sky-200 hover:border-sky-400 hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-sky-400 text-white flex items-center justify-center shadow-sm">
                      <Monitor size={18} />
                    </div>
                    <span className="font-bold text-xs text-sky-950">Sign Up as Reception</span>
                    <span className="text-[10px] text-sky-600 font-semibold">تسجيل سكرتارية عيادة</span>
                  </button>

                  <button
                    onClick={() => onOpenSaasModal('patient')}
                    className="p-3.5 bg-white text-sky-950 hover:bg-sky-50 rounded-2xl font-bold text-xs shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center gap-1.5 border border-sky-200 hover:border-sky-400 hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-sky-600 text-white flex items-center justify-center shadow-sm">
                      <User size={18} />
                    </div>
                    <span className="font-bold text-xs text-sky-950">Sign Up as Patient</span>
                    <span className="text-[10px] text-sky-600 font-semibold">حجز كشف لمريض</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <a href="#login-hub" className="bg-sky-500 hover:bg-sky-600 text-white px-7 py-3.5 rounded-full font-bold text-sm shadow-md shadow-sky-500/25 transition-all inline-flex items-center gap-2">
                  <span>Login Hub</span> <ArrowRight size={16} />
                </a>
                <a href="#doctor-profile" className="border-2 border-sky-200 bg-white hover:bg-sky-50 text-sky-800 px-7 py-3.5 rounded-full font-bold text-sm shadow-sm transition-all">
                  Our Specialists
                </a>
              </div>
            </div>
            
            {/* Hero Visual Card displaying the specified logo */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="absolute inset-0 bg-sky-300/30 rounded-full blur-3xl transform scale-95 pointer-events-none"></div>
              
              <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-sky-100 overflow-hidden flex flex-col items-center text-center">
                <div className="w-full bg-gradient-to-b from-sky-50 to-white rounded-2xl p-6 border border-sky-100 mb-4 flex items-center justify-center min-h-[260px]">
                  <img 
                    src="https://i.postimg.cc/HkFdgvmz/Screenshot-2026-11-05-062500.png" 
                    alt="عيادتي حالا Logo" 
                    className="max-h-56 max-w-full object-contain rounded-xl drop-shadow-sm" 
                  />
                </div>

                <div className="w-full text-left bg-sky-50/60 p-4 rounded-2xl border border-sky-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                      <Shield size={16} className="text-sky-600" /> Virtual Health Network
                    </span>
                    <span className="text-[11px] bg-sky-100 text-sky-800 font-bold px-2.5 py-0.5 rounded-full border border-sky-200">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-sky-800/80 leading-relaxed">
                    منصة افتراضية سريعة وموثوقة لربط الأطباء بالمرضى، وإدارة الاستشارات والمواعيد بأحدث التقنيات.
                  </p>
                </div>

                {/* Stable Consultation / Access badge */}
                <div className="mt-4 w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white p-3.5 rounded-2xl shadow-sm border border-sky-400/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">
                      <Star size={18} className="fill-white text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-[11px] text-white/80 font-medium">الاستشارات & الكشوفات</p>
                      <p className="font-bold text-sm text-white">حجز إلكتروني فوري</p>
                    </div>
                  </div>
                  <span className="text-xs bg-white text-sky-700 font-bold px-3 py-1.5 rounded-xl shadow-xs">
                    متاح 24/7
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Doctor Profile Section */}
      <section id="doctor-profile" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-sky-950 mb-4">Our Specialist</h2>
            <div className="w-24 h-1 bg-sky-400 mx-auto rounded-full mb-3"></div>
            <p className="text-sky-800/80 text-sm max-w-xl mx-auto">
              نخبة من الاستشاريين والأطباء المعتمدين ذوي الكفاءة العالية لتقديم أفضل رعاية طبية متكاملة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-sky-150 p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-sky-300 transition-all">
              <div className="w-14 h-14 bg-sky-500 rounded-xl flex items-center justify-center text-white mb-6 shadow-sm">
                <Shield size={28} />
              </div>
              <h3 className="text-2xl font-bold text-sky-950 mb-2">Verified Doctor Quality</h3>
              <p className="text-xs font-bold text-sky-600 mb-4">معايير دقيقة لاعتماد الأطباء والاستشاريين</p>
              <p className="text-sky-800/80 mb-6 leading-relaxed text-sm">
                يتم فحص وتدقيق كافة الأطباء والاستشاريين المسجلين في منصة <strong>عيادتي حالا</strong> بعناية فائقة لضمان حصولك على أعلى مستويات التشخيص والعلاج الموثوق.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-medium text-sky-900">
                  <CheckCircle2 className="text-sky-500 shrink-0" size={18} /> أطباء واستشاريون معتمدون ومرخصون من نقابة الأطباء
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-sky-900">
                  <CheckCircle2 className="text-sky-500 shrink-0" size={18} /> شهادات عليا وزمالات طبية دولية ومحلية معترف بها
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-sky-900">
                  <CheckCircle2 className="text-sky-500 shrink-0" size={18} /> تقييم مستمر للجودة والرضا الطبي من واقع كشوفات المرضى
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-sky-900">
                  <CheckCircle2 className="text-sky-500 shrink-0" size={18} /> تغطية شاملة لكافة التخصصات الطبية بأحدث المعايير
                </li>
              </ul>
            </div>

            <div className="bg-white border border-sky-150 p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-sky-300 transition-all">
              <div className="w-14 h-14 bg-sky-400 rounded-xl flex items-center justify-center text-white mb-6 shadow-sm">
                <MessageCircle size={28} />
              </div>
              <h3 className="text-2xl font-bold text-sky-950 mb-4">Patient Reviews</h3>
              <div className="flex items-center gap-1.5 mb-4 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className="fill-amber-400 text-amber-400" />
                ))}
                <span className="text-sky-950 font-bold ml-2 text-lg">{tenant.reviewScore}</span>
              </div>
              <div className="space-y-4">
                {tenant.reviews.map((rev: string, idx: number) => (
                  <div key={idx} className="bg-sky-50/60 p-4 rounded-xl italic text-sky-900 text-sm border-l-4 border-sky-400">
                    {rev}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-sky-500 to-sky-600 text-white p-8 rounded-2xl shadow-md flex flex-col">
              <div className="w-14 h-14 bg-white text-sky-600 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <FileText size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Doctor's Daily Tips</h3>
              <div className="space-y-4 flex-grow">
                <div className="flex items-start gap-3">
                  <Droplet className="mt-1 text-sky-200 shrink-0" size={18} />
                  <p className="text-sm text-white/95">{tenant.tips[0]}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="mt-1 text-sky-200 shrink-0" size={18} />
                  <p className="text-sm text-white/95">{tenant.tips[1]}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Moon className="mt-1 text-sky-200 shrink-0" size={18} />
                  <p className="text-sm text-white/95">{tenant.tips[2]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinic Information Section */}
      <section id="clinic-info" className="py-24 bg-[#F0F9FF] text-sky-950 border-t border-sky-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-white text-sky-700 border border-sky-200 text-xs font-semibold tracking-wider mb-3 shadow-xs">
              100% VIRTUAL HEALTH PLATFORM
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-sky-950 mb-3">عيادتي حالا — المنصة الافتراضية والدفع</h2>
            <div className="w-24 h-1 bg-sky-400 mx-auto rounded-full mb-4"></div>
            <p className="text-sky-800/80 max-w-2xl mx-auto text-sm">
              نظام رعاية وعيادات رقمي متكامل — تواصل مباشر عبر البريد الإلكتروني مع دعم شامل لكافة وسائل الدفع المعتمدة.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            {/* Left Column: Virtual Platform Contact */}
            <div className="bg-white rounded-3xl p-8 border border-sky-200 shadow-md flex flex-col justify-between text-sky-950">
              <div>
                <div className="w-14 h-14 bg-sky-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <Mail size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-sky-950">Virtual Platform Contact</h3>
                <p className="text-sky-700 text-xs mb-6">تواصل رقمي مباشر لخدمة المرضى والأطباء والعيادات المسجلة</p>

                <div className="space-y-4">
                  <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100">
                    <span className="text-xs text-sky-600 block mb-1">البريد الإلكتروني الرسمي (Official Email)</span>
                    <a href="mailto:contact@ayadatihala.com" className="text-lg font-bold text-sky-900 hover:text-sky-600 transition-colors flex items-center gap-2">
                      <Mail size={18} className="text-sky-500" /> contact@ayadatihala.com
                    </a>
                  </div>

                  <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100">
                    <span className="text-xs text-sky-600 block mb-1">خدمة المساعدين والاستفسارات (Secretary Hotline)</span>
                    <p className="text-base font-bold text-sky-900 flex items-center gap-2">
                      <Phone size={18} className="text-sky-600" /> {tenant.secretaryPhone || '+20 100 123 4567'}
                    </p>
                  </div>

                  <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-150">
                    <span className="text-xs text-sky-700 font-bold block mb-1">نظام عمل افتراضي (Virtual Operation)</span>
                    <p className="text-xs text-sky-800 leading-relaxed">
                      نحن موقع ومنظومة افتراضية تتيح تنسيق المواعيد وتنظيم الحجز والدور إلكترونياً مع الأطباء المسجلين على مستوى الجمهورية دون الحاجة إلى مقر مادي ثابت.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Supported Payment Methods */}
            <div className="bg-white rounded-3xl p-8 border border-sky-200 shadow-md flex flex-col justify-between text-sky-950">
              <div>
                <div className="w-14 h-14 bg-sky-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <CreditCard size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-sky-950">Supported Payment Methods</h3>
                <p className="text-sky-700 text-xs mb-6">وسائل الدفع المدعومة والمعتمدة في المنصة</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                      VF
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-sky-950">Vodafone Cash</h4>
                      <p className="text-[11px] text-sky-600">فودافون كاش ومحافظ المحمول</p>
                    </div>
                  </div>

                  <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                      IP
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-sky-950">InstaPay</h4>
                      <p className="text-[11px] text-sky-600">تحويل لحظي انستاباي</p>
                    </div>
                  </div>

                  <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                      💳
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-sky-950">Credit / Debit Cards</h4>
                      <p className="text-[11px] text-sky-600">فيزا وماستركارد وميزة</p>
                    </div>
                  </div>

                  <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                      💵
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-sky-950">Cash at Clinic</h4>
                      <p className="text-[11px] text-sky-600">الدفع نقداً عند تأكيد الحضور</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-sky-50/70 rounded-2xl border border-sky-150 text-xs text-sky-800 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-sky-600 shrink-0" />
                  <span>فواتير إلكترونية معتمدة وإشعارات فورية عبر البريد والواتساب فور السداد.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login Hub Section */}
      <section id="login-hub" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-sky-950 mb-4">Central Login Hub</h2>
            <div className="w-24 h-1 bg-sky-400 mx-auto rounded-full mb-6"></div>
            <p className="text-sky-800/80 max-w-2xl mx-auto">Select your portal entry point below to securely access your personalized dashboard.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
            <button onClick={() => handleLoginClick('Patient')} className="group relative bg-white border-2 border-sky-100 hover:border-sky-400 rounded-3xl p-10 text-center shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center cursor-pointer">
              <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center text-sky-600 mb-6 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                <User size={32} />
              </div>
              <h3 className="text-2xl font-bold text-sky-950 mb-3">Patient Portal</h3>
              <p className="text-sky-700/80 text-sm mb-8">Book appointments, view records, and message your doctor securely.</p>
              <div className="mt-auto inline-flex items-center gap-2 text-sky-600 font-bold group-hover:text-sky-700">
                Login as Patient <ArrowRight size={18} />
              </div>
            </button>

            <button onClick={() => handleLoginClick('Doctor')} className="group relative bg-white border-2 border-sky-300 hover:border-sky-500 rounded-3xl p-10 text-center shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col items-center cursor-pointer">
              <div className="w-20 h-20 bg-sky-500 rounded-full flex items-center justify-center text-white mb-6 group-hover:bg-sky-600 transition-colors shadow-sm">
                <Stethoscope size={32} />
              </div>
              <h3 className="text-2xl font-bold text-sky-950 mb-3">Doctor Portal</h3>
              <p className="text-sky-700/80 text-sm mb-8">Manage patient files, schedules, and clinical notes in one place.</p>
              <div className="mt-auto inline-flex items-center gap-2 text-sky-600 font-bold group-hover:text-sky-700">
                Login as Doctor <ArrowRight size={18} />
              </div>
            </button>

            <button onClick={() => handleLoginClick('Reception')} className="group relative bg-white border-2 border-sky-100 hover:border-sky-400 rounded-3xl p-10 text-center shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center cursor-pointer">
              <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center text-sky-500 mb-6 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                <Monitor size={32} />
              </div>
              <h3 className="text-2xl font-bold text-sky-950 mb-3">Reception Desk</h3>
              <p className="text-sky-700/80 text-sm mb-8">Handle scheduling, billing, and front desk patient management.</p>
              <div className="mt-auto inline-flex items-center gap-2 text-sky-600 font-bold group-hover:text-sky-700">
                Login as Reception <ArrowRight size={18} />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sky-50 border-t border-sky-100 text-sky-700 py-8 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} عيادتي حالاً — {tenant.clinicName}. All rights reserved.</p>
        </div>
      </footer>

      {loginModalRole && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-sky-950/40 backdrop-blur-sm">
          <div className="bg-white text-sky-950 p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 text-center border border-sky-100">
            <Shield className="text-sky-500 mx-auto mb-4" size={36} />
            <h3 className="text-2xl font-bold mb-2">Authentication</h3>
            <p className="text-sky-700 mb-6">Redirecting to the <span className="font-bold">{loginModalRole}</span> portal...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
};


// ==========================================
// 3. PATIENT SPECIALTY & DOCTOR DISCOVERY VIEW
// (Step 3: اختيار التخصص -> عرض الدكاترة -> اختيار دكتور -> نافذة الحجز ومواعيد وأماكن العيادات)
// ==========================================
interface PatientDirectoryViewProps {
  tenants: Tenant[];
  onSelectTenant: (tenant: Tenant) => void;
  onBackToHome: () => void;
}

const PatientDirectoryView: React.FC<PatientDirectoryViewProps> = ({ tenants, onSelectTenant, onBackToHome }) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [activeDoctorModal, setActiveDoctorModal] = useState<Tenant | null>(null);
  const [patientBookingForm, setPatientBookingForm] = useState({ name: '', phone: '', date: '2026-11-15' });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const filteredTenants = selectedSpecialty === 'All' 
    ? tenants 
    : tenants.filter((t: Tenant) => t.specialty.toLowerCase() === selectedSpecialty.toLowerCase());

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
      setActiveDoctorModal(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#F0F8FF] py-10 px-4 font-sans text-sky-950">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBackToHome} className="inline-flex items-center gap-2 text-sm font-bold text-sky-800 hover:text-sky-600 transition cursor-pointer">
            <ArrowLeft size={18} /> Back to Home
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white p-1 shadow-sm border border-sky-100 flex items-center justify-center">
              <img src={SAAS_LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-xl font-bold text-sky-950">عيادتي حالاً — Patient Discovery</h1>
          </div>
        </div>

        {/* 1. Specialty Selector (اختيار التخصص) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sky-100 mb-8">
          <h2 className="text-lg font-bold text-sky-950 mb-4 flex items-center gap-2">
            <Search size={20} className="text-sky-500" /> اختر التخصص الطبي (Select Specialty)
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSpecialty('All')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedSpecialty === 'All' ? 'bg-sky-500 text-white shadow-sm' : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
              }`}
            >
              All Specialties (الكل)
            </button>
            {AVAILABLE_SPECIALTIES.map(sp => (
              <button
                key={sp}
                onClick={() => setSelectedSpecialty(sp)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedSpecialty === sp ? 'bg-sky-500 text-white shadow-sm' : 'bg-white text-sky-800 hover:bg-sky-50 border border-sky-200'
                }`}
              >
                {sp}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Display Doctors in Specialty (يعرض الدكاترة اللي موجودين فيه) */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-sky-950 mb-4">
            Available Doctors ({filteredTenants.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTenants.map((doc: Tenant) => (
              <div key={doc.id} className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-sky-300 transition-all">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={`https://placehold.co/100x100/0284c7/FFFFFF?text=${doc.doctorName.replace('Dr. ', '')}`} 
                      alt={doc.doctorName} 
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-400 shadow-sm" 
                    />
                    <div>
                      <h4 className="font-bold text-lg text-sky-950">{doc.doctorName}</h4>
                      <span className="text-xs bg-sky-50 text-sky-700 font-semibold px-2.5 py-0.5 rounded-full border border-sky-200">
                        {doc.specialty}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-sky-900/70 mb-4 line-clamp-2 leading-relaxed">{doc.bio}</p>
                  <div className="space-y-1.5 text-xs text-sky-800/80">
                    <p className="flex items-center gap-1.5"><MapPin size={14} className="text-sky-500" /> {doc.address}</p>
                    <p className="flex items-center gap-1.5"><DollarSign size={14} className="text-sky-500" /> Consultation Fee: <strong className="text-sky-950">{doc.consultationFee} EGP</strong></p>
                  </div>
                </div>

                <div className="p-4 bg-sky-50/50 border-t border-sky-100 flex gap-2">
                  <button
                    onClick={() => {
                      onSelectTenant(doc);
                    }}
                    className="w-1/2 py-2.5 bg-white hover:bg-sky-50 text-sky-800 border border-sky-200 rounded-xl text-xs font-bold transition-colors shadow-sm"
                  >
                    Visit Clinic App
                  </button>
                  <button
                    onClick={() => setActiveDoctorModal(doc)}
                    className="w-1/2 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                  >
                    حجز موعد (Book)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Doctor Booking & Clinic Locations Modal (نافذة الحجز ومواعيد وأماكن العيادات) */}
        {activeDoctorModal && (
          <div className="fixed inset-0 z-50 bg-sky-950/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-sky-200">
              <div className="bg-gradient-to-r from-sky-500 to-sky-600 text-white p-6 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-xl">{activeDoctorModal.doctorName}</h3>
                  <p className="text-xs text-sky-100">{activeDoctorModal.specialty} • {activeDoctorModal.clinicName}</p>
                </div>
                <button onClick={() => setActiveDoctorModal(null)} className="text-white/80 hover:text-white p-2">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                {bookingConfirmed ? (
                  <div className="bg-sky-50 border border-sky-200 p-6 rounded-2xl text-center space-y-3">
                    <CheckCircle size={48} className="text-sky-500 mx-auto" />
                    <h4 className="font-bold text-sky-950 text-lg">Appointment Booked Successfully!</h4>
                    <p className="text-xs text-sky-700">Your turn number has been issued. The clinic secretary will confirm via WhatsApp.</p>
                  </div>
                ) : (
                  <>
                    {/* Clinic Locations & Hours */}
                    <div>
                      <h4 className="font-bold text-sm text-sky-950 mb-3 flex items-center gap-2">
                        <MapPin size={16} className="text-sky-500" /> أماكن ومواعيد العيادات (Clinic Locations & Hours)
                      </h4>
                      <div className="space-y-2">
                        {activeDoctorModal.clinicLocations.map((loc: ClinicLocation) => (
                          <div key={loc.id} className="bg-sky-50/60 border border-sky-200 p-3 rounded-xl text-xs space-y-1">
                            <p className="font-bold text-sky-950">{loc.name}</p>
                            <p className="text-sky-700 flex items-center gap-1"><Calendar size={13} className="text-sky-500" /> {loc.days} ({loc.hours})</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Booking Form */}
                    <form onSubmit={handleBookAppointment} className="space-y-4 pt-4 border-t border-sky-100">
                      <h4 className="font-bold text-sm text-sky-950">حجز موعد جديد (New Booking)</h4>
                      <div>
                        <label className="block text-xs font-bold text-sky-800 mb-1">Patient Full Name (اسم المريض)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., محمود سعيد"
                          value={patientBookingForm.name}
                          onChange={e => setPatientBookingForm({...patientBookingForm, name: e.target.value})}
                          className="w-full p-2.5 border border-sky-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-sky-800 mb-1">Mobile Number (رقم المحمول)</label>
                        <input
                          type="tel"
                          required
                          placeholder="01000000000"
                          value={patientBookingForm.phone}
                          onChange={e => setPatientBookingForm({...patientBookingForm, phone: e.target.value})}
                          className="w-full p-2.5 border border-sky-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-sky-800 mb-1">Preferred Date (تاريخ الحجز)</label>
                        <input
                          type="date"
                          value={patientBookingForm.date}
                          onChange={e => setPatientBookingForm({...patientBookingForm, date: e.target.value})}
                          className="w-full p-2.5 border border-sky-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-400 outline-none"
                        />
                      </div>
                      <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs flex justify-between items-center text-sky-950">
                        <span>Consultation Fee:</span>
                        <strong className="text-sm font-bold text-sky-600">{activeDoctorModal.consultationFee} EGP</strong>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
                      >
                        Confirm Booking & Get Turn Number
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// ==========================================
// 4. PATIENT PORTAL
// ==========================================
interface PatientPortalProps {
  onBackToHome: () => void;
  tenant: Tenant;
  demoBypassAuth?: boolean;
  uiLang?: 'ar' | 'en';
}

const PatientPortal: React.FC<PatientPortalProps> = ({ onBackToHome, tenant, demoBypassAuth = false }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(demoBypassAuth);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [visitCompleted, setVisitCompleted] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  useEffect(() => {
    if (demoBypassAuth) {
      setIsLoggedIn(true);
    }
  }, [demoBypassAuth]);

  const colors = {
    primaryText: 'text-sky-950',
    primaryBg: 'bg-sky-950',
    accentText: 'text-sky-600',
    accentBg: 'bg-sky-500',
    accentBorder: 'border-sky-500',
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F0F8FF] via-[#E0F2FE] to-white flex flex-col items-center justify-center p-4 font-sans text-sky-950">
        <div className="max-w-md w-full mb-4">
          <button onClick={onBackToHome} className="inline-flex items-center gap-2 text-sm font-semibold text-sky-800 hover:text-sky-600">
            <ArrowLeft size={16} /> Back to Home
          </button>
        </div>
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-sky-100">
          <div className="bg-gradient-to-r from-sky-500 to-sky-600 p-8 text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <User size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-1">Patient Portal</h1>
            <p className="text-sky-100 text-xs font-medium">{tenant.clinicName} • {tenant.doctorName}</p>
          </div>
          <div className="p-8">
            <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-sky-900 mb-2">Patient ID / Number</label>
                <input type="text" required defaultValue="P-1004" className="w-full p-3 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none text-sky-950" />
              </div>
              <div>
                <label className="block text-sm font-bold text-sky-900 mb-2">Mobile Number</label>
                <input type="tel" required defaultValue="01012345678" className="w-full p-3 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-400 outline-none text-sky-950" />
              </div>
              <button type="submit" className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold shadow-md transition-all cursor-pointer">
                Access Portal
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F8FF] font-sans text-sky-950">
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-sky-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Activity className="text-sky-500" size={24} />
            <h1 className="text-xl font-bold text-sky-950">MedPortal</h1>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 text-sm text-sky-700 hover:text-sky-900 font-semibold cursor-pointer">
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </header>

      <div className="bg-white border-b border-sky-100">
        <div className="max-w-5xl mx-auto px-4 flex space-x-6">
          {['dashboard', 'post-consultation', 'support'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-bold text-sm capitalize cursor-pointer transition ${activeTab === tab ? 'border-sky-500 text-sky-600' : 'border-transparent text-sky-800/60 hover:text-sky-900'}`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex gap-4 items-start">
              <CheckCircle2 className="text-sky-500 shrink-0 mt-0.5" size={24} />
              <div>
                <h3 className="text-sky-950 font-bold mb-1">Arrival Instructions</h3>
                <p className="text-sky-800 text-sm">Please aim to arrive <strong>15 minutes early</strong> for your appointment.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm border border-sky-100">
                <h3 className="text-sm font-bold text-sky-700 mb-4 uppercase">Your Turn Number</h3>
                <div className="w-32 h-32 rounded-full border-4 border-sky-400 bg-sky-50 flex items-center justify-center mb-2 shadow-inner">
                  <span className="text-5xl font-extrabold text-sky-600">04</span>
                </div>
                <p className="text-sm text-sky-800 mt-2">Currently serving: <span className="font-bold text-sky-600">02</span></p>
              </div>

              <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-sky-100">
                <h2 className="text-lg font-bold mb-6 text-sky-950 flex items-center gap-2">
                  <Calendar size={20} className="text-sky-500" /> Upcoming Appointment ({tenant.doctorName})
                </h2>
                <div className="grid sm:grid-cols-2 gap-6 text-sm">
                  <div><p className="text-sky-700">Date:</p><p className="font-bold text-sky-950">Thursday, Nov 12, 2026</p></div>
                  <div><p className="text-sky-700">Time:</p><p className="font-bold text-sky-950">10:30 AM</p></div>
                  <div><p className="text-sky-700">Location:</p><p className="font-bold text-sky-950">{tenant.address}</p></div>
                  <div><p className="text-sky-700">Fee:</p><p className="font-bold text-sky-600">{tenant.consultationFee} EGP</p></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'post-consultation' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-sky-100 flex justify-between items-center">
              <span className="text-sm font-semibold text-sky-950">Demo: Toggle Visit Status</span>
              <button onClick={() => setVisitCompleted(!visitCompleted)} className={`px-4 py-2 rounded-full text-sm font-bold transition ${visitCompleted ? 'bg-sky-500 text-white' : 'bg-sky-50 text-sky-700 border border-sky-200'}`}>
                {visitCompleted ? 'Visit Completed' : 'Mark as Completed'}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-sky-100 space-y-4">
                <h3 className="font-bold text-sky-950">Medical Orders & Prescriptions</h3>
                <ul className="space-y-2 text-sm">
                  <li className="bg-sky-50 p-2.5 rounded-lg border border-sky-200 text-sky-900 font-medium">CBC & Lipid Panel</li>
                  <li className="bg-sky-50 p-2.5 rounded-lg border border-sky-200 text-sky-900 font-medium">Chest X-Ray</li>
                </ul>
              </div>

              <div className="relative bg-white p-6 rounded-2xl shadow-sm border border-sky-100 flex flex-col">
                <h3 className="font-bold text-sky-950 mb-4">Ratings & Notes</h3>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={24} 
                      onClick={() => setSelectedRating(star)} 
                      className={`cursor-pointer transition ${star <= selectedRating ? 'text-amber-400 fill-amber-400' : 'text-sky-200'}`} 
                    />
                  ))}
                </div>
                <div className="bg-sky-50/60 p-3 rounded-xl border border-sky-200 text-xs text-sky-900 mb-4 h-24">
                  Patient presented with stable vitals. Prescribed standard course. Follow-up in 2 weeks.
                </div>
                <button onClick={() => setRatingSubmitted(true)} className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-bold shadow-sm transition">
                  {ratingSubmitted ? 'Submitted!' : 'Submit Rating'}
                </button>

                {!visitCompleted && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] rounded-2xl flex flex-col items-center justify-center">
                    <Lock size={28} className="text-sky-400 mb-1" />
                    <span className="text-xs font-bold text-sky-900">Locked Until Visit Completed</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
            {[{q: 'How to reschedule?', a: 'Contact secretary at ' + tenant.secretaryPhone}, {q: 'Where are lab results?', a: 'Visible in Post-Consultation tab.'}].map((f, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border shadow-sm">
                <h4 className="font-bold text-sm mb-1">{f.q}</h4>
                <p className="text-xs text-gray-600">{f.a}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// ==========================================
// 5. RECEPTION DESK PORTAL
// ==========================================
export const INITIAL_RECEPTION_PATIENTS = [
  { id: 'P001', name: 'Ahmed Mahmoud', phone: '01012345678', address: 'Maadi, Cairo', time: '09:00 AM', status: 'waiting', turn: 1 },
  { id: 'P002', name: 'Fatma Ali', phone: '01198765432', address: 'Zamalek, Cairo', time: '09:30 AM', status: 'waiting', turn: 2 },
  { id: 'P003', name: 'Omar Hassan', phone: '01234567890', address: 'Mohandeseen, Giza', time: '10:00 AM', status: 'waiting', turn: 3 }
];

interface ReceptionPortalProps {
  onBackToHome: () => void;
  tenant: Tenant;
  demoBypassAuth?: boolean;
  onLocalSave?: () => void;
  uiLang?: 'ar' | 'en';
}

const ReceptionPortal: React.FC<ReceptionPortalProps> = ({ onBackToHome, tenant, demoBypassAuth = false, onLocalSave }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(demoBypassAuth);
  const [currentView, setCurrentView] = useState('queue');
  const queueStorageKey = `ayadati_reception_queue_${tenant.id}`;
  const [patients, setPatients] = useState<typeof INITIAL_RECEPTION_PATIENTS>(() => {
    try {
      const saved = localStorage.getItem(queueStorageKey);
      return saved ? JSON.parse(saved) : INITIAL_RECEPTION_PATIENTS;
    } catch {
      return INITIAL_RECEPTION_PATIENTS;
    }
  });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (demoBypassAuth) {
      setIsAuthenticated(true);
    }
  }, [demoBypassAuth]);

  const updatePatients = (updater: (prev: typeof INITIAL_RECEPTION_PATIENTS) => typeof INITIAL_RECEPTION_PATIENTS) => {
    setPatients(prev => {
      const next = updater(prev);
      try {
        localStorage.setItem(queueStorageKey, JSON.stringify(next));
        if (onLocalSave) onLocalSave();
      } catch {}
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F0F8FF] via-[#E0F2FE] to-white flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-t-4 border-sky-400 border border-sky-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-sky-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
              <Users size={30} />
            </div>
            <h1 className="text-xl font-bold text-sky-950">Receptionist Desk Portal</h1>
            <p className="text-sky-600 text-xs mt-1 font-semibold">{tenant.clinicName}</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); }} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-sky-800 mb-1">Username</label>
              <input type="text" defaultValue="secretary" className="w-full p-2.5 border border-sky-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 outline-none text-sky-950" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-sky-800 mb-1">Password</label>
              <input type="password" defaultValue="password" className="w-full p-2.5 border border-sky-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 outline-none text-sky-950" required />
            </div>
            <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl text-sm shadow-md transition-all cursor-pointer">
              Login to Reception
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F8FF] flex">
      <div className="w-64 bg-white border-r border-sky-100 flex flex-col hidden md:flex fixed h-full z-20">
        <div className="p-6 bg-gradient-to-r from-sky-500 to-sky-600 text-white">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            <Users size={22} className="text-white" />
          </div>
          <h2 className="font-bold text-lg">Reception Desk</h2>
          <p className="text-xs text-sky-100">{tenant.doctorName}</p>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-semibold">
            {tenant.clinicName}
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'queue', label: 'Queue & Turn Manager', icon: Calendar },
            { id: 'payments', label: `Payments & Invoices (${tenant.consultationFee} EGP)`, icon: CreditCard },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === item.id 
                  ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-sm' 
                  : 'text-sky-900/70 hover:bg-sky-50'
              }`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-sky-100">
          <button onClick={onBackToHome} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-sky-700 hover:bg-sky-50 rounded-xl transition cursor-pointer">
            <ArrowLeft size={16} /> Back to Website
          </button>
        </div>
      </div>

      <div className="flex-1 md:ml-64 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header Bar */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-sky-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-full bg-sky-500 animate-pulse"></span>
                <h1 className="text-xl font-bold text-sky-950">
                  {currentView === 'queue' ? 'Queue & Turn Management' : 'Clinic Financials & Payments'}
                </h1>
              </div>
              <p className="text-xs text-sky-700">
                Secretary Hotline: <strong className="text-sky-950">{tenant.secretaryPhone}</strong> | Location: {tenant.clinicLocations?.[0]?.name || tenant.address}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  const waiting = patients.find((p: any) => p.status === 'waiting');
                  if (waiting) {
                    updatePatients(prev => prev.map(p => p.id === waiting.id ? { ...p, status: 'in-consultation' } : p));
                    showToast(`Called Turn #${waiting.turn} (${waiting.name}) into Doctor's Office!`);
                  } else {
                    showToast("No more waiting patients in queue.");
                  }
                }} 
                className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Phone size={15} /> Call Next Patient
              </button>
            </div>
          </div>

          {/* VIEW 1: QUEUE MANAGER */}
          {currentView === 'queue' && (
            <div className="space-y-6">
              {/* Quick Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs text-sky-700 font-semibold block">Waiting Patients</span>
                    <span className="text-2xl font-bold text-sky-950">
                      {patients.filter((p: any) => p.status === 'waiting').length}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                    <Clock size={20} />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs text-sky-700 font-semibold block">In Examination</span>
                    <span className="text-2xl font-bold text-sky-600">
                      {patients.filter((p: any) => p.status === 'in-consultation').length}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                    <Activity size={20} />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs text-sky-700 font-semibold block">Consultation Fee</span>
                    <span className="text-2xl font-bold text-sky-600">
                      {tenant.consultationFee} EGP
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                    <DollarSign size={20} />
                  </div>
                </div>
              </div>

              {/* Waiting & Examination List */}
              <div className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-sky-950 text-sm">
                    Today's Patients List ({patients.length})
                  </h3>
                  <span className="text-xs text-sky-600 font-medium">Live Turn Flow</span>
                </div>

                <div className="space-y-3">
                  {patients.map((p: any) => (
                    <div 
                      key={p.id} 
                      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-xl gap-3 transition-all ${
                        p.status === 'in-consultation' 
                          ? 'bg-sky-50/70 border-sky-200 shadow-sm' 
                          : p.status === 'done'
                          ? 'bg-slate-50/60 border-slate-200 opacity-70'
                          : 'bg-white border-sky-100'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center text-sm shrink-0 shadow-sm ${
                          p.status === 'in-consultation'
                            ? 'bg-sky-500 text-white animate-pulse'
                            : p.status === 'done'
                            ? 'bg-sky-200 text-sky-800'
                            : 'bg-sky-100 text-sky-800'
                        }`}>
                          #{p.turn}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sky-950 text-sm">{p.name}</p>
                            {p.status === 'in-consultation' && (
                              <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
                                In Examination Room
                              </span>
                            )}
                            {p.status === 'done' && (
                              <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
                                Finished
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-sky-700/80">
                            {p.phone} • Scheduled: {p.time} • {p.address}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {p.status === 'waiting' && (
                          <button 
                            onClick={() => {
                              updatePatients(prev => prev.map(item => item.id === p.id ? { ...item, status: 'in-consultation' } : item));
                              showToast(`Sent ${p.name} to Doctor's Room`);
                            }} 
                            className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
                          >
                            Send In
                          </button>
                        )}
                        <button 
                          onClick={() => showToast(`Payment of ${tenant.consultationFee} EGP recorded for ${p.name}`)} 
                          className="px-3.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <CreditCard size={13} /> Collect {tenant.consultationFee} EGP
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: PAYMENTS & INVOICES */}
          {currentView === 'payments' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <span className="text-xs text-gray-500 font-semibold block mb-1">Total Revenue Today</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {patients.length * tenant.consultationFee} EGP
                  </span>
                  <span className="text-[11px] text-gray-400 block mt-1">Based on {patients.length} clinic visits</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <span className="text-xs text-gray-500 font-semibold block mb-1">E-Invoices Status</span>
                  <span className="text-sm font-bold text-blue-600 flex items-center gap-1 mt-1">
                    <CheckCircle2 size={16} /> 100% Synced (ETA)
                  </span>
                  <span className="text-[11px] text-gray-400 block mt-1">Tax Authority QR Ready</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <span className="text-xs text-gray-500 font-semibold block mb-1">Accepted Gateways</span>
                  <p className="text-xs font-bold text-gray-700 mt-1">
                    {tenant.paymentMethods.join(' • ')}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-800 text-sm mb-4">Patient Receipts & Invoices</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b text-gray-500 font-bold">
                        <th className="pb-3">Invoice #</th>
                        <th className="pb-3">Patient</th>
                        <th className="pb-3">Method</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {patients.map((p: any, i: number) => (
                        <tr key={p.id} className="py-2.5">
                          <td className="py-3 font-mono font-bold text-gray-700">INV-2026-0{i+1}</td>
                          <td className="py-3 font-semibold text-gray-800">{p.name}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                              {i % 2 === 0 ? 'Vodafone Cash' : 'Cash'}
                            </span>
                          </td>
                          <td className="py-3 font-bold text-emerald-700">{tenant.consultationFee} EGP</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              PAID
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button 
                              onClick={() => showToast(`Receipt printed for ${p.name} (Tax Reg: 489-210-994)`)}
                              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold text-[11px]"
                            >
                              Print E-Receipt
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {toastMsg && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl text-xs flex items-center gap-2 z-50 animate-bounce">
          <CheckCircle size={16} className="text-emerald-400" /> {toastMsg}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 6. WHATSAPP PATIENT ALERTS & MESSAGING CENTER
// ==========================================

export interface TodayAppointment {
  id: string;
  name: string;
  phone: string;
  time: string;
  dayKey?: string;
  dateLabel?: string;
}

export const WEEK_DAYS_STRIP = [
  { key: 'sat', labelAr: 'السبت', labelEn: 'Sat', dateLabel: '2026-11-07' },
  { key: 'sun', labelAr: 'الأحد', labelEn: 'Sun', dateLabel: '2026-11-08' },
  { key: 'mon', labelAr: 'الإثنين', labelEn: 'Mon', dateLabel: '2026-11-09' },
  { key: 'tue', labelAr: 'الثلاثاء', labelEn: 'Tue', dateLabel: '2026-11-10' },
  { key: 'wed', labelAr: 'الأربعاء', labelEn: 'Wed', dateLabel: '2026-11-11' },
  { key: 'thu', labelAr: 'الخميس (اليوم)', labelEn: 'Thu (Today)', dateLabel: '2026-11-05' },
  { key: 'fri', labelAr: 'الجمعة', labelEn: 'Fri', dateLabel: '2026-11-06' },
];

export const SEEDED_TODAY_APPOINTMENTS: TodayAppointment[] = [
  { id: 'wa-1', name: 'أحمد محمود سالم', phone: '01012345678', time: '10:30 AM', dayKey: 'thu', dateLabel: '2026-11-05' },
  { id: 'wa-2', name: 'سارة إبراهيم حسن', phone: '01123456789', time: '11:15 AM', dayKey: 'thu', dateLabel: '2026-11-05' },
  { id: 'wa-3', name: 'محمد كمال عبد الرحمن', phone: '01234567890', time: '12:00 PM', dayKey: 'thu', dateLabel: '2026-11-05' },
  { id: 'wa-4', name: 'منى يوسف الشريف', phone: '01512345678', time: '01:30 PM', dayKey: 'thu', dateLabel: '2026-11-05' },
  { id: 'wa-5', name: 'عمر خالد الجندي', phone: '01098765432', time: '02:15 PM', dayKey: 'thu', dateLabel: '2026-11-05' },
];

export const SEEDED_WEEK_EXTRA_APPOINTMENTS: TodayAppointment[] = [
  { id: 'wa-sat-1', name: 'هدى عبد العزيز منصور', phone: '01022334455', time: '11:00 AM', dayKey: 'sat', dateLabel: '2026-11-07' },
  { id: 'wa-sat-2', name: 'طارق فؤاد المنياوي', phone: '01133445566', time: '12:30 PM', dayKey: 'sat', dateLabel: '2026-11-07' },
  { id: 'wa-sun-1', name: 'ياسمين عادل الشاذلي', phone: '01244556677', time: '10:00 AM', dayKey: 'sun', dateLabel: '2026-11-08' },
  { id: 'wa-mon-1', name: 'كريم مصطفى زكي', phone: '01555667788', time: '01:00 PM', dayKey: 'mon', dateLabel: '2026-11-09' },
  { id: 'wa-tue-1', name: 'نهى سامي الجمل', phone: '01066778899', time: '04:30 PM', dayKey: 'tue', dateLabel: '2026-11-10' },
  { id: 'wa-wed-1', name: 'محمود أشرف الدسوقي', phone: '01177889900', time: '06:00 PM', dayKey: 'wed', dateLabel: '2026-11-11' },
];

export interface WhatsAppLogEntry {
  id: string;
  patientId: string;
  patientName: string;
  phone: string;
  timestamp: string;
  messageType: string;
  status: string; // Preserves any legacy status; new entries use 'جاهزة' | 'فتحت في واتساب يدويًا' | 'أكّدها الدكتور يدويًا'
}

export type WaTemplateType = 'booking_confirm' | 'appointment_reminder' | 'reschedule_cancel';

/**
 * Normalizes Egyptian phone numbers before building links:
 * - "01012345678" -> "201012345678" (drops leading 0, prefixes 20)
 * - Accept inputs starting with 01, 20, +20
 * - Output must never be wa.me/010...
 */
export function normalizeEgyptianPhone(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.trim().replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  if (cleaned.startsWith('00')) {
    cleaned = cleaned.substring(2);
  }
  // Strip duplicate 0 if formatted as 2001...
  if (cleaned.startsWith('2001') && cleaned.length >= 13) {
    cleaned = '20' + cleaned.substring(3);
  }
  // Standard Egyptian mobile prefixes: 010, 011, 012, 015
  if (cleaned.startsWith('01')) {
    cleaned = '20' + cleaned.substring(1);
  } else if ((cleaned.startsWith('10') || cleaned.startsWith('11') || cleaned.startsWith('12') || cleaned.startsWith('15')) && cleaned.length === 10) {
    cleaned = '20' + cleaned;
  } else if (cleaned.startsWith('20')) {
    // Already prefixed with country code 20
  } else if (cleaned.startsWith('0')) {
    cleaned = '20' + cleaned.substring(1);
  }
  return cleaned;
}

export function buildWaMeLink(phone: string, text: string): string {
  const normalized = normalizeEgyptianPhone(phone);
  const encoded = encodeURIComponent(text || '');
  return `https://wa.me/${normalized}${encoded ? `?text=${encoded}` : ''}`;
}

export function resolveTemplateVariables(
  templateText: string,
  patient: TodayAppointment,
  doctorName: string,
  reminderLeadTime?: string
): string {
  return templateText
    .replace(/\{اسم_المريض\}|\{patient_name\}/g, patient.name)
    .replace(/\{التاريخ\}|\{date\}/g, patient.dateLabel || '2026-11-05')
    .replace(/\{الساعة\}|\{time\}/g, patient.time)
    .replace(/\{اسم_الدكتور\}|\{doctor_name\}/g, doctorName)
    .replace(/\{وقت_التذكير\}|\{reminder_lead\}/g, reminderLeadTime || 'قبل الموعد بـ 24 ساعة');
}

export interface WhatsAppPatientAlertsSectionProps {
  tenant: Tenant;
  onLocalSave?: () => void;
  uiLang?: 'ar' | 'en';
}

export const WhatsAppPatientAlertsSection: React.FC<WhatsAppPatientAlertsSectionProps> = ({ tenant, onLocalSave }) => {
  // Week Day Strip selection ('thu' = today with the 5 seeded appointments; 'all' shows all week)
  const [selectedDayKey, setSelectedDayKey] = useState<string>('thu');

  const allWeekAppointments = [...SEEDED_TODAY_APPOINTMENTS, ...SEEDED_WEEK_EXTRA_APPOINTMENTS];
  const appointments = selectedDayKey === 'thu'
    ? SEEDED_TODAY_APPOINTMENTS
    : selectedDayKey === 'all'
    ? allWeekAppointments
    : allWeekAppointments.filter(a => a.dayKey === selectedDayKey);

  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>(
    SEEDED_TODAY_APPOINTMENTS.map(a => a.id)
  );
  const [alertMessage, setAlertMessage] = useState<string>(
    `تذكير بموعد الكشف اليوم في العيادة مع ${tenant.doctorName}. برجاء الحضور قبل الموعد بـ 15 دقيقة حرصاً على راحتكم ودقة المواعيد.`
  );

  // Editable 3 Templates + Reminder Time Setting persisted in localStorage
  const templatesStorageKey = `ayadati_wa_templates_${tenant?.id || 'dr-wright'}`;
  const [activeTemplateKey, setActiveTemplateKey] = useState<WaTemplateType>('appointment_reminder');
  const [reminderLeadTime, setReminderLeadTime] = useState<string>(() => {
    try {
      return localStorage.getItem(`${templatesStorageKey}_lead`) || 'قبل الموعد بـ 24 ساعة';
    } catch {
      return 'قبل الموعد بـ 24 ساعة';
    }
  });
  const [templates, setTemplates] = useState<Record<WaTemplateType, string>>(() => {
    const defaults: Record<WaTemplateType, string> = {
      booking_confirm: `مرحباً {اسم_المريض}، تم تأكيد حجز موعدكم في عيادة {اسم_الدكتور} يوم {التاريخ} الساعة {الساعة}. نتمنى لكم دوام الصحة.`,
      appointment_reminder: `تذكير للمريض/ة {اسم_المريض}: موعد الكشف في عيادة {اسم_الدكتور} يوم {التاريخ} الساعة {الساعة} ({وقت_التذكير}). برجاء الحضور قبل الموعد بـ 15 دقيقة.`,
      reschedule_cancel: `عناية الأستاذ/ة {اسم_المريض}، بخصوص موعدكم يوم {التاريخ} الساعة {الساعة} في عيادة {اسم_الدكتور}، يرجى التواصل معنا لتنسيق تعديل أو إلغاء الموعد.`
    };
    try {
      const saved = localStorage.getItem(templatesStorageKey);
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch {
      return defaults;
    }
  });

  const handleTemplateChange = (key: WaTemplateType, newText: string) => {
    setTemplates(prev => {
      const next = { ...prev, [key]: newText };
      try {
        localStorage.setItem(templatesStorageKey, JSON.stringify(next));
        if (onLocalSave) onLocalSave();
      } catch {}
      return next;
    });
  };

  const handleReminderLeadChange = (val: string) => {
    setReminderLeadTime(val);
    try {
      localStorage.setItem(`${templatesStorageKey}_lead`, val);
      if (onLocalSave) onLocalSave();
    } catch {}
  };

  const templateTypeLabels: Record<WaTemplateType, string> = {
    booking_confirm: 'تأكيد الحجز',
    appointment_reminder: `تذكير قبل المعاد (${reminderLeadTime})`,
    reschedule_cancel: 'تغيير / إلغاء المعاد',
  };

  // Per-patient status persisted in localStorage (preserving existing records)
  const storageKey = `ayadati_wa_status_${tenant?.id || 'dr-wright'}`;
  const [patientStatuses, setPatientStatuses] = useState<Record<string, 'pending' | 'opened' | 'confirmed'>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Internal Message Log persisted in localStorage (preserving any existing records untouched)
  const logStorageKey = `ayadati_wa_message_log_${tenant?.id || 'dr-wright'}`;
  const [messageLog, setMessageLog] = useState<WhatsAppLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(logStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    // Seed initial "جاهزة" entries for today's appointments without overwriting if already saved
    return SEEDED_TODAY_APPOINTMENTS.map((pt) => ({
      id: `log-init-${pt.id}`,
      patientId: pt.id,
      patientName: pt.name,
      phone: pt.phone,
      timestamp: 'اليوم 09:00 ص',
      messageType: 'تذكير قبل المعاد',
      status: 'جاهزة',
    }));
  });

  const appendOrUpdateMessageLog = (
    patient: TodayAppointment,
    messageType: string,
    newStatus: 'جاهزة' | 'فتحت في واتساب يدويًا' | 'أكّدها الدكتور يدويًا'
  ) => {
    const nowTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setMessageLog(prev => {
      const entry: WhatsAppLogEntry = {
        id: `log-${patient.id}-${Date.now()}`,
        patientId: patient.id,
        patientName: patient.name,
        phone: patient.phone,
        timestamp: nowTime,
        messageType,
        status: newStatus,
      };
      const next = [entry, ...prev];
      try {
        localStorage.setItem(logStorageKey, JSON.stringify(next));
        if (onLocalSave) onLocalSave();
      } catch {}
      return next;
    });
  };

  const updatePatientStatus = (
    patient: TodayAppointment,
    status: 'opened' | 'confirmed' | 'pending',
    msgTypeLabel: string = templateTypeLabels[activeTemplateKey]
  ) => {
    setPatientStatuses(prev => {
      const next = { ...prev, [patient.id]: status };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
        if (onLocalSave) onLocalSave();
      } catch (e) {
        console.error(e);
      }
      return next;
    });

    if (status === 'opened') {
      appendOrUpdateMessageLog(patient, msgTypeLabel, 'فتحت في واتساب يدويًا');
    } else if (status === 'confirmed') {
      appendOrUpdateMessageLog(patient, msgTypeLabel, 'أكّدها الدكتور يدويًا');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPatientIds(appointments.map(a => a.id));
    } else {
      setSelectedPatientIds([]);
    }
  };

  const handleTogglePatient = (id: string) => {
    setSelectedPatientIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const confirmedCount = SEEDED_TODAY_APPOINTMENTS.filter(p => patientStatuses[p.id] === 'confirmed').length;

  // Real WhatsApp Cloud API direct dispatch
  const [apiSendingId, setApiSendingId] = useState<string | null>(null);
  const [apiFeedback, setApiFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleCloudApiSend = async (patient: TodayAppointment, messageText: string) => {
    setApiSendingId(patient.id);
    setApiFeedback(null);
    try {
      const res = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: patient.phone,
          message: messageText,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        updatePatientStatus(patient, 'confirmed', 'Cloud API (Meta)');
        setApiFeedback({
          success: true,
          message: `تم إرسال الرسالة بنجاح عبر خادم WhatsApp Cloud API للمريض ${patient.name}! (معرّف الرسالة: ${data.messageId || 'Success'})`,
        });
      } else {
        setApiFeedback({
          success: false,
          message: data.error || 'تعذر الإرسال عبر Cloud API. تأكد من إضافة WHATSAPP_ACCESS_TOKEN و WHATSAPP_PHONE_NUMBER_ID في متغيرات البيئة.',
        });
      }
    } catch (err) {
      setApiFeedback({
        success: false,
        message: err instanceof Error ? err.message : 'خطأ في الاتصال بالخادم',
      });
    } finally {
      setApiSendingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 10. WEEK DAY STRIP (شريط أيام الأسبوع للتنقل السريع بين الأيام) */}
      <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm space-y-3" dir="rtl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="text-xs sm:text-sm font-bold text-sky-950 flex items-center gap-2">
            <Calendar size={16} className="text-sky-500" />
            <span>شريط أيام الأسبوع — التنقل السريع بين جدول المواعيد (Week Day Strip)</span>
          </h3>
          <button
            type="button"
            onClick={() => {
              setSelectedDayKey('all');
              setSelectedPatientIds(allWeekAppointments.map(a => a.id));
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              selectedDayKey === 'all'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200'
            }`}
          >
            عرض كل الأسبوع ({allWeekAppointments.length})
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {WEEK_DAYS_STRIP.map((day) => {
            const count = allWeekAppointments.filter(a => a.dayKey === day.key).length;
            const isSelected = selectedDayKey === day.key;
            return (
              <button
                key={day.key}
                type="button"
                onClick={() => {
                  setSelectedDayKey(day.key);
                  const dayApps = allWeekAppointments.filter(a => a.dayKey === day.key);
                  setSelectedPatientIds(dayApps.map(a => a.id));
                }}
                className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-sky-500 text-white border-sky-500 shadow-md'
                    : 'bg-sky-50/50 hover:bg-sky-50 text-sky-950 border-sky-100'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold">{day.labelAr}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-white text-sky-600' : 'bg-white text-sky-700 border border-sky-200'
                  }`}>
                    {count}
                  </span>
                </div>
                <span className={`text-[10px] font-mono mt-1 block ${isSelected ? 'text-sky-100' : 'text-sky-600/70'}`}>
                  {day.dateLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN WHATSAPP ALERTS & MESSAGING CENTER SECTION */}
      <section className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden" aria-label="WhatsApp Alerts">
        {/* Section Header */}
        <div className="bg-gradient-to-r from-sky-500 to-sky-600 p-5 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 text-white flex items-center justify-center shadow-sm shrink-0 backdrop-blur-sm">
              <MessageCircle size={24} className="fill-white text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                <span>إشعارات واتساب للمرضى — WhatsApp Patient Alerts</span>
              </h2>
              <p className="text-sky-100 text-xs">
                مركز رسائل المواعيد (تأكيد الحجز • تذكير قبل المعاد • تغيير/إلغاء المعاد) عبر الإرسال اليدوي المباشر wa.me
              </p>
            </div>
          </div>

          {/* Counter Badge */}
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/25">
            <span className="text-xs text-white/95 font-medium">حالة الإرسال:</span>
            <span className="px-3 py-1 rounded-full bg-white text-sky-700 font-bold text-xs shadow-sm">
              {confirmedCount}/{SEEDED_TODAY_APPOINTMENTS.length} تم تأكيد إرسالها
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          
          {/* 6A. EDITABLE TEMPLATES FOR 3 APPOINTMENT CASES WITH VARIABLES */}
          <div className="p-5 bg-sky-50/50 rounded-2xl border border-sky-100 space-y-4" dir="rtl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-sky-950 flex items-center gap-2">
                  <MessageSquare size={16} className="text-sky-500" />
                  <span>قوالب رسائل المواعيد القابلة للتعديل (٣ حالات + متغيرات تلقائية)</span>
                </h3>
                <p className="text-[11px] text-sky-700/80 mt-0.5">
                  المتغيرات المتاحة: <code className="bg-white px-1.5 py-0.5 rounded border border-sky-200 text-sky-950 font-mono">{'{اسم_المريض}'}</code> ،{' '}
                  <code className="bg-white px-1.5 py-0.5 rounded border border-sky-200 text-sky-950 font-mono">{'{التاريخ}'}</code> ،{' '}
                  <code className="bg-white px-1.5 py-0.5 rounded border border-sky-200 text-sky-950 font-mono">{'{الساعة}'}</code> ،{' '}
                  <code className="bg-white px-1.5 py-0.5 rounded border border-sky-200 text-sky-950 font-mono">{'{اسم_الدكتور}'}</code>
                </p>
              </div>

              {/* Reminder Lead Time Setting */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-sky-200 text-xs shadow-sm">
                <Clock size={14} className="text-sky-500" />
                <label className="font-bold text-sky-900">إعداد وقت التذكير:</label>
                <select
                  value={reminderLeadTime}
                  onChange={(e) => handleReminderLeadChange(e.target.value)}
                  className="bg-sky-50/50 border border-sky-200 rounded-lg px-2 py-1 text-xs font-bold text-sky-950 outline-none"
                >
                  <option value="قبل الموعد بـ 24 ساعة">قبل الموعد بـ 24 ساعة</option>
                  <option value="قبل الموعد بـ 6 ساعات">قبل الموعد بـ 6 ساعات</option>
                  <option value="قبل الموعد بـ ساعتين">قبل الموعد بـ ساعتين</option>
                  <option value="قبل الموعد بـ 15 دقيقة">قبل الموعد بـ 15 دقيقة</option>
                </select>
              </div>
            </div>

            {/* 3 Template Type Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold">
              {(
                [
                  { key: 'booking_confirm', label: '1. قالب تأكيد الحجز' },
                  { key: 'appointment_reminder', label: '2. قالب تذكير قبل المعاد' },
                  { key: 'reschedule_cancel', label: '3. قالب تغيير / إلغاء المعاد' },
                ] as { key: WaTemplateType; label: string }[]
              ).map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setActiveTemplateKey(item.key);
                    const samplePt = appointments[0] || SEEDED_TODAY_APPOINTMENTS[0];
                    setAlertMessage(resolveTemplateVariables(templates[item.key], samplePt, tenant.doctorName, reminderLeadTime));
                  }}
                  className={`py-2.5 px-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    activeTemplateKey === item.key
                      ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                      : 'bg-white text-sky-900 border-sky-200 hover:bg-sky-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {activeTemplateKey === item.key && <Check size={14} className="text-white" />}
                </button>
              ))}
            </div>

            {/* Active Template Editor */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-sky-900">
                  تعديل نص القالب ({templateTypeLabels[activeTemplateKey]}):
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const samplePt = appointments[0] || SEEDED_TODAY_APPOINTMENTS[0];
                    setAlertMessage(resolveTemplateVariables(templates[activeTemplateKey], samplePt, tenant.doctorName, reminderLeadTime));
                  }}
                  className="text-xs font-bold text-sky-600 hover:underline cursor-pointer"
                >
                  نسخ القالب للرسالة الموحدة أدناه
                </button>
              </div>
              <textarea
                rows={2}
                value={templates[activeTemplateKey]}
                onChange={(e) => handleTemplateChange(activeTemplateKey, e.target.value)}
                className="w-full p-3 bg-white border border-sky-200 rounded-xl text-xs text-sky-950 focus:ring-2 focus:ring-sky-400 outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* 1 Message Textarea with Live Character Count */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-sky-900 flex items-center gap-1.5">
                <FileText size={15} className="text-sky-500" />
                <span>نص الرسالة الموحدة (Message to all selected patients)</span>
              </label>
              <span className="text-xs font-mono font-bold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200">
                {alertMessage.length} حرف / characters
              </span>
            </div>

            <textarea
              rows={3}
              placeholder="اكتب رسالتك هنا..."
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              className="w-full p-3.5 border border-sky-200 rounded-xl text-xs sm:text-sm text-sky-950 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-all resize-y leading-relaxed"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-sky-600">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sky-800">قوالب جاهزة:</span>
                <button
                  type="button"
                  onClick={() => setAlertMessage(`تذكير بموعد الكشف اليوم في العيادة مع ${tenant.doctorName}. برجاء الحضور قبل الموعد بـ 15 دقيقة حرصاً على راحتكم ودقة المواعيد.`)}
                  className="text-[11px] px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg font-medium transition-all"
                >
                  تذكير بالموعد
                </button>
                <button
                  type="button"
                  onClick={() => setAlertMessage(`نرجو تأكيد حضوركم لموعد الكشف اليوم في عيادة ${tenant.doctorName}. في حال رغبتكم بتعديل الموعد يرجى الرد على هذه الرسالة.`)}
                  className="text-[11px] px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg font-medium transition-all"
                >
                  تأكيد الحضور
                </button>
              </div>
              <button
                type="button"
                onClick={() => setAlertMessage('')}
                className="text-xs text-sky-400 hover:text-sky-600 transition-colors"
              >
                مسح النص
              </button>
            </div>
          </div>

          {/* Patients Appointments List */}
          <div className="border border-sky-100 rounded-xl overflow-hidden shadow-sm">
            {/* List Header with Select All Checkbox */}
            <div className="bg-sky-50/60 p-3.5 border-b border-sky-100 flex justify-between items-center text-xs">
              <label className="flex items-center gap-2.5 font-bold text-sky-900 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedPatientIds.length === appointments.length && appointments.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-400 cursor-pointer"
                />
                <span>تحديد الكل / Select all ({selectedPatientIds.length}/{appointments.length} محدد)</span>
              </label>
              <span className="text-sky-700 font-medium hidden sm:inline">
                مواعيد اليوم المعروضة ({appointments.length})
              </span>
            </div>

            {/* Cloud API Feedback Banner */}
            {apiFeedback && (
              <div className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                apiFeedback.success
                  ? 'bg-sky-50 border-sky-300 text-sky-900 font-semibold'
                  : 'bg-amber-50 border-amber-200 text-amber-900 font-medium'
              }`} dir="rtl">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${apiFeedback.success ? 'bg-sky-500' : 'bg-amber-500'}`} />
                  <span>{apiFeedback.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setApiFeedback(null)}
                  className="text-xs font-bold text-sky-700 hover:underline cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            )}

            {/* List Rows */}
            <div className="divide-y divide-sky-100">
              {appointments.map((patient) => {
                const isSelected = selectedPatientIds.includes(patient.id);
                const status = patientStatuses[patient.id] || 'pending';
                const normalizedPhone = normalizeEgyptianPhone(patient.phone);
                // Resolve personalized template message for this patient
                const personalizedTemplateMsg = resolveTemplateVariables(
                  templates[activeTemplateKey],
                  patient,
                  tenant.doctorName,
                  reminderLeadTime
                );
                const waLink = buildWaMeLink(patient.phone, alertMessage);
                const waTemplateLink = buildWaMeLink(patient.phone, personalizedTemplateMsg);

                return (
                  <div
                    key={patient.id}
                    className={`p-4 flex flex-col gap-3 transition-colors ${
                      isSelected ? 'bg-white hover:bg-sky-50/50' : 'bg-sky-50/30 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      {/* Patient Info with Checkbox */}
                      <div className="flex items-center gap-3.5 min-w-[240px]">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleTogglePatient(patient.id)}
                          className="w-4 h-4 rounded text-sky-600 focus:ring-sky-400 cursor-pointer"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sky-950 text-sm">{patient.name}</p>
                            <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 font-bold text-[10px] flex items-center gap-1 border border-sky-200">
                              <Clock size={11} /> {patient.time}
                            </span>
                            {patient.dateLabel && (
                              <span className="text-[10px] font-mono text-sky-400">{patient.dateLabel}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-sky-700/70 mt-0.5">
                            <Phone size={11} className="text-sky-400" />
                            <span className="font-mono text-sky-800">{patient.phone}</span>
                            <span className="text-[11px] text-sky-500 font-mono">({normalizedPhone})</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge (Mapped to honest manual states) */}
                      <div className="flex items-center gap-2">
                        {status === 'confirmed' ? (
                          <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 font-bold text-xs flex items-center gap-1 border border-sky-200">
                            <CheckCircle2 size={13} className="text-sky-600" /> تم تأكيد الإرسال (أكّدها الدكتور يدويًا)
                          </span>
                        ) : status === 'opened' ? (
                          <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center gap-1 border border-sky-200">
                            <MessageSquare size={13} className="text-sky-600" /> تم فتح المحادثة (فتحت في واتساب يدويًا)
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium text-xs">
                            جاهزة (لم يتم الإرسال)
                          </span>
                        )}
                      </div>

                      {/* Action Buttons: WhatsApp Button + Template WA Button + Separate Manual Confirm Button */}
                      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                        {isSelected ? (
                          <>
                            {/* Green WhatsApp button opening unified message in NEW TAB */}
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => updatePatientStatus(patient, 'opened', 'رسالة موحدة')}
                              className="px-3.5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-xs shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer"
                              title="فتح محادثة واتساب مع المريض في نافذة جديدة"
                            >
                              <MessageCircle size={15} className="fill-white text-white" />
                              <span>واتساب</span>
                            </a>

                            {/* Template Personalized WhatsApp Button */}
                            <a
                              href={waTemplateLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => updatePatientStatus(patient, 'opened', templateTypeLabels[activeTemplateKey])}
                              className="px-3 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl font-bold text-xs transition-all inline-flex items-center gap-1 cursor-pointer"
                              title="فتح واتساب بنص القالب المخصص باسم المريض وموعده"
                            >
                              <Send size={13} className="text-sky-600" />
                              <span>فتح بالقالب ({templateTypeLabels[activeTemplateKey].split(' ')[0]})</span>
                            </a>

                            {/* Direct WhatsApp Cloud API Button */}
                            <button
                              type="button"
                              disabled={apiSendingId === patient.id}
                              onClick={() => handleCloudApiSend(patient, personalizedTemplateMsg)}
                              className="px-3 py-2 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white rounded-xl font-bold text-xs shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                              title="إرسال رسالة مباشرة للمريض عبر Meta WhatsApp Cloud API و Node.js backend"
                            >
                              {apiSendingId === patient.id ? (
                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Sparkles size={13} className="text-sky-200" />
                              )}
                              <span>إرسال Cloud API</span>
                            </button>

                            {/* Separate manual button: تأكيد الإرسال */}
                            <button
                              type="button"
                              onClick={() => updatePatientStatus(patient, 'confirmed', templateTypeLabels[activeTemplateKey])}
                              className={`px-3 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1 cursor-pointer ${
                                status === 'confirmed'
                                  ? 'bg-sky-50 text-sky-700 border border-sky-300'
                                  : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sm'
                              }`}
                              title="تأكيد يدوي من الطبيب بأنه أرسل الرسالة داخل واتساب"
                            >
                              <Check size={14} />
                              <span>تأكيد الإرسال</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] text-sky-400 italic">
                            حدد المريض لإرسال الإشعار
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Preview of personalized template message for this patient */}
                    {isSelected && (
                      <div className="bg-sky-50/50 px-3 py-2 rounded-lg border border-sky-100 text-[11px] text-sky-700 flex items-center justify-between gap-2" dir="rtl">
                        <span className="truncate">
                          <strong className="text-sky-950">معاينة القالب للمريض:</strong> {personalizedTemplateMsg}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Note under section */}
          <div className="p-3.5 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-900 font-semibold flex items-center gap-2.5 shadow-sm">
            <Info size={16} className="text-sky-500 shrink-0" />
            <span>إرسال يدوي - الدكتور يراجع الرسالة ويضغط إرسال داخل واتساب بنفسه</span>
          </div>

          {/* 6C. INTERNAL MESSAGE LOG (سجل داخلي لكل رسالة: الوقت، النوع، والحالة) */}
          <div className="border border-sky-100 rounded-2xl overflow-hidden bg-white shadow-sm" dir="rtl">
            <div className="bg-sky-50/60 p-4 border-b border-sky-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-sky-950 flex items-center gap-2">
                  <Clock size={15} className="text-sky-500" />
                  <span>سجل الرسائل الداخلي على الجهاز (Internal Message Log — {messageLog.length})</span>
                </h3>
                <p className="text-[11px] text-sky-700/80 mt-0.5">
                  الحالات المسموحة: <strong>«جاهزة»</strong> • <strong>«فتحت في واتساب يدويًا»</strong> • <strong>«أكّدها الدكتور يدويًا»</strong> (تأكيد المستخدم اليدوي ليس إيصال استلام أو قراءة من واتساب).
                </p>
              </div>
            </div>

            <div className="max-h-56 overflow-y-auto divide-y divide-gray-100 text-xs">
              {messageLog.map((entry) => (
                <div key={entry.id} className="p-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {entry.timestamp}
                    </span>
                    <span className="font-bold text-gray-800">{entry.patientName}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-semibold">
                      {entry.messageType}
                    </span>
                  </div>
                  <div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      entry.status === 'أكّدها الدكتور يدويًا'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : entry.status === 'فتحت في واتساب يدويًا'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}>
                      {entry.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

// ==========================================
// 7. DOCTOR PORTAL
// ==========================================
interface DoctorPortalProps {
  onBackToHome: () => void;
  tenant: Tenant;
  demoBypassAuth?: boolean;
  onLocalSave?: () => void;
  uiLang?: 'ar' | 'en';
}

const DoctorPortal: React.FC<DoctorPortalProps> = ({ onBackToHome, tenant, demoBypassAuth = false, onLocalSave }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(demoBypassAuth);
  const [pin, setPin] = useState('DR-2026');
  const [notification, setNotification] = useState<string | null>(null);
  const [activeDoctorTab, setActiveDoctorTab] = useState<'whatsapp' | 'ambient' | 'consultation' | 'records' | 'settings'>('whatsapp');

  useEffect(() => {
    if (demoBypassAuth) {
      setIsAuthenticated(true);
    }
  }, [demoBypassAuth]);

  // Read waiting queue count from real reception queue in localStorage
  const waitingQueueCount = (() => {
    try {
      const saved = localStorage.getItem(`ayadati_reception_queue_${tenant.id}`);
      const list = saved ? JSON.parse(saved) : INITIAL_RECEPTION_PATIENTS;
      return Array.isArray(list) ? list.filter((p: any) => p.status === 'waiting').length : 3;
    } catch {
      return 3;
    }
  })();

  // Clinical Consultation State persisted in localStorage
  const clinicalStorageKey = `ayadati_doctor_clinical_${tenant.id}`;
  const [currentPatientName, setCurrentPatientName] = useState('Ahmed Mahmoud');

  // 5. Vital Signs (ضغط، نبض، حرارة، سكر) in clear chips
  const [patientVitals, setPatientVitals] = useState<{
    bp: string;
    hr: string;
    temp: string;
    glucose: string;
    weight: string;
  }>(() => {
    const defaults = { bp: '120/80 mmHg', hr: '74 bpm', temp: '37.0 °C', glucose: '110 mg/dL', weight: '76 kg' };
    try {
      const saved = localStorage.getItem(`${clinicalStorageKey}_vitals`);
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch {
      return defaults;
    }
  });

  const updateVital = (field: 'bp' | 'hr' | 'temp' | 'glucose' | 'weight', val: string) => {
    setPatientVitals(prev => {
      const next = { ...prev, [field]: val };
      try {
        localStorage.setItem(`${clinicalStorageKey}_vitals`, JSON.stringify(next));
        if (onLocalSave) onLocalSave();
      } catch {}
      return next;
    });
  };

  // 4. Separate S / O / A / P Cards for Consultation Draft
  const [soapNotes, setSoapNotes] = useState<{
    s: string;
    o: string;
    a: string;
    p: string;
  }>(() => {
    const defaults = {
      s: 'المريض يشكو من كحة مستمرة منذ ٤ أيام مع احتقان بالحلق وصداع خفيف. ينفي وجود سخونية أو ضيق بالتنفس.',
      o: 'المريض واعي، العلامات الحيوية مستقرة (الضغط 120/80، النبض 74، الحرارة 37.0، السكر 110). فحص الصدر يوضح تهيج شعبي بسيط.',
      a: 'Acute Bronchial Irritation & Upper Respiratory Congestion',
      p: 'الالتزام بالروشتة الموصوفة، راحة وشرب سوائل دافئة، وإجراء صورة دم كاملة CBC، مع متابعة (استشارة) بعد 7 أيام.'
    };
    try {
      const saved = localStorage.getItem(`${clinicalStorageKey}_soap`);
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch {
      return defaults;
    }
  });

  const updateSoapField = (field: 's' | 'o' | 'a' | 'p', val: string) => {
    setSoapNotes(prev => {
      const next = { ...prev, [field]: val };
      try {
        localStorage.setItem(`${clinicalStorageKey}_soap`, JSON.stringify(next));
        if (onLocalSave) onLocalSave();
      } catch {}
      return next;
    });
  };

  const [medications, setMedications] = useState([
    { id: 1, name: 'Amoxicillin + Clavulanic Acid 1g', dose: '1 Tab', freq: 'Twice daily after meals', days: '7 days' },
    { id: 2, name: 'Paracetamol 500mg', dose: '1-2 Tabs', freq: 'Every 8 hours as needed', days: '5 days' },
    { id: 3, name: 'Salbutamol Inhaler 100mcg', dose: '2 Puffs', freq: 'Every 6 hours if wheezing', days: '10 days' }
  ]);
  const [newMed, setNewMed] = useState({ name: '', dose: '', freq: '', days: '' });
  const [labTests, setLabTests] = useState(['Complete Blood Picture (CBC)', 'Chest X-Ray (PA View)']);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDoctorLogin = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    setIsAuthenticated(true);
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name) return;
    setMedications(prev => [...prev, { id: Date.now(), ...newMed }]);
    setNewMed({ name: '', dose: '', freq: '', days: '' });
    if (onLocalSave) onLocalSave();
    showNotification('Medication added to prescription pad');
  };

  const handleRemoveMedication = (id: number) => {
    setMedications(prev => prev.filter(m => m.id !== id));
    if (onLocalSave) onLocalSave();
  };

  const handleLoadSimulatedEncounter = () => {
    const simSoap = {
      s: '[سيناريو محاكاة تجريبي] مريض يبلغ من العمر ٤٢ عاماً يشكو من كحة جافة وإجهاد منذ ٣ أيام. ينفي وجود سخونية أو ألم بالصدر.',
      o: '[سيناريو محاكاة تجريبي] الضغط: 125/82 mmHg | النبض: 78 bpm | الحرارة: 37.1 °C | السكر العشوائي: 115 mg/dL.',
      a: '[سيناريو محاكاة تجريبي] Acute Upper Respiratory Infection (Simulated ICD-10: J06.9)',
      p: '[سيناريو محاكاة تجريبي] سوائل دافئة + راحة + متابعة خلال أسبوع (استشارة).'
    };
    setSoapNotes(simSoap);
    try {
      localStorage.setItem(`${clinicalStorageKey}_soap`, JSON.stringify(simSoap));
      if (onLocalSave) onLocalSave();
    } catch {}
    showNotification('تم تحميل سيناريو المحاكاة التجريبي في كروت S / O / A / P');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F0F8FF] via-[#E0F2FE] to-white flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border-t-4 border-sky-400 border border-sky-100">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3 shadow-sm border border-sky-100">
              <Stethoscope size={36} />
            </div>
            <h1 className="text-xl font-bold text-sky-950">Doctor Portal — {tenant.doctorName}</h1>
            <p className="text-xs text-sky-600 font-semibold mt-1">{tenant.specialty} • {tenant.clinicName}</p>
          </div>
          <form onSubmit={handleDoctorLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-sky-800 mb-1">Doctor Security PIN / Passcode</label>
              <input 
                type="password" 
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full p-2.5 border border-sky-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-400 outline-none text-sky-950" 
                required 
              />
              <span className="text-[11px] text-sky-500 mt-1 block">PIN التجريبي المعبأ: DR-2026</span>
            </div>
            <button 
              type="submit" 
              onClick={handleDoctorLogin}
              className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Login to Doctor Dashboard
            </button>
            <button 
              type="button" 
              onClick={onBackToHome} 
              className="w-full text-xs font-bold text-sky-700 hover:text-sky-900 pt-2 cursor-pointer"
            >
              Back to Main Website
            </button>
          </form>
        </div>
      </div>
    );
  }

  const nextUpcomingAppt = SEEDED_TODAY_APPOINTMENTS[0];

  return (
    <div className="min-h-screen bg-[#F0F8FF] p-4 sm:p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Doctor Header Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sky-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
              <Stethoscope size={28} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-sky-950">{tenant.doctorName}</h1>
              <p className="text-xs text-sky-700">{tenant.specialty} • {tenant.clinicName}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle size={10} className="text-sky-600" /> Clinic Active
                </span>
                <span className="text-[11px] text-sky-600/80">Consultation Fee: {tenant.consultationFee} EGP</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => showNotification("Egyptian Tax Authority (ETA) e-Invoice batch synchronized successfully.")}
              className="px-4 py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-sky-200 cursor-pointer shadow-sm"
            >
              <FileSpreadsheet size={15} /> Sync ETA e-Invoice
            </button>
            <button 
              onClick={() => setIsAuthenticated(false)} 
              className="px-4 py-2 bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              Logout
            </button>
            <button 
              onClick={onBackToHome} 
              className="px-4 py-2 bg-sky-500 text-white hover:bg-sky-600 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              Back to Web
            </button>
          </div>
        </div>

        {/* 1. KPI STRIP AT TOP OF DOCTOR PORTAL (شريط ملخص أعلى بوابة الدكتور) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" dir="rtl">
          {/* KPI 1: Today's Appointments */}
          <button
            type="button"
            onClick={() => setActiveDoctorTab('whatsapp')}
            className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md hover:border-sky-300 transition-all text-right flex items-center justify-between cursor-pointer group"
          >
            <div>
              <span className="text-xs text-sky-700 font-bold block">حالات النهارده (مواعيد اليوم)</span>
              <span className="text-2xl font-extrabold text-sky-950 mt-1 block">
                {SEEDED_TODAY_APPOINTMENTS.length} حالات
              </span>
              <span className="text-[10px] text-sky-600 font-bold group-hover:underline">
                انتقل لجدول المواعيد والواتساب ←
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Calendar size={22} />
            </div>
          </button>

          {/* KPI 2: Waiting in Queue */}
          <button
            type="button"
            onClick={() => setActiveDoctorTab('consultation')}
            className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md hover:border-sky-300 transition-all text-right flex items-center justify-between cursor-pointer group"
          >
            <div>
              <span className="text-xs text-sky-700 font-bold block">المنتظرين في الطابور</span>
              <span className="text-2xl font-extrabold text-sky-600 mt-1 block">
                {waitingQueueCount} بالانتظار
              </span>
              <span className="text-[10px] text-sky-600 font-bold group-hover:underline">
                انتقل لغرفة الكشف الحالية ←
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Users size={22} />
            </div>
          </button>

          {/* KPI 3: Next Upcoming Appointment */}
          <button
            type="button"
            onClick={() => setActiveDoctorTab('whatsapp')}
            className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md hover:border-sky-300 transition-all text-right flex items-center justify-between cursor-pointer group"
          >
            <div className="min-w-0">
              <span className="text-xs text-sky-700 font-bold block">أقرب معاد جاي</span>
              <span className="text-sm font-extrabold text-sky-700 mt-1 block truncate">
                {nextUpcomingAppt ? `${nextUpcomingAppt.time} — ${nextUpcomingAppt.name}` : 'غير متاح'}
              </span>
              <span className="text-[10px] text-sky-600 font-bold group-hover:underline">
                عرض تفاصيل الموعد ←
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Clock size={22} />
            </div>
          </button>

          {/* KPI 4: Honest Financial Metric (No fabricated net income since expenses aren't tracked) */}
          <button
            type="button"
            onClick={() => setActiveDoctorTab('settings')}
            className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md hover:border-sky-300 transition-all text-right flex items-center justify-between cursor-pointer group"
          >
            <div>
              <span className="text-xs text-sky-700 font-bold block">صافي الدخل / قيمة الكشف</span>
              <span className="text-sm font-extrabold text-sky-950 mt-1 block">
                صافي الدخل: <span className="text-sky-600">غير متاح</span>
              </span>
              <span className="text-[10px] text-sky-600 block">
                الكشف: {tenant.consultationFee} ج.م (لا توجد بيانات مصروفات)
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <DollarSign size={22} />
            </div>
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-2 border-b border-sky-100 pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveDoctorTab('whatsapp')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeDoctorTab === 'whatsapp' 
                ? 'bg-sky-500 text-white shadow-sm' 
                : 'text-sky-800 hover:bg-sky-50 bg-white border border-sky-100'
            }`}
          >
            <MessageCircle size={15} className="fill-current text-white" />
            <span>إشعارات واتساب والمواعيد (WhatsApp Alerts)</span>
          </button>
          <button
            onClick={() => setActiveDoctorTab('ambient')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeDoctorTab === 'ambient' 
                ? 'bg-sky-500 text-white shadow-sm' 
                : 'text-sky-800 hover:bg-sky-50 bg-white border border-sky-100'
            }`}
          >
            <Mic size={15} className="text-sky-300" />
            <span>تجربة التسجيل الذكي / Ambient demo</span>
          </button>
          <button
            onClick={() => setActiveDoctorTab('consultation')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeDoctorTab === 'consultation' 
                ? 'bg-sky-500 text-white shadow-sm' 
                : 'text-sky-800 hover:bg-sky-50 bg-white border border-sky-100'
            }`}
          >
            Active Examination & Rx (الكشف و SOAP)
          </button>
          <button
            onClick={() => setActiveDoctorTab('records')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeDoctorTab === 'records' 
                ? 'bg-sky-500 text-white shadow-sm' 
                : 'text-sky-800 hover:bg-sky-50 bg-white border border-sky-100'
            }`}
          >
            Patient History & Diagnosis
          </button>
          <button
            onClick={() => setActiveDoctorTab('settings')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeDoctorTab === 'settings' 
                ? 'bg-sky-500 text-white shadow-sm' 
                : 'text-sky-800 hover:bg-sky-50 bg-white border border-sky-100'
            }`}
          >
            Clinic Settings & Automation (الإعدادات والأتمتة)
          </button>
        </div>

        {/* TAB 1: WHATSAPP PATIENT ALERTS */}
        {activeDoctorTab === 'whatsapp' && (
          <WhatsAppPatientAlertsSection tenant={tenant} onLocalSave={onLocalSave} />
        )}

        {/* TAB 2: AMBIENT RECORDING DEMO (LOCAL ONLY) */}
        {activeDoctorTab === 'ambient' && (
          <AmbientDemoTab />
        )}

        {/* TAB 3: CONSULTATION & RX WRITER (WITH VITAL CHIPS & S/O/A/P CARDS) */}
        {activeDoctorTab === 'consultation' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Active Patient Banner & Vital Signs Chips (ضغط، نبض، حرارة، سكر) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-sky-100">
                <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider block mb-1">
                  Now Examining
                </span>
                <h3 className="text-lg font-bold text-sky-950">{currentPatientName}</h3>
                <p className="text-xs text-sky-700/80 mb-4">Patient File #P-1004 • Age: 38 • Male</p>

                {/* 5. VITAL SIGNS CHIPS (العلامات الحيوية: ضغط، نبض، حرارة، سكر في خانات chips واضحة) */}
                <div className="space-y-3" dir="rtl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-sky-950 flex items-center gap-1.5">
                      <HeartPulse size={15} className="text-sky-500" />
                      العلامات الحيوية (Vital Signs Chips)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    {/* Chip 1: Blood Pressure (ضغط) */}
                    <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200 space-y-1.5">
                      <span className="text-[11px] font-bold text-sky-900 block">الضغط (BP)</span>
                      <input
                        type="text"
                        value={patientVitals.bp}
                        onChange={(e) => updateVital('bp', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-sky-200 rounded-lg font-mono font-bold text-sky-950 text-xs focus:ring-1 focus:ring-sky-400 outline-none"
                        dir="ltr"
                      />
                      <div className="flex flex-wrap gap-1">
                        {['120/80', '130/85', '140/90'].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => updateVital('bp', `${val} mmHg`)}
                            className="px-1.5 py-0.5 bg-white hover:bg-sky-100 border border-sky-200 rounded text-[10px] font-mono text-sky-800 cursor-pointer"
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chip 2: Pulse / Heart Rate (نبض) */}
                    <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200 space-y-1.5">
                      <span className="text-[11px] font-bold text-sky-900 block">النبض (Pulse)</span>
                      <input
                        type="text"
                        value={patientVitals.hr}
                        onChange={(e) => updateVital('hr', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-sky-200 rounded-lg font-mono font-bold text-sky-950 text-xs focus:ring-1 focus:ring-sky-400 outline-none"
                        dir="ltr"
                      />
                      <div className="flex flex-wrap gap-1">
                        {['72 bpm', '80 bpm', '96 bpm'].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => updateVital('hr', val)}
                            className="px-1.5 py-0.5 bg-white hover:bg-sky-100 border border-sky-200 rounded text-[10px] font-mono text-sky-800 cursor-pointer"
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chip 3: Temperature (حرارة) */}
                    <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200 space-y-1.5">
                      <span className="text-[11px] font-bold text-sky-900 block">الحرارة (Temp)</span>
                      <input
                        type="text"
                        value={patientVitals.temp}
                        onChange={(e) => updateVital('temp', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-sky-200 rounded-lg font-mono font-bold text-sky-950 text-xs focus:ring-1 focus:ring-sky-400 outline-none"
                        dir="ltr"
                      />
                      <div className="flex flex-wrap gap-1">
                        {['36.8 °C', '37.0 °C', '38.3 °C'].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => updateVital('temp', val)}
                            className="px-1.5 py-0.5 bg-white hover:bg-sky-100 border border-sky-200 rounded text-[10px] font-mono text-sky-800 cursor-pointer"
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chip 4: Blood Glucose (سكر) */}
                    <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200 space-y-1.5">
                      <span className="text-[11px] font-bold text-sky-900 block">السكر (Glucose)</span>
                      <input
                        type="text"
                        value={patientVitals.glucose}
                        onChange={(e) => updateVital('glucose', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-sky-200 rounded-lg font-mono font-bold text-sky-950 text-xs focus:ring-1 focus:ring-sky-400 outline-none"
                        dir="ltr"
                      />
                      <div className="flex flex-wrap gap-1">
                        {['95 mg/dL', '110 mg/dL', '165 mg/dL'].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => updateVital('glucose', val)}
                            className="px-1.5 py-0.5 bg-white hover:bg-sky-100 border border-sky-200 rounded text-[10px] font-mono text-sky-800 cursor-pointer"
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <button 
                    onClick={() => {
                      showNotification(`Consultation completed for ${currentPatientName}! Prescription & e-Invoice issued.`);
                      setCurrentPatientName('Fatma Ali');
                    }}
                    className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 size={16} /> Complete & Issue Prescription
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentPatientName('Fatma Ali');
                      showNotification("Called Next Patient: Fatma Ali");
                    }}
                    className="w-full py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold rounded-xl text-xs transition-all border border-sky-200 cursor-pointer"
                  >
                    Next Patient in Queue
                  </button>
                </div>
              </div>

              {/* Lab & Imaging Requests */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-sky-100">
                <h4 className="font-bold text-sky-950 text-sm mb-3 flex items-center gap-2">
                  <Activity size={16} className="text-sky-500" /> Lab & Radiology Orders
                </h4>
                <div className="space-y-2 text-xs">
                  {labTests.map((t, idx) => (
                    <div key={idx} className="p-2.5 bg-sky-50/70 border border-sky-100 rounded-lg flex justify-between items-center text-sky-900 font-medium">
                      <span>{t}</span>
                      <button onClick={() => setLabTests(prev => prev.filter((_, i) => i !== idx))} className="text-sky-500 hover:text-sky-700 font-bold cursor-pointer">×</button>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input 
                    type="text" 
                    id="new-lab-input" 
                    placeholder="e.g., Lipid Profile" 
                    className="w-full p-2 border border-sky-200 rounded-lg text-xs text-sky-950 focus:ring-1 focus:ring-sky-400 outline-none" 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value;
                        if (val) {
                          setLabTests(prev => [...prev, val]);
                          (e.target as HTMLInputElement).value = '';
                          if (onLocalSave) onLocalSave();
                        }
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      const el = document.getElementById('new-lab-input') as HTMLInputElement;
                      if (el && el.value) {
                        setLabTests(prev => [...prev, el.value]);
                        el.value = '';
                        if (onLocalSave) onLocalSave();
                      }
                    }}
                    className="px-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold cursor-pointer shadow-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Separate S / O / A / P Consultation Cards & Electronic Prescription Pad */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-sky-100 space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-sky-100 pb-4">
                  <div>
                    <h3 className="font-bold text-sky-950 text-base flex items-center gap-2">
                      <FileText size={18} className="text-sky-500" /> مسودة الكشف (كروت S / O / A / P) & الروشتة الإلكترونية (Rx)
                    </h3>
                    <p className="text-xs text-sky-700/80">Official Clinic SOAP Notes & Prescription • Saved Locally</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] bg-sky-50 text-sky-800 border border-sky-200 font-bold px-2.5 py-0.5 rounded-full">
                      بيانات تجريبية للعرض فقط - محاكاة
                    </span>
                    <button
                      type="button"
                      onClick={handleLoadSimulatedEncounter}
                      className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles size={13} className="text-sky-100" />
                      <span>جرّب بسيناريو جاهز (محاكاة)</span>
                    </button>
                  </div>
                </div>

                {/* 4. SEPARATE S / O / A / P CARDS (بدل النص الطويل المتصل) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs" dir="rtl">
                  {/* Card S: Subjective */}
                  <div className="p-4 rounded-2xl border border-sky-200 bg-sky-50/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sky-950 flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-lg bg-sky-500 text-white font-mono flex items-center justify-center">S</span>
                        Subjective — شكوى المريض
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={soapNotes.s}
                      onChange={(e) => updateSoapField('s', e.target.value)}
                      className="w-full p-2.5 bg-white border border-sky-200 rounded-xl text-xs text-sky-950 leading-relaxed focus:ring-2 focus:ring-sky-400 outline-none"
                    />
                  </div>

                  {/* Card O: Objective */}
                  <div className="p-4 rounded-2xl border border-sky-200 bg-sky-50/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sky-950 flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-lg bg-sky-600 text-white font-mono flex items-center justify-center">O</span>
                        Objective — الفحص الإكلينيكي
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={soapNotes.o}
                      onChange={(e) => updateSoapField('o', e.target.value)}
                      className="w-full p-2.5 bg-white border border-sky-200 rounded-xl text-xs text-sky-950 leading-relaxed focus:ring-2 focus:ring-sky-400 outline-none"
                    />
                  </div>

                  {/* Card A: Assessment */}
                  <div className="p-4 rounded-2xl border border-sky-200 bg-sky-50/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sky-950 flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-lg bg-sky-500 text-white font-mono flex items-center justify-center">A</span>
                        Assessment — التقييم والتشخيص
                      </span>
                      <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full border border-sky-200">
                        بيانات تجريبية للعرض فقط - محاكاة
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={soapNotes.a}
                      onChange={(e) => updateSoapField('a', e.target.value)}
                      className="w-full p-2.5 bg-white border border-sky-200 rounded-xl text-xs text-sky-950 leading-relaxed focus:ring-2 focus:ring-sky-400 outline-none"
                    />
                  </div>

                  {/* Card P: Plan */}
                  <div className="p-4 rounded-2xl border border-sky-200 bg-sky-50/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sky-950 flex items-center gap-1.5">
                        <span className="w-6 h-6 rounded-lg bg-sky-600 text-white font-mono flex items-center justify-center">P</span>
                        Plan — الخطة والمتابعة
                      </span>
                      <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full border border-sky-200">
                        بيانات تجريبية للعرض فقط - محاكاة
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={soapNotes.p}
                      onChange={(e) => updateSoapField('p', e.target.value)}
                      className="w-full p-2.5 bg-white border border-sky-200 rounded-xl text-xs text-sky-950 leading-relaxed focus:ring-2 focus:ring-sky-400 outline-none"
                    />
                  </div>
                </div>

                {/* Mandatory Simulation Badge above Medications / Dosages / Alerts */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-sky-950">Prescribed Medications (الأدوية والجرعات)</h4>
                    <span className="text-[11px] bg-sky-50 text-sky-800 border border-sky-200 font-extrabold px-3 py-0.5 rounded-full">
                      بيانات تجريبية للعرض فقط - محاكاة
                    </span>
                  </div>

                  {medications.map((m, idx) => (
                    <div key={m.id} className="p-3.5 bg-sky-50/60 border border-sky-100 rounded-xl flex justify-between items-center text-xs">
                      <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sky-950">{idx + 1}. {m.name}</span>
                          <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 font-bold text-[10px]">{m.dose}</span>
                          <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-semibold">
                            بيانات تجريبية للعرض فقط - محاكاة
                          </span>
                        </div>
                        <p className="text-sky-700/80">{m.freq} — Duration: {m.days}</p>
                      </div>
                      <button 
                        onClick={() => handleRemoveMedication(m.id)}
                        className="text-sky-500 hover:text-sky-700 font-bold px-2 py-1 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new medication form */}
                <form onSubmit={handleAddMedication} className="p-4 bg-sky-50/50 border border-dashed border-sky-200 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-sky-900 block">+ Add Drug to Rx</span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <input 
                      type="text" 
                      placeholder="Medication Name" 
                      value={newMed.name} 
                      onChange={e => setNewMed({...newMed, name: e.target.value})}
                      className="p-2 border border-sky-200 rounded-lg text-xs bg-white text-sky-950 sm:col-span-2 focus:ring-1 focus:ring-sky-400 outline-none"
                      required
                    />
                    <input 
                      type="text" 
                      placeholder="Dosage (e.g., 500mg)" 
                      value={newMed.dose} 
                      onChange={e => setNewMed({...newMed, dose: e.target.value})}
                      className="p-2 border border-sky-200 rounded-lg text-xs bg-white text-sky-950 focus:ring-1 focus:ring-sky-400 outline-none"
                    />
                    <input 
                      type="text" 
                      placeholder="Days (e.g., 5 days)" 
                      value={newMed.days} 
                      onChange={e => setNewMed({...newMed, days: e.target.value})}
                      className="p-2 border border-sky-200 rounded-lg text-xs bg-white text-sky-950 focus:ring-1 focus:ring-sky-400 outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Frequency / Instructions (e.g., 1 Tab TID after food)" 
                      value={newMed.freq} 
                      onChange={e => setNewMed({...newMed, freq: e.target.value})}
                      className="p-2 border border-sky-200 rounded-lg text-xs bg-white text-sky-950 flex-1 focus:ring-1 focus:ring-sky-400 outline-none"
                    />
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg text-xs shadow-sm transition-all cursor-pointer"
                    >
                      Add Medication
                    </button>
                  </div>
                </form>

              </div>
            </div>

          </div>
        )}

        {/* TAB 4: PATIENT RECORDS */}
        {activeDoctorTab === 'records' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800 text-sm">Recent Clinical Consultations</h3>
              <span className="text-[11px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2.5 py-0.5 rounded-full">
                بيانات تجريبية للعرض فقط - محاكاة
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { name: 'Kareem Tarek', date: 'Yesterday', diagnosis: 'Mild Hypertension - Stage 1', rx: 'Amlodipine 5mg' },
                { name: 'Nour El-Din', date: '2 days ago', diagnosis: 'Gastroenteritis', rx: 'Ciprofloxacin + ORS' },
                { name: 'Salma Mourad', date: '3 days ago', diagnosis: 'Seasonal Allergic Rhinitis', rx: 'Cetirizine 10mg' }
              ].map((rec, i) => (
                <div key={i} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <strong className="text-gray-900 block text-sm">{rec.name}</strong>
                    <span className="text-gray-500">{rec.diagnosis}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 block">{rec.date}</span>
                    <span className="text-emerald-700 font-bold">{rec.rx}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CLINIC SETTINGS & APPOINTMENT AUTOMATION (تجهيز فقط - غير متصل فعلياً) */}
        {activeDoctorTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
              <h3 className="font-bold text-gray-800 text-sm">Clinic Details & Consultation Fee</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl border">
                  <span className="text-gray-500 block">Consultation Fee</span>
                  <strong className="text-sm text-gray-800">{tenant.consultationFee} EGP</strong>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border">
                  <span className="text-gray-500 block">Secretary Contact</span>
                  <strong className="text-sm text-gray-800">{tenant.secretaryPhone}</strong>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border sm:col-span-2">
                  <span className="text-gray-500 block">Registered Branches</span>
                  <div className="mt-1 space-y-1">
                    {tenant.clinicLocations.map(loc => (
                      <div key={loc.id} className="font-semibold text-gray-800">
                        • {loc.name} ({loc.days} — {loc.hours})
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 7. APPOINTMENT AUTOMATION SETTINGS SECTION (قسم إعدادات «أتمتة المواعيد» — تجهيز فقط، غير متصل فعليًا) */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-300 p-6 space-y-4" dir="rtl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Settings size={18} className="text-gray-600" />
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                      قسم إعدادات «أتمتة المواعيد» (Appointment Automation)
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-extrabold">
                      تجهيز / معاينة فقط — غير متصل فعلياً
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    واجهة تجهيزية لمعاينة قواعد الجدولة المستقبلية دون أي اتصال خلفي في هذه النسخة.
                  </p>
                </div>

                {/* Master Toggle: Disabled & Locked OFF */}
                <div className="flex items-center gap-3 bg-gray-100 px-4 py-2.5 rounded-xl border border-gray-300">
                  <input
                    type="checkbox"
                    checked={false}
                    disabled
                    readOnly
                    className="w-4 h-4 rounded cursor-not-allowed opacity-50"
                  />
                  <span className="text-xs font-extrabold text-red-700">
                    غير متصل بواتساب - إعداد للتجهيز فقط
                  </span>
                </div>
              </div>

              {/* Honest Technical Disclosure */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 leading-relaxed flex items-start gap-2.5">
                <Info size={18} className="text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">ملاحظة توضيحية صادقة:</p>
                  <p>
                    التفعيل الفعلي للإرسال التلقائي يحتاج لاحقاً إلى ربط رسمي بـ <strong>WhatsApp Business Platform (Cloud API)</strong> من حساب العيادة التجاري الموثق، وهذا الربط <strong>ليس جزءاً من النسخة الحالية</strong>. جميع الرسائل الحالية تعمل يدوياً عبر <code>wa.me</code> بمراجعة الطبيب.
                  </p>
                </div>
              </div>

              {/* Preview-only items */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs opacity-75">
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-700">إرسال تأكيد الحجز تلقائياً</span>
                    <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-bold">
                      معاينة فقط (غير شغال)
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    تجهيز مستقبلي لإرسال القالب عند تسجيل حجز جديد (معطل حالياً — يعمل يدوياً من تبويب واتساب).
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-700">جدولة تذكير قبل المعاد</span>
                    <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-bold">
                      معاينة فقط (غير شغال)
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    تجهيز مستقبلي لجدولة التذكير قبل 24 ساعة عبر Cron/Webhook (معطل حالياً).
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-700">إيصالات الاستلام والقراءة</span>
                    <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-bold">
                      معاينة فقط (غير شغال)
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    يتطلب Webhook رسمي من Meta (غير متصل في هذه النسخة، التوثيق الحالي يدوي فقط).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {notification && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-xs z-50 flex items-center gap-2 shadow-xl animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-400" />
          {notification}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 8. MASTER APP & ROUTING SWITCHER
// ==========================================
export default function App() {
  const { currentUser, loading, logout } = useAuth();
  const [activePortal, setActivePortal] = useState('landing'); // 'landing' | 'patient-directory' | 'patient' | 'reception' | 'doctor'
  const [demoBypassAuth, setDemoBypassAuth] = useState(true);
  const [tenants, setTenants] = useState(INITIAL_SAAS_TENANTS);
  const [activeTenantId, setActiveTenantId] = useState(INITIAL_SAAS_TENANTS[0].id);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'doctor' | 'receptionist' | 'patient'>('doctor');

  // Automatically route to appropriate portal based on authenticated Firestore role
  useEffect(() => {
    if (currentUser?.role === 'doctor') {
      setActivePortal('doctor');
    } else if (currentUser?.role === 'receptionist') {
      setActivePortal('reception');
    } else if (currentUser?.role === 'patient') {
      setActivePortal('patient');
    }
  }, [currentUser?.role]);

  // 9. UI Language Toggle (عربي / English) persisted in localStorage
  const [uiLang, setUiLang] = useState<'ar' | 'en'>(() => {
    try {
      const saved = localStorage.getItem('ayadati_ui_lang');
      return saved === 'en' ? 'en' : 'ar';
    } catch {
      return 'ar';
    }
  });

  // 8. "Saved on Device" Indicator with Last Saved Timestamp in localStorage
  const [lastSavedAt, setLastSavedAt] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('ayadati_last_saved_at');
      if (saved) return saved;
      const now = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      localStorage.setItem('ayadati_last_saved_at', now);
      return now;
    } catch {
      return new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    }
  });

  const recordLocalSave = () => {
    const now = new Date().toLocaleTimeString(uiLang === 'ar' ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLastSavedAt(now);
    try {
      localStorage.setItem('ayadati_last_saved_at', now);
    } catch {}
  };

  const toggleUiLanguage = () => {
    setUiLang(prev => {
      const next = prev === 'ar' ? 'en' : 'ar';
      try {
        localStorage.setItem('ayadati_ui_lang', next);
      } catch {}
      return next;
    });
    recordLocalSave();
  };

  const handleQuickRoleSwitch = (role: 'doctor' | 'reception' | 'patient' | 'landing') => {
    setDemoBypassAuth(true);
    setActivePortal(role);
    recordLocalSave();
  };

  const handleOpenAuthModal = (tab: 'doctor' | 'receptionist' | 'patient' = 'doctor') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const activeTenant = tenants.find(t => t.id === activeTenantId) || tenants[0];

  // 4. Loading Spinner while Firebase checks Auth State & Firestore User Profile
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F0F8FF] via-[#E0F2FE] to-white flex flex-col items-center justify-center p-4 text-sky-950 font-sans selection:bg-sky-200 selection:text-sky-900">
        <DynamicCursor />
        <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-xl mb-4 border border-sky-200 animate-pulse flex items-center justify-center">
          <img src={SAAS_LOGO_URL} alt="عيادتي حالا" className="w-full h-full object-contain" />
        </div>
        <div className="flex items-center gap-2.5 text-sky-700 text-sm font-bold mb-2">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-sky-500 border-t-transparent"></div>
          <span>Verifying Firebase Authentication...</span>
        </div>
        <p className="text-sky-700/70 text-xs">Checking user session & Firestore profile credentials</p>
      </div>
    );
  }

  // 4. Redirect to AuthScreen if currentUser is null
  if (!currentUser) {
    return (
      <>
        <DynamicCursor />
        <AuthScreen />
      </>
    );
  }

  return (
    <div className="relative min-h-screen bg-white" dir={uiLang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Interactive modern dynamic cursor */}
      <DynamicCursor />
      
      {/* Top Demo Bar + Firebase Active User Header */}
      <div className="sticky top-0 z-[110] bg-white/95 text-sky-950 border-b border-sky-200 px-3 sm:px-6 py-2 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          
          {/* Quick Role Switcher + Current User Identity */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 text-sky-800 px-2.5 py-1 rounded-xl text-[11px] font-bold">
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt={currentUser.name} className="w-4 h-4 rounded-full object-cover border border-sky-300" />
              ) : (
                <span className={`w-2 h-2 rounded-full ${currentUser.isDemoUser ? 'bg-amber-400' : 'bg-sky-500'} animate-pulse`}></span>
              )}
              <span>{currentUser.name}</span>
              <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 text-[10px] uppercase tracking-wider font-extrabold border border-sky-200">
                {currentUser.role}
              </span>
              <span className="text-sky-600/70 hidden sm:inline text-[10px]">({currentUser.department})</span>
            </div>

            <div className="flex items-center bg-sky-50/80 p-1 rounded-xl gap-1 border border-sky-200">
              <button
                type="button"
                onClick={() => handleQuickRoleSwitch('doctor')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                  activePortal === 'doctor'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-sky-800 hover:bg-white'
                }`}
              >
                <Stethoscope size={13} />
                <span>{uiLang === 'ar' ? 'دكتور' : 'Doctor'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleSwitch('reception')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                  activePortal === 'reception'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-sky-800 hover:bg-white'
                }`}
              >
                <Monitor size={13} />
                <span>{uiLang === 'ar' ? 'استقبال' : 'Reception'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleSwitch('patient')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                  activePortal === 'patient'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-sky-800 hover:bg-white'
                }`}
              >
                <User size={13} />
                <span>{uiLang === 'ar' ? 'مريض' : 'Patient'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRoleSwitch('landing')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  activePortal === 'landing'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-sky-700 hover:bg-white'
                }`}
              >
                {uiLang === 'ar' ? 'الرئيسية' : 'Home'}
              </button>
            </div>
          </div>

          {/* Right side: Saved on Device Indicator + Language Toggle + Logout */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-1 rounded-lg text-[11px] font-bold"
              title="يتم حفظ التعديلات محلياً في localStorage على هذا الجهاز"
            >
              <CheckCircle2 size={13} className="text-sky-600 shrink-0" />
              <span>
                {uiLang === 'ar'
                  ? `تم الحفظ على الجهاز • آخر حفظ: ${lastSavedAt}`
                  : `Saved on device • Last: ${lastSavedAt}`}
              </span>
            </div>

            <button
              type="button"
              onClick={toggleUiLanguage}
              className="px-3 py-1 rounded-lg bg-white hover:bg-sky-50 text-sky-700 font-bold text-xs border border-sky-200 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Globe size={13} className="text-sky-500" />
              <span>{uiLang === 'ar' ? 'English / عربي' : 'عربي / English'}</span>
            </button>

            <button
              type="button"
              onClick={() => logout()}
              className="px-3 py-1 rounded-lg bg-white hover:bg-sky-50 text-sky-700 font-bold text-xs border border-sky-200 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Sign out of Firebase"
            >
              <LogOut size={13} className="text-sky-500" />
              <span>{uiLang === 'ar' ? 'خروج' : 'Log Out'}</span>
            </button>
          </div>

        </div>
      </div>


      {/* Floating Onboarding & Switcher Widget ("عيادتي حالا") */}
      <div className="fixed bottom-4 left-4 z-[95] bg-white/95 text-sky-950 p-2 rounded-2xl shadow-xl border border-sky-200 backdrop-blur-md flex items-center gap-2 text-xs">
        <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 p-1 flex items-center justify-center shrink-0">
          <img src={SAAS_LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
        </div>
        
        <button
          onClick={() => handleOpenAuthModal('doctor')}
          className="px-3 py-1.5 rounded-xl font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          title="Onboard Doctor or Reception"
        >
          <Sparkles size={13} className="text-sky-200" />
          <span>Onboard</span>
        </button>

        <button
          onClick={() => logout()}
          className="px-2.5 py-1.5 rounded-xl font-bold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 shadow-sm transition-all flex items-center gap-1 cursor-pointer"
          title="Logout from Firebase Auth"
        >
          <LogOut size={13} className="text-sky-600" />
          <span>Exit</span>
        </button>

        <div className="h-5 w-px bg-sky-200"></div>

        <button
          onClick={() => setActivePortal('landing')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${activePortal === 'landing' ? 'bg-sky-500 text-white shadow-sm' : 'text-sky-700 hover:bg-sky-50'}`}
        >
          Home
        </button>
        <button
          onClick={() => setActivePortal('patient-directory')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${activePortal === 'patient-directory' ? 'bg-sky-500 text-white shadow-sm' : 'text-sky-700 hover:bg-sky-50'}`}
        >
          Patients (اختر تخصص)
        </button>
      </div>

      {/* SaaS Auth & Onboarding Modal */}
      <SaasAuthModal
        isOpen={isAuthModalOpen}
        initialTab={authModalTab}
        onClose={() => setIsAuthModalOpen(false)}
        onRegisterDoctor={(newDoc: Tenant) => {
          setTenants(prev => [newDoc, ...prev]);
          setActiveTenantId(newDoc.id);
          setActivePortal('landing');
          recordLocalSave();
        }}
        onRegisterReceptionist={() => {
          setDemoBypassAuth(true);
          setActivePortal('reception');
          recordLocalSave();
        }}
        onSelectPatientView={() => {
          setActivePortal('patient-directory');
        }}
      />

      {/* Portal Routing */}
      {activePortal === 'landing' && (
        <LandingPortal 
          tenant={activeTenant}
          onSelectPortal={(role: string) => {
            setDemoBypassAuth(false);
            setActivePortal(role);
          }} 
          onOpenSaasModal={(tab) => handleOpenAuthModal(tab || 'doctor')}
        />
      )}
      {activePortal === 'patient-directory' && (
        <PatientDirectoryView
          tenants={tenants}
          onSelectTenant={(doc: Tenant) => {
            setActiveTenantId(doc.id);
            setActivePortal('landing');
          }}
          onBackToHome={() => setActivePortal('landing')}
        />
      )}
      {activePortal === 'patient' && (
        <PatientPortal 
          tenant={activeTenant}
          demoBypassAuth={demoBypassAuth}
          uiLang={uiLang}
          onBackToHome={() => setActivePortal('landing')} 
        />
      )}
      {activePortal === 'reception' && (
        <ReceptionPortal 
          tenant={activeTenant}
          demoBypassAuth={demoBypassAuth}
          onLocalSave={recordLocalSave}
          uiLang={uiLang}
          onBackToHome={() => setActivePortal('landing')} 
        />
      )}
      {activePortal === 'doctor' && (
        <DoctorPortal 
          tenant={activeTenant}
          demoBypassAuth={demoBypassAuth}
          onLocalSave={recordLocalSave}
          uiLang={uiLang}
          onBackToHome={() => setActivePortal('landing')} 
        />
      )}

    </div>
  );
}