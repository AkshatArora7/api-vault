'use client';

import { useState, useEffect } from 'react';
import { ApiKey } from '@/types';
import { useEditApiKey } from '@/hooks/useEditApiKey';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiX,
  HiPencil,
  HiKey,
  HiUser,
  HiServer,
  HiTag,
  HiInformationCircle,
  HiShieldCheck,
  HiEye,
  HiEyeOff,
  HiSparkles,
  HiCheckCircle
} from 'react-icons/hi';

interface EditApiKeyModalProps {
  apiKey: ApiKey;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditApiKeyModal({ apiKey, isOpen, onClose, onSuccess }: EditApiKeyModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    keyValue: '',
    service: '',
    environment: 'production',
    tags: '',
    isActive: true,
    updateKey: false,
  });
  const [error, setError] = useState('');
  const [showNewKey, setShowNewKey] = useState(false);
  const { editApiKey, loading } = useEditApiKey();

  // Initialize form with current API key data
  useEffect(() => {
    if (isOpen && apiKey) {
      setFormData({
        name: apiKey.name,
        description: apiKey.description || '',
        keyValue: '',
        service: apiKey.service,
        environment: apiKey.environment,
        tags: apiKey.tags?.map(tag => tag.name).join(', ') || '',
        isActive: apiKey.isActive,
        updateKey: false,
      });
      setError('');
      setShowNewKey(false);
    }
  }, [isOpen, apiKey]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.service.trim()) {
      setError('Name and Service are required');
      return;
    }

    if (formData.updateKey && formData.keyValue.trim() && formData.keyValue.length < 8) {
      setError('New API key must be at least 8 characters long');
      return;
    }

    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const updateData = {
      name: formData.name,
      description: formData.description || undefined,
      service: formData.service,
      environment: formData.environment,
      tags: tags.length > 0 ? tags : undefined,
      isActive: formData.isActive,
      ...(formData.updateKey && formData.keyValue.trim() && {
        keyValue: formData.keyValue
      })
    };

    const result = await editApiKey(apiKey.id, updateData);

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setError(result.error || 'Failed to update API key');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={onClose}
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
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25"
                    >
                      <HiPencil className="w-6 h-6 text-primary-content" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold text-base-content">Edit API Key</h3>
                      <p className="text-base-content/60">Update your API key configuration</p>
                    </div>
                  </div>
                  <button
                    className="btn btn-ghost btn-circle"
                    onClick={onClose}
                    disabled={loading}
                  >
                    <HiX className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="form-control"
                    >
                      <label className="label">
                        <span className="label-text font-semibold">Key Name</span>
                        <span className="label-text-alt text-error">Required</span>
                      </label>
                      <label className="input input-bordered flex items-center gap-3 focus-within:input-primary">
                        <HiKey className="w-5 h-5 text-base-content/40" />
                        <input
                          type="text"
                          name="name"
                          placeholder="Enter key name"
                          className="grow"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={loading}
                          required
                        />
                      </label>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="form-control"
                    >
                      <label className="label">
                        <span className="label-text font-semibold">Service</span>
                        <span className="label-text-alt text-error">Required</span>
                      </label>
                      <label className="input input-bordered flex items-center gap-3 focus-within:input-primary">
                        <HiServer className="w-5 h-5 text-base-content/40" />
                        <input
                          type="text"
                          name="service"
                          placeholder="Enter service name"
                          className="grow"
                          value={formData.service}
                          onChange={handleInputChange}
                          disabled={loading}
                          required
                        />
                      </label>
                    </motion.div>
                  </div>

                  {/* Environment & Status */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="form-control"
                    >
                      <label className="label">
                        <span className="label-text font-semibold">Environment</span>
                      </label>
                      <select
                        name="environment"
                        className="select select-bordered focus:select-primary"
                        value={formData.environment}
                        onChange={handleInputChange}
                        disabled={loading}
                      >
                        <option value="development">Development</option>
                        <option value="staging">Staging</option>
                        <option value="production">Production</option>
                      </select>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                      className="form-control"
                    >
                      <label className="label">
                        <span className="label-text font-semibold">Status</span>
                      </label>
                      <label className="label cursor-pointer bg-base-200 rounded-lg p-3 border-2 border-transparent hover:border-primary/20 transition-colors">
                        <span className="label-text flex items-center gap-2">
                          <HiCheckCircle className={`w-5 h-5 ${formData.isActive ? 'text-success' : 'text-base-content/40'}`} />
                          Active Key
                        </span>
                        <input
                          type="checkbox"
                          name="isActive"
                          className="toggle toggle-success"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                      </label>
                    </motion.div>
                  </div>

                  {/* Update Key Toggle */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="card bg-warning/5 border border-warning/20"
                  >
                    <div className="card-body p-4">
                      <label className="label cursor-pointer">
                        <div className="flex items-start gap-3">
                          <HiShieldCheck className="w-5 h-5 text-warning mt-1 flex-shrink-0" />
                          <div>
                            <span className="label-text font-semibold text-base-content">Update API Key Value</span>
                            <p className="text-sm text-base-content/60 mt-1">
                              Check this only if you want to replace the current API key. Leave unchecked to keep the existing key.
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          name="updateKey"
                          className="checkbox checkbox-warning"
                          checked={formData.updateKey}
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                      </label>
                    </div>
                  </motion.div>

                  {/* API Key Input (conditional) */}
                  <AnimatePresence>
                    {formData.updateKey && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="form-control"
                      >
                        <label className="label">
                          <span className="label-text font-semibold flex items-center gap-2">
                            <HiKey className="w-4 h-4" />
                            New API Key
                          </span>
                          <span className="label-text-alt text-primary flex items-center gap-1">
                            <HiShieldCheck className="w-3 h-3" />
                            Will be encrypted
                          </span>
                        </label>
                        <div className="relative">
                          <textarea
                            name="keyValue"
                            placeholder="Paste your new API key here..."
                            className="textarea textarea-bordered w-full h-24 font-mono text-sm resize-none focus:textarea-primary"
                            value={formData.keyValue}
                            onChange={handleInputChange}
                            disabled={loading}
                          />
                          <button
                            type="button"
                            className="absolute top-3 right-3 text-base-content/40 hover:text-base-content"
                            onClick={() => setShowNewKey(!showNewKey)}
                          >
                            {showNewKey ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                          </button>
                        </div>
                        <label className="label">
                          <span className="label-text-alt text-base-content/60">
                            Your key will be encrypted with AES-256 before storage
                          </span>
                        </label>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Description */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="form-control"
                  >
                    <label className="label">
                      <span className="label-text font-semibold">Description</span>
                      <span className="label-text-alt text-base-content/60">Optional</span>
                    </label>
                    <textarea
                      name="description"
                      placeholder="What is this key used for? (optional)"
                      className="textarea textarea-bordered h-20 resize-none focus:textarea-primary"
                      value={formData.description}
                      onChange={handleInputChange}
                      disabled={loading}
                      maxLength={500}
                    />
                  </motion.div>

                  {/* Tags */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className="form-control"
                  >
                    <label className="label">
                      <span className="label-text font-semibold flex items-center gap-2">
                        <HiTag className="w-4 h-4" />
                        Tags
                      </span>
                      <span className="label-text-alt text-base-content/60">Comma separated</span>
                    </label>
                    <input
                      type="text"
                      name="tags"
                      placeholder="e.g., ai, payments, database"
                      className="input input-bordered focus:input-primary"
                      value={formData.tags}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                    <label className="label">
                      <span className="label-text-alt text-base-content/60">
                        Tags help organize and filter your keys
                      </span>
                    </label>
                  </motion.div>

                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="alert alert-error"
                      >
                        <HiInformationCircle className="w-5 h-5" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="flex justify-end gap-3 pt-6 border-t border-base-300"
                  >
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={onClose}
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
                      {loading ? 'Updating...' : (
                        <>
                          <HiCheckCircle className="w-5 h-5" />
                          Update API Key
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
