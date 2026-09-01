import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { articlesService } from '../../services/articles';
import { categoriesService } from '../../services/categories';
import { authorsService } from '../../services/authors';
import { mediaService } from '../../services/media';
import { Save, Eye, ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';

function slugify(t:string){ return t.toLowerCase().trim().replace(/[^a-z0-9\u0900-\u097F]+/g,'-').replace(/^-|-$/g,''); }

export const ArticleEditor: React.FC = () => {
  const { id } = useParams();
  const isNew = !id || id==='new';
  const nav = useNavigate();
  const [cats, setCats] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({
    title:'', title_hi:'', slug:'', subheadline:'', content:'', excerpt:'', category_id:'', author_id:'', hero_image_url:'', hero_image_caption:'', language:'hi',
    status:'draft', is_breaking:false, is_featured:false, is_trending:false, is_lead:false, is_exclusive:false,
    seo_title:'', seo_description:'', seo_keywords:'', published_at:'', scheduled_at:''
  });
  const [previewImg, setPreviewImg] = useState('');

  useEffect(()=>{
    categoriesService.list().then(setCats).catch(()=>{});
    authorsService.list().then(setAuthors).catch(()=>{});
    if (!isNew && id) {
      articlesService.getById(id).then(a=>{
        setForm({
          title: a.title, title_hi: a.title_hi||'', slug: a.slug, subheadline: a.subheadline||'', content: a.content, excerpt: a.excerpt||'',
          category_id: a.category_id||'', author_id: a.author_id||'', hero_image_url: a.hero_image_url||'', hero_image_caption: a.hero_image_caption||'', language: a.language||'hi',
          status: a.status, is_breaking: a.is_breaking, is_featured: a.is_featured, is_trending: a.is_trending, is_lead: a.is_lead, is_exclusive: a.is_exclusive,
          seo_title: a.seo_title||'', seo_description: a.seo_description||'', seo_keywords: a.seo_keywords||'', published_at: a.published_at||'', scheduled_at: a.scheduled_at||''
        });
        setPreviewImg(a.hero_image_url||'');
        setLoading(false);
      });
    }
  },[id]);

  const onTitle = (v:string)=> setForm((f:any)=>({ ...f, title:v, slug: f.slug || slugify(v) }));

  const [imgUploading, setImgUploading] = useState(false);
  const handleImage = async (e:React.ChangeEvent<HTMLInputElement>)=>{
    const file=e.target.files?.[0]; if(!file) return;
    // immediate preview via base64 so UI feels instant even if upload is slow
    const localPreview = await new Promise<string>((res)=>{
      const r=new FileReader(); r.onload=()=>res(r.result as string); r.readAsDataURL(file);
    });
    setPreviewImg(localPreview);
    setForm((f:any)=>({ ...f, hero_image_url: localPreview }));
    setImgUploading(true);
    try{
      const m=await mediaService.upload(file, 'article-images');
      const url = (m as any).public_url || localPreview;
      setForm((f:any)=>({ ...f, hero_image_url: url }));
      setPreviewImg(url);
    }catch(err:any){
      // fallback already set to base64 preview — keep it so article still saves with image
      console.warn('upload failed, keeping base64 preview', err?.message);
      alert('Supabase upload failed — using local preview. Article will still save with image (base64). Check Supabase bucket/Rls if you want hosted URLs.');
    }finally{
      setImgUploading(false);
      // reset input so same file can be re-selected
      e.target.value='';
    }
  };

  const save = async (publish=false)=>{
    setSaving(true);
    const payload:any = {
      title: form.title,
      title_hi: form.title_hi || form.title,
      slug: slugify(form.slug || form.title),
      subheadline: form.subheadline,
      content: form.content,
      excerpt: form.excerpt || form.content.slice(0,160),
      category_id: form.category_id || null,
      author_id: form.author_id || null,
      hero_image_url: form.hero_image_url,
      hero_image_caption: form.hero_image_caption,
      language: form.language,
      status: publish ? 'published' : form.status,
      published_at: publish ? new Date().toISOString() : (form.published_at || null),
      scheduled_at: form.scheduled_at || null,
      seo_title: form.seo_title || form.title,
      seo_description: form.seo_description || form.subheadline || form.excerpt,
      seo_keywords: form.seo_keywords,
      is_breaking: form.is_breaking, is_featured: form.is_featured, is_trending: form.is_trending, is_lead: form.is_lead, is_exclusive: form.is_exclusive,
    };
    try {
      if (isNew) {
        const created = await articlesService.create(payload);
        nav(`/admin/articles/${created.id}/edit`);
      } else {
        await articlesService.update(id!, payload);
        alert('Saved ✓');
      }
    } catch(e:any){ alert(e.message); }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link to="/admin/articles" className="p-2 bg-white border rounded-xl"><ArrowLeft className="w-4 h-4" /></Link>
        <h1 className="font-black text-lg">{isNew ? 'New Article' : 'Edit Article'}</h1>
        <div className="ml-auto flex gap-2">
          <button onClick={()=>save(false)} disabled={saving} className="px-4 py-2 bg-white border rounded-xl text-xs font-bold flex items-center gap-1"><Save className="w-4 h-4" /> Save Draft</button>
          <button onClick={()=>save(true)} disabled={saving} className="px-4 py-2 bg-[#8B0000] text-white rounded-xl text-xs font-black">Publish</button>
          {!isNew && <Link to={`/article/${form.slug}`} target="_blank" className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1"><Eye className="w-4 h-4" /> Preview</Link>}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5 space-y-4">
            <div>
              <label className="block text-xs font-black mb-1">Headline *</label>
              <input value={form.title} onChange={e=>onTitle(e.target.value)} placeholder="मुख्य शीर्षक / Headline" className="w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Hindi Title (optional)</label>
              <input value={form.title_hi} onChange={e=>setForm({...form, title_hi:e.target.value})} placeholder="हिंदी शीर्षक" className="w-full px-3 py-2 rounded-xl border bg-slate-50 font-devanagari" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-bold mb-1">Slug *</label><input value={form.slug} onChange={e=>setForm({...form, slug:e.target.value})} className="w-full px-3 py-2 rounded-xl border bg-slate-50 font-mono text-xs" /></div>
              <div><label className="block text-xs font-bold mb-1">Language</label><select value={form.language} onChange={e=>setForm({...form, language:e.target.value})} className="w-full px-3 py-2 rounded-xl border bg-white"><option value="hi">Hindi</option><option value="en">English</option></select></div>
            </div>
            <div><label className="block text-xs font-bold mb-1">Subheadline</label><textarea value={form.subheadline} onChange={e=>setForm({...form, subheadline:e.target.value})} rows={2} className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-sm" /></div>
            <div>
              <label className="block text-xs font-black mb-1">Content * <span className="font-normal text-slate-500">(supports HTML: &lt;b&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;img&gt;, &lt;a&gt;)</span></label>
              <textarea value={form.content} onChange={e=>setForm({...form, content:e.target.value})} rows={12} placeholder="<p>Article body with <b>bold</b>, <a href='...'>links</a>, <img src='...' /> etc</p>" className="w-full px-3 py-3 rounded-xl border bg-slate-50 font-mono text-xs" />
              <p className="text-[11px] text-slate-500 mt-1">Rich text: paste HTML from editor. Images will be uploaded via Media Library.</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5 space-y-3">
            <h3 className="font-black text-sm">SEO</h3>
            <input value={form.seo_title} onChange={e=>setForm({...form, seo_title:e.target.value})} placeholder="SEO Title" className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-sm" />
            <textarea value={form.seo_description} onChange={e=>setForm({...form, seo_description:e.target.value})} placeholder="SEO Description" rows={2} className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-sm" />
            <input value={form.seo_keywords} onChange={e=>setForm({...form, seo_keywords:e.target.value})} placeholder="Keywords comma separated" className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-sm" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5 space-y-3">
            <h3 className="font-black text-sm">Publish</h3>
            <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})} className="w-full px-3 py-2 rounded-xl border bg-white text-sm font-bold">
              <option value="draft">Draft</option><option value="review">Review</option><option value="scheduled">Scheduled</option><option value="published">Published</option><option value="archived">Archived</option>
            </select>
            <input type="datetime-local" value={form.scheduled_at ? new Date(form.scheduled_at).toISOString().slice(0,16) : ''} onChange={e=>setForm({...form, scheduled_at: e.target.value ? new Date(e.target.value).toISOString() : ''})} className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-xs" />
            <p className="text-[11px] text-slate-500">Asia/Kolkata — scheduled will auto-publish via cron or manual check</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5 space-y-3">
            <h3 className="font-black text-sm">Taxonomy</h3>
            <select value={form.category_id} onChange={e=>setForm({...form, category_id:e.target.value})} className="w-full px-3 py-2 rounded-xl border bg-white text-sm">
              <option value="">Select Category</option>
              {cats.map(c=><option key={c.id} value={c.id}>{c.name_hi || c.name}</option>)}
            </select>
            <select value={form.author_id} onChange={e=>setForm({...form, author_id:e.target.value})} className="w-full px-3 py-2 rounded-xl border bg-white text-sm">
              <option value="">Select Author</option>
              {authors.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5 space-y-3">
            <h3 className="font-black text-sm flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Hero Image {imgUploading && <span className="ml-auto text-[11px] font-bold text-amber-600 animate-pulse">Uploading...</span>}</h3>
            {previewImg ? <img src={previewImg} alt="" className="w-full h-32 sm:h-40 object-cover rounded-xl border" /> : <div className="w-full h-32 bg-slate-100 rounded-xl border flex items-center justify-center text-slate-400 text-xs">No image</div>}
            <input value={form.hero_image_url} onChange={e=>{setForm({...form, hero_image_url:e.target.value}); setPreviewImg(e.target.value);}} placeholder="Image URL or upload (data: URL works)" className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-xs font-mono" />
            <label className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer justify-center ${imgUploading ? 'bg-slate-400 text-white' : 'bg-slate-900 text-white hover:bg-black'}`}>
              <Upload className="w-4 h-4" /> {imgUploading ? 'Uploading...' : 'Upload to Supabase'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} disabled={imgUploading} />
            </label>
            <p className="text-[11px] text-slate-500">If Supabase bucket is missing, image is saved as base64 and will still show on site + mobile (no external URL needed).</p>
            <input value={form.hero_image_caption} onChange={e=>setForm({...form, hero_image_caption:e.target.value})} placeholder="Caption / Credit" className="w-full px-3 py-2 rounded-xl border bg-slate-50 text-xs" />
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border p-5 space-y-2">
            <h3 className="font-black text-sm">Flags</h3>
            {[
              ['is_breaking','Breaking News 🔴'],
              ['is_featured','Featured ⭐'],
              ['is_trending','Trending 🔥'],
              ['is_lead','Main Hero (homepage hero)'],
              ['is_exclusive','Exclusive'],
            ].map(([k,label])=>(
              <label key={k} className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={!!form[k]} onChange={e=>setForm({...form, [k]: e.target.checked})} /> {label}</label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
