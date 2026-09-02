import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FileText, Layers, MapPin, Users, Image as ImageIcon,
  Newspaper, Zap, LayoutTemplate, Megaphone, Menu, MessageSquare, Users2,
  BarChart3, Settings, LogOut, Eye, Bell, Search, X, Plus
} from 'lucide-react';

const navGroups = [
  { label: 'OVERVIEW', items: [{ icon: LayoutDashboard, label: 'Dashboard', path: '/admin' }] },
  { label: 'CONTENT', items: [
    { icon: FileText, label: 'Articles', path: '/admin/articles' },
    { icon: FileText, label: 'Drafts', path: '/admin/articles?status=draft' },
    { icon: FileText, label: 'Scheduled', path: '/admin/articles?status=scheduled' },
    { icon: Layers, label: 'Categories', path: '/admin/categories' },
    { icon: MapPin, label: 'Locations', path: '/admin/locations' },
    { icon: Users, label: 'Authors', path: '/admin/authors' },
    { icon: ImageIcon, label: 'Media Library', path: '/admin/media' },
  ]},
  { label: 'NEWSPAPER', items: [
    { icon: Zap, label: 'Breaking News', path: '/admin/breaking-news' },
    { icon: Newspaper, label: 'E-Paper', path: '/admin/epaper' },
    { icon: Newspaper, label: 'E-Paper Archive', path: '/admin/epaper?tab=archive' },
  ]},
  { label: 'WEBSITE', items: [
    { icon: LayoutTemplate, label: 'Homepage', path: '/admin/homepage' },
    { icon: Menu, label: 'Navigation', path: '/admin/navigation' },
    { icon: Megaphone, label: 'Advertisements', path: '/admin/advertisements' },
    { icon: Search, label: 'Pages & SEO', path: '/admin/seo' },
  ]},
  { label: 'COMMUNITY', items: [
    { icon: MessageSquare, label: 'Comments', path: '/admin/comments' },
    { icon: Users2, label: 'Subscribers', path: '/admin/subscribers' },
  ]},
  { label: 'SYSTEM', items: [
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: FileText, label: 'Activity Log', path: '/admin/activity' },
    { icon: Users2, label: 'Users & Roles', path: '/admin/users' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ]},
];

export const AdminLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user, signOut } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const onLogout = async () => { await signOut(); nav('/admin/login'); };

  return (
    <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#0B0F17] flex flex-col lg:flex-row">
      
      {/* Sidebar Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1a0000] text-slate-200 flex flex-col border-r border-white/10 transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <img
            src="/assets/logo.jpg"
            alt="चाणक्य भारत लोगो"
            className="h-9 w-9 rounded-full object-cover border border-amber-400 bg-white shadow-sm"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x80/8B0000/FFFFFF?text=CB'; }}
          />
          <div>
            <h1 className="font-devanagari font-black text-sm leading-none text-white">Chanakya Bharat</h1>
            <p className="text-[10px] text-amber-300 uppercase tracking-widest font-sans mt-0.5">खोजी समाचार • कुशीनगर</p>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden ml-auto p-1.5 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
          {navGroups.map(g => (
            <div key={g.label}>
              <p className="text-[10px] font-black tracking-widest text-white/40 px-2 mb-1">{g.label}</p>
              <div className="space-y-0.5">
                {g.items.map(it => {
                  const active = loc.pathname === it.path || (it.path !== '/admin' && loc.pathname.startsWith(it.path));
                  const Icon = it.icon;
                  return (
                    <Link
                      key={it.path + it.label}
                      to={it.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                        active ? 'bg-[#8B0000] text-white shadow-xs' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{it.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2">
            <div className="w-8 h-8 rounded-full bg-[#8B0000] flex items-center justify-center text-white font-black text-xs">
              {user?.email?.[0]?.toUpperCase() || 'E'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-white">{user?.email || 'Editor Desk'}</p>
              <p className="text-[10px] text-amber-300">कुशीनगर ब्यूरो</p>
            </div>
            <button onClick={onLogout} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 min-w-0 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 px-3 sm:px-6 py-2.5">
          
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-1 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              title="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <Link to="/admin" className="flex items-center gap-2 lg:hidden">
              <img
                src="/assets/logo.jpg"
                alt="CB"
                className="h-7 w-7 rounded-full object-cover border border-amber-400"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x80/8B0000/FFFFFF?text=CB'; }}
              />
              <span className="font-devanagari font-black text-sm text-[#8B0000] dark:text-red-400">चाणक्य भारत</span>
            </Link>

            <div className="hidden lg:block">
              <h2 className="font-black text-base truncate">
                {navGroups.flatMap(g => g.items).find(i => loc.pathname === i.path)?.label || 'Dashboard'}
              </h2>
              <p className="text-[11px] text-slate-500">कुशीनगर • उत्तर प्रदेश • Asia/Kolkata</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/articles/new"
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#8B0000] text-white px-3 py-1.5 rounded-xl text-xs font-black shadow-xs hover:bg-[#7a0000] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Article</span>
            </Link>
            
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#8B0000]" />
              <span className="hidden sm:inline">View Site</span>
            </Link>
            
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Body with bottom padding on mobile to avoid bottom nav clash */}
        <main className="flex-1 p-3 sm:p-6 pb-20 lg:pb-6">{children}</main>

        {/* 3. MOBILE BOTTOM NAVIGATION BAR (Phones & Tablets) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-1 px-3 flex items-center justify-around shadow-2xl">
          
          <Link
            to="/admin"
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
              loc.pathname === '/admin' ? 'text-[#8B0000] dark:text-red-400 font-black' : 'text-slate-500'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/articles"
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
              loc.pathname === '/admin/articles' ? 'text-[#8B0000] dark:text-red-400 font-black' : 'text-slate-500'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Articles</span>
          </Link>

          {/* Elevated + New Article Button */}
          <Link
            to="/admin/articles/new"
            className="flex flex-col items-center -mt-5"
          >
            <div className="w-12 h-12 rounded-full bg-[#F06529] hover:bg-[#E05418] text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 active:scale-95 transition-transform">
              <Plus className="w-6 h-6 stroke-[3]" />
            </div>
            <span className="text-[10px] font-black text-[#F06529] mt-0.5">New Story</span>
          </Link>

          <Link
            to="/admin/media"
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold ${
              loc.pathname === '/admin/media' ? 'text-[#8B0000] dark:text-red-400 font-black' : 'text-slate-500'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span>Media</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-bold text-slate-500"
          >
            <Menu className="w-5 h-5" />
            <span>Menu</span>
          </button>

        </nav>

      </div>

      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

    </div>
  );
};
