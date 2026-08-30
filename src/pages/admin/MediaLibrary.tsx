import React, { useEffect, useState } from 'react';
import { mediaService, DbMedia } from '../../services/media';
import { Upload, Trash2, Copy, Image as ImageIcon } from 'lucide-react';
export const MediaLibrary: React.FC = () => {
  const [items, setItems] = useState<DbMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fetch = async ()=>{ setLoading(true); try{ const r=await mediaService.list(); setItems(r as any); }catch{} setLoading(false); };
  useEffect(()=>{ fetch(); },[]);
  const onUpload = async (e:React.ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0]; if(!file) return;
    setUploading(true);
    try{ await mediaService.upload(file, 'article-images'); await fetch(); } catch(err:any){ alert(err.message); }
    setUploading(false);
  };
  const remove = async (id:string)=>{ if(!confirm('Delete media?')) return; await mediaService.remove(id); fetch(); };
  const copyUrl = (url:string)=>{ navigator.clipboard.writeText(url); alert('URL copied'); };
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-black text-lg">Media Library</h2>
        <label className="px-4 py-2 bg-[#8B0000] text-white rounded-xl text-xs font-black cursor-pointer flex items-center gap-1">
          <Upload className="w-4 h-4" /> {uploading?'Uploading...':'Upload Image'}
          <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
        </label>
      </div>
      {loading ? <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{[1,2,3,4,5,6].map(i=><div key={i} className="h-32 bg-white rounded-xl border animate-pulse" />)}</div>
      : items.length===0 ? <div className="bg-white rounded-2xl border p-12 text-center"><ImageIcon className="w-10 h-10 mx-auto text-slate-300" /><p className="font-black mt-2">No media yet</p><p className="text-xs text-slate-500">Upload article images, author photos etc</p></div>
      : <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {items.map(m=>(
            <div key={m.id} className="bg-white rounded-xl border overflow-hidden group">
              <img src={(m as any).public_url} alt={m.alt_text||m.filename} className="w-full h-32 object-cover" />
              <div className="p-2">
                <p className="text-[11px] font-bold truncate">{m.filename}</p>
                <p className="text-[10px] text-slate-500">{(m.file_size||0/1024).toFixed(0)} KB • {(m as any).folder}</p>
                <div className="flex gap-1 mt-1">
                  <button onClick={()=>copyUrl((m as any).public_url)} className="p-1 bg-slate-100 rounded hover:bg-slate-200" title="Copy URL"><Copy className="w-3 h-3" /></button>
                  <button onClick={()=>remove(m.id)} className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Delete"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    </div>
  );
};
