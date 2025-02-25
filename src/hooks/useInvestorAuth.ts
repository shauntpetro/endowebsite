import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useSupabase } from '../context/SupabaseContext';

interface InvestorAuthError {
  message: string;
  code?: string;
}

export function useInvestorAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<InvestorAuthError | null>(null);
  const { user } = useSupabase();

  const register = useCallback(async ({
    email,
    password,
    firstName,
    lastName,
    company,
    role
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    company: string;
    role: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            company,
            role,
            investor_status: 'pending'
          }
        }
      });

      if (error) throw error;

      return data;
    } catch (err) {
      const authError = err as Error;
      setError({
        message: authError.message,
        code: 'registration_error'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkStatus = useCallback(async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('investor_profiles')
        .select('status')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return data?.status || user.user_metadata.investor_status;
    } catch (err) {
      console.error('Error checking investor status:', err);
      return null;
    }
  }, [user]);

  return {
    register,
    checkStatus,
    loading,
    error,
    isAuthenticated: !!user,
    user
  };
}