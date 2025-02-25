import React from 'react';
import { useAuth } from './AuthContext';
import { InvestorAuth } from './InvestorAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, investorStatus, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <InvestorAuth onClose={() => {}} />;
  }

  if (investorStatus === 'pending') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-yellow-50 p-8 rounded-xl max-w-md text-center">
          <h2 className="text-xl font-semibold text-yellow-800 mb-4">Registration Pending</h2>
          <p className="text-yellow-700">
            Your registration is currently under review. You will be notified once approved.
          </p>
        </div>
      </div>
    );
  }

  if (investorStatus === 'rejected') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 p-8 rounded-xl max-w-md text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-4">Access Denied</h2>
          <p className="text-red-700">
            Your registration was not approved. Please contact support for more information.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}