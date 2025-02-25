import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabase } from '../../context/SupabaseContext';
import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  investorStatus: 'pending' | 'approved' | 'rejected' | null;
  loading: boolean;
  user: User | null;
  refreshStatus: () => Promise<void>;
  clearStatus: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  investorStatus: null,
  loading: true,
  user: null,
  refreshStatus: async () => {},
  clearStatus: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user } = useSupabase();
  const [loading, setLoading] = useState(true);
  const [investorStatus, setInvestorStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);

  const clearStatus = () => {
    setInvestorStatus(null);
    setLoading(false);
  };

  const checkStatus = async () => {
    if (!user) {
      clearStatus();
      return;
    }

    try {
      setLoading(true);

      // First check if user is admin
      if (user.user_metadata?.role === 'admin') {
        setInvestorStatus('approved');
        setLoading(false);
        return;
      }

      // Check user metadata first for cached status
      const metadataStatus = user.user_metadata?.investor_status;
      if (metadataStatus) {
        setInvestorStatus(metadataStatus);
        setLoading(false);
        return;
      }

      // If no metadata status, check database
      const { data: registration, error } = await supabase
        .from('investor_registrations')
        .select('status')
        .eq('user_id', user.id)
        .maybeSingle();

      // Handle case where no registration exists
      if (error && error.code === 'PGRST116') {
        // No registration found - set status to null
        setInvestorStatus(null);
        setLoading(false);
        return;
      }

      // Handle other errors
      if (error) {
        console.error('Error checking registration status:', error);
        clearStatus();
        return;
      }

      // If registration found, update metadata and state
      if (registration?.status) {
        const status = registration.status;
        setInvestorStatus(status);
        
        // Update user metadata
        await supabase.auth.updateUser({
          data: { investor_status: status }
        });
      } else {
        clearStatus();
      }
    } catch (err) {
      console.error('Error checking investor status:', err);
      clearStatus();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check status immediately when component mounts or user changes
    if (user) {
      checkStatus();
    } else {
      clearStatus();
    }
  }, [user?.id]); // Only re-run when user ID changes

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!user,
      investorStatus,
      loading,
      user,
      refreshStatus: checkStatus,
      clearStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}