import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';

interface UseSupabaseMutationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: PostgrestError) => void;
}

export function useSupabaseMutation(
  query: string,
  { onSuccess, onError }: UseSupabaseMutationOptions = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PostgrestError | null>(null);

  const mutate = useCallback(async (variables?: any[]) => {
    try {
      setLoading(true);
      setError(null);

      // Extract table name from the query
      const matches = query.match(/INSERT INTO ([^\s]+)/i);
      if (!matches) {
        throw new Error('Invalid query format');
      }

      const tableName = matches[1];
      
      const { data, error: mutationError } = await supabase
        .from(tableName)
        .insert(variables ? { ...variables } : {})
        .select()
        .single();

      if (mutationError) {
        throw mutationError;
      }

      onSuccess?.(data);
      return data;
    } catch (err) {
      const supabaseError = err as PostgrestError;
      setError(supabaseError);
      onError?.(supabaseError);
      throw supabaseError;
    } finally {
      setLoading(false);
    }
  }, [query, onSuccess, onError]);

  return { mutate, loading, error };
}