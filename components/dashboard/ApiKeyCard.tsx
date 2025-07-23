'use client';

import { useState, useRef } from 'react';
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
      } else{
        setError(error instanceof Error ? error.message : 'Failed to copy key');
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

  // Different layouts based on viewMode
  if (viewMode === 'list') {
    return (
      <>
        <div className="card card-side bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300 hover:border-primary/20 group w-full">
          <div className="card-body p-4 sm:p-5 flex-row items-center gap-3 sm:gap-5">
            {/* Left: Icon and Basic Info */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 max-w-[280px] sm:max-w-[300px]">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 ${
                apiKey.isActive 
                  ? 'bg-gradient-to-br from-primary to-secondary shadow-primary/25' 
                  : 'bg-base-300'
              }`}>
                <HiKey className={`w-4 h-4 sm:w-5 sm:h-5 ${apiKey.isActive ? 'text-primary-content' : 'text-base-content/40'}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-base text-base-content group-hover:text-primary transition-colors truncate">
                    {apiKey.name}
                  </h3>
                  <div className={`badge ${getEnvironmentBadgeClass(apiKey.environment)} badge-sm flex-shrink-0`}>
                    {apiKey.environment}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 text-xs text-base-content/70">
                  <span className="font-medium truncate max-w-[140px] sm:max-w-[150px]">{apiKey.service}</span>
                  <div className="inline-flex h-1.5 w-1.5 rounded-full bg-base-content/30 flex-shrink-0"></div>
                  <div className={`flex items-center gap-1 ${apiKey.isActive ? 'text-success' : 'text-error'} flex-shrink-0`}>
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${apiKey.isActive ? 'bg-success/40' : 'bg-error/40'} opacity-75`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${apiKey.isActive ? 'bg-success' : 'bg-error'}`}></span>
                    </span>
                    <span>{apiKey.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center: API Key Display */}
            <div className="flex-1 min-w-0 mx-1 sm:mx-2">
              <div className="join w-full items-stretch">
                <input
                  ref={inputRef}
                  type="text"
                  className="join-item input input-sm input-bordered w-full font-mono text-xs bg-base-200"
                  value={showKey ? actualKey : apiKey.keyValue}
                  readOnly
                  onClick={showKey ? selectAllKey : undefined}
                />
                <button
                  className={`join-item btn btn-sm min-h-[32px] h-auto px-2 flex items-center justify-center ${loading ? 'loading' : showKey ? 'btn-warning' : 'btn-ghost'}`}
                  onClick={handleRevealKey}
                  disabled={loading}
                  title={showKey ? 'Hide key' : 'Reveal key'}
                >
                  {loading ? '' : showKey ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                </button>
                
                {showKey && actualKey && (
                  <button
                    className={`join-item btn btn-sm min-h-[32px] h-auto px-2 flex items-center justify-center ${copySuccess ? 'btn-success' : 'btn-ghost'}`}
                    onClick={copyToClipboard}
                    title={copySuccess ? 'Copied!' : 'Copy to clipboard'}
                  >
                    {copySuccess ? <HiCheck className="w-4 h-4" /> : <HiClipboardCopy className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>

            {/* Right: Actions and Meta */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Usage Stats */}
              <div className="hidden md:flex text-xs text-base-content/60 border-r border-base-300 pr-3 mr-1 flex-col gap-0.5">
                {apiKey.usageCount !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <HiTrendingUp className="w-3.5 h-3.5 text-primary/70" />
                    <span className="font-medium">{apiKey.usageCount} uses</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <HiClock className="w-3.5 h-3.5 text-secondary/70" />
                  <span>{apiKey.lastUsed ? formatDate(apiKey.lastUsed) : 'Never'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1 flex-shrink-0">
                <button
                  className="btn btn-sm btn-ghost btn-square"
                  onClick={handleEdit}
                  title="Edit"
                >
                  <HiPencil className="w-4 h-4" />
                </button>

                {!showDeleteConfirm ? (
                  <button
                    className="btn btn-sm btn-ghost btn-square text-error hover:bg-error/10"
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    title="Delete"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex gap-1">
                    <button
                      className="btn btn-sm btn-ghost btn-square"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={deleteLoading}
                      title="Cancel"
                    >
                      <HiX className="w-4 h-4" />
                    </button>
                    <button
                      className={`btn btn-sm btn-error btn-square ${deleteLoading ? 'loading' : ''}`}
                      onClick={handleDelete}
                      disabled={deleteLoading}
                      title="Confirm delete"
                    >
                      {deleteLoading ? '' : <HiCheck className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error Messages for List View */}
          <AnimatePresence>
            {(error || (showKey && actualKey)) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 sm:px-5 pb-3"
              >
                {error && (
                  <div className="alert alert-error shadow-sm py-2">
                    <span className="text-xs">{error}</span>
                  </div>
                )}
                {/* {showKey && actualKey && !error && (
                  <div className="alert alert-warning shadow-sm py-2 flex items-center gap-2">
                    <HiShieldCheck className=" justify-center w-4 h-4 flex-shrink-0" />
                    <span className="text-xs">Keep this key secure and never share it publicly</span>
                  </div>
                )} */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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

  // Grid view (default)
  return (
    <>
      <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300 hover:border-primary/20 group hover:-translate-y-1">
        <div className="card-body p-5">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                apiKey.isActive 
                  ? 'bg-gradient-to-br from-primary to-secondary shadow-primary/25' 
                  : 'bg-base-300'
              }`}>
                <HiKey className={`w-5 h-5 ${apiKey.isActive ? 'text-primary-content' : 'text-base-content/40'}`} />
              </div>
              <div>
                <h3 className="font-bold text-base text-base-content group-hover:text-primary transition-colors">
                  {apiKey.name}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-base-content/60 truncate max-w-[100px]">{apiKey.service}</p>
                  <div className="inline-flex h-1 w-1 rounded-full bg-base-content/30"></div>
                  <div className={`badge badge-sm ${getEnvironmentBadgeClass(apiKey.environment)} gap-1 py-0 h-5`}>
                    {apiKey.environment}
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`flex items-center gap-1 ${apiKey.isActive ? 'text-success' : 'text-error'} text-xs`}>
              <span className="relative flex h-2 w-2 mr-1">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${apiKey.isActive ? 'bg-success/40' : 'bg-error/40'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${apiKey.isActive ? 'bg-success' : 'bg-error'}`}></span>
              </span>
              {apiKey.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>

          {/* Usage Stats */}
          <div className="flex items-center gap-4 text-xs text-base-content/60 mb-3">
            {apiKey.usageCount !== undefined && (
              <div className="flex items-center gap-1.5">
                <HiTrendingUp className="w-3.5 h-3.5 text-primary/70" />
                <span className="font-medium">{apiKey.usageCount} uses</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <HiClock className="w-3.5 h-3.5 text-secondary/70" />
              <span>{apiKey.lastUsed ? formatDate(apiKey.lastUsed) : 'Never used'}</span>
            </div>
          </div>

          {/* Description */}
          {apiKey.description && (
            <p className="text-xs text-base-content/70 mb-3 line-clamp-2 bg-base-200/50 p-2 rounded-md">
              {apiKey.description}
            </p>
          )}

          {/* Tags */}
          {apiKey.tags && apiKey.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {apiKey.tags.map((tag) => (
                <div
                  key={tag.id}
                  className="badge badge-sm text-white shadow-sm"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </div>
              ))}
            </div>
          )}

          {/* API Key Display */}
          <div className="space-y-1.5 mb-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-base-content/70">API Key</label>
              {showKey && (
                <div className="flex items-center gap-1 text-xs text-warning">
                  <HiEye className="w-3 h-3" />
                  <span>Visible</span>
                </div>
              )}
            </div>
            <div className="join w-full">
              <input
                ref={inputRef}
                type="text"
                className="join-item input input-bordered input-sm w-full font-mono text-xs bg-base-200"
                value={showKey ? actualKey : apiKey.keyValue}
                readOnly
                onClick={showKey ? selectAllKey : undefined}
              />
              <button
                className={`join-item btn btn-xs ${loading ? 'loading' : showKey ? 'btn-warning' : 'btn-ghost'}`}
                onClick={handleRevealKey}
                disabled={loading}
                title={showKey ? 'Hide key' : 'Reveal key'}
              >
                {loading ? '' : showKey ? <HiEyeOff className="w-3 h-3" /> : <HiEye className="w-3 h-3" />}
              </button>
              
              {showKey && actualKey && (
                <button
                  className={`join-item btn btn-xs ${copySuccess ? 'btn-success' : 'btn-ghost'}`}
                  onClick={copyToClipboard}
                  title={copySuccess ? 'Copied!' : 'Copy to clipboard'}
                >
                  {copySuccess ? <HiCheck className="w-3 h-3" /> : <HiClipboardCopy className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="alert alert-error shadow-sm py-1.5 mb-3"
              >
                <span className="text-xs">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security Warning */}
          <AnimatePresence>
            {showKey && actualKey && !error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="alert alert-warning shadow-sm py-1.5 mb-3 flex items-center gap-2"
              >
                <HiShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-xs">Keep this key secure and never share it publicly</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="flex justify-between items-center pt-3 border-t border-base-300 mt-auto">
            <div className="flex gap-1">
              <button
                className="btn btn-xs btn-ghost btn-square"
                onClick={handleEdit}
                title="Edit"
              >
                <HiPencil className="w-3.5 h-3.5" />
              </button>

              {!showDeleteConfirm ? (
                <button
                  className="btn btn-xs btn-ghost btn-square text-error hover:bg-error/10"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  title="Delete"
                >
                  <HiTrash className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="flex gap-1">
                  <button
                    className="btn btn-xs btn-ghost btn-square"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleteLoading}
                    title="Cancel"
                  >
                    <HiX className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className={`btn btn-xs btn-error btn-square ${deleteLoading ? 'loading' : ''}`}
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    title="Confirm delete"
                  >
                    {deleteLoading ? '' : <HiCheck className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
