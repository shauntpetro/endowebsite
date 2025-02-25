import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Trash2, Shield, Mail, Lock, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface User {
  id: string;
  email: string;
  raw_user_meta_data: {
    role?: string;
  };
  created_at: string;
  last_sign_in_at: string | null;
}

export const UserAuthentication = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc('get_users');

      if (error) throw error;

      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please ensure you have admin privileges.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: { role: newUser.role }
        }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        await fetchUsers(); // Refresh the user list
        setShowCreateForm(false);
        setNewUser({ email: '', password: '', role: 'user' });
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Failed to create user. The email might already be registered.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const { error } = await supabase.rpc('delete_managed_user', { user_id: userId });

      if (error) throw error;

      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please ensure you have admin privileges.');
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin text-gold-600" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gold-600 hover:bg-gold-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500"
        >
          <UserPlus className="-ml-1 mr-2 h-5 w-5" />
          Create User
        </motion.button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {showCreateForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          onSubmit={handleCreateUser}
          className="bg-gray-50 rounded-lg p-6 space-y-4"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                id="email"
                required
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="password"
                id="password"
                required
                minLength={8}
                value={newUser.password}
                onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">Minimum 8 characters</p>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <div className="mt-1 relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select
                id="role"
                value={newUser.role}
                onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 sm:text-sm"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gold-600 hover:bg-gold-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              ) : (
                <CheckCircle className="-ml-1 mr-2 h-5 w-5" />
              )}
              Create User
            </button>
          </div>
        </motion.form>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <motion.li
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-6 py-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Shield className="h-4 w-4 mr-1" />
                    <span className="capitalize">{user.raw_user_meta_data?.role || 'user'}</span>
                    <span className="mx-2">•</span>
                    <span>Created {new Date(user.created_at).toLocaleDateString()}</span>
                    {user.last_sign_in_at && (
                      <>
                        <span className="mx-2">•</span>
                        <span>Last login {new Date(user.last_sign_in_at).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeleteUser(user.id)}
                  className="p-2 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};