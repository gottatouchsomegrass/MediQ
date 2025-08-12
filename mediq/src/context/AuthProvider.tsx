'use client';

import { SessionProvider } from 'next-auth/react';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor';
  specialty?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, role: 'patient' | 'doctor') => Promise<void>;
  signUp: (email: string, password: string, name: string, role: 'patient' | 'doctor', specialty?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthContextProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
    } else if (session?.user) {
      // In a real app, you'd fetch user details from your database
      setUser({
        id: session.user.id || '',
        email: session.user.email || '',
        name: session.user.name || '',
        role: (session.user as any).role || 'patient',
        specialty: (session.user as any).specialty,
      });
      setLoading(false);
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [session, status]);

  const handleSignIn = async (email: string, password: string, role: 'patient' | 'doctor') => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        role,
        redirect: false,
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string, name: string, role: 'patient' | 'doctor', specialty?: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          role,
          specialty,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Sign up failed');
      }

      // After successful signup, sign in
      await handleSignIn(email, password, role);
    } catch (error) {
      throw error;
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Main AuthProvider that combines SessionProvider with AuthContext
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;
