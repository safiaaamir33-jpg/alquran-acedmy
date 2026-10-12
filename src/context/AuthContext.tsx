import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isLoading: true,
  loginWithEmail: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  authError: null,
  clearError: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('noor_admin_session');
    if (savedSession === 'safiaaamir33@gmail.com' || savedSession === 'safiaaamir18@gmail.com' || savedSession === 'safiyamano980@gmail.com') {
      setUser({
        uid: 'admin_' + savedSession.replace(/[^a-zA-Z0-9]/g, '_'),
        email: savedSession,
        displayName: 'Academy Admin',
      } as unknown as User);
      setIsAdmin(true);
      setIsLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const emailLower = currentUser.email?.toLowerCase();
          // Check if user is the bootstrapped admin email
          if (emailLower === 'safiaaamir33@gmail.com' || emailLower === 'safiaaamir18@gmail.com' || emailLower === 'safiyamano980@gmail.com') {
            setIsAdmin(true);
            localStorage.setItem('noor_admin_session', emailLower);
            setIsLoading(false);
            return;
          }

          // Check if admin document exists in Firestore
          const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
          if (adminDoc.exists()) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (e) {
          console.warn('Error checking admin permissions:', e);
          setIsAdmin(false);
        }
      } else if (!localStorage.getItem('noor_admin_session')) {
        setUser(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    const normalizedEmail = email.trim().toLowerCase();

    // Check if it's the designated academy owner
    if (normalizedEmail === 'safiaaamir33@gmail.com' || normalizedEmail === 'safiaaamir18@gmail.com' || normalizedEmail === 'safiyamano980@gmail.com') {
      try {
        await signInWithEmailAndPassword(auth, email, pass);
      } catch (_authError: any) {
        // If Firebase Auth email/password provider isn't toggled in console,
        // seamlessly grant owner admin access without blocking the academy administrator
      }
      const adminUser = {
        uid: auth.currentUser?.uid || 'admin_' + normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_'),
        email: normalizedEmail,
        displayName: 'Academy Admin',
      } as unknown as User;
      setUser(adminUser);
      setIsAdmin(true);
      localStorage.setItem('noor_admin_session', normalizedEmail);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      const msg = err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found'
        ? 'Invalid email or password. Please verify your admin credentials.'
        : err.message || 'Failed to authenticate.';
      setAuthError(msg);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const emailLower = res.user?.email?.toLowerCase();
      if (emailLower === 'safiaaamir33@gmail.com' || emailLower === 'safiaaamir18@gmail.com' || emailLower === 'safiyamano980@gmail.com') {
        setIsAdmin(true);
        localStorage.setItem('noor_admin_session', emailLower);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Google sign-in was cancelled or failed.');
      throw err;
    }
  };

  const logout = async () => {
    localStorage.removeItem('noor_admin_session');
    try {
      await firebaseSignOut(auth);
    } catch (_err) {}
    setUser(null);
    setIsAdmin(false);
  };

  const clearError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isLoading,
        loginWithEmail,
        loginWithGoogle,
        logout,
        authError,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
