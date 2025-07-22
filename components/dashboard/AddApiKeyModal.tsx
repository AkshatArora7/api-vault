'use client';

import { useState } from 'react';
import { useAddApiKey } from '@/hooks/useAddApiKey';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiPlus,
  HiShieldCheck,
  HiX,
  HiKey,
  HiGlobe,
  HiSparkles
} from 'react-icons/hi';

interface AddApiKeyModalProps {
  onSuccess: () => void;
}

export default function AddApiKeyModal({ onSuccess }: AddApiKeyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    keyValue: '',
    service: '',
    environment: 'production',
    tags: '',
  });
  const [error, setError] = useState('');

  const { addApiKey, loading } = useAddApiKey();

  const openModal = () => {
    setIsOpen(true);
    setError('');
    setFormData({
      name: '',
      description: '',
      keyValue: '',
      service: '',
      environment: 'production',
      tags: '',
    });
  };

  const closeModal = () => {
    setIsOpen(false);
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.keyValue.trim() || !formData.service.trim()) {
      setError('Name, API Key, and Service are required');
      return;
    }

    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const result = await addApiKey({
      name: formData.name,
      description: formData.description || undefined,
      keyValue: formData.keyValue,
      service: formData.service,
      environment: formData.environment,
      tags: tags.length > 0 ? tags : undefined,
    });

    if (result.success) {
      closeModal();
      onSuccess();
    } else {
      setError(result.error || 'Failed to add API key');
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="btn btn-primary shadow-lg gap-2"
        onClick={openModal}
      >
        <HiPlus className="w-5 h-5" />
        Add API Key
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeModal}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="card bg-base-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-base-300">
                <div className="card-body p-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                        <HiShieldCheck className="w-6 h-6 text-primary-content" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-base-content">Add New API Key</h3>
                        <p className="text-base-content/60">Securely store your API credentials</p>
                      </div>
                    </div>
                    <button
                      className="btn btn-ghost btn-circle"
                      onClick={closeModal}
                      disabled={loading}
                    >
                      <HiX className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold text-base-content">Name</span>
                          <span className="label-text-alt text-error">Required</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          placeholder="e.g., OpenAI Production Key"
                          className="input input-bordered input-lg focus:input-primary"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={loading}
                          maxLength={100}
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold text-base-content">Service</span>
                          <span className="label-text-alt text-error">Required</span>
                        </label>
                        <input
                          type="text"
                          name="service"
                          placeholder="e.g., OpenAI, Stripe, AWS"
                          className="input input-bordered input-lg focus:input-primary"
                          value={formData.service}
                          onChange={handleInputChange}
                          disabled={loading}
                          maxLength={50}
                        />
                      </div>
                    </div>

                    {/* Environment */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-base-content">Environment</span>
                        <span className="label-text-alt text-base-content/60">Where will this key be used?</span>
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: 'development', label: 'Development', icon: HiSparkles, desc: 'For testing and development' },
                          { value: 'staging', label: 'Staging', icon: HiGlobe, desc: 'Pre-production environment' },
                          { value: 'production', label: 'Production', icon: HiShieldCheck, desc: 'Live production use' }
                        ].map((env) => (
                          <label
                            key={env.value}
                            className={`cursor-pointer card card-compact border-2 transition-all duration-200 hover:shadow-lg ${
                              formData.environment === env.value 
                                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20' 
                                : 'border-base-300 hover:border-primary/50'
                            }`}
                          >
                            <div className="card-body items-center text-center p-4">
                              <input
                                type="radio"
                                name="environment"
                                value={env.value}
                                checked={formData.environment === env.value}
                                onChange={handleInputChange}
                                className="hidden"
                                disabled={loading}
                              />
                              <env.icon className={`w-6 h-6 mb-2 ${formData.environment === env.value ? 'text-primary' : 'text-base-content/60'}`} />
                              <div className={`font-semibold text-sm ${formData.environment === env.value ? 'text-primary' : 'text-base-content'}`}>
                                {env.label}
                              </div>
                              <div className="text-xs text-base-content/60 mt-1">{env.desc}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* API Key */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-base-content">API Key</span>
                        <span className="label-text-alt text-primary flex items-center gap-1">
                          <HiShieldCheck className="w-3 h-3" />
                          Will be encrypted
                        </span>
                      </label>
                      <textarea
                        name="keyValue"
                        placeholder="Paste your API key here..."
                        className="textarea textarea-bordered textarea-lg h-24 focus:textarea-primary font-mono text-sm resize-none"
                        value={formData.keyValue}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                      <label className="label">
                        <span className="label-text-alt text-base-content/60">
                          Your key will be encrypted with AES-256 before storage
                        </span>
                      </label>
                    </div>

                    {/* Description */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-base-content">Description</span>
                        <span className="label-text-alt text-base-content/60">Optional</span>
                      </label>
                      <textarea
                        name="description"
                        placeholder="What is this key used for? (optional)"
                        className="textarea textarea-bordered h-20 focus:textarea-primary resize-none"
                        value={formData.description}
                        onChange={handleInputChange}
                        disabled={loading}
                        maxLength={500}
                      />
                    </div>

                    {/* Tags */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-base-content">Tags</span>
                        <span className="label-text-alt text-base-content/60">Comma separated</span>
                      </label>
                      <input
                        type="text"
                        name="tags"
                        placeholder="e.g., ai, payments, database"
                        className="input input-bordered input-lg focus:input-primary"
                        value={formData.tags}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                      <label className="label">
                        <span className="label-text-alt text-base-content/60">
                          Tags help organize and filter your keys
                        </span>
                      </label>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="alert alert-error"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                      </motion.div>
                    )}

                    {/* Actions */}
                    <div className="card-actions justify-end pt-6 gap-3">
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={closeModal}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className={`btn btn-primary shadow-lg gap-2 ${loading ? 'loading' : ''}`}
                        disabled={loading}
                      >
                        {loading ? 'Adding Key...' : (
                          <>
                            <HiKey className="w-5 h-5" />
                            Add API Key
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
