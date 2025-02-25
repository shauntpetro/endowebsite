import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, Loader2, User, Building2, Phone, Shield, DollarSign } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface InvestorRegistrationFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const INVESTMENT_PREFERENCES = [
  'Early Stage',
  'Growth Stage',
  'Clinical Trials',
  'Research & Development',
  'Medical Devices',
  'Therapeutics'
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  company: string;
  role: string;
  investmentPreferences: string[];
  accreditationStatus: string;
  investmentCapacityRange: string;
}

export const InvestorRegistrationForm = ({ onClose, onSuccess }: InvestorRegistrationFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    company: '',
    role: '',
    investmentPreferences: [],
    accreditationStatus: 'pending_verification',
    investmentCapacityRange: 'under_250k'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePreferenceToggle = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      investmentPreferences: prev.investmentPreferences.includes(preference)
        ? prev.investmentPreferences.filter(p => p !== preference)
        : [...prev.investmentPreferences, preference]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            company: formData.company,
            role: formData.role,
            phone: formData.phone,
            investment_preferences: formData.investmentPreferences,
            accreditation_status: formData.accreditationStatus,
            investment_capacity_range: formData.investmentCapacityRange,
            investor_status: 'pending'
          }
        }
      });

      if (signUpError) throw signUpError;

      // Call onSuccess to show the success message
      onSuccess();
    } catch (err) {
      console.error('Supabase request failed:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-display font-bold text-gray-900 mb-4">
        Investor Registration
      </h2>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 p-2 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm"
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <div className="relative">
              <User className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                name="firstName"
                id="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="pl-8 w-full rounded-lg border-gray-300 focus:border-gold-500 focus:ring-gold-500 text-sm h-9"
              />
            </div>
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <div className="relative">
              <User className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                name="lastName"
                id="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="pl-8 w-full rounded-lg border-gray-300 focus:border-gold-500 focus:ring-gold-500 text-sm h-9"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="pl-8 w-full rounded-lg border-gray-300 focus:border-gold-500 focus:ring-gold-500 text-sm h-9"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="password"
              name="password"
              id="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="pl-8 w-full rounded-lg border-gray-300 focus:border-gold-500 focus:ring-gold-500 text-sm h-9"
            />
          </div>
          <p className="mt-0.5 text-xs text-gray-500">Minimum 8 characters</p>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <div className="relative">
            <Phone className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="pl-8 w-full rounded-lg border-gray-300 focus:border-gold-500 focus:ring-gold-500 text-sm h-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <div className="relative">
              <Building2 className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                name="company"
                id="company"
                value={formData.company}
                onChange={handleChange}
                className="pl-8 w-full rounded-lg border-gray-300 focus:border-gold-500 focus:ring-gold-500 text-sm h-9"
              />
            </div>
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <div className="relative">
              <Building2 className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="pl-8 w-full rounded-lg border-gray-300 focus:border-gold-500 focus:ring-gold-500 text-sm h-9"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Investment Preferences *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {INVESTMENT_PREFERENCES.map(preference => (
              <button
                key={preference}
                type="button"
                onClick={() => handlePreferenceToggle(preference)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  formData.investmentPreferences.includes(preference)
                    ? 'bg-gold-100 text-gold-800 border border-gold-200'
                    : 'bg-gray-100 text-gray-700 border border-transparent hover:bg-gray-200'
                }`}
              >
                {preference}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="accreditationStatus" className="block text-sm font-medium text-gray-700 mb-1">
            Accreditation Status *
          </label>
          <div className="relative">
            <Shield className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              name="accreditationStatus"
              id="accreditationStatus"
              required
              value={formData.accreditationStatus}
              onChange={handleChange}
              className="pl-8 w-full rounded-lg border-gray-300 focus:border-gold-500 focus:ring-gold-500 text-sm h-9"
            >
              <option value="pending_verification">Pending Verification</option>
              <option value="accredited">Accredited Investor</option>
              <option value="qualified_purchaser">Qualified Purchaser</option>
              <option value="non_accredited">Non-Accredited</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="investmentCapacityRange" className="block text-sm font-medium text-gray-700 mb-1">
            Investment Capacity Range *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              name="investmentCapacityRange"
              id="investmentCapacityRange"
              required
              value={formData.investmentCapacityRange}
              onChange={handleChange}
              className="pl-8 w-full rounded-lg border-gray-300 focus:border-gold-500 focus:ring-gold-500 text-sm h-9"
            >
              <option value="under_250k">Under $250,000</option>
              <option value="250k_to_1m">$250,000 - $1,000,000</option>
              <option value="1m_to_5m">$1,000,000 - $5,000,000</option>
              <option value="5m_to_10m">$5,000,000 - $10,000,000</option>
              <option value="above_10m">Above $10,000,000</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gold-600 text-white py-2 px-4 rounded-lg hover:bg-gold-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              'Register'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};