import React, { createContext, useContext, useEffect, useState } from 'react';
import { mockArticles, mockLiveUpdates } from '../data/mockNewsData';
import { Article, CategoryType, LanguageCode, LiveUpdate, UserProfile } from '../types';

interface NewsContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  articles: Article[];
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
  name: 'Rajesh Sharma',
  email: 'rajesh.s@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  subscriptionPlan: 'Premium',
  savedArticleIds: ['art-01', 'art-02'],
  readingHistoryIds: ['art-01', 'art-04', 'art-05'],
  followedTopics: ['India', 'Politics', 'Business', 'Cricket'],
  followedAuthors: ['auth-1', 'auth-2']
};

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const local = localStorage.getItem('ir_theme');
    return (local === 'dark' || local === 'light') ? local : 'light';
  });

  const [language, setLanguage] = useState<LanguageCode>(() => {
    return (localStorage.getItem('ir_lang') as LanguageCode) || 'en';
  });

  const [articles, setArticles] = useState<Article[]>(() => {
    const localArticles = localStorage.getItem('ir_articles');
    if (localArticles) {
      try {
        return JSON.parse(localArticles);
      } catch (e) {
        return mockArticles;
      }
    }
    return mockArticles;
  });

  const [savedArticleIds, setSavedArticleIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('ir_saved');
    return saved ? JSON.parse(saved) : ['art-01', 'art-02'];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [speechPlayingId, setSpeechPlayingId] = useState<string | null>(null);

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
  }, [language]);

  useEffect(() => {
    localStorage.setItem('ir_saved', JSON.stringify(savedArticleIds));
  }, [savedArticleIds]);

  useEffect(() => {
    localStorage.setItem('ir_articles', JSON.stringify(articles));
  }, [articles]);

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
      isDemo: true
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
