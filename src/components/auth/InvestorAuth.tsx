import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, AlertCircle, Loader2, X, CheckCircle } from 'lucide-react';
import { InvestorRegistrationForm } from './InvestorRegistrationForm';
import { supabase } from '../../lib/supabase';
import { useAuth } from './AuthContext';

interface InvestorAuthProps {
  onClose: () => void;
}

export const InvestorAuth = ({ onClose }: InvestorAuthProps) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshStatus } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Get fresh session first
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      // Sign out if there's an existing session
      if (currentSession) {
        await supabase.auth.signOut();
      }

      // Attempt to sign in
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (signInError) {
        throw signInError;
      }

      // Get fresh session to ensure we have latest metadata
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No session after sign in');
      }

      // Check if user is admin
      if (session.user.user_metadata?.role === 'admin') {
        await refreshStatus();
        onClose();
        return;
      }

      // Check registration status
      const { data: registration, error: regError } = await supabase
        .from('investor_registrations')
        .select('status')
        .eq('user_id', session.user.id)
        .single();

      if (regError) {
        throw new Error('Please register first to access the investor portal.');
      }

      if (registration.status === 'pending') {
        throw new Error('Your registration is pending approval. You will be notified once approved.');
      }

      if (registration.status === 'rejected') {
        throw new Error('Your registration has been rejected. Please contact support for assistance.');
      }

      // Update user metadata with registration status
      await supabase.auth.updateUser({
        data: { investor_status: registration.status }
      });

      // Refresh status and close modal
      await refreshStatus();
      onClose();
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationSuccess = async () => {
    setRegistrationSuccess(true);
    await refreshStatus();
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden relative"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <X size={20} />
        </motion.button>

        <AnimatePresence mode="wait">
          {registrationSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Registration Successful
              </h3>
              <p className="text-gray-600">
                Thank you for registering. Your account is pending approval.
                You will be notified once your registration is approved.
              </p>
            </motion.div>
          ) : isRegistering ? (
            <InvestorRegistrationForm 
              onClose={onClose}
              onSuccess={handleRegistrationSuccess}
            />
          ) : (
            <div className="p-8">
              <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
                Investor Sign In
              </h2>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2"
                >
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full rounded-lg border-gray-300 focus:border-gold-500 focus:ring-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      name="password"
                      id="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 w-full rounded-lg border-gray-300 focus:border-gold-500 focus:ring-gold-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    type="button"
                    onClick={() => setIsRegistering(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Register
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gold-600 text-white py-2 px-4 rounded-lg hover:bg-gold-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      'Sign In'
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}