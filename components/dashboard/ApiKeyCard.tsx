'use client';

import { useState, useRef, useEffect } from 'react';
import { ApiKey } from '@/types';
import { useRevealKey } from '@/hooks/useRevealKey';
import { useDeleteApiKey } from '@/hooks/useDeleteApiKey';
import EditApiKeyModal from './EditApiKeyModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiEye,
  HiEyeOff,
  HiClipboardCopy,
  HiCheck,
  HiPencil,
  HiTrash,
  HiKey,
  HiShieldCheck,
  HiClock,
  HiTrendingUp,
  HiX,
  HiCheckCircle
} from 'react-icons/hi';

interface ApiKeyCardProps {
  apiKey: ApiKey;
  onUpdate: () => void;
  viewMode?: 'grid' | 'list';
}

export default function ApiKeyCard({ apiKey, onUpdate, viewMode = 'grid' }: ApiKeyCardProps) {
  const [showKey, setShowKey] = useState(false);
  const [actualKey, setActualKey] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { revealKey, loading } = useRevealKey();
  const { deleteApiKey, loading: deleteLoading } = useDeleteApiKey();

  const getEnvironmentBadgeClass = (env: string) => {
    switch (env) {
      case 'production':
        return 'badge-error';
      case 'staging':
        return 'badge-warning';
      case 'development':
        return 'badge-info';
      default:
        return 'badge-neutral';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRevealKey = async () => {
    if (showKey) {
      setShowKey(false);
      setActualKey('');
      setError('');
      return;
    }

    setError('');
    const result = await revealKey(apiKey.id);

    if (result.success && result.keyValue) {
      setActualKey(result.keyValue);
      setShowKey(true);
      setError('');
    } else {
      setError(result.error || 'Failed to reveal key');
    }
  };

  const copyToClipboard = async () => {
    if (!actualKey) return;

    try {
      await navigator.clipboard.writeText(actualKey);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      if (inputRef.current) {
        inputRef.current.select();
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    }
  };

  const selectAllKey = () => {
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    onUpdate();
  };

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    const result = await deleteApiKey(apiKey.id);

    if (result.success) {
      onUpdate();
    } else {
      setError(result.error || 'Failed to delete API key');
    }

    setShowDeleteConfirm(false);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -4 }}
        className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300 hover:border-primary/20 group"
      >
        <div className="card-body p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                  apiKey.isActive 
                    ? 'bg-gradient-to-br from-primary to-secondary shadow-primary/25' 
                    : 'bg-base-300'
                }`}
              >
                <HiKey className={`w-6 h-6 ${apiKey.isActive ? 'text-primary-content' : 'text-base-content/40'}`} />
              </motion.div>
              <div>
                <h3 className="font-bold text-lg text-base-content group-hover:text-primary transition-colors">
                  {apiKey.name}
                </h3>
                <p className="text-sm text-base-content/60">{apiKey.service}</p>
              </div>
            </div>
            <div className={`badge ${getEnvironmentBadgeClass(apiKey.environment)} badge-lg`}>
              {apiKey.environment}
            </div>
          </div>

          {/* Status and Usage */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`badge ${apiKey.isActive ? 'badge-success' : 'badge-error'} gap-2`}>
                {apiKey.isActive ? <HiCheckCircle className="w-3 h-3" /> : <HiX className="w-3 h-3" />}
                {apiKey.isActive ? 'Active' : 'Inactive'}
              </div>
              {apiKey.usageCount !== undefined && (
                <div className="flex items-center gap-1 text-sm text-base-content/60">
                  <HiTrendingUp className="w-4 h-4" />
                  <span>{apiKey.usageCount} uses</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {apiKey.description && (
            <p className="text-sm text-base-content/70 mb-4 line-clamp-2">
              {apiKey.description}
            </p>
          )}

          {/* API Key Display */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-base-content/80">API Key</label>
              {showKey && (
                <div className="flex items-center gap-1 text-xs text-warning">
                  <HiEye className="w-3 h-3" />
                  <span>Visible</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  className="input input-bordered input-sm w-full font-mono text-xs pr-20"
                  value={showKey ? actualKey : apiKey.keyValue}
                  readOnly
                  onClick={showKey ? selectAllKey : undefined}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`btn btn-xs ${loading ? 'loading' : showKey ? 'btn-warning' : 'btn-ghost'}`}
                    onClick={handleRevealKey}
                    disabled={loading}
                    title={showKey ? 'Hide key' : 'Reveal key'}
                  >
                    {loading ? '' : showKey ? <HiEyeOff className="w-3 h-3" /> : <HiEye className="w-3 h-3" />}
                  </motion.button>
                  
                  <AnimatePresence>
                    {showKey && actualKey && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`btn btn-xs ${copySuccess ? 'btn-success' : 'btn-ghost'}`}
                        onClick={copyToClipboard}
                        title={copySuccess ? 'Copied!' : 'Copy to clipboard'}
                      >
                        {copySuccess ? <HiCheck className="w-3 h-3" /> : <HiClipboardCopy className="w-3 h-3" />}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="alert alert-error alert-sm mb-4"
              >
                <span className="text-xs">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security Warning */}
          <AnimatePresence>
            {showKey && actualKey && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="alert alert-warning alert-sm mb-4"
              >
                <HiShieldCheck className="w-4 h-4" />
                <span className="text-xs">Keep this key secure and never share it publicly</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tags */}
          {apiKey.tags && apiKey.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {apiKey.tags.map((tag) => (
                <motion.div
                  key={tag.id}
                  whileHover={{ scale: 1.05 }}
                  className="badge badge-sm text-white shadow-sm"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </motion.div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-end pt-4 border-t border-base-300">
            <div className="text-xs text-base-content/50">
              <div className="flex items-center gap-1 mb-1">
                <HiClock className="w-3 h-3" />
                <span>
                  {apiKey.lastUsed ? `Used ${formatDate(apiKey.lastUsed)}` : 'Never used'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="btn btn-xs btn-ghost"
                onClick={handleEdit}
                title="Edit"
              >
                <HiPencil className="w-3 h-3" />
              </motion.button>

              {!showDeleteConfirm ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="btn btn-xs btn-ghost text-error hover:btn-error hover:text-error-content"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  title="Delete"
                >
                  <HiTrash className="w-3 h-3" />
                </motion.button>
              ) : (
                <div className="flex gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="btn btn-xs btn-ghost"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleteLoading}
                    title="Cancel"
                  >
                    <HiX className="w-3 h-3" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`btn btn-xs btn-error ${deleteLoading ? 'loading' : ''}`}
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    title="Confirm delete"
                  >
                    {deleteLoading ? '' : <HiCheck className="w-3 h-3" />}
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <EditApiKeyModal
        apiKey={apiKey}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
