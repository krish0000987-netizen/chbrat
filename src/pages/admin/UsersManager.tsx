import React, { useEffect, useState } from 'react';
import { profilesService, DbProfile, Role } from '../../services/profiles';
import { auditService } from '../../services/auditLogs';
import { Users2, Shield, Trash2, Search, Crown, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const UsersManager: React.FC = () => {
  const [users, setUsers]=useState<DbProfile[]>([]);
  const [loading, setLoading]=useState(true);
  const [search, setSearch]=useState('');
  const [currentRole, setCurrentRole]=useState<string>('');

  const fetchAll=async()=>{
    setLoading(true);
    try{
      const [r, role]=await Promise.all([profilesService.list(), profilesService.getCurrentRole()]);
      setUsers(r);
      setCurrentRole(role||'');
    }catch(e:any){ alert(e.message); }
    setLoading(false);
  };
  useEffect(()=>{ fetchAll(); },[]);

  const changeRole=async(id:string, role:Role)=>{
    if(currentRole!=='super_admin' && currentRole!=='admin'){
      return alert('Only super_admin/admin can change roles');
    }
    if(!confirm(`Change role to ${role}?`)) return;
    await profilesService.updateRole(id, role);
    await auditService.log('role_changed','profiles',id,{role});
    fetchAll();
  };
  const onDelete=async(id:string)=>{
    if(!confirm('Delete user profile? This does not delete auth user, only profile row.')) return;
    await profilesService.remove(id);
    await auditService.log('user_deleted','profiles',id);
    fetchAll();
  };

  const filtered=users.filter(u=>{
    if(search && !u.email?.toLowerCase().includes(search.toLowerCase()) && !u.full_name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-black text-xl flex items-center gap-2"><Users2 className="w-5 h-5 text-[#8B0000]" /> Users & Roles</h1>
        <p className="text-xs text-slate-500">RBAC: super_admin → everything, admin → most ops, editor → content/media, reporter → own articles, viewer → read-only. Current role: <span className="font-mono bg-slate-900 text-white px-1.5 py-0.5 rounded text-[11px]">{currentRole||'loading'}</span></p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search email or name..." className="pl-8 pr-3 py-2 rounded-xl border bg-white text-sm w-full" />
        </div>
        <span className="px-3 py-2 bg-white border rounded-xl text-xs font-mono">{users.length} users</span>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs">
        <p className="font-black flex items-center gap-1"><Shield className="w-3.5 h-3.5"/> Security note</p>
        <p className="mt-1 text-slate-700">Roles are enforced in UI and via Supabase RLS policies + server checks. Never trust client alone. Service-role bypasses RLS for admin writes. Create first admin via Supabase Dashboard → Auth → Users → Add user, then <span className="font-mono">update profiles set role='super_admin' where email='...'</span></p>
      </div>

      {loading ? <div className="h-32 bg-white rounded-2xl border animate-pulse" />
      : filtered.length===0 ? <div className="bg-white rounded-2xl border p-12 text-center"><Users2 className="w-10 h-10 mx-auto text-slate-300"/><p className="font-black mt-2">No users</p><p className="text-xs text-slate-500">Profiles are auto-created via trigger on auth.users insert. Login via /admin/login to create profile.</p></div>
      : <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase font-black"><tr><th className="p-3 text-left">User</th><th className="p-3">Role</th><th className="p-3">Joined</th><th className="p-3">Change Role</th><th className="p-3">Actions</th></tr></thead>
              <tbody>
                {filtered.map(u=>(
                  <tr key={u.id} className="border-t hover:bg-slate-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#8B0000] text-white flex items-center justify-center font-black text-xs">{u.email?.[0]?.toUpperCase()||'?'}</div>
                        <div>
                          <p className="font-bold text-sm">{u.full_name||'-'}</p>
                          <p className="font-mono text-[11px] text-slate-500">{u.email||u.id.slice(0,8)}</p>
                        </div>
                        {u.role==='super_admin' && <Crown className="w-4 h-4 text-amber-500" />}
                      </div>
                    </td>
                    <td className="p-3 text-center"><span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${u.role==='super_admin'?'bg-amber-400 text-black': u.role==='admin'?'bg-[#8B0000] text-white' : u.role==='editor'?'bg-blue-600 text-white':'bg-slate-200'}`}>{u.role}</span></td>
                    <td className="p-3 text-center text-[11px]">{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="p-3 text-center">
                      <select value={u.role} onChange={e=>changeRole(u.id, e.target.value as Role)} className="px-2 py-1 border rounded-xl bg-white text-[11px] font-bold">
                        <option value="viewer">viewer</option><option value="reporter">reporter</option><option value="editor">editor</option><option value="admin">admin</option><option value="super_admin">super_admin</option>
                      </select>
                    </td>
                    <td className="p-3 text-center">
                      <button onClick={()=>onDelete(u.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 className="w-3.5 h-3.5"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  );
};
