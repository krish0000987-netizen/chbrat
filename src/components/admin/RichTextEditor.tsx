import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon,
  Smile, Undo, Redo, Code, Eye, ChevronDown, Upload, Minus,
  RemoveFormatting, Indent, Outdent, Table as TableIcon
} from 'lucide-react';
import { mediaService } from '../../services/media';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

// Common phonetic transliteration dictionary for Hindi news reporting
const HINDI_COMMON_WORDS: Record<string, string> = {
  namaste: 'नमस्ते',
  bharat: 'भारत',
  chanakya: 'चाणक्य',
  kushinagar: 'कुशीनगर',
  padrauna: 'पडरौना',
  gorakhpur: 'गोरखपुर',
  deoria: 'देवरिया',
  uttar: 'उत्तर',
  pradesh: 'प्रदेश',
  samachar: 'समाचार',
  khabar: 'खबर',
  desh: 'देश',
  videsh: 'विदेश',
  khel: 'खेल',
  dharm: 'धर्म',
  rajya: 'राज्य',
  nagar: 'नगर',
  palika: 'पालिका',
  parishad: 'परिषद',
  adhyaksh: 'अध्यक्ष',
  sarkar: 'सरकार',
  shasan: 'शासन',
  adhikari: 'अधिकारी',
  karmchari: 'कर्मचारी',
  vidhayak: 'विधायक',
  sansad: 'सांसद',
  pulis: 'पुलिस',
  police: 'पुलिस',
  kanoon: 'कानून',
  nyay: 'न्याय',
  aaj: 'आज',
  kal: 'कल',
  patrakar: 'पत्रकार',
  bureau: 'ब्यूरो',
  reported: 'रिपोर्ट',
  report: 'रिपोर्ट',
  janta: 'जनता',
  vikas: 'विकास',
  yojana: 'योजना',
  pradhan: 'प्रधान',
  mantri: 'मंत्री',
  mukhya: 'मुख्य',
  chunav: 'चुनाव',
  ghoshna: 'घोषणा',
  ghatna: 'घटना',
  haadsa: 'हादसा',
  bjp: 'भाजपा',
  congress: 'कांग्रेस',
  sp: 'सपा',
  bsp: 'बसपा',
  aap: 'आप',
  hai: 'है',
  hain: 'हैं',
  tha: 'था',
  the: 'थे',
  thi: 'थी',
  aur: 'और',
  par: 'पर',
  mein: 'में',
  me: 'में',
  se: 'से',
  ko: 'को',
  ke: 'के',
  ki: 'की',
  ka: 'का',
  yeh: 'यह',
  woh: 'वह',
  bhi: 'भी',
  nahi: 'नहीं',
  nahin: 'नहीं',
  ab: 'अब',
  tab: 'तब',
  jab: 'जब',
  sab: 'सब',
  kaha: 'कहा',
  kiya: 'किया',
  gaya: 'गया',
  gaye: 'गए',
  rahe: 'रहे',
  rahi: 'रही',
  raha: 'रहा',
  kar: 'कर',
  karke: 'करके',
  huye: 'हुए',
  baat: 'बात',
  sawal: 'सवाल',
  jankari: 'जानकारी',
  dawa: 'दावा',
  arop: 'आरोप',
  khulasa: 'खुलासा',
  live: 'लाइव',
  breaking: 'ब्रेकिंग',
  exclusive: 'एक्सक्लूसिव',
};

const HINDI_CONSONANTS: Record<string, string> = {
  k: 'क', kh: 'ख', g: 'ग', gh: 'घ',
  ch: 'च', chh: 'छ', j: 'ज', jh: 'झ',
  t: 'त', th: 'थ', d: 'द', dh: 'ध', n: 'न',
  p: 'प', ph: 'फ', f: 'फ़', b: 'ब', bh: 'भ', m: 'म',
  y: 'य', r: 'र', l: 'ल', v: 'व', w: 'व',
  sh: 'श', s: 'स', h: 'ह', z: 'ज़'
};

function transliterateWord(w: string): string {
  const lower = w.toLowerCase();
  if (HINDI_COMMON_WORDS[lower]) return HINDI_COMMON_WORDS[lower];
  let res = '';
  let i = 0;
  while (i < lower.length) {
    if (i + 2 <= lower.length && HINDI_CONSONANTS[lower.slice(i, i + 3)]) {
      res += HINDI_CONSONANTS[lower.slice(i, i + 3)];
      i += 3;
    } else if (i + 1 <= lower.length && HINDI_CONSONANTS[lower.slice(i, i + 2)]) {
      res += HINDI_CONSONANTS[lower.slice(i, i + 2)];
      i += 2;
    } else if (HINDI_CONSONANTS[lower[i]]) {
      res += HINDI_CONSONANTS[lower[i]];
      i += 1;
    } else if (lower[i] === 'a') {
      if (i > 0 && lower[i + 1] === 'a') { res += 'ा'; i += 2; }
      else { i += 1; }
    } else if (lower[i] === 'i') {
      res += (i === 0 ? 'इ' : 'ि');
      i += 1;
    } else if (lower[i] === 'e') {
      if (lower[i + 1] === 'e') { res += 'ी'; i += 2; }
      else { res += (i === 0 ? 'ए' : 'े'); i += 1; }
    } else if (lower[i] === 'u') {
      res += (i === 0 ? 'उ' : 'ु');
      i += 1;
    } else if (lower[i] === 'o') {
      if (lower[i + 1] === 'o') { res += 'ू'; i += 2; }
      else { res += (i === 0 ? 'ओ' : 'ो'); i += 1; }
    } else {
      res += lower[i];
      i += 1;
    }
  }
  return res || w;
}

const QUICK_HINDI_CHARS = ['।', '॥', '₹', 'ँ', 'ं', 'ः', 'ॐ', '–', '‘', '’', '“', '”'];

const COLOR_PRESETS = [
  { label: 'Black', value: '#111827' },
  { label: 'Maroon (Brand)', value: '#8B0000' },
  { label: 'Crimson Red', value: '#DC2626' },
  { label: 'Navy Blue', value: '#1D4ED8' },
  { label: 'Emerald Green', value: '#059669' },
  { label: 'Amber Orange', value: '#D97706' },
  { label: 'Purple', value: '#7C3AED' },
  { label: 'Slate Gray', value: '#4B5563' },
];

const HIGHLIGHT_PRESETS = [
  { label: 'None', value: 'transparent' },
  { label: 'Yellow', value: '#FEF08A' },
  { label: 'Amber', value: '#FED7AA' },
  { label: 'Lime Green', value: '#BBF7D0' },
  { label: 'Cyan Blue', value: '#BAE6FD' },
  { label: 'Pink Rose', value: '#FBCFE8' },
  { label: 'Lavender', value: '#E9D5FF' },
];

const EMOJIS = [
  '🔴', '🔥', '🚨', '⚡', '📢', '📰', '🇮🇳', '⚖️', '🏛️', '👮',
  '🏥', '🏏', '🚩', '🌾', '🌧️', '☀️', '👉', '📌', '✅', '⚠️'
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'यहाँ समाचार विस्तार से लिखें (Write full news story)...',
  minHeight = '320px',
  className = ''
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isHtmlView, setIsHtmlView] = useState(false);
  const [activeHeading, setActiveHeading] = useState('p');
  const [isHindiInputEnabled, setIsHindiInputEnabled] = useState(false);
  const [showMoreTools, setShowMoreTools] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);

  // Link modal state
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  // Image modal state
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageUploading, setImageUploading] = useState(false);

  // Table modal state
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  useEffect(() => {
    if (editorRef.current && !isHtmlView) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, isHtmlView]);

  const exec = useCallback((command: string, val: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, val);
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleFormatBlock = (tag: string) => {
    setActiveHeading(tag);
    if (tag === 'p') {
      exec('formatBlock', '<p>');
    } else if (tag === 'blockquote') {
      exec('formatBlock', '<blockquote>');
    } else if (tag === 'pre') {
      exec('formatBlock', '<pre>');
    } else {
      exec('formatBlock', `<${tag}>`);
    }
  };

  const insertLink = () => {
    if (!linkUrl.trim()) return;
    const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
    if (editorRef.current) {
      editorRef.current.focus();
      if (linkText.trim()) {
        const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[#8B0000] underline font-bold">${linkText}</a>`;
        document.execCommand('insertHTML', false, linkHtml);
      } else {
        exec('createLink', url);
      }
      onChange(editorRef.current.innerHTML);
    }
    setLinkUrl('');
    setLinkText('');
    setShowLinkModal(false);
  };

  const insertImage = (url: string, caption?: string) => {
    if (!url.trim()) return;
    if (editorRef.current) {
      editorRef.current.focus();
      const figureHtml = `
        <figure class="my-4 text-center">
          <img src="${url}" alt="${caption || 'News Image'}" class="max-w-full h-auto mx-auto rounded-xl border border-slate-200 shadow-sm" />
          ${caption ? `<figcaption class="text-xs text-slate-500 mt-1 italic">${caption}</figcaption>` : ''}
        </figure>
        <p><br></p>
      `;
      document.execCommand('insertHTML', false, figureHtml);
      onChange(editorRef.current.innerHTML);
    }
    setImageUrl('');
    setImageCaption('');
    setShowImageModal(false);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const media = await mediaService.upload(file, 'article-images');
      const url = media.public_url || '';
      if (url) {
        insertImage(url, file.name.replace(/\.[^/.]+$/, ''));
      }
    } catch (err: any) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          insertImage(reader.result, 'Uploaded Image');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setImageUploading(false);
      e.target.value = '';
    }
  };

  const insertTable = () => {
    let html = '<table class="w-full my-4 border-collapse border border-slate-300 text-xs"><tbody>';
    for (let r = 0; r < tableRows; r++) {
      html += '<tr>';
      for (let c = 0; c < tableCols; c++) {
        if (r === 0) {
          html += '<th class="border border-slate-300 p-2 bg-slate-100 font-bold text-left">शीर्षक ' + (c + 1) + '</th>';
        } else {
          html += '<td class="border border-slate-300 p-2">विवरण ' + r + '-' + (c + 1) + '</td>';
        }
      }
      html += '</tr>';
    }
    html += '</tbody></table><p><br></p>';
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, html);
      onChange(editorRef.current.innerHTML);
    }
    setShowTableModal(false);
  };

  const insertEmoji = (emoji: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertText', false, emoji);
      onChange(editorRef.current.innerHTML);
    }
    setShowEmojiPicker(false);
  };

  const insertChar = (char: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertText', false, char);
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isHindiInputEnabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      const textNode = range.startContainer;
      if (textNode.nodeType === Node.TEXT_NODE && textNode.textContent) {
        const text = textNode.textContent;
        const offset = range.startOffset;
        const textBefore = text.slice(0, offset);
        const match = textBefore.match(/([a-zA-Z]+)$/);
        if (match) {
          const engWord = match[1];
          const hindiWord = transliterateWord(engWord);
          if (hindiWord !== engWord) {
            e.preventDefault();
            const startPos = offset - engWord.length;
            const newText = text.slice(0, startPos) + hindiWord + ' ' + text.slice(offset);
            textNode.textContent = newText;
            const newRange = document.createRange();
            newRange.setStart(textNode, startPos + hindiWord.length + 1);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
            handleInput();
          }
        }
      }
    }
  };

  return (
    <div className={`border border-slate-300 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col ${className}`}>
      
      {/* TOOLBAR ROW 1: PRIMARY FORMATTING (Matches Image 1 & Image 2) */}
      <div className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 p-2 sm:p-2.5 flex flex-wrap items-center gap-1 sm:gap-1.5 text-slate-700 dark:text-slate-200 select-none">
        
        {/* Compose vs HTML Mode switch (Pencil icon from Image 2) */}
        <button
          type="button"
          onClick={() => setIsHtmlView(!isHtmlView)}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
            isHtmlView ? 'bg-[#8B0000] text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
          title={isHtmlView ? 'Switch to Visual Compose View' : 'Switch to HTML Code View'}
        >
          {isHtmlView ? <Eye className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isHtmlView ? 'Compose' : 'HTML'}</span>
        </button>

        <span className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-0.5" />

        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => exec('undo')}
          disabled={isHtmlView}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('redo')}
          disabled={isHtmlView}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-0.5" />

        {/* Paragraph / Heading selector (Matches Image 1 "Paragraph ▾" and Image 2 "Normal ▾") */}
        <div className="relative">
          <select
            value={activeHeading}
            onChange={(e) => handleFormatBlock(e.target.value)}
            disabled={isHtmlView}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer pr-6 appearance-none focus:outline-none focus:ring-1 focus:ring-[#8B0000]"
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1 (बड़ा शीर्षक)</option>
            <option value="h2">Heading 2 (मध्यम शीर्षक)</option>
            <option value="h3">Heading 3 (छोटा उपशीर्षक)</option>
            <option value="blockquote">Quote (उद्धरण)</option>
            <option value="pre">Code / Box</option>
          </select>
          <ChevronDown className="w-3 h-3 absolute right-2 top-2 pointer-events-none text-slate-400" />
        </div>

        <span className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-0.5" />

        {/* Bold, Italic, Underline, Strikethrough (Images 1 & 2) */}
        <button
          type="button"
          onClick={() => exec('bold')}
          disabled={isHtmlView}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 font-bold disabled:opacity-30"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('italic')}
          disabled={isHtmlView}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 italic disabled:opacity-30"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('underline')}
          disabled={isHtmlView}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 underline disabled:opacity-30"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('strikeThrough')}
          disabled={isHtmlView}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 line-through disabled:opacity-30"
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-0.5 hidden sm:inline" />

        {/* Bullet List, Numbered List, Blockquote (Image 1 row 1) */}
        <button
          type="button"
          onClick={() => exec('insertUnorderedList')}
          disabled={isHtmlView}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('insertOrderedList')}
          disabled={isHtmlView}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleFormatBlock('blockquote')}
          disabled={isHtmlView}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        {/* Alignment (Image 1 row 2) */}
        <span className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-0.5" />
        <button
          type="button"
          onClick={() => exec('justifyLeft')}
          disabled={isHtmlView}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('justifyCenter')}
          disabled={isHtmlView}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('justifyRight')}
          disabled={isHtmlView}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        {/* Link & Media Inserts (Image 1 row 2) */}
        <span className="w-px h-5 bg-slate-300 dark:bg-slate-700 mx-0.5" />
        <button
          type="button"
          onClick={() => setShowLinkModal(true)}
          disabled={isHtmlView}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setShowImageModal(true)}
          disabled={isHtmlView}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 disabled:opacity-30"
          title="Insert Photo / Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setShowTableModal(true)}
          disabled={isHtmlView}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
          title="Insert Table"
        >
          <TableIcon className="w-4 h-4" />
        </button>

        {/* More Tools Toggle (Image 2 "...") */}
        <button
          type="button"
          onClick={() => setShowMoreTools(!showMoreTools)}
          className={`p-1.5 rounded-lg font-black text-xs px-2 transition-colors ${
            showMoreTools ? 'bg-slate-300 dark:bg-slate-700 text-[#8B0000]' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
          title="More Tools"
        >
          •••
        </button>

        {/* Google Hindi Typing Tool (Matching the "G" icon in Image 2) */}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsHindiInputEnabled(!isHindiInputEnabled)}
            className={`px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1.5 transition-all shadow-xs ${
              isHindiInputEnabled
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500'
            }`}
            title="Google Hindi Typing / Transliteration (Type English -> converts to Hindi on Space)"
          >
            <span className="w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center leading-none">G</span>
            <span>{isHindiInputEnabled ? 'हिंदी ON' : 'हिंदी OFF'}</span>
          </button>
        </div>
      </div>

      {/* SECONDARY / EXTENDED TOOLBAR (Expanded when "..." is clicked) */}
      {showMoreTools && (
        <div className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-2 flex flex-wrap items-center gap-2 text-xs">
          
          {/* Text Color Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 font-bold"
            >
              <span className="w-3.5 h-3.5 rounded-full bg-[#8B0000] border border-white" />
              <span>Color</span>
            </button>
            {showColorPicker && (
              <div className="absolute left-0 top-full mt-1 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 flex gap-1.5">
                {COLOR_PRESETS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => { exec('foreColor', c.value); setShowColorPicker(false); }}
                    className="w-6 h-6 rounded-full border border-slate-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Highlight Marker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowHighlightPicker(!showHighlightPicker)}
              className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 font-bold"
            >
              <span className="w-3.5 h-3.5 rounded-sm bg-yellow-300 border border-slate-400" />
              <span>Highlight</span>
            </button>
            {showHighlightPicker && (
              <div className="absolute left-0 top-full mt-1 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 flex gap-1.5">
                {HIGHLIGHT_PRESETS.map(h => (
                  <button
                    key={h.value}
                    type="button"
                    onClick={() => { exec('hiliteColor', h.value); setShowHighlightPicker(false); }}
                    className="w-6 h-6 rounded-sm border border-slate-300 hover:scale-110 transition-transform flex items-center justify-center text-[10px]"
                    style={{ backgroundColor: h.value }}
                    title={h.label}
                  >
                    {h.value === 'transparent' ? '✕' : ''}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Indent / Outdent */}
          <button
            type="button"
            onClick={() => exec('indent')}
            className="p-1 bg-white dark:bg-slate-900 border rounded-lg hover:bg-slate-200"
            title="Increase Indent"
          >
            <Indent className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec('outdent')}
            className="p-1 bg-white dark:bg-slate-900 border rounded-lg hover:bg-slate-200"
            title="Decrease Indent"
          >
            <Outdent className="w-4 h-4" />
          </button>

          {/* Horizontal Divider */}
          <button
            type="button"
            onClick={() => exec('insertHorizontalRule')}
            className="px-2 py-1 bg-white dark:bg-slate-900 border rounded-lg flex items-center gap-1 font-bold"
            title="Insert Horizontal Rule"
          >
            <Minus className="w-3.5 h-3.5" /> Divider
          </button>

          {/* Emoji Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 flex items-center gap-1 font-bold"
            >
              <Smile className="w-3.5 h-3.5 text-amber-500" /> Emoji
            </button>
            {showEmojiPicker && (
              <div className="absolute left-0 top-full mt-1 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 grid grid-cols-5 gap-2 w-48">
                {EMOJIS.map(e => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => insertEmoji(e)}
                    className="text-lg hover:scale-125 transition-transform p-1 rounded"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear Formatting */}
          <button
            type="button"
            onClick={() => exec('removeFormat')}
            className="px-2 py-1 bg-white dark:bg-slate-900 border rounded-lg flex items-center gap-1 text-slate-500 hover:text-red-600"
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      )}

      {/* QUICK HINDI CHARACTER BAR */}
      <div className="bg-amber-50/70 dark:bg-amber-950/20 border-b border-amber-200/60 dark:border-amber-900/30 px-3 py-1 flex items-center gap-1.5 text-xs overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 shrink-0">हिंदी विराम व चिह्न:</span>
        {QUICK_HINDI_CHARS.map(c => (
          <button
            key={c}
            type="button"
            onClick={() => insertChar(c)}
            className="px-2 py-0.5 bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 rounded text-amber-900 dark:text-amber-200 hover:bg-amber-100 text-xs font-devanagari font-black shrink-0 transition-colors"
          >
            {c}
          </button>
        ))}
        {isHindiInputEnabled && (
          <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold ml-auto shrink-0 animate-pulse">
            ✓ Phonetic Hindi सक्रिय है (उदा. namaste + Space = नमस्ते)
          </span>
        )}
      </div>

      {/* EDITOR BODY (WYSIWYG or RAW HTML) */}
      <div className="relative flex-1 p-3 sm:p-4 min-h-[280px]">
        {isHtmlView ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ minHeight }}
            className="w-full h-full p-3 font-mono text-xs bg-slate-950 text-emerald-400 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
            placeholder="<html>... paste raw HTML here ...</html>"
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            style={{ minHeight }}
            className="outline-none text-sm sm:text-base leading-relaxed text-slate-900 dark:text-slate-100 font-devanagari article-body prose max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none"
            data-placeholder={placeholder}
            spellCheck={false}
          />
        )}
      </div>

      {/* BOTTOM FOOTER INFO */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-500">
        <div>
          <span>{value.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(Boolean).length} शब्द (Words)</span>
          <span className="mx-2">•</span>
          <span>{value.replace(/<[^>]*>/g, '').length} वर्ण (Characters)</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Rich HTML News Format</span>
        </div>
      </div>

      {/* LINK MODAL */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2 text-slate-900 dark:text-white">
              <LinkIcon className="w-4 h-4 text-[#8B0000]" /> लिंक जोड़ें (Insert Link)
            </h3>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">लिंक टेक्स्ट (Text to display - Optional)</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="उदा. चाणक्य भारत विशेष खबर"
                className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">URL (वेबसाइट लिंक) *</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://chanakyabharat.com/article/..."
                className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-mono"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-3 py-1.5 border rounded-xl text-xs font-bold hover:bg-slate-100"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="button"
                onClick={insertLink}
                className="px-4 py-1.5 bg-[#8B0000] text-white rounded-xl text-xs font-bold shadow"
              >
                जोड़ें (Insert Link)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE MODAL */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2 text-slate-900 dark:text-white">
              <ImageIcon className="w-4 h-4 text-[#8B0000]" /> फ़ोटो / चित्र जोड़ें (Insert Photo)
            </h3>
            
            {/* File Upload Button with Mobile Camera support */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">फ़ोन / कंप्यूटर से अपलोड करें:</label>
              <label className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Upload className="w-4 h-4 text-[#8B0000]" />
                <span>{imageUploading ? 'अपलोड हो रहा है...' : 'फ़ोटो चुनें या कैमरा से लें'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  disabled={imageUploading}
                  className="hidden"
                />
              </label>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
              <span className="flex-shrink mx-2 text-[10px] uppercase font-bold text-slate-400">या URL दर्ज करें</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">फ़ोटो का URL:</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">फ़ोटो कैप्शन (Caption):</label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="उदा. बैठक के दौरान उपस्थित अधिकारी"
                className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-800 text-xs"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-3 py-1.5 border rounded-xl text-xs font-bold hover:bg-slate-100"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={() => insertImage(imageUrl, imageCaption)}
                disabled={!imageUrl.trim()}
                className="px-4 py-1.5 bg-[#8B0000] text-white rounded-xl text-xs font-bold shadow disabled:opacity-40"
              >
                फ़ोटो जोड़ें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE MODAL */}
      {showTableModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2 text-slate-900 dark:text-white">
              <TableIcon className="w-4 h-4 text-[#8B0000]" /> तालिका जोड़ें (Insert Table)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">पंक्तियाँ (Rows)</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={tableRows}
                  onChange={(e) => setTableRows(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">कॉलम (Columns)</label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={tableCols}
                  onChange={(e) => setTableCols(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="px-3 py-1.5 border rounded-xl text-xs font-bold hover:bg-slate-100"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={insertTable}
                className="px-4 py-1.5 bg-[#8B0000] text-white rounded-xl text-xs font-bold shadow"
              >
                तालिका बनाएँ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
