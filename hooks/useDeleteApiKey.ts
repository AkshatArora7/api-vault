import { useState } from 'react';

interface UseDeleteApiKeyReturn {
  deleteApiKey: (keyId: string) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

export function useDeleteApiKey(): UseDeleteApiKeyReturn {
  const [loading, setLoading] = useState(false);

  const deleteApiKey = async (keyId: string) => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/keys/${keyId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to delete API key' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  return { deleteApiKey, loading };
}
