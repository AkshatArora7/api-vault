import { useState } from 'react';
import { signIn, SignInResponse } from 'next-auth/react';

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface UseAuthReturn {
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  login: (data: SignInData) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

export function useAuth(): UseAuthReturn {
  const [loading, setLoading] = useState(false);

  const register = async (data: RegisterData) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: SignInData) => {
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        return { 
          success: false, 
          error: result.error === 'CredentialsSignin' 
            ? 'Invalid email or password' 
            : 'Sign in failed. Please try again.'
        };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  return { register, login, loading };
}
