'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useApiKeys } from '@/hooks/useApiKeys';
import Navigation from '@/components/Navigation';
import ApiKeyCard from './ApiKeyCard';
import AddApiKeyModal from './AddApiKeyModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiKey,
  HiShieldCheck,
  HiGlobe,
  HiSearch,
  HiFilter,
  HiViewGrid,
  HiViewList,
  HiPlus,
  HiTrendingUp,
  HiClock,
  HiSparkles,
  HiRefresh,
  HiX,
  HiCheckCircle,
} from 'react-icons/hi';
import { HiExclamationTriangle } from 'react-icons/hi2';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { apiKeys, loading, error, stats, refreshKeys } = useApiKeys();
  
  const [filter, setFilter] = useState('');
  const [selectedEnvironment, setSelectedEnvironment] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  // Filter API keys
  const filteredKeys = apiKeys.filter(key => {
    const matchesFilter = key.name.toLowerCase().includes(filter.toLowerCase()) ||
                         key.service.toLowerCase().includes(filter.toLowerCase()) ||
                         key.description?.toLowerCase().includes(filter.toLowerCase());
    const matchesEnvironment = selectedEnvironment === 'all' || key.environment === selectedEnvironment;
    
    return matchesFilter && matchesEnvironment;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshKeys();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const clearFilters = () => {
    setFilter('');
    setSelectedEnvironment('all');
  };

  // Loading State
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
              <span className="loading loading-spinner loading-lg text-primary-content"></span>
            </div>
            <h3 className="text-xl font-bold text-base-content mb-2">Loading Your Vault</h3>
            <p className="text-base-content/60">Decrypting your secure API keys...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card bg-base-100 shadow-2xl border border-base-300 w-full max-w-md"
          >
            <div className="card-body text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-error/10 flex items-center justify-center">
                <HiExclamationTriangle className="w-8 h-8 text-error" />
              </div>
              <h3 className="text-2xl font-bold text-error mb-4">Unable to Load Keys</h3>
              <p className="text-base-content/60 mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <button 
                  className="btn btn-outline"
                  onClick={() => router.push('/')}
                >
                  Go Home
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleRefresh}
                >
                  <HiRefresh className="w-5 h-5" />
                  Try Again
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navigation />
      
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="card bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border border-primary/10 shadow-lg"
        >
          <div className="card-body p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/20"
                >
                  <HiSparkles className="w-7 h-7 text-primary-content" />
                </motion.div>
                <div>
                  <motion.h1 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="text-2xl lg:text-3xl font-bold text-base-content"
                  >
                    Welcome back, {session?.user?.name?.split(' ')[0] || 'Developer'}!
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25, duration: 0.3 }}
                    className="text-base-content/60 mt-1"
                  >
                    Manage your API keys securely and efficiently
                  </motion.p>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="flex gap-3"
              >
                <button 
                  className={`btn btn-sm lg:btn-md btn-outline gap-2 ${isRefreshing ? 'loading' : ''}`}
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  {!isRefreshing && <HiRefresh className="w-4 h-4 lg:w-5 lg:h-5" />}
                  Refresh
                </button>
                <AddApiKeyModal onSuccess={refreshKeys} />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6"
        >
          {[
            { 
              title: 'Total Keys', 
              value: stats?.total || 0, 
              icon: HiKey, 
              color: 'text-primary',
              bgColor: 'bg-primary/10',
              trend: '+12% from last month',
              trendIcon: HiTrendingUp,
              trendColor: 'text-success'
            },
            { 
              title: 'Active Keys', 
              value: stats?.active || 0, 
              icon: HiShieldCheck, 
              color: 'text-success',
              bgColor: 'bg-success/10',
              trend: 'All systems operational',
              trendIcon: HiCheckCircle,
              trendColor: 'text-success'
            },
            { 
              title: 'Services', 
              value: stats?.services || 0, 
              icon: HiGlobe, 
              color: 'text-info',
              bgColor: 'bg-info/10',
              trend: 'Last sync: 2 min ago',
              trendIcon: HiClock,
              trendColor: 'text-warning'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl hover:border-primary/20 transition-all duration-300 group cursor-pointer"
            >
              <div className="card-body p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`text-3xl font-bold ${stat.color} group-hover:scale-110 transition-transform`}>
                      {stat.value}
                    </h3>
                    <p className="text-base-content/60 font-medium">{stat.title}</p>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <stat.trendIcon className={`w-4 h-4 ${stat.trendColor}`} />
                  <span className={`text-sm font-medium ${stat.trendColor}`}>{stat.trend}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="card bg-base-100 shadow-md border border-base-300"
        >
          <div className="card-body p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <label className="input input-bordered flex items-center gap-3 focus-within:input-primary">
                  <HiSearch className="w-5 h-5 text-base-content/40" />
                  <input
                    type="text"
                    placeholder="Search keys, services, or descriptions..."
                    className="grow"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                  {filter && (
                    <button
                      onClick={() => setFilter('')}
                      className="text-base-content/40 hover:text-base-content"
                    >
                      <HiX className="w-5 h-5" />
                    </button>
                  )}
                </label>
              </div>
              
              {/* Environment Filter */}
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-outline gap-2">
                  <HiFilter className="w-4 h-4" />
                  {selectedEnvironment === 'all' ? 'All Environments' : selectedEnvironment}
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-56 p-2 shadow-xl border border-base-300">
                  {['all', 'development', 'staging', 'production'].map((env) => (
                    <li key={env}>
                      <button 
                        onClick={() => setSelectedEnvironment(env)}
                        className={selectedEnvironment === env ? 'active' : ''}
                      >
                        {env === 'all' ? 'All Environments' : env.charAt(0).toUpperCase() + env.slice(1)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* View Mode */}
              <div className="join">
                <button
                  className={`btn join-item ${viewMode === 'grid' ? 'btn-active' : 'btn-outline'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <HiViewGrid className="w-4 h-4" />
                </button>
                <button
                  className={`btn join-item ${viewMode === 'list' ? 'btn-active' : 'btn-outline'}`}
                  onClick={() => setViewMode('list')}
                >
                  <HiViewList className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active Filters & Quick Actions */}
            <AnimatePresence>
              {(filter || selectedEnvironment !== 'all') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-base-300 pt-4 mt-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-base-content/60">
                      <span>Active filters:</span>
                      {filter && <span className="badge badge-primary badge-sm">{filter}</span>}
                      {selectedEnvironment !== 'all' && <span className="badge badge-secondary badge-sm">{selectedEnvironment}</span>}
                    </div>
                    <button 
                      className="btn btn-ghost btn-sm gap-2"
                      onClick={clearFilters}
                    >
                      <HiX className="w-4 h-4" />
                      Clear filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Filter Tags */}
            {apiKeys.length > 0 && !filter && selectedEnvironment === 'all' && (
              <>
                <div className="divider"></div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-base-content/60">Quick filters:</span>
                  {Array.from(new Set(apiKeys.map(key => key.service))).slice(0, 5).map(service => (
                    <motion.button
                      key={service}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="badge badge-outline hover:badge-primary cursor-pointer transition-colors"
                      onClick={() => setFilter(service)}
                    >
                      {service}
                    </motion.button>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* API Keys Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="relative min-h-[200px]"
        >
          {filteredKeys.length > 0 ? (
            <>
              {/* Grid View */}
              <div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5"
                style={{ 
                  opacity: viewMode === 'grid' ? 1 : 0,
                  position: viewMode === 'grid' ? 'relative' : 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  pointerEvents: viewMode === 'grid' ? 'auto' : 'none',
                  transition: 'opacity 0.25s ease'
                }}
              >
                {filteredKeys.map((apiKey) => (
                  <div key={`grid-${apiKey.id}`}>
                    <ApiKeyCard
                      apiKey={apiKey}
                      onUpdate={refreshKeys}
                      viewMode="grid"
                    />
                  </div>
                ))}
              </div>
              
              {/* List View */}
              <div 
                className="flex flex-col gap-3"
                style={{ 
                  opacity: viewMode === 'list' ? 1 : 0,
                  position: viewMode === 'list' ? 'relative' : 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  pointerEvents: viewMode === 'list' ? 'auto' : 'none',
                  transition: 'opacity 0.25s ease'
                }}
              >
                {filteredKeys.map((apiKey) => (
                  <div key={`list-${apiKey.id}`}>
                    <ApiKeyCard
                      apiKey={apiKey}
                      onUpdate={refreshKeys}
                      viewMode="list"
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="card bg-base-100 shadow-xl border border-base-300"
            >
              <div className="card-body text-center py-16">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center"
                >
                  {apiKeys.length === 0 ? (
                    <HiPlus className="w-12 h-12 text-primary" />
                  ) : (
                    <HiSearch className="w-12 h-12 text-primary" />
                  )}
                </motion.div>
                
                {apiKeys.length === 0 ? (
                  <div>
                    <h3 className="text-3xl font-bold text-base-content mb-4">Your vault is empty</h3>
                    <p className="text-base-content/60 mb-8 max-w-md mx-auto leading-relaxed">
                      Get started by adding your first API key to securely store and manage your credentials.
                    </p>
                    <AddApiKeyModal onSuccess={refreshKeys} />
                  </div>
                ) : (
                  <div>
                    <h3 className="text-2xl font-bold text-base-content mb-4">No keys match your search</h3>
                    <p className="text-base-content/60 mb-8">
                      Try adjusting your search terms or environment filter.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button 
                        className="btn btn-outline gap-2"
                        onClick={clearFilters}
                      >
                        <HiX className="w-5 h-5" />
                        Clear Filters
                      </button>
                      <AddApiKeyModal onSuccess={refreshKeys} />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

