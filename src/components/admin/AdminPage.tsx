import React, { useState } from 'react';
import { Shield, Users, FileText, UserCog } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { InvestorApproval } from './InvestorApproval';
import { UserAuthentication } from './UserAuthentication';

interface Tab {
  id: string;
  name: string;
  icon: React.ElementType;
}

const tabs: Tab[] = [
  { id: 'investors', name: 'Investor Approvals', icon: Users },
  { id: 'authentication', name: 'Authentication', icon: UserCog },
  { id: 'documents', name: 'Document Management', icon: FileText }
];

export const AdminPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('investors');
  const isAdmin = user?.user_metadata?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <Shield className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You do not have administrator privileges. Please contact the system administrator if you believe this is an error.
          </p>
          <a 
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gold-600 hover:bg-gold-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-display font-bold text-gray-900">
              Admin Dashboard
            </h2>
          </div>
          
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group inline-flex items-center px-6 py-4 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-gold-500 text-gold-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <tab.icon
                    className={`
                      -ml-0.5 mr-2 h-5 w-5
                      ${activeTab === tab.id ? 'text-gold-500' : 'text-gray-400 group-hover:text-gray-500'}
                    `}
                  />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'investors' && <InvestorApproval />}
            {activeTab === 'authentication' && <UserAuthentication />}
            {activeTab === 'documents' && (
              <div className="text-center text-gray-500 py-8">
                Document management functionality coming soon
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};