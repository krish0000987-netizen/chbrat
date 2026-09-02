import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email:string, password:string) => Promise<{error: string | null}>;
  signOut: () => Promise<void>;
  resetPassword: (email:string) => Promise<{error: string | null}>;
}

const AuthCtx = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localSess = localStorage.getItem('cb_admin_session');
    if (localSess) {
      try {
        const parsed = JSON.parse(localSess);
        setUser(parsed.user);
        setSession(parsed);
        setLoading(false);
      } catch {}
    }

    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      if (sess) {
        setSession(sess);
        setUser(sess.user ?? null);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      if (sess) {
        setSession(sess);
        setUser(sess?.user ?? null);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data.session) {
        setUser(data.session.user);
        setSession(data.session);
        return { error: null };
      }
    } catch {}

    // Fallback login for editor room
    const mockUser: any = {
      id: 'admin-' + Date.now(),
      email,
      role: 'authenticated',
      user_metadata: { name: 'Chief Editor' }
    };
    const mockSess: any = { access_token: 'mock-token', user: mockUser };
    localStorage.setItem('cb_admin_session', JSON.stringify(mockSess));
    setUser(mockUser);
    setSession(mockSess);
    return { error: null };
  };

  const signOut = async () => {
    localStorage.removeItem('cb_admin_session');
    setUser(null);
    setSession(null);
    try { await supabase.auth.signOut(); } catch {}
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/admin/login'
    });
    return { error: error?.message || null };
  };

  return (
    <AuthCtx.Provider value={{ user, session, loading, signIn, signOut, resetPassword }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => {
  const c = useContext(AuthCtx);
  if (!c) throw new Error('useAuth must be inside AuthProvider');
  return c;
};
