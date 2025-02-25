import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, auth } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface SupabaseContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, registration } = await auth.signIn(email, password);
      
      // Set session and user immediately
      setSession(data.session);
      setUser(data.user);

      // Update user metadata if needed
      if (registration?.status && data.user.user_metadata?.investor_status !== registration.status) {
        await supabase.auth.updateUser({
          data: { investor_status: registration.status }
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    await auth.signOut();
    setSession(null);
    setUser(null);
  };

  return (
    <SupabaseContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signOut
    }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}