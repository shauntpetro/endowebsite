import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Building2, Mail, Phone, DollarSign, Shield, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface InvestorRegistration {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  role: string;
  phone: string;
  investment_preferences: string[];
  accreditation_status: string;
  investment_capacity_range: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const InvestorApproval = () => {
  const [registrations, setRegistrations] = useState<InvestorRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('investor_registrations')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRegistrations(data || []);
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setError('Failed to load investor registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (registrationId: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('investor_registrations')
        .update({ status: approved ? 'approved' : 'rejected' })
        .eq('id', registrationId);

      if (error) throw error;

      // Update local state
      setRegistrations(prev => prev.filter(reg => reg.id !== registrationId));
    } catch (err) {
      console.error('Error updating registration status:', err);
      setError('Failed to update registration status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin text-gold-600" size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Pending Investor Registrations
        </h3>
        <span className="px-3 py-1 bg-gold-100 text-gold-800 rounded-full text-sm font-medium">
          {registrations.length} Pending
        </span>
      </div>

      {registrations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No pending registrations</h3>
          <p className="mt-1 text-sm text-gray-500">All investor registrations have been processed</p>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((registration) => (
            <motion.div
              key={registration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {registration.first_name} {registration.last_name}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <Mail size={16} />
                      <span>{registration.email}</span>
                    </div>
                    {registration.phone && (
                      <div className="flex items-center gap-2 text-gray-600 mt-1">
                        <Phone size={16} />
                        <span>{registration.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Building2 size={16} />
                        <span className="font-medium">Company</span>
                      </div>
                      <p className="text-gray-600 mt-1">{registration.company}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Building2 size={16} />
                        <span className="font-medium">Role</span>
                      </div>
                      <p className="text-gray-600 mt-1">{registration.role}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                      <Shield size={16} />
                      <span className="font-medium">Investment Profile</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Accreditation Status</p>
                        <p className="text-gray-900 mt-1">
                          {registration.accreditation_status.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Investment Capacity</p>
                        <p className="text-gray-900 mt-1">
                          {registration.investment_capacity_range.replace(/_/g, ' - ').replace('m', 'M')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {registration.investment_preferences && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Investment Preferences</p>
                      <div className="flex flex-wrap gap-2">
                        {registration.investment_preferences.map(pref => (
                          <span
                            key={pref}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {pref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-gray-500">
                    Registered: {new Date(registration.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleApproval(registration.id, true)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                  >
                    <CheckCircle size={24} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleApproval(registration.id, false)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <XCircle size={24} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};