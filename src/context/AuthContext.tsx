import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isPlaceholderConfig } from '../lib/firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  name: string;
  role: 'doctor' | 'receptionist' | 'patient' | 'admin' | string;
  department: string;
  photoURL?: string | null;
  createdAt?: string | number | null;
  updatedAt?: string | number | null;
  isDemoUser?: boolean;
}

export interface SignupOptions {
  name?: string;
  role?: 'doctor' | 'receptionist' | 'patient' | 'admin' | string;
  department?: string;
}

export interface AuthContextType {
  currentUser: UserProfile | null;
  firebaseUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, options?: SignupOptions) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  demoLogin: (role?: 'doctor' | 'receptionist' | 'patient', name?: string, department?: string) => void;
  isPlaceholderAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isPlaceholder = isPlaceholderConfig();

  // Helper to extract clean error message
  const formatAuthError = (err: unknown): string => {
    if (err && typeof err === 'object' && 'code' in err) {
      const code = String((err as { code: string }).code);
      switch (code) {
        case 'auth/popup-closed-by-user':
          return 'Google sign-in popup was closed before completing.';
        case 'auth/cancelled-popup-request':
          return 'The Google sign-in request was cancelled.';
        case 'auth/popup-blocked':
          return 'The Google sign-in popup was blocked by your browser. Please allow popups for this site.';
        case 'auth/unauthorized-domain':
          return 'This domain is not authorized in Firebase Auth. Please verify Authorized Domains in Firebase Console.';
        case 'auth/invalid-email':
          return 'Invalid email address format.';
        case 'auth/user-disabled':
          return 'This user account has been disabled.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          return 'Invalid email or password. Please verify and try again.';
        case 'auth/email-already-in-use':
          return 'An account already exists with this email address. Try logging in.';
        case 'auth/weak-password':
          return 'Password should be at least 6 characters.';
        case 'auth/network-request-failed':
          return 'Network connection error. Check your connection or Firebase project config.';
        case 'auth/api-key-not-valid':
        case 'auth/invalid-api-key':
          return 'Firebase API key is invalid or not yet configured in .env. You can use Demo Mode below.';
        default:
          return (err as unknown as { message?: string })?.message || 'An error occurred during authentication.';
      }
    }
    return err instanceof Error ? err.message : 'Authentication failed.';
  };

  // Fetch or create user document in Firestore
  const fetchUserData = async (user: User): Promise<UserProfile> => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        return {
          uid: user.uid,
          email: user.email,
          name: data.name || user.displayName || user.email?.split('@')[0] || 'Doctor',
          role: data.role || 'doctor',
          department: data.department || 'General Medicine',
          photoURL: (data.photoURL || user.photoURL) || null,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      }

      // If document doesn't exist yet, build fallback profile and attempt to persist
      const fallbackName = (user.displayName || user.email?.split('@')[0] || 'Doctor').slice(0, 100);
      const safeEmail = (user.email || `${user.uid}@clinic.portal`).slice(0, 256);
      const safePhotoURL = (user.photoURL && typeof user.photoURL === 'string' && user.photoURL.length <= 500)
        ? user.photoURL
        : undefined;

      const fallbackProfile: UserProfile = {
        uid: user.uid,
        email: safeEmail,
        name: fallbackName,
        role: 'doctor',
        department: 'General Medicine',
        ...(safePhotoURL ? { photoURL: safePhotoURL } : {}),
      };

      try {
        const payloadToPersist: Record<string, unknown> = {
          uid: fallbackProfile.uid,
          email: fallbackProfile.email,
          name: fallbackProfile.name,
          role: fallbackProfile.role,
          department: fallbackProfile.department,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        if (safePhotoURL) {
          payloadToPersist.photoURL = safePhotoURL;
        }
        await setDoc(userDocRef, payloadToPersist);
      } catch (writeErr) {
        console.warn('Could not auto-create user profile doc in Firestore:', writeErr);
      }

      return fallbackProfile;
    } catch (fetchErr) {
      console.warn('Error reading from Firestore users collection, using auth fallback:', fetchErr);
      return {
        uid: user.uid,
        email: user.email,
        name: (user.displayName || user.email?.split('@')[0] || 'Doctor').slice(0, 100),
        role: 'doctor',
        department: 'General Medicine',
        photoURL: (user.photoURL && user.photoURL.length <= 500) ? user.photoURL : null,
      };
    }
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    let isMounted = true;

    // Check for existing demo session in sessionStorage
    const savedDemoUser = sessionStorage.getItem('ayadatihala_demo_user');
    if (savedDemoUser) {
      try {
        const parsed = JSON.parse(savedDemoUser);
        if (parsed && parsed.uid) {
          setCurrentUser(parsed);
          setLoading(false);
        }
      } catch {}
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!isMounted) return;

        if (user) {
          setFirebaseUser(user);
          try {
            const profile = await fetchUserData(user);
            if (isMounted) {
              setCurrentUser(profile);
              sessionStorage.removeItem('ayadatihala_demo_user');
            }
          } catch {
            if (isMounted) {
              setCurrentUser({
                uid: user.uid,
                email: user.email,
                name: user.displayName || user.email?.split('@')[0] || 'Doctor',
                role: 'doctor',
                department: 'General Medicine',
              });
            }
          }
        } else {
          setFirebaseUser(null);
          // If no active demo user, clear currentUser
          const demoSession = sessionStorage.getItem('ayadatihala_demo_user');
          if (!demoSession) {
            setCurrentUser(null);
          }
        }

        if (isMounted) {
          setLoading(false);
        }
      },
      (authError) => {
        console.warn('Firebase Auth State Error:', authError);
        if (isMounted) {
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Login with Email and Password
  const login = async (email: string, password: string): Promise<void> => {
    setError(null);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const profile = await fetchUserData(userCredential.user);
      setCurrentUser(profile);
      setFirebaseUser(userCredential.user);
      sessionStorage.removeItem('ayadatihala_demo_user');
    } catch (err) {
      const formatted = formatAuthError(err);
      setError(formatted);
      throw new Error(formatted);
    } finally {
      setLoading(false);
    }
  };

  // Register new user with Email, Password & auto-create Firestore doc
  const signup = async (email: string, password: string, options?: SignupOptions): Promise<void> => {
    setError(null);
    setLoading(true);

    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Prepare user profile fields (default role: "doctor", name: email prefix)
      const emailPrefix = email.includes('@') ? email.split('@')[0] : 'User';
      const resolvedName = options?.name?.trim() || emailPrefix;
      const resolvedRole = options?.role || 'doctor';
      
      let defaultDept = 'General Medicine';
      if (resolvedRole === 'receptionist') defaultDept = 'Front Desk & Reception';
      else if (resolvedRole === 'patient') defaultDept = 'Outpatient Care';
      else if (resolvedRole === 'admin') defaultDept = 'Hospital Administration';
      const resolvedDepartment = options?.department?.trim() || defaultDept;

      // 3. Update auth display name
      try {
        await updateProfile(user, { displayName: resolvedName });
      } catch (profileErr) {
        console.warn('Could not update Firebase user displayName:', profileErr);
      }

      // 4. Create document in Firestore 'users' collection with uid
      const userDocRef = doc(db, 'users', user.uid);
      const userDocData: UserProfile = {
        uid: user.uid,
        email: user.email,
        name: resolvedName,
        role: resolvedRole,
        department: resolvedDepartment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        await setDoc(userDocRef, userDocData);
      } catch (firestoreErr) {
        console.warn('Firestore user doc write warning (rules or offline):', firestoreErr);
      }

      setFirebaseUser(user);
      setCurrentUser(userDocData);
      sessionStorage.removeItem('ayadatihala_demo_user');
    } catch (err) {
      const formatted = formatAuthError(err);
      setError(formatted);
      throw new Error(formatted);
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In with popup
  const signInWithGoogle = async (): Promise<void> => {
    setError(null);
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account',
      });

      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const profile = await fetchUserData(user);
      setFirebaseUser(user);
      setCurrentUser(profile);
      sessionStorage.removeItem('ayadatihala_demo_user');
    } catch (err) {
      const formatted = formatAuthError(err);
      setError(formatted);
      throw new Error(formatted);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    setError(null);
    setLoading(true);
    try {
      sessionStorage.removeItem('ayadatihala_demo_user');
      await signOut(auth);
      setCurrentUser(null);
      setFirebaseUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Demo Login fallback (works immediately even without configured live Firebase keys)
  const demoLogin = (
    role: 'doctor' | 'receptionist' | 'patient' = 'doctor',
    name?: string,
    department?: string
  ): void => {
    const demoProfiles: Record<string, UserProfile> = {
      doctor: {
        uid: 'demo-doc-wright-001',
        email: 'dr.wright@ayadatihala.com',
        name: name || 'Dr. Alexander Wright',
        role: 'doctor',
        department: department || 'Internal Medicine',
        isDemoUser: true,
      },
      receptionist: {
        uid: 'demo-rec-maryam-002',
        email: 'reception@ayadatihala.com',
        name: name || 'Maryam Ahmed',
        role: 'receptionist',
        department: department || 'Reception & Front Desk',
        isDemoUser: true,
      },
      patient: {
        uid: 'demo-pat-samir-003',
        email: 'patient.samir@example.com',
        name: name || 'Samir Mansour',
        role: 'patient',
        department: department || 'Outpatient Consultation',
        isDemoUser: true,
      },
    };

    const chosen = demoProfiles[role] || demoProfiles.doctor;
    sessionStorage.setItem('ayadatihala_demo_user', JSON.stringify(chosen));
    setCurrentUser(chosen);
    setError(null);
  };

  const clearError = () => setError(null);

  const value: AuthContextType = {
    currentUser,
    firebaseUser,
    loading,
    error,
    login,
    signup,
    signInWithGoogle,
    logout,
    clearError,
    demoLogin,
    isPlaceholderAuth: isPlaceholder,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
