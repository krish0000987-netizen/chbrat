import React, { createContext, useContext, useEffect, useState } from 'react';
import { mockArticles, mockLiveUpdates } from '../data/mockNewsData';
import { Article, CategoryType, LanguageCode, LiveUpdate, UserProfile } from '../types';
import { supabase } from '../lib/supabase';
import { dbArticleToArticle, getLocal } from '../services/articles';

interface NewsContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  articles: Article[];
  refreshArticles: () => void;
  savedArticleIds: string[];
  toggleSaveArticle: (articleId: string) => void;
  isArticleSaved: (articleId: string) => boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  setFontSize: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
  liveUpdates: LiveUpdate[];
  userProfile: UserProfile;
  addArticle: (newArticle: Omit<Article, 'id' | 'publishedAt' | 'viewsCount' | 'commentsCount' | 'sharesCount'>) => void;
  updateArticle: (id: string, updatedFields: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  speechPlayingId: string | null;
  toggleSpeech: (articleId: string, text: string) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

const initialProfile: UserProfile = {
  name: 'चाणक्य भारत पाठक',
  email: '',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  subscriptionPlan: 'Free',
  savedArticleIds: [],
  readingHistoryIds: [],
  followedTopics: ['India', 'State News', 'Sports', 'Entertainment'] as unknown as CategoryType[],
  followedAuthors: []
};

function loadWebsiteArticles(): Article[] {
  try {
    const localCj = localStorage.getItem('cj_articles_db');
    if (localCj) {
      const parsed = JSON.parse(localCj);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const published = parsed.filter((x: any) => x.status === 'published');
        if (published.length > 0) {
          return published.map(dbArticleToArticle);
        }
      }
    }
    const localIr = localStorage.getItem('ir_articles');
    if (localIr) {
      const parsed = JSON.parse(localIr);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return getLocal().filter(x => x.status === 'published').map(dbArticleToArticle);
}

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const local = localStorage.getItem('ir_theme');
    return (local === 'dark' || local === 'light') ? local : 'light';
  });

  const [language, setLanguage] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('ir_lang') as LanguageCode | null;
    if (saved === 'en' || saved === 'hi' || saved === 'bho' || saved === 'ur' || saved === 'bn') return saved;
    return 'hi';
  });

  const [articles, setArticles] = useState<Article[]>(loadWebsiteArticles);
  const [dbLoaded, setDbLoaded] = useState(false);

  const [savedArticleIds, setSavedArticleIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ir_saved');
    return saved ? JSON.parse(saved) : ['art-01', 'art-02'];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [speechPlayingId, setSpeechPlayingId] = useState<string | null>(null);

  const refreshArticles = () => {
    setArticles(loadWebsiteArticles());
  };

  // Instant reactive synchronization with admin panel updates
  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e?.detail && Array.isArray(e.detail) && e.detail.length > 0) {
        setArticles(e.detail);
      } else {
        setArticles(loadWebsiteArticles());
      }
    };
    window.addEventListener('cb_articles_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('cb_articles_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('ir_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('ir_lang', language);
    const htmlLangMap: Record<LanguageCode, string> = { hi: 'hi', en: 'en', bho: 'hi', ur: 'ur', bn: 'bn' };
    document.documentElement.lang = htmlLangMap[language] || 'hi';
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    localStorage.setItem('ir_saved', JSON.stringify(savedArticleIds));
  }, [savedArticleIds]);

  // Fetch published articles from Supabase if available
  useEffect(() => {
    let cancelled = false;
    const fetchFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*, categories(id,name,name_hi,slug), authors(id,name,slug,avatar_url)')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(50);
        if (!cancelled && !error && data && data.length > 0) {
          const mapped: Article[] = (data as any[]).map(dbArticleToArticle);
          setArticles(mapped);
          setDbLoaded(true);
          return true;
        }
      } catch {}
      return false;
    };
    fetchFromSupabase();
    const iv = setInterval(() => { if (!cancelled) fetchFromSupabase(); }, 30000);
    return () => { cancelled = true; clearInterval(iv); };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleSaveArticle = (articleId: string) => {
    setSavedArticleIds(prev =>
      prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const isArticleSaved = (articleId: string) => savedArticleIds.includes(articleId);

  const addArticle = (newArtData: Omit<Article, 'id' | 'publishedAt' | 'viewsCount' | 'commentsCount' | 'sharesCount'>) => {
    const newArticle: Article = {
      ...newArtData,
      id: `art-${Date.now()}`,
      publishedAt: new Date().toISOString(),
      viewsCount: 120,
      commentsCount: 0,
      sharesCount: 10,
      isDemo: false
    };
    setArticles(prev => [newArticle, ...prev]);
  };

  const updateArticle = (id: string, updatedFields: Partial<Article>) => {
    setArticles(prev =>
      prev.map(a => (a.id === id ? { ...a, ...updatedFields } : a))
    );
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const toggleSpeech = (articleId: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (speechPlayingId === articleId) {
        window.speechSynthesis.cancel();
        setSpeechPlayingId(null);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text.slice(0, 500));
        utterance.rate = 1.0;
        utterance.onend = () => setSpeechPlayingId(null);
        utterance.onerror = () => setSpeechPlayingId(null);
        window.speechSynthesis.speak(utterance);
        setSpeechPlayingId(articleId);
      }
    }
  };

  return (
    <NewsContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        setLanguage,
        articles,
        refreshArticles,
        savedArticleIds,
        toggleSaveArticle,
        isArticleSaved,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        fontSize,
        setFontSize,
        liveUpdates: mockLiveUpdates,
        userProfile: initialProfile,
        addArticle,
        updateArticle,
        deleteArticle,
        speechPlayingId,
        toggleSpeech
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};
