'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { motion } from 'framer-motion';
import { 
  HiUser, 
  HiMail, 
  HiLockClosed, 
  HiEye, 
  HiEyeOff, 
  HiArrowRight,
  HiShieldCheck,
  HiCheck,
  HiSparkles
} from 'react-icons/hi';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, loading } = useAuth();
  const router = useRouter();

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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/signin');
      }, 2000);
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
        <Navigation showBackButton />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <div className="card bg-base-100 shadow-2xl border border-base-300 w-full max-w-md">
            <div className="card-body text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-success rounded-2xl flex items-center justify-center">
                <HiCheck className="w-8 h-8 text-success-content" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-success">Account Created!</h2>
              <p className="text-base-content/70 mb-6">
                Welcome to API Vault! Redirecting you to sign in...
              </p>
              <span className="loading loading-dots loading-md text-primary"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      <Navigation title="Sign Up" showBackButton />
      
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
                  <HiSparkles className="w-8 h-8 text-primary-content" />
                </div>
                <h1 className="text-3xl font-bold text-base-content mb-2">Create Account</h1>
                <p className="text-base-content/70">Join thousands of developers securing their APIs</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-3 focus-within:input-primary">
                    <HiUser className="w-5 h-5 text-base-content/40" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      className="grow"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={loading}
                      required
                    />
                  </label>
                </div>

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
                      placeholder="Create password"
                      className="grow"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      minLength={6}
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

                {/* Confirm Password Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Confirm Password</span>
                  </label>
                  <label className="input input-bordered flex items-center gap-3 focus-within:input-primary">
                    <HiCheck className="w-5 h-5 text-base-content/40" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm password"
                      className="grow"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-base-content/40 hover:text-base-content"
                    >
                      {showConfirmPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                    </button>
                  </label>
                </div>

                {/* Password Requirements */}
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${formData.password.length >= 6 ? 'bg-success' : 'bg-base-300'}`}></div>
                    <span className={formData.password.length >= 6 ? 'text-success' : 'text-base-content/60'}>
                      6+ characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${formData.password === formData.confirmPassword && formData.password ? 'bg-success' : 'bg-base-300'}`}></div>
                    <span className={formData.password === formData.confirmPassword && formData.password ? 'text-success' : 'text-base-content/60'}>
                      Passwords match
                    </span>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3 p-0">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-sm"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      disabled={loading}
                    />
                    <span className="label-text text-sm">
                      I agree to the <button type="button" className="link link-primary">Terms</button> and <button type="button" className="link link-primary">Privacy Policy</button>
                    </span>
                  </label>
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
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-base-content/70">
              Already have an account?{' '}
              <Link href="/auth/signin" className="link link-primary font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
