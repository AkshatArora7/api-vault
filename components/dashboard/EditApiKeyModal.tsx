'use client';

import { useState, useEffect } from 'react';
import { ApiKey } from '@/types';
import { useEditApiKey } from '@/hooks/useEditApiKey';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiX,
  HiPencil,
  HiKey,
  HiServer,
  HiTag,
  HiShieldCheck,
  HiEye,
  HiEyeOff,
  HiCheckCircle,
  HiGlobe
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="card bg-base-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-base-300" onClick={e => e.stopPropagation()}>
              <div className="card-body p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                      <HiPencil className="w-6 h-6 text-primary-content" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-base-content">Edit API Key</h3>
                      <p className="text-base-content/60 text-sm">Update your API key configuration</p>
                    </div>
                  </div>
                  <button
                    className="btn btn-sm btn-ghost btn-circle"
                    onClick={onClose}
                    disabled={loading}
                  >
                    <HiX className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="form-control w-full">
                      <label className="label py-1">
                        <span className="label-text font-semibold text-base-content">Key Name</span>
                        <span className="label-text-alt text-error">Required</span>
                      </label>
                      <label className="input input-bordered flex items-center gap-2 focus-within:input-primary w-full">
                        <HiKey className="w-4 h-4 text-base-content/40" />
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
                    </div>

                    <div className="form-control w-full">
                      <label className="label py-1">
                        <span className="label-text font-semibold text-base-content">Service</span>
                        <span className="label-text-alt text-error">Required</span>
                      </label>
                      <label className="input input-bordered flex items-center gap-2 focus-within:input-primary w-full">
                        <HiServer className="w-4 h-4 text-base-content/40" />
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
                    </div>
                  </div>

                  {/* Environment & Status */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="form-control w-full">
                      <label className="label py-1">
                        <span className="label-text font-semibold text-base-content">Environment</span>
                      </label>
                      <div className="flex w-full items-center">
                        <HiGlobe className="w-4 h-4 text-base-content/40 absolute ml-3 pointer-events-none" />
                        <select
                          name="environment"
                          className="select select-bordered focus:select-primary w-full pl-9"
                          value={formData.environment}
                          onChange={handleInputChange}
                          disabled={loading}
                        >
                          <option value="development">Development</option>
                          <option value="staging">Staging</option>
                          <option value="production">Production</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-control w-full">
                      <label className="label py-1">
                        <span className="label-text font-semibold text-base-content">Status</span>
                      </label>
                      <label className="label cursor-pointer bg-base-200 rounded-lg p-3 border-2 border-transparent hover:border-primary/20 transition-colors w-full justify-between">
                        <span className="label-text flex items-center gap-2">
                          <HiCheckCircle className={`w-4 h-4 ${formData.isActive ? 'text-success' : 'text-base-content/40'}`} />
                          Active Key
                        </span>
                        <input
                          type="checkbox"
                          name="isActive"
                          className="toggle toggle-success toggle-sm"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Update Key Toggle */}
                  <div className="card bg-warning/5 border border-warning/20 w-full">
                    <div className="card-body p-4">
                      <label className="label cursor-pointer w-full justify-between py-0">
                        <div className="flex items-start gap-3">
                          <HiShieldCheck className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="label-text font-semibold text-base-content">Update API Key Value</span>
                            <p className="text-xs text-base-content/60 mt-1">
                              Check this only if you want to replace the current API key. Leave unchecked to keep the existing key.
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          name="updateKey"
                          className="checkbox checkbox-warning checkbox-sm"
                          checked={formData.updateKey}
                          onChange={handleInputChange}
                          disabled={loading}
                        />
                      </label>
                    </div>
                  </div>

                  {/* API Key Input (conditional) */}
                  <AnimatePresence>
                    {formData.updateKey && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="form-control w-full overflow-hidden"
                      >
                        <label className="label py-1">
                          <span className="label-text font-semibold flex items-center gap-2">
                            <HiKey className="w-4 h-4" />
                            New API Key
                          </span>
                          <span className="label-text-alt text-primary flex items-center gap-1">
                            <HiShieldCheck className="w-3 h-3" />
                            Will be encrypted
                          </span>
                        </label>
                        <div className="relative w-full">
                          <textarea
                            name="keyValue"
                            placeholder="Paste your new API key here..."
                            className="textarea textarea-bordered w-full h-20 font-mono text-sm resize-none focus:textarea-primary bg-base-200 pr-9"
                            value={formData.keyValue}
                            onChange={handleInputChange}
                            disabled={loading}
                          />
                          <button
                            type="button"
                            className="absolute top-3 right-3 text-base-content/40 hover:text-base-content"
                            onClick={() => setShowNewKey(!showNewKey)}
                          >
                            {showNewKey ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                          </button>
                        </div>
                        <label className="label pt-1 pb-0">
                          <span className="label-text-alt text-base-content/60">
                            Your key will be encrypted with AES-256 before storage
                          </span>
                        </label>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Description */}
                  <div className="form-control w-full">
                    <label className="label py-1">
                      <span className="label-text font-semibold text-base-content">Description</span>
                      <span className="label-text-alt text-base-content/60">Optional</span>
                    </label>
                    <textarea
                      name="description"
                      placeholder="What is this key used for? (optional)"
                      className="textarea textarea-bordered w-full h-16 resize-none focus:textarea-primary"
                      value={formData.description}
                      onChange={handleInputChange}
                      disabled={loading}
                      maxLength={500}
                    />
                  </div>

                  {/* Tags */}
                  <div className="form-control w-full">
                    <label className="label py-1">
                      <span className="label-text font-semibold text-base-content flex items-center gap-2">
                        <HiTag className="w-4 h-4" />
                        Tags
                      </span>
                      <span className="label-text-alt text-base-content/60">Comma separated</span>
                    </label>
                    <label className="input input-bordered flex items-center gap-2 focus-within:input-primary w-full">
                      <HiTag className="w-4 h-4 text-base-content/40" />
                      <input
                        type="text"
                        name="tags"
                        placeholder="e.g., ai, payments, database"
                        className="grow"
                        value={formData.tags}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                    </label>
                    <label className="label pt-1 pb-0">
                      <span className="label-text-alt text-base-content/60">
                        Tags help organize and filter your keys
                      </span>
                    </label>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="alert alert-error shadow-sm">
                      <HiX className="w-5 h-5" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-base-300 mt-2">
                    <button
                      type="button"
                      className="btn btn-sm md:btn-md btn-outline"
                      onClick={onClose}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`btn btn-sm md:btn-md btn-primary shadow-md gap-2 ${loading ? 'loading' : ''}`}
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : (
                        <>
                          <HiCheckCircle className="w-4 h-4" />
                          Update API Key
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
