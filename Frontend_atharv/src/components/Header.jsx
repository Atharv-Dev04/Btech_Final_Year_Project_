import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  ChevronDown,
  Activity,
  Settings,
  Lock,
  LogOut,
  Mail,
  ShieldCheck
} from 'lucide-react';

export default function Header({ onLogout }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper to check if current page
  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 px-8 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3 cursor-pointer group">
        <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-lg shadow-primary/10 group-hover:scale-105 transition-transform duration-300">
          <img src="/logo.jpeg" alt="InsightPoint Logo" className="w-full h-full object-cover" />
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-primary transition-colors">InsightPoint</span>
      </Link>

      <nav className="flex items-center gap-8">
        <div className="hidden md:flex items-center gap-6 mr-4">
          <Link
            to="/"
            className={`text-sm font-semibold transition-colors ${isActive('/') ? 'text-primary' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Home
          </Link>
          <Link
            to="/analyze"
            className={`text-sm font-semibold transition-colors ${isActive('/analyze') ? 'text-primary' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Analyze
          </Link>
          <Link
            to="/news"
            className={`text-sm font-semibold transition-colors ${isActive('/news') ? 'text-primary' : 'text-gray-500 hover:text-gray-900'}`}
          >
            News Feed
          </Link>
          <Link
            to="/about"
            className={`text-sm font-semibold transition-colors ${isActive('/about') ? 'text-primary' : 'text-gray-500 hover:text-gray-900'}`}
          >
            About
          </Link>
        </div>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-100 relative" ref={dropdownRef}>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-none">John Doe</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Premium User</p>
          </div>

          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="relative group cursor-pointer focus:outline-none"
          >
            <div className={`w-10 h-10 rounded-full border-2 transition-all overflow-hidden shadow-sm ${isProfileOpen ? 'border-primary' : 'border-white group-hover:border-gray-100'}`}>
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}>
              <ChevronDown size={10} className={isProfileOpen ? 'text-primary' : 'text-gray-400'} />
            </div>
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 top-full mt-4 w-72 bg-white rounded-3xl shadow-2xl shadow-indigo-500/15 border border-gray-100 p-2 z-[60]"
              >
                {/* User Info Section */}
                <div className="p-4 mb-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="User" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900">John Doe</p>
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-tight">Premium Account</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                      <Mail size={12} className="text-gray-300" />
                      john.doe@insightpoint.ai
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                      <ShieldCheck size={12} className="text-gray-300" />
                      Administrator Access
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-50 mx-2 mb-2" />

                {/* Actions Section */}
                <div className="p-1 space-y-1">
                  <p className="px-3 py-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest">Account Actions</p>
                  <Link
                    to="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-primary transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Settings size={16} />
                    </div>
                    Change Details
                  </Link>
                </div>

                <div className="h-px bg-gray-50 mx-2 my-2" />

                {/* Logout Button */}
                <div className="p-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                      <LogOut size={16} />
                    </div>
                    Logout Account
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
}
