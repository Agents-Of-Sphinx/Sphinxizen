
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoadingAuth(false);
    });
    return unsub;
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoadingAuth,
    isLoadingPublicSettings: false,
    authError: null,
    appPublicSettings: null,
    navigateToLogin: () => {
      window.location.href = '/profile';
    },
    logout: async () => {
      await signOut(auth);
    },
    login: async (email, password) => signInWithEmailAndPassword(auth, email, password),
    signup: async (email, password, fullName) => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (fullName?.trim()) {
        await updateProfile(cred.user, { displayName: fullName.trim() });
      }
      return cred;
    },
  }), [user, isLoadingAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
