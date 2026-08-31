import React, { useEffect, useState } from 'react';
import { epapersService } from '../../services/epapers';
import { Upload, Trash2, Eye, Download, Star } from 'lucide-react';

export const EpaperManager: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('Chanakya Bharat – Daily Edition');
  const [editionDate, setEditionDate] = useState(new Date().toISOString().slice(0,10));
  const [isFeatured, setIsFeatured] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const fetch = async ()=>{ setLoading(true); try{ const r=await epapersService.list(); setList(r); }catch{} setLoading(false); };
  useEffect(()=>{ fetch(); },[]);

  const onCreate = async ()=>{
    if(!pdfFile) return alert('Select PDF');
    setUploading(true);
    try{
      const up = await epapersService.uploadPdf(pdfFile, coverFile || undefined);
      await epapersService.create({
        title, edition_date: editionDate, edition_type:'daily', pdf_storage_path: up.pdfPath, pdf_public_url: up.pdfUrl,
        cover_image_path: up.coverPath, cover_public_url: up.coverUrl, file_size: up.fileSize, status:'published', is_featured:isFeatured, language:'hi', published_at: new Date().toISOString()
      } as any);
      setPdfFile(null); setCoverFile(null);
      alert('E-Paper published ✓');
      fetch();
    } catch(e:any){ alert(e.message); }
    setUploading(false);
  };

  const toggleFeatured = async (id:string, cur:boolean)=>{
    await epapersService.update(id, { is_featured: !cur } as any);
    fetch();
  };
  const remove = async (id:string)=>{ if(!confirm('Delete e-paper?')) return; await epapersService.remove(id); fetch(); };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5">
        <h3 className="font-black text-sm mb-3">Upload New E-Paper (PDF + Cover)</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Edition Title" className="px-3 py-2 rounded-xl border bg-slate-50" />
          <input type="date" value={editionDate} onChange={e=>setEditionDate(e.target.value)} className="px-3 py-2 rounded-xl border bg-slate-50" />
          <label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={isFeatured} onChange={e=>setIsFeatured(e.target.checked)} /> Featured (homepage)</label>
        </div>
        <div className="grid md:grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-xs font-bold mb-1">PDF File * (drag & drop)</label>
            <input type="file" accept="application/pdf" onChange={e=>setPdfFile(e.target.files?.[0]||null)} className="w-full text-xs border rounded-xl p-2 bg-slate-50" />
            {pdfFile && <p className="text-[11px] text-emerald-600 mt-1">{pdfFile.name} • {(pdfFile.size/1024/1024).toFixed(2)} MB</p>}
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Cover Image (optional)</label>
            <input type="file" accept="image/*" onChange={e=>setCoverFile(e.target.files?.[0]||null)} className="w-full text-xs border rounded-xl p-2 bg-slate-50" />
          </div>
        </div>
        <button onClick={onCreate} disabled={uploading || !pdfFile} className="mt-3 px-6 py-2.5 bg-[#8B0000] text-white rounded-xl text-xs font-black disabled:opacity-50 flex items-center gap-1">
          <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload & Publish PDF'}
        </button>
        <p className="text-[11px] text-slate-500 mt-2">Stored in Supabase Storage bucket <span className="font-mono">epapers/</span> — public URL saved in DB. Max 50MB, PDF only.</p>
      </div>

      {loading ? <div className="h-32 bg-white rounded-xl border animate-pulse" />
      : list.length===0 ? <div className="bg-white rounded-2xl border p-12 text-center"><p className="font-black">No e-papers</p><p className="text-xs text-slate-500">Upload today’s PDF to appear on /epaper</p></div>
      : <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase font-black"><tr><th className="p-3 text-left">Cover</th><th className="p-3 text-left">Edition</th><th className="p-3">Date</th><th className="p-3">Status</th><th className="p-3">Featured</th><th className="p-3">Actions</th></tr></thead>
            <tbody>
              {list.map(e=>(
                <tr key={e.id} className="border-t">
                  <td className="p-3"><img src={e.cover_public_url || 'https://placehold.co/60x80'} alt="" className="w-12 h-16 object-cover rounded border" /></td>
                  <td className="p-3"><p className="font-bold line-clamp-1">{e.title}</p><p className="text-[11px] text-slate-500 font-mono">{e.pdf_storage_path?.slice(0,30)}...</p></td>
                  <td className="p-3 text-center">{e.edition_date}</td>
                  <td className="p-3 text-center"><span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${e.status==='published'?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-700'}`}>{e.status}</span></td>
                  <td className="p-3 text-center"><button onClick={()=>toggleFeatured(e.id, e.is_featured)} className={`p-1 rounded ${e.is_featured?'bg-amber-400 text-black':'bg-slate-100'}`}><Star className="w-4 h-4" /></button></td>
                  <td className="p-3">
                    <div className="flex gap-1 justify-center">
                      {e.pdf_public_url && <a href={e.pdf_public_url} target="_blank" className="p-1.5 hover:bg-slate-100 rounded"><Eye className="w-3.5 h-3.5" /></a>}
                      {e.pdf_public_url && <a href={e.pdf_public_url} download className="p-1.5 hover:bg-slate-100 rounded"><Download className="w-3.5 h-3.5" /></a>}
                      <button onClick={()=>remove(e.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
};
