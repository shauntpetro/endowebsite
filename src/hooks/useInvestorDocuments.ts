import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/auth/AuthContext';

interface InvestorDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  file_type: 'pdf' | 'image' | 'spreadsheet' | 'presentation';
  file_size: number;
  url: string;
  preview_url?: string;
  publish_date: string;
  tags: string[];
}

export function useInvestorDocuments() {
  const [documents, setDocuments] = useState<InvestorDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isAuthenticated, investorStatus, user } = useAuth();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get fresh session to ensure we have latest metadata
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('No active session');
        }

        // Fetch documents
        const { data, error: fetchError } = await supabase
          .from('investor_documents')
          .select('*')
          .order('publish_date', { ascending: false });

        if (fetchError) throw fetchError;

        // Transform dates to proper format and ensure tags are arrays
        const formattedData = (data || []).map(doc => ({
          ...doc,
          publish_date: new Date(doc.publish_date).toISOString(),
          tags: Array.isArray(doc.tags) ? doc.tags : []
        }));

        setDocuments(formattedData);
      } catch (err) {
        console.error('Error fetching investor documents:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch documents'));
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user is authenticated
    if (isAuthenticated) {
      fetchDocuments();
    } else {
      setDocuments([]);
      setLoading(false);
    }
  }, [isAuthenticated, investorStatus, user?.id]);

  return { documents, loading, error };
}