import { useState } from 'react';

interface AddApiKeyData {
  name: string;
  description?: string;
  keyValue: string;
  service: string;
  environment: string;
  tags?: string[];
}

interface UseAddApiKeyReturn {
  addApiKey: (data: AddApiKeyData) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

export function useAddApiKey(): UseAddApiKeyReturn {
  const [loading, setLoading] = useState(false);

  const addApiKey = async (data: AddApiKeyData): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to add API key' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  return { addApiKey, loading };
}
