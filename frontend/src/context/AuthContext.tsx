'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  doc,
  setDoc,
  getDoc,
} from '@/lib/firebase';

export type Role = 'Fan' | 'Volunteer' | 'Organizer' | 'Security';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: Role;
  isGuest: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginWithGoogle: async () => {},
  loginAsGuest: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrCreateUserProfile = async (firebaseUser: User, isGuest: boolean) => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    let profile: UserProfile;

    if (userSnap.exists()) {
      profile = userSnap.data() as UserProfile;
    } else {
      // Default to Fan if new user
      profile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: isGuest ? 'Guest Fan' : firebaseUser.displayName,
        role: 'Fan',
        isGuest,
      };
      await setDoc(userRef, profile);
    }

    setUser(profile);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchOrCreateUserProfile(firebaseUser, firebaseUser.isAnonymous);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google login failed', error);
    }
  };

  const loginAsGuest = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error('Guest login failed', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
