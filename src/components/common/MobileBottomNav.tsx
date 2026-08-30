import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Zap, Newspaper, Sparkles, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const navItems = [
    { label: 'होम', path: '/', icon: Home },
    { label: 'ताजा', path: '/live', icon: Zap },
    { label: 'ई-पेपर', path: '/epaper', icon: Newspaper },
    { label: 'राशिफल', path: '/bhavishya/rashifal', icon: Sparkles },
    { label: 'खाता', path: '/profile', icon: User }
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0B0F17] border-t border-slate-300 py-1 px-1 flex items-center justify-around z-40 lg:hidden shadow-lg no-print">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path || location.pathname.startsWith('/bhavishya') && item.path.includes('bhavishya');
        return (
          <Link key={item.label} to={item.path} className={`flex flex-col items-center py-1 px-2 rounded ${isActive ? 'text-[#8B0000] font-bold' : 'text-slate-600'}`}>
            <Icon className="w-5 h-5" />
            <span className="text-[9px] mt-0.5 font-devanagari font-bold">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
