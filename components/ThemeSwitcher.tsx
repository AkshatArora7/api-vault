'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiSun,
  HiMoon,
  HiSparkles,
  HiColorSwatch,
  HiCheck
} from 'react-icons/hi';
import { themeChange } from 'theme-change';

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('light');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize theme-change on component mount
  useEffect(() => {
    themeChange(false);
    
    // Get initial theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('api-vault-theme') || 'dark';
    setCurrentTheme(savedTheme);
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const themes = [
    { name: 'light', icon: HiSun, desc: 'Default light theme' },
    { name: 'dark', icon: HiMoon, desc: 'Default dark theme' },
    { name: 'cupcake', icon: HiSparkles, desc: 'Sweet and pink' },
    { name: 'bumblebee', icon: HiSun, desc: 'Yellow and black' },
    { name: 'emerald', icon: HiColorSwatch, desc: 'Green and fresh' },
    { name: 'corporate', icon: HiColorSwatch, desc: 'Professional blue' },
    { name: 'synthwave', icon: HiSparkles, desc: 'Retro neon vibes' },
    { name: 'retro', icon: HiColorSwatch, desc: 'Vintage style' },
    { name: 'cyberpunk', icon: HiSparkles, desc: 'Neon and electric' },
    { name: 'valentine', icon: HiSparkles, desc: 'Romantic pink' },
    { name: 'halloween', icon: HiMoon, desc: 'Spooky orange' },
    { name: 'garden', icon: HiColorSwatch, desc: 'Natural greens' },
    { name: 'forest', icon: HiColorSwatch, desc: 'Deep forest' },
    { name: 'aqua', icon: HiColorSwatch, desc: 'Ocean blues' },
    { name: 'lofi', icon: HiMoon, desc: 'Calm and muted' },
    { name: 'pastel', icon: HiSparkles, desc: 'Soft pastels' },
    { name: 'fantasy', icon: HiSparkles, desc: 'Magical purples' },
    { name: 'wireframe', icon: HiColorSwatch, desc: 'Minimal wireframe' },
    { name: 'black', icon: HiMoon, desc: 'Pure black' },
    { name: 'luxury', icon: HiColorSwatch, desc: 'Gold and elegant' },
    { name: 'dracula', icon: HiMoon, desc: 'Classic Dracula' },
    { name: 'cmyk', icon: HiColorSwatch, desc: 'Print colors' },
    { name: 'autumn', icon: HiColorSwatch, desc: 'Fall colors' },
    { name: 'business', icon: HiColorSwatch, desc: 'Professional' },
    { name: 'acid', icon: HiSparkles, desc: 'Bright and vibrant' },
    { name: 'lemonade', icon: HiSun, desc: 'Fresh and citrus' },
    { name: 'night', icon: HiMoon, desc: 'Deep night' },
    { name: 'coffee', icon: HiColorSwatch, desc: 'Warm browns' },
    { name: 'winter', icon: HiColorSwatch, desc: 'Cool and crisp' },
    { name: 'dim', icon: HiMoon, desc: 'Dimmed dark' },
    { name: 'nord', icon: HiColorSwatch, desc: 'Arctic inspired' },
    { name: 'sunset', icon: HiSun, desc: 'Warm sunset' }
  ];

  const currentThemeInfo = themes.find(t => t.name === currentTheme) || themes[0];
  const CurrentIcon = currentThemeInfo.icon;

  const handleThemeChange = (themeName: string) => {
    // Update local state
    setCurrentTheme(themeName);
    
    // Apply theme to document immediately
    document.documentElement.setAttribute('data-theme', themeName);
    
    // Save to localStorage with the same key as your existing context
    localStorage.setItem('api-vault-theme', themeName);
    
    // Close the dropdown
    setIsOpen(false);
    
    // Debug log to confirm
    console.log('Theme changed to:', themeName);
    console.log('Saved to localStorage:', localStorage.getItem('api-vault-theme'));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost btn-circle"
        aria-label="Change theme"
      >
        <CurrentIcon className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-base-100 rounded-box shadow-xl border border-base-300 z-50"
          >
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <HiColorSwatch className="w-5 h-5 text-base-content" />
                <h3 className="font-semibold text-base-content">Choose Theme</h3>
              </div>
              
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                <div className="grid gap-1">
                  {themes.map((theme, index) => {
                    const Icon = theme.icon;
                    const isSelected = currentTheme === theme.name;
                    
                    return (
                      <motion.button
                        key={theme.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.2 }}
                        whileHover={{ x: 4 }}
                        className={`flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                          isSelected
                            ? 'bg-primary text-primary-content'
                            : 'hover:bg-base-200 text-base-content'
                        }`}
                        onClick={() => handleThemeChange(theme.name)}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm capitalize">{theme.name}</div>
                          <div className="text-xs opacity-70 truncate">{theme.desc}</div>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <HiCheck className="w-4 h-4" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-base-300">
                <p className="text-xs text-base-content/60 text-center">
                  Theme is saved automatically
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
