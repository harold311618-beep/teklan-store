"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'admin@teklan.com')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsAdmin(
        firebaseUser?.email
          ? ADMIN_EMAILS.includes(firebaseUser.email.toLowerCase())
          : false
      );
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    setAuthError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const message = error?.message || 'No pudimos iniciar sesión. Revisa tus credenciales.';
      setAuthError(message);
      throw error;
    }
  };

  const signUp = async (email, password) => {
    setAuthError('');

    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const message = error?.message || 'No pudimos crear tu cuenta. Revisa tus datos.';
      setAuthError(message);
      throw error;
    }
  };

  const logOut = async () => {
    await firebaseSignOut(auth);
  };

  const value = useMemo(() => ({
    user,
    loading,
    authError,
    isAdmin,
    signIn,
    signUp,
    logOut,
  }), [user, loading, authError, isAdmin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used dentro de AuthProvider');
  }

  return context;
}
