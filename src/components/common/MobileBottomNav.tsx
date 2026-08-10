import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Zap, Newspaper, Sun, Moon, User } from 'lucide-react';
import { useNews } from '../../context/NewsContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useNews();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Live Desk', path: '/live', icon: Zap },
    { label: 'E-Paper', path: '/epaper', icon: Newspaper },
    { label: 'Account', path: '/profile', icon: User }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#FAF9F6] dark:bg-[#0B0F17] border-t border-slate-300 dark:border-slate-800 py-1.5 px-2 flex items-center justify-around z-40 md:hidden shadow-lg no-print">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded transition-colors ${
              isActive
                ? 'text-red-900 dark:text-red-400 font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-red-800'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[9px] mt-0.5 font-sans-ui uppercase tracking-wider font-semibold">{item.label}</span>
          </Link>
        );
      })}

      {/* Direct Mobile Theme Switcher (White / Dark) */}
      <button
        onClick={toggleTheme}
        className="flex flex-col items-center justify-center py-1 px-2 rounded text-slate-700 dark:text-slate-300 hover:text-red-800 transition-colors"
        title="Toggle White / Dark Mode"
      >
        {theme === 'light' ? (
          <Sun className="w-5 h-5 text-amber-600" />
        ) : (
          <Moon className="w-5 h-5 text-amber-400" />
        )}
        <span className="text-[9px] mt-0.5 font-sans-ui uppercase tracking-wider font-bold">
          {theme === 'light' ? 'WHITE' : 'DARK'}
        </span>
      </button>
    </div>
  );
};

