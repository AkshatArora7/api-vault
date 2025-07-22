import { useState } from 'react';

interface UseRevealKeyReturn {
  revealKey: (keyId: string) => Promise<{ success: boolean; keyValue?: string; error?: string }>;
  loading: boolean;
}

export function useRevealKey(): UseRevealKeyReturn {
  const [loading, setLoading] = useState(false);

  const revealKey = async (keyId: string) => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/keys/${keyId}/decrypt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });


      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to reveal key' };
      }

      if (!result.keyValue) {
        return { success: false, error: 'No key value received' };
      }
      // Fix: Check response.ok instead of result.success
      return { success: true, keyValue: result.keyValue };
    } catch (error) {
      console.error('Network error revealing key:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  return { revealKey, loading };
}
