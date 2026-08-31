import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, FileText, Layers, MapPin, Users, Image as ImageIcon, Newspaper, Zap, LayoutTemplate, Megaphone, Menu, MessageSquare, Users2, BarChart3, Settings, LogOut, Eye, Bell, Search, X } from 'lucide-react';

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
  const onLogout = async ()=>{ await signOut(); nav('/admin/login'); };

  return (
    <div className="min-h-screen bg-[#F8F7F4] dark:bg-[#0B0F17] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1a0000] text-slate-200 flex flex-col border-r border-white/10 transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <img src="/assets/logo.jpg" alt="चाणक्य भारत लोगो" className="h-9 w-9 rounded-full object-cover border border-amber-400 bg-white shadow-sm" />
          <div>
            <h1 className="font-black text-sm leading-none">Chanakya Bharat</h1>
            <p className="text-[10px] text-amber-300 uppercase tracking-widest">खोजी समाचार • 9919529245</p>
          </div>
          <button onClick={()=>setMobileOpen(false)} className="lg:hidden ml-auto p-1 hover:bg-white/10 rounded"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
          {navGroups.map(g=>(
            <div key={g.label}>
              <p className="text-[10px] font-black tracking-widest text-white/40 px-2 mb-1">{g.label}</p>
              <div className="space-y-0.5">
                {g.items.map(it=>{
                  const active = loc.pathname === it.path || (it.path!=='/admin' && loc.pathname.startsWith(it.path));
                  const Icon = it.icon;
                  return <Link key={it.path+it.label} to={it.path} onClick={()=>setMobileOpen(false)} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${active ? 'bg-[#8B0000] text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}><Icon className="w-4 h-4" />{it.label}</Link>;
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2 bg-white/5 rounded-xl p-2">
            <div className="w-8 h-8 rounded-full bg-[#8B0000] flex items-center justify-center text-white font-black text-xs">{user?.email?.[0]?.toUpperCase()}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{user?.email}</p>
              <p className="text-[10px] text-white/50">Editor</p>
            </div>
            <button onClick={onLogout} className="p-1.5 hover:bg-white/10 rounded-lg" title="Logout"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 lg:pl-64 min-w-0">
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 px-3 sm:px-4 py-2.5">
          <button onClick={()=>setMobileOpen(true)} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg"><Menu className="w-5 h-5" /></button>
          <div className="flex-1 min-w-0">
            <h2 className="font-black text-sm sm:text-base truncate">
              {navGroups.flatMap(g=>g.items).find(i=> loc.pathname===i.path)?.label || 'Dashboard'}
            </h2>
            <p className="text-[11px] text-slate-500 hidden sm:block">Asia/Kolkata • {new Date().toLocaleDateString('en-IN', { dateStyle:'medium'})}</p>
          </div>
          <Link to="/" target="_blank" className="hidden sm:inline-flex items-center gap-1 bg-[#8B0000] text-white px-3 py-1.5 rounded-full text-xs font-bold hover:bg-[#7a0000]"><Eye className="w-3.5 h-3.5" /> View Website</Link>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><Bell className="w-4 h-4" /></button>
        </header>
        <main className="p-3 sm:p-6">{children}</main>
      </div>
      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={()=>setMobileOpen(false)} />}
    </div>
  );
};
