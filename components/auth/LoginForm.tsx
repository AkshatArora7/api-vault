'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';
import { 
  HiMail, 
  HiLockClosed, 
  HiEye, 
  HiEyeOff, 
  HiArrowRight,
  HiShieldCheck,
  HiSparkles
} from 'react-icons/hi';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading } = useAuth();
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Sign in failed');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      <Navigation title="Sign In" showBackButton />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-md">
          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card bg-base-100 shadow-2xl border border-base-300"
          >
            <div className="card-body p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                  <HiShieldCheck className="w-8 h-8 text-primary-content" />
                </div>
                <h1 className="text-3xl font-bold text-base-content mb-2">Welcome Back</h1>
                <p className="text-base-content/70">Sign in to your secure vault</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email Address</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-3 focus-within:input-primary">
                    <HiMail className="w-5 h-5 text-base-content/40" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="grow"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      autoComplete="email"
                    />
                  </label>
                </div>

                {/* Password Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-3 focus-within:input-primary">
                    <HiLockClosed className="w-5 h-5 text-base-content/40" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter your password"
                      className="grow"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-base-content/40 hover:text-base-content"
                    >
                      {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                    </button>
                  </label>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex justify-between items-center">
                  <label className="label cursor-pointer flex items-center gap-2 p-0">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-sm"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={loading}
                    />
                    <span className="label-text">Remember me</span>
                  </label>
                  
                  <button 
                    type="button"
                    className="link link-primary text-sm"
                    disabled={loading}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="alert alert-error">
                    <HiSparkles className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {!loading && <HiArrowRight className="w-5 h-5" />}
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-base-content/70">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="link link-primary font-medium">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
