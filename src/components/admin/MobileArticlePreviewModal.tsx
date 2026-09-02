import React, { useState } from 'react';
import { X, Moon, Sun, Search, Menu, Share2, Bookmark, CheckCircle2, Send, Smartphone, Tablet, Monitor } from 'lucide-react';

interface MobileArticlePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: {
    title: string;
    title_hi?: string;
    content: string;
    subheadline?: string;
    category_name?: string;
    state_name?: string;
    author_name?: string;
    hero_image_url?: string;
    hero_image_caption?: string;
    published_at?: string;
  };
  onPublish?: () => void;
  saving?: boolean;
}

export const MobileArticlePreviewModal: React.FC<MobileArticlePreviewModalProps> = ({
  isOpen,
  onClose,
  article,
  onPublish,
  saving = false
}) => {
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet'>('mobile');

  if (!isOpen) return null;

  const headline = article.title_hi || article.title || 'शीर्षक यहाँ दिखाई देगा...';
  const category = article.category_name || 'प्रदेश';
  const state = article.state_name || 'उत्तर प्रदेश';
  const author = article.author_name || 'चाणक्य भारत डेस्क';
  
  // Format Hindi short date matching "1 सित°" from Image 3
  const now = new Date(article.published_at || Date.now());
  const hindiMonths = ['जन', 'फ़र', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सित°', 'अक्तू', 'नवं', 'दिसं'];
  const formattedDate = `${now.getDate()} ${hindiMonths[now.getMonth()]}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-2 sm:p-4 overflow-y-auto">
      
      {/* Top Controls Bar */}
      <div className="w-full max-w-lg mb-2 flex items-center justify-between text-white px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
            <Smartphone className="w-4 h-4" /> लाइव मोबाइल प्रीव्यू (Live Mobile Preview)
          </span>
          <div className="hidden sm:flex items-center bg-white/10 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`px-2 py-0.5 rounded-md font-bold ${deviceMode === 'mobile' ? 'bg-white text-black' : 'text-white'}`}
            >
              Mobile
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`px-2 py-0.5 rounded-md font-bold ${deviceMode === 'tablet' ? 'bg-white text-black' : 'text-white'}`}
            >
              Tablet
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onPublish && (
            <button
              onClick={onPublish}
              disabled={saving}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-lg flex items-center gap-1 shadow-md transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{saving ? 'प्रकाशन हो रहा है...' : 'Publish'}</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
            title="Close Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Phone Frame Mockup */}
      <div
        className={`w-full transition-all duration-300 bg-white dark:bg-[#0B0F17] rounded-[36px] border-8 border-slate-900 shadow-2xl overflow-hidden flex flex-col ${
          deviceMode === 'mobile' ? 'max-w-[390px] h-[800px]' : 'max-w-[640px] h-[820px]'
        }`}
      >
        {/* Mobile Browser Top Bar (Matches Android / WhatsApp in-app browser from Image 3) */}
        <div className="bg-[#1F2937] text-slate-300 px-4 py-2 flex items-center justify-between text-xs select-none">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[11px] text-emerald-400 font-bold">🔒</span>
            <span className="truncate text-xs font-mono text-slate-200">chanakyabharat.com</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>⋮</span>
          </div>
        </div>

        {/* Scrollable Website Content (Styled exactly like 3rd image) */}
        <div
          className={`flex-1 overflow-y-auto select-none ${
            previewTheme === 'dark' ? 'bg-[#0B0F17] text-slate-100 dark' : 'bg-[#FEFCF8] text-[#121212]'
          }`}
        >
          {/* 1. TOP BAR (Matches Image 3 top row: "1 सित°", "🌐 हिंदी ∨", Moon icon) */}
          <div className="bg-[#8B0000] text-white px-3 py-1.5 flex items-center justify-between text-[11px] font-sans-ui">
            <span className="font-bold text-amber-100">{formattedDate}</span>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white text-[#8B0000] rounded-full px-2 py-0.5 gap-1 font-bold text-[10px]">
                <span>🌐</span>
                <span>हिंदी ▾</span>
              </div>

              {/* Working Dark Mode Toggle inside preview */}
              <button
                type="button"
                onClick={() => setPreviewTheme(previewTheme === 'light' ? 'dark' : 'light')}
                className="p-1 rounded-full bg-white/20 text-white hover:bg-white/30"
                title="Toggle Dark Mode in Preview"
              >
                {previewTheme === 'light' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3 text-amber-300" />}
              </button>
            </div>
          </div>

          {/* 2. BRANDED HEADER (Matches Image 3: Hamburger, Logo, "चाणक्य भारत", "कुशीनगर • उत्तर प्रदेश", Search) */}
          <div className="py-2.5 px-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F17] flex items-center justify-between">
            <button className="p-1.5 -ml-1 text-slate-700 dark:text-slate-200">
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <img
                src="/assets/logo.jpg"
                alt="चाणक्य भारत"
                className="h-9 w-9 rounded-full object-cover border border-amber-400 bg-white shadow-xs"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x80/8B0000/FFFFFF?text=CB'; }}
              />
              <div className="text-center">
                <h1 className="font-devanagari font-black text-xl leading-none text-[#8B0000] dark:text-red-400">
                  चाणक्य भारत
                </h1>
                <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mt-0.5">
                  {state.includes('Uttar') || state.includes('उत्तर') ? 'कुशीनगर • उत्तर प्रदेश' : `${state} • ब्यूरो`}
                </p>
              </div>
            </div>

            <button className="p-1.5 -mr-1 text-slate-700 dark:text-slate-200">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* 3. MAROON CATEGORY NAV BAR (Matches Image 3: "मुखपृष्ठ", "देश-विदेश", "प्रदेश", "खेल", "धर्म"...) */}
          <div className="bg-[#8B0000] text-white px-3 py-1.5 flex items-center gap-4 text-xs font-bold font-devanagari overflow-x-auto no-scrollbar shadow-xs">
            <span className="shrink-0 font-black border-b-2 border-white pb-0.5">मुखपृष्ठ</span>
            <span className="shrink-0 text-white/90">देश-विदेश</span>
            <span className="shrink-0 text-white/90">प्रदेश</span>
            <span className="shrink-0 text-white/90">खेल</span>
            <span className="shrink-0 text-white/90">धर्म</span>
            <span className="shrink-0 text-white/90">मनोरंजन</span>
            <span className="shrink-0 text-white/90">विचार</span>
          </div>

          {/* 4. ARTICLE CONTENT (Styled exactly like Image 3 Devanagari typography) */}
          <div className="p-4 space-y-3">
            
            {/* Category / State Tag */}
            <div className="flex items-center gap-2">
              <span className="bg-[#8B0000] text-white px-2 py-0.5 rounded text-[10px] font-bold font-devanagari">
                {category}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold">
                {state}
              </span>
            </div>

            {/* Headline (Matching large Devanagari headline from Image 3) */}
            <h2 className="font-devanagari font-black text-xl sm:text-2xl leading-snug text-slate-900 dark:text-slate-100 tracking-tight">
              {headline}
            </h2>

            {/* Subheadline if present */}
            {article.subheadline && (
              <p className="text-xs text-slate-600 dark:text-slate-400 font-devanagari font-medium leading-relaxed italic">
                {article.subheadline}
              </p>
            )}

            {/* Byline & Date */}
            <div className="flex items-center justify-between border-y border-slate-200 dark:border-slate-800 py-2 text-[11px] text-slate-500 dark:text-slate-400 font-sans-ui">
              <span>{author} • कुशीनगर ब्यूरो</span>
              <span>{formattedDate} • 2 मिनट पढ़ें</span>
            </div>

            {/* Hero Image & Caption */}
            {article.hero_image_url && (
              <figure className="my-3">
                <img
                  src={article.hero_image_url}
                  alt={headline}
                  className="w-full h-48 sm:h-56 object-cover rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
                />
                {article.hero_image_caption && (
                  <figcaption className="text-[10px] text-slate-500 mt-1 italic font-devanagari">
                    {article.hero_image_caption}
                  </figcaption>
                )}
              </figure>
            )}

            {/* FULL NEWS STORY BODY (Rendered exactly with Image 3 Hindi typography) */}
            <div
              className="article-body font-devanagari text-slate-900 dark:text-slate-100 text-[15px] sm:text-[16px] leading-[1.8] space-y-4 pt-1 prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: article.content && article.content.trim().length > 0
                  ? article.content
                  : `<p class="text-slate-400 italic">समाचार का विस्तृत विवरण यहाँ दिखाई देगा...</p>`
              }}
            />

            {/* Social Share / Reader Feedback Bar */}
            <div className="pt-6 pb-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold text-[#8B0000]">© दैनिक चाणक्य भारत</span>
              <div className="flex items-center gap-3">
                <Share2 className="w-4 h-4 cursor-pointer hover:text-red-700" />
                <Bookmark className="w-4 h-4 cursor-pointer hover:text-red-700" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
