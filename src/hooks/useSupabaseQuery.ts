import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';

interface UseSupabaseQueryOptions<T> {
  query: string;
  params?: any[];
  dependencies?: any[];
  transform?: (data: any) => T;
  onError?: (error: PostgrestError) => void;
  cacheKey?: string;
  bypassCache?: boolean;
}

export function useSupabaseQuery<T = any>({
  query,
  params = [],
  dependencies = [],
  transform,
  onError,
  cacheKey,
  bypassCache = false
}: UseSupabaseQueryOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Parse the table name from the query
      const tableName = query.toLowerCase().match(/from\s+([^\s]+)/i)?.[1];
      
      if (!tableName) {
        throw new Error('Invalid query format: Could not extract table name');
      }

      // Execute the query
      const { data: result, error: queryError } = await supabase
        .from(tableName)
        .select('*');

      if (queryError) throw queryError;

      const transformedData = transform ? transform(result) : result;
      setData(transformedData);
      setError(null);
    } catch (err) {
      const supabaseError = err as PostgrestError;
      setError(supabaseError);
      onError?.(supabaseError);
    } finally {
      setLoading(false);
    }
  }, [query, cacheKey, bypassCache, ...params, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return { data, error, loading, refetch };
}