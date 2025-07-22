'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';
import {
  HiArrowLeft,
  HiMenu,
  HiUser,
  HiCog,
  HiQuestionMarkCircle,
  HiLogout,
  HiViewGrid,
  HiChartBar,
  HiShieldCheck,
  HiX
} from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationProps {
  title?: string;
  showBackButton?: boolean;
}

export default function Navigation({ title = 'API Vault', showBackButton = false }: NavigationProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const isAuthPage = pathname?.startsWith('/auth/');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
    };
    
    if (isDropdownOpen || isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isDropdownOpen, isMobileMenuOpen]);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: HiViewGrid },
    { href: '/analytics', label: 'Analytics', icon: HiChartBar },
    { href: '/settings', label: 'Settings', icon: HiCog },
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`navbar bg-base-100 border-b border-base-300 sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg backdrop-blur-lg bg-base-100/95' : ''
      }`}
    >
      <div className="navbar-start">
        <div className="flex items-center gap-4">
          <AnimatePresence>
            {showBackButton && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => router.back()}
                className="btn btn-ghost btn-circle btn-sm"
              >
                <HiArrowLeft className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
          
          <Link href={session ? '/dashboard' : '/'} className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg"
            >
              <HiShieldCheck className="w-6 h-6 text-primary-content" />
            </motion.div>
            <div>
              <motion.h1 
                className="text-2xl font-bold text-base-content group-hover:text-primary transition-colors"
                whileHover={{ x: 2 }}
              >
                {title}
              </motion.h1>
            </div>
          </Link>
        </div>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        {session && !isAuthPage && (
          <div className="tabs tabs-boxed bg-base-200 rounded-2xl">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={`tab gap-2 px-2 ${isActive ? 'tab-active' : ''}`}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="navbar-end">
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          
          {session ? (
            <div className="dropdown dropdown-end" onClick={(e) => e.stopPropagation()}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-sm font-bold text-primary-content">
                  {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase()}
                </div>
              </motion.div>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.ul
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="dropdown-content menu bg-base-100 rounded-box w-64 p-2 shadow-xl border border-base-300"
                  >
                    <div className="px-3 py-3 border-b border-base-300">
                      <div className="font-semibold text-base-content">
                        {session.user?.name || 'User'}
                      </div>
                      <div className="text-sm text-base-content/60">
                        {session.user?.email}
                      </div>
                    </div>
                    
                    {[
                      { href: '/settings', icon: HiCog, label: 'Settings' },
                      { href: '/profile', icon: HiUser, label: 'Profile' },
                      { href: '/help', icon: HiQuestionMarkCircle, label: 'Help' },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.href}>
                          <Link 
                            href={item.href} 
                            className="flex items-center gap-3"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                    
                    <div className="divider my-2"></div>
                    <li>
                      <button 
                        onClick={handleSignOut}
                        className="flex items-center gap-3 text-error"
                      >
                        <HiLogout className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          ) : (
            !isAuthPage && (
              <div className="flex items-center gap-3">
                <Link href="/auth/signin" className="btn btn-ghost">
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/auth/signup" className="btn btn-primary">
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )
          )}

          {session && !isAuthPage && (
            <motion.button
              className="btn btn-ghost btn-circle lg:hidden"
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }}>
                    <HiX className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90 }} animate={{ rotate: 0 }}>
                    <HiMenu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {session && !isAuthPage && isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-base-300 bg-base-100"
          >
            <div className="p-4">
              <ul className="menu bg-base-200 rounded-box">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <li key={item.href}>
                      <Link 
                        href={item.href} 
                        className={`flex items-center gap-3 ${isActive ? 'active' : ''}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
