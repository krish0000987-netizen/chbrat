import React from 'react';
import { Construction } from 'lucide-react';
export const AdminStub: React.FC<{title:string; desc?:string}> = ({ title, desc }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border p-12 text-center">
    <Construction className="w-10 h-10 mx-auto text-amber-500" />
    <h2 className="font-black text-lg mt-3">{title}</h2>
    <p className="text-sm text-slate-500 mt-1 max-w-lg mx-auto">{desc || 'This module is scaffolded with Supabase tables and RLS. CRUD UI will be completed next iteration — DB schema already ready in supabase/schema.sql.'}</p>
    <p className="text-[11px] text-slate-400 mt-3 font-mono">Tables: {title.toLowerCase().replace(/\s+/g,'_')} • Storage: supabase/schema.sql</p>
  </div>
);
