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

  useEffect(()=>{
    supabase.auth.getSession().then(({ data:{session} })=>{
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess)=>{
      setSession(sess);
      setUser(sess?.user ?? null);
    });
    return ()=> sub.subscription.unsubscribe();
  },[]);

  const signIn = async (email:string, password:string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  };
  const signOut = async () => { await supabase.auth.signOut(); };
  const resetPassword = async (email:string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/admin/login' });
    return { error: error?.message || null };
  };

  return <AuthCtx.Provider value={{ user, session, loading, signIn, signOut, resetPassword }}>{children}</AuthCtx.Provider>;
};

export const useAuth = () => {
  const c = useContext(AuthCtx);
  if (!c) throw new Error('useAuth must be inside AuthProvider');
  return c;
};
