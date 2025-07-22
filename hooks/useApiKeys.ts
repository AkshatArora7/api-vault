import { useState, useEffect } from 'react';
import { ApiKey } from '@/types';

interface UseApiKeysReturn {
  apiKeys: ApiKey[];
  loading: boolean;
  error: string | null;
  refreshKeys: () => Promise<void>;
  stats: {
    total: number;
    active: number;
    services: number;
  };
}

export function useApiKeys(): UseApiKeysReturn {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/keys');
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please sign in to view your API keys');
        }
        throw new Error('Failed to fetch API keys');
      }

      const keys = await response.json();
      setApiKeys(keys);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const refreshKeys = async () => {
    await fetchApiKeys();
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  // Calculate stats
  const stats = {
    total: apiKeys.length,
    active: apiKeys.filter(key => key.isActive).length,
    services: new Set(apiKeys.map(key => key.service)).size,
  };

  return {
    apiKeys,
    loading,
    error,
    refreshKeys,
    stats,
  };
}
