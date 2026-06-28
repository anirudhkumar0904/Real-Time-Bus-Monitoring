import { Bus, LogOut, Moon, Sun, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: 'Home', path: '/dashboard' },
    { name: 'Track My Bus', path: '/track' },
    { name: 'My Bus Route', path: '/my-bus-route' },
    { name: 'Contact', path: '/contact' },
    { name: 'Profile', path: '/profile' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">

        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}
        >
          <div className="bg-gradient-to-tr from-orange-500 to-amber-500 p-2.5 rounded-xl shadow-md shadow-orange-500/15 group-hover:scale-105 transition duration-200">
            <Bus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-gray-900 dark:text-white text-lg font-bold tracking-tight">
              Bus<span className="text-orange-500">Track</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-[10px] tracking-wider uppercase font-semibold">SASTRA</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                isActive(item.path)
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-xl'
              }`}
            >
              {isActive(item.path) && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute inset-0 bg-orange-500/10 dark:bg-orange-500/10 border border-orange-500/20 rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Theme Toggle + Logout + Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition duration-200"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-sm font-medium transition duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition duration-200"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition duration-200 flex items-center justify-between ${
                    isActive(item.path)
                      ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
