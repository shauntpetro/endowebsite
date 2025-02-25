import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with improved configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
  global: {
    headers: {
      'x-application-name': 'endocyclic-therapeutics',
    },
  },
});

// Enhanced auth methods with better error handling
export const auth = {
  async signIn(email: string, password: string) {
    try {
      // First check if user exists and their status
      const { data: registration, error: regError } = await supabase
        .from('investor_registrations')
        .select('status')
        .eq('email', email)
        .single();

      if (regError && regError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw regError;
      }

      // If user exists and was rejected, prevent login
      if (registration?.status === 'rejected') {
        throw new Error('Your registration has been rejected. Please contact support for assistance.');
      }

      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password');
        }
        throw error;
      }

      // Update user metadata with investor status
      if (registration?.status) {
        await supabase.auth.updateUser({
          data: { investor_status: registration.status }
        });
      }

      return { data, registration };
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local storage
      window.localStorage.removeItem('supabase.auth.token');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get session error:', error);
      throw error;
    }
  }
};

export default supabase;