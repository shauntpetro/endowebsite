import { useEffect, useState } from 'react';
import { useSupabase } from '../context/SupabaseContext';

export function useInvestorStatus() {
  const { user } = useSupabase();
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setStatus(user.user_metadata.investor_status || null);
    }
    setLoading(false);
  }, [user]);

  return { status, loading };
}