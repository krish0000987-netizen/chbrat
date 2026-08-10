import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { NewsProvider } from './context/NewsContext';
import { GlobalHeader } from './components/common/GlobalHeader';
import { BreakingTicker } from './components/common/BreakingTicker';
import { GlobalFooter } from './components/common/GlobalFooter';
import { MobileBottomNav } from './components/common/MobileBottomNav';

import { HomePage } from './pages/HomePage';
import { ArticlePage } from './pages/ArticlePage';
import { CategoryPage } from './pages/CategoryPage';
import { StatePage } from './pages/StatePage';
import { CityPage } from './pages/CityPage';
import { LivePage } from './pages/LivePage';
import { VideosPage } from './pages/VideosPage';
import { PhotosPage } from './pages/PhotosPage';
import { WebStoriesPage } from './pages/WebStoriesPage';
import { EpaperPage } from './pages/EpaperPage';
import { SubscribePage } from './pages/SubscribePage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';
import { AuthorsPage } from './pages/AuthorsPage';
import { AuthorDetailPage } from './pages/AuthorDetailPage';
import { PodcastsPage } from './pages/PodcastsPage';
import { StaticPage } from './pages/StaticPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

export default function App() {
  return (
    <NewsProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#FBFBF9] dark:bg-slate-950 text-[#121212] dark:text-slate-100 font-sans selection:bg-red-200 dark:selection:bg-red-900 selection:text-red-950 pb-16 lg:pb-0">
          
          {/* Top Sticky Header */}
          <GlobalHeader />

          {/* Real-time Breaking News Ticker */}
          <BreakingTicker />

          {/* Main Dynamic View Content */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/article/:articleId" element={<ArticlePage />} />
              
              {/* Core News Desk Section Routes */}
              <Route path="/india" element={<CategoryPage defaultCategory="India" />} />
              <Route path="/politics" element={<CategoryPage defaultCategory="Politics" />} />
              <Route path="/business" element={<CategoryPage defaultCategory="Business" />} />
              <Route path="/markets" element={<CategoryPage defaultCategory="Business" />} />
              <Route path="/world" element={<CategoryPage defaultCategory="World" />} />
              <Route path="/technology" element={<CategoryPage defaultCategory="Technology" />} />
              <Route path="/tech" element={<CategoryPage defaultCategory="Technology" />} />
              <Route path="/cricket" element={<CategoryPage defaultCategory="Cricket" />} />
              <Route path="/sports" element={<CategoryPage defaultCategory="Cricket" />} />
              <Route path="/entertainment" element={<CategoryPage defaultCategory="Entertainment" />} />
              <Route path="/bollywood" element={<CategoryPage defaultCategory="Entertainment" />} />
              <Route path="/lifestyle" element={<CategoryPage defaultCategory="Lifestyle" />} />
              <Route path="/opinion" element={<CategoryPage defaultCategory="Opinion" />} />
              <Route path="/explained" element={<CategoryPage defaultCategory="Explainers" />} />
              <Route path="/fact-check" element={<CategoryPage defaultCategory="Fact Check" />} />
              <Route path="/startups" element={<CategoryPage defaultCategory="Technology" />} />
              <Route path="/automobile" element={<CategoryPage defaultCategory="Automobile" />} />
              <Route path="/travel" element={<CategoryPage defaultCategory="Travel" />} />
              <Route path="/health" element={<CategoryPage defaultCategory="Health" />} />
              <Route path="/elections" element={<CategoryPage defaultCategory="Politics" />} />

              {/* Parametric Category & State Routes */}
              <Route path="/category/:categorySlug" element={<CategoryPage />} />
              <Route path="/c/:categorySlug" element={<CategoryPage />} />
              <Route path="/search" element={<CategoryPage />} />
              <Route path="/latest" element={<CategoryPage />} />
              <Route path="/state/:stateId" element={<StatePage />} />
              <Route path="/city/:stateId/:cityName" element={<CityPage />} />
              
              {/* Media & Interactive Features */}
              <Route path="/live" element={<LivePage />} />
              <Route path="/videos" element={<VideosPage />} />
              <Route path="/photos" element={<PhotosPage />} />
              <Route path="/web-stories" element={<WebStoriesPage />} />
              <Route path="/epaper" element={<EpaperPage />} />
              <Route path="/subscribe" element={<SubscribePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/authors" element={<AuthorsPage />} />
              <Route path="/author/:authorId" element={<AuthorDetailPage />} />
              <Route path="/podcasts" element={<PodcastsPage />} />
              
              {/* Static Pages */}
              <Route path="/page/:pageSlug" element={<StaticPage />} />
              <Route path="/about" element={<StaticPage />} />
              <Route path="/editorial-policy" element={<StaticPage />} />
              <Route path="/contact" element={<StaticPage />} />
              <Route path="/privacy" element={<StaticPage />} />
              <Route path="/terms" element={<StaticPage />} />
              
              {/* Generic Fallback to Category or Home */}
              <Route path="/:categorySlug" element={<CategoryPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>

          {/* Global Newspaper Footer */}
          <GlobalFooter />

          {/* Mobile Bottom Quick Navigation */}
          <MobileBottomNav />

        </div>
      </BrowserRouter>
    </NewsProvider>
  );
}
