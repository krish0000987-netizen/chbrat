import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { articlesService } from '../../services/articles';
import { categoriesService } from '../../services/categories';
import { authorsService } from '../../services/authors';
import { locationsService } from '../../services/locations';
import { mediaService } from '../../services/media';
import { RichTextEditor } from '../../components/admin/RichTextEditor';
import { MobileArticlePreviewModal } from '../../components/admin/MobileArticlePreviewModal';
import {
  Save, Eye, ArrowLeft, Upload, Image as ImageIcon, Send, Settings,
  ChevronDown, CheckCircle2, Sparkles, AlertCircle, X, Globe, MapPin, Tag
} from 'lucide-react';
import { useNews } from '../../context/NewsContext';

function slugify(t: string) {
  return t.toLowerCase().trim().replace(/[^a-z0-9\u0900-\u097F]+/g, '-').replace(/^-|-$/g, '');
}

const INDIAN_STATES = [
  { id: 'loc-up', name: 'Uttar Pradesh', name_hi: 'उत्तर प्रदेश' },
  { id: 'loc-bihar', name: 'Bihar', name_hi: 'बिहार' },
  { id: 'loc-delhi', name: 'Delhi NCR', name_hi: 'दिल्ली एनसीआर' },
  { id: 'loc-mp', name: 'Madhya Pradesh', name_hi: 'मध्य प्रदेश' },
  { id: 'loc-rajasthan', name: 'Rajasthan', name_hi: 'राजस्थान' },
  { id: 'loc-gujarat', name: 'Gujarat', name_hi: 'गुजरात' },
  { id: 'loc-maharashtra', name: 'Maharashtra', name_hi: 'महाराष्ट्र' },
  { id: 'loc-uk', name: 'Uttarakhand', name_hi: 'उत्तराखंड' },
  { id: 'loc-haryana', name: 'Haryana', name_hi: 'हरियाणा' },
  { id: 'loc-punjab', name: 'Punjab', name_hi: 'पंजाब' },
  { id: 'loc-jharkhand', name: 'Jharkhand', name_hi: 'झारखंड' },
  { id: 'loc-national', name: 'National / Other', name_hi: 'राष्ट्रीय / अन्य' },
];

const UP_DISTRICTS = [
  { id: 'loc-kushinagar', name: 'Kushinagar', name_hi: 'कुशीनगर' },
  { id: 'loc-padrauna', name: 'Padrauna', name_hi: 'पडरौना' },
  { id: 'loc-gorakhpur', name: 'Gorakhpur', name_hi: 'गोरखपुर' },
  { id: 'loc-deoria', name: 'Deoria', name_hi: 'देवरिया' },
  { id: 'loc-maharajganj', name: 'Maharajganj', name_hi: 'महराजगंज' },
  { id: 'loc-lucknow', name: 'Lucknow', name_hi: 'लखनऊ' },
  { id: 'loc-varanasi', name: 'Varanasi', name_hi: 'वाराणसी' },
  { id: 'loc-ayodhya', name: 'Ayodhya', name_hi: 'अयोध्या' },
  { id: 'loc-prayagraj', name: 'Prayagraj', name_hi: 'प्रयागराज' },
  { id: 'loc-kanpur', name: 'Kanpur', name_hi: 'कानपुर' },
  { id: 'loc-noida', name: 'Noida / Ghaziabad', name_hi: 'नोएडा / गाज़ियाबाद' },
];

export const ArticleEditor: React.FC = () => {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const nav = useNavigate();
  const { refreshArticles } = useNews();

  const [cats, setCats] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saveToast, setSaveToast] = useState('');

  // Main Article Form State matching Image 1
  const [form, setForm] = useState<any>({
    title: '',
    title_hi: '',
    slug: '',
    subheadline: '',
    content: '',
    excerpt: '',
    category_id: '',
    state_id: 'loc-up',
    city_id: 'loc-kushinagar',
    author_id: '',
    hero_image_url: '',
    hero_image_caption: '',
    language: 'hi',
    status: 'draft',
    is_breaking: false,
    is_featured: false,
    is_trending: false,
    is_lead: false,
    is_exclusive: false,
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    published_at: '',
    scheduled_at: ''
  });

  const [previewImg, setPreviewImg] = useState('');
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);

  useEffect(() => {
    categoriesService.list().then(c => {
      if (c && c.length) setCats(c);
    }).catch(() => {});

    authorsService.list().then(a => {
      if (a && a.length) setAuthors(a);
    }).catch(() => {});

    if (!isNew && id) {
      articlesService.getById(id).then(a => {
        if (a) {
          setForm({
            title: a.title || '',
            title_hi: a.title_hi || '',
            slug: a.slug || '',
            subheadline: a.subheadline || '',
            content: a.content || '',
            excerpt: a.excerpt || '',
            category_id: a.category_id || '',
            state_id: a.state_id || 'loc-up',
            city_id: a.city_id || '',
            author_id: a.author_id || '',
            hero_image_url: a.hero_image_url || '',
            hero_image_caption: a.hero_image_caption || '',
            language: a.language || 'hi',
            status: a.status || 'draft',
            is_breaking: !!a.is_breaking,
            is_featured: !!a.is_featured,
            is_trending: !!a.is_trending,
            is_lead: !!a.is_lead,
            is_exclusive: !!a.is_exclusive,
            seo_title: a.seo_title || '',
            seo_description: a.seo_description || '',
            seo_keywords: a.seo_keywords || '',
            published_at: a.published_at || '',
            scheduled_at: a.scheduled_at || ''
          });
          setPreviewImg(a.hero_image_url || '');
        }
        setLoading(false);
      });
    }
  }, [id, isNew]);

  const onTitleChange = (v: string) => {
    setForm((f: any) => ({
      ...f,
      title: v,
      title_hi: f.title_hi || v,
      slug: f.slug || slugify(v),
      seo_title: f.seo_title || v
    }));
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Immediate preview via base64 for instant feedback
    const localPreview = await new Promise<string>((res) => {
      const r = new FileReader();
      r.onload = () => res(r.result as string);
      r.readAsDataURL(file);
    });

    setPreviewImg(localPreview);
    setForm((f: any) => ({ ...f, hero_image_url: localPreview }));
    setImgUploading(true);

    try {
      const m = await mediaService.upload(file, 'article-images');
      const url = (m as any).public_url || localPreview;
      setForm((f: any) => ({ ...f, hero_image_url: url }));
      setPreviewImg(url);
    } catch (err: any) {
      console.warn('upload fallback to local preview', err?.message);
    } finally {
      setImgUploading(false);
      e.target.value = '';
    }
  };

  const save = async (publish = false) => {
    if (!form.title.trim()) {
      alert('कृपया मुख्य समाचार शीर्षक (News Headline) दर्ज करें।');
      return;
    }
    setSaving(true);

    const payload: any = {
      title: form.title,
      title_hi: form.title_hi || form.title,
      slug: slugify(form.slug || form.title),
      subheadline: form.subheadline,
      content: form.content,
      excerpt: form.excerpt || form.content.replace(/<[^>]*>/g, '').slice(0, 160),
      category_id: form.category_id || null,
      state_id: form.state_id || 'loc-up',
      city_id: form.city_id || null,
      author_id: form.author_id || null,
      hero_image_url: form.hero_image_url,
      hero_image_caption: form.hero_image_caption,
      language: form.language,
      status: publish ? 'published' : form.status,
      published_at: publish ? new Date().toISOString() : (form.published_at || (form.status === 'published' ? new Date().toISOString() : null)),
      scheduled_at: form.scheduled_at || null,
      seo_title: form.seo_title || form.title,
      seo_description: form.seo_description || form.subheadline || form.excerpt,
      seo_keywords: form.seo_keywords,
      is_breaking: form.is_breaking,
      is_featured: form.is_featured,
      is_trending: form.is_trending,
      is_lead: form.is_lead,
      is_exclusive: form.is_exclusive,
    };

    try {
      if (isNew) {
        const created = await articlesService.create(payload);
        refreshArticles();
        setSaveToast(publish ? 'समाचार सफलतापूर्वक प्रकाशित हुआ ✓' : 'ड्राफ्ट सहेजा गया ✓');
        setTimeout(() => setSaveToast(''), 3000);
        nav(`/admin/articles/${created.id}/edit`);
      } else {
        await articlesService.update(id!, payload);
        refreshArticles();
        setSaveToast(publish ? 'समाचार प्रकाशित हुआ ✓' : 'परिवर्तन सहेजे गए ✓');
        setTimeout(() => setSaveToast(''), 3000);
      }
      setIsMobilePreviewOpen(false);
    } catch (e: any) {
      alert(e.message || 'Saving failed');
    } finally {
      setSaving(false);
    }
  };

  const selectedCategoryObj = cats.find(c => c.id === form.category_id);
  const selectedStateObj = INDIAN_STATES.find(s => s.id === form.state_id);
  const selectedAuthorObj = authors.find(a => a.id === form.author_id);

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="w-8 h-8 border-4 border-[#8B0000] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="font-bold text-sm text-slate-500">समाचार लोड हो रहा है...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-20">
      
      {/* 1. TOP MOBILE-FRIENDLY STUDIO BAR (Matches Image 2) */}
      <div className="sticky top-12 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-2.5 sm:p-3.5 shadow-sm flex items-center justify-between gap-2">
        
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Link
            to="/admin/articles"
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl text-slate-700 dark:text-slate-200 shrink-0 transition-colors"
            title="वापस सूची में जाएँ"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          
          {/* Quick Title Input with Orange Underline (Image 2 style) */}
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={form.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Title (शीर्षक)..."
              className="w-full bg-transparent border-b-2 border-orange-500/80 focus:border-orange-600 outline-none text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 px-1 py-0.5 font-devanagari truncate"
            />
          </div>
        </div>

        {/* Right Action Icons (Image 2: Eye Preview, Dropdown, Orange Send Button, Settings Gear) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Eye Icon: Open Live Mobile Preview (like Image 3) */}
          <button
            type="button"
            onClick={() => setIsMobilePreviewOpen(true)}
            className="p-2 sm:px-3 sm:py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
            title="लाइव मोबाइल प्रीव्यू देखें (Live Mobile Preview like 3rd Image)"
          >
            <Eye className="w-4 h-4 text-[#8B0000] dark:text-red-400" />
            <span className="hidden md:inline">Mobile Preview</span>
          </button>

          {/* Settings Gear Icon: Opens Post Settings Modal/Drawer */}
          <button
            type="button"
            onClick={() => setIsSettingsDrawerOpen(true)}
            className="p-2 sm:px-3 sm:py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
            title="पोस्ट सेटिंग्स (SEO, फ़ोटो, लेखक, श्रेणी)"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Draft Save */}
          <button
            type="button"
            onClick={() => save(false)}
            disabled={saving}
            className="hidden sm:flex px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold items-center gap-1 hover:bg-slate-50 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Draft</span>
          </button>

          {/* VIBRANT ORANGE PUBLISH BUTTON (Matching the Orange Send/Airplane Button in Image 2) */}
          <button
            type="button"
            onClick={() => save(true)}
            disabled={saving}
            className="px-3.5 sm:px-5 py-2 bg-[#F06529] hover:bg-[#E05418] active:scale-95 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md transition-all"
            title="समाचार तुरंत प्रकाशित करें (Publish News)"
          >
            <Send className="w-4 h-4 fill-white" />
            <span>{saving ? 'Publishing...' : 'Publish'}</span>
          </button>

        </div>
      </div>

      {/* Save Success Toast */}
      {saveToast && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* 2. FORM FIELDS (EXACTLY MATCHING IMAGE 1) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-7 shadow-sm space-y-6">
        
        {/* Field 1: News Headline (Required) */}
        <div>
          <label className="block text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 mb-1.5 font-sans-ui">
            News Headline <span className="text-[#8B0000] dark:text-red-400 font-semibold">(Required)</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="यहाँ न्यूज़ हेडिंग लिखें"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-base sm:text-lg font-bold font-devanagari focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Field 2: News Category (Required) */}
        <div>
          <label className="block text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 mb-1.5 font-sans-ui">
            News Category <span className="text-[#8B0000] dark:text-red-400 font-semibold">(Required)</span>
          </label>
          <div className="relative">
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm sm:text-base font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent cursor-pointer"
            >
              <option value="">-- select --</option>
              {cats.length > 0 ? (
                cats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_hi || c.name} {c.name_hi && c.name ? `(${c.name})` : ''}
                  </option>
                ))
              ) : (
                <>
                  <option value="cat-desh-videsh">देश-विदेश (National & World)</option>
                  <option value="cat-pradesh">प्रदेश (State)</option>
                  <option value="cat-khel">खेल (Sports)</option>
                  <option value="cat-dharm">धर्म (Spiritual)</option>
                  <option value="cat-manoranjan">मनोरंजन (Entertainment)</option>
                  <option value="cat-vichar">विचार (Opinion)</option>
                  <option value="cat-lifestyle">लाइफस्टाइल & हेल्थ</option>
                  <option value="cat-tech">टेक (Technology)</option>
                </>
              )}
            </select>
            <ChevronDown className="w-5 h-5 absolute right-4 top-3.5 pointer-events-none text-slate-400" />
          </div>
          {/* Helper text matching Image 1 */}
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-devanagari">
            न्यूज़ केटेगरी चुनें
          </p>
        </div>

        {/* Field 3: State (Required) & Linked District */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 mb-1.5 font-sans-ui">
              State <span className="text-[#8B0000] dark:text-red-400 font-semibold">(Required)</span>
            </label>
            <div className="relative">
              <select
                value={form.state_id}
                onChange={(e) => setForm({ ...form, state_id: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm sm:text-base font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-[#8B0000] cursor-pointer"
              >
                <option value="">-- select --</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name_hi} ({s.name})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 absolute right-4 top-3.5 pointer-events-none text-slate-400" />
            </div>
            {/* Helper text matching Image 1 */}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-devanagari">
              राज्य चुनें
            </p>
          </div>

          {/* District / City Desk (Tailored for Kushinagar & UP Bureau) */}
          <div>
            <label className="block text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 mb-1.5 font-sans-ui flex items-center justify-between">
              <span>District / City Desk</span>
              <span className="text-[11px] text-slate-400 font-normal">जिला / नगर</span>
            </label>
            <div className="relative">
              <select
                value={form.city_id}
                onChange={(e) => setForm({ ...form, city_id: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm sm:text-base font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-[#8B0000] cursor-pointer"
              >
                <option value="">-- चुनें (Select District) --</option>
                {UP_DISTRICTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name_hi} ({d.name})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 absolute right-4 top-3.5 pointer-events-none text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-devanagari">
              कुशीनगर, पडरौना या संबंधित जिला चुनें
            </p>
          </div>
        </div>

        {/* Field 4: Full News Story (Required) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 font-sans-ui">
              Full News Story <span className="text-[#8B0000] dark:text-red-400 font-semibold">(Required)</span>
            </label>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-devanagari">
              संपूर्ण खबर विस्तार से लिखें
            </span>
          </div>

          {/* Embedded WYSIWYG Rich Editor (Image 1 & Image 2 Toolbar) */}
          <RichTextEditor
            value={form.content}
            onChange={(val) => setForm({ ...form, content: val })}
            placeholder="यहाँ समाचार विस्तार से लिखें... (Write full news story with headings, bold, quotes, and images)"
            minHeight="360px"
          />
        </div>

        {/* Quick Hero Image Preview / Uploader on Main Screen */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              {previewImg ? (
                <img
                  src={previewImg}
                  alt="Hero Preview"
                  className="w-16 h-12 object-cover rounded-xl border border-slate-300 shrink-0"
                />
              ) : (
                <div className="w-16 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl border flex items-center justify-center text-slate-400 shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {previewImg ? 'मुख्य फ़ोटो (Hero Image) सेट है' : 'मुख्य फ़ोटो जोड़ें (Hero Image)'}
                </p>
                <p className="text-[11px] text-slate-500">
                  फ़ोन कैमरा या गैलरी से फ़ोटो अपलोड करें
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <Upload className="w-3.5 h-3.5 text-[#8B0000]" />
                <span>{imgUploading ? 'अपलोड हो रहा है...' : 'फ़ोटो चुनें / कैमरा'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  disabled={imgUploading}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={() => setIsSettingsDrawerOpen(true)}
                className="px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors"
              >
                More Settings
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 3. SETTINGS DRAWER / MODAL (Triggered by ⚙️ Gear in Top Bar or Button) */}
      {isSettingsDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full overflow-y-auto p-5 space-y-6 shadow-2xl border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#8B0000]" />
                <h3 className="font-black text-base text-slate-900 dark:text-slate-100">
                  Article Settings (सेटिंग्स)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsDrawerOpen(false)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Publishing Status & Schedule */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border">
              <h4 className="font-black text-xs uppercase tracking-wider text-slate-500">प्रकाशन स्थिति (Publishing)</h4>
              <div>
                <label className="block text-xs font-bold mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 text-xs font-bold"
                >
                  <option value="draft">Draft (ड्राफ्ट)</option>
                  <option value="review">Under Review (समीक्षा)</option>
                  <option value="scheduled">Scheduled (शेड्यूल)</option>
                  <option value="published">Published (प्रकाशित)</option>
                  <option value="archived">Archived (संग्रहीत)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Schedule Date & Time</label>
                <input
                  type="datetime-local"
                  value={form.scheduled_at ? new Date(form.scheduled_at).toISOString().slice(0, 16) : ''}
                  onChange={(e) => setForm({ ...form, scheduled_at: e.target.value ? new Date(e.target.value).toISOString() : '' })}
                  className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 text-xs font-mono"
                />
              </div>
            </div>

            {/* Author Selection */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border">
              <h4 className="font-black text-xs uppercase tracking-wider text-slate-500">लेखक / रिपोर्टर (Author)</h4>
              <select
                value={form.author_id}
                onChange={(e) => setForm({ ...form, author_id: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 text-xs font-bold"
              >
                <option value="">चाणक्य भारत डेस्क (Default Desk)</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>

            {/* Editorial Flags */}
            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border">
              <h4 className="font-black text-xs uppercase tracking-wider text-slate-500">फ़्लैग (Badges)</h4>
              {[
                ['is_breaking', '🔴 ब्रेकिंग न्यूज़ (Breaking News Ticker)'],
                ['is_lead', '⭐ मुख्य लीड स्टोरी (Main Homepage Hero)'],
                ['is_featured', '✨ फीचर स्टोरी (Featured Story)'],
                ['is_trending', '🔥 ट्रेंडिंग न्यूज़ (Trending Now)'],
                ['is_exclusive', '🔒 एक्सक्लूसिव रिपोर्ट (Exclusive Bureau Report)'],
              ].map(([k, label]) => (
                <label key={k} className="flex items-center gap-2.5 text-xs font-bold py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!form[k]}
                    onChange={(e) => setForm({ ...form, [k]: e.target.checked })}
                    className="w-4 h-4 rounded text-[#8B0000] focus:ring-[#8B0000]"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>

            {/* SEO & Slug */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border">
              <h4 className="font-black text-xs uppercase tracking-wider text-slate-500">SEO & सोशल मीडिया</h4>
              <div>
                <label className="block text-xs font-bold mb-1">Slug (URL Permalink)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Subheadline / Excerpt</label>
                <textarea
                  value={form.subheadline}
                  onChange={(e) => setForm({ ...form, subheadline: e.target.value })}
                  rows={2}
                  placeholder="खबर का संक्षिप्त विवरण..."
                  className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">SEO Keywords</label>
                <input
                  type="text"
                  value={form.seo_keywords}
                  onChange={(e) => setForm({ ...form, seo_keywords: e.target.value })}
                  placeholder="कुशीनगर, उत्तर प्रदेश, ताजा समाचार"
                  className="w-full px-3 py-2 rounded-xl border bg-white dark:bg-slate-900 text-xs"
                />
              </div>
            </div>

            {/* Bottom Drawer Actions */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsSettingsDrawerOpen(false)}
                className="w-1/2 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold"
              >
                बंद करें (Close)
              </button>
              <button
                type="button"
                onClick={() => { save(false); setIsSettingsDrawerOpen(false); }}
                className="w-1/2 py-2.5 bg-[#8B0000] text-white rounded-xl text-xs font-bold shadow"
              >
                सेव करें (Save)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. LIVE MOBILE PREVIEW MODAL (MATCHING IMAGE 3) */}
      <MobileArticlePreviewModal
        isOpen={isMobilePreviewOpen}
        onClose={() => setIsMobilePreviewOpen(false)}
        article={{
          title: form.title,
          title_hi: form.title_hi,
          content: form.content,
          subheadline: form.subheadline,
          category_name: selectedCategoryObj?.name_hi || selectedCategoryObj?.name || 'प्रदेश',
          state_name: selectedStateObj?.name_hi || 'उत्तर प्रदेश',
          author_name: selectedAuthorObj?.name || 'चाणक्य भारत डेस्क',
          hero_image_url: form.hero_image_url,
          hero_image_caption: form.hero_image_caption,
          published_at: form.published_at || new Date().toISOString()
        }}
        onPublish={() => save(true)}
        saving={saving}
      />

    </div>
  );
};
