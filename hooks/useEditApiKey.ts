import { useState } from 'react';
import { ApiKey } from '@/types';

interface EditApiKeyData {
  name: string;
  description?: string;
  keyValue?: string; // Optional - only if user wants to change it
  service: string;
  environment: string;
  tags?: string[];
  isActive: boolean;
}

interface UseEditApiKeyReturn {
  editApiKey: (keyId: string, data: EditApiKeyData) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

export function useEditApiKey(): UseEditApiKeyReturn {
  const [loading, setLoading] = useState(false);

  const editApiKey = async (keyId: string, data: EditApiKeyData) => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/keys/${keyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to update API key' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  return { editApiKey, loading };
}
