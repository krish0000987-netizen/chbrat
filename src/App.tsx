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
import { BhavishyaPage } from './pages/BhavishyaPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
};

export default function App() {
  return (
    <NewsProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#FEFCF8] dark:bg-slate-950 text-[#121212] dark:text-slate-100 font-sans selection:bg-red-200 pb-16 lg:pb-0">
          <GlobalHeader />
          <BreakingTicker />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/article/:articleId" element={<ArticlePage />} />
              
              {/* Hindi Category Routes */}
              <Route path="/desh-videsh" element={<CategoryPage defaultCategory="देश-विदेश" />} />
              <Route path="/pradesh" element={<CategoryPage defaultCategory="प्रदेश" />} />
              <Route path="/khel" element={<CategoryPage defaultCategory="खेल" />} />
              <Route path="/dharm" element={<CategoryPage defaultCategory="धर्म" />} />
              <Route path="/manoranjan" element={<CategoryPage defaultCategory="मनोरंजन" />} />
              <Route path="/vichar" element={<CategoryPage defaultCategory="विचार" />} />
              <Route path="/lifestyle-health" element={<CategoryPage defaultCategory="लाइफस्टाइल & हेल्थ" />} />
              <Route path="/tech" element={<CategoryPage defaultCategory="टेक" />} />
              <Route path="/technology" element={<CategoryPage defaultCategory="टेक" />} />

              {/* Legacy English routes -> Hindi handling */}
              <Route path="/india" element={<CategoryPage defaultCategory="देश-विदेश" />} />
              <Route path="/world" element={<CategoryPage defaultCategory="देश-विदेश" />} />
              <Route path="/politics" element={<CategoryPage defaultCategory="विचार" />} />
              <Route path="/business" element={<CategoryPage defaultCategory="देश-विदेश" />} />
              <Route path="/cricket" element={<CategoryPage defaultCategory="खेल" />} />
              <Route path="/sports" element={<CategoryPage defaultCategory="खेल" />} />
              <Route path="/entertainment" element={<CategoryPage defaultCategory="मनोरंजन" />} />
              <Route path="/bollywood" element={<CategoryPage defaultCategory="मनोरंजन" />} />
              <Route path="/lifestyle" element={<CategoryPage defaultCategory="लाइफस्टाइल & हेल्थ" />} />
              <Route path="/opinion" element={<CategoryPage defaultCategory="विचार" />} />
              <Route path="/health" element={<CategoryPage defaultCategory="लाइफस्टाइल & हेल्थ" />} />
              <Route path="/automobile" element={<CategoryPage defaultCategory="टेक" />} />
              <Route path="/travel" element={<CategoryPage defaultCategory="प्रदेश" />} />

              {/* Bhavishya Jigyasa */}
              <Route path="/bhavishya/:tab" element={<BhavishyaPage />} />
              <Route path="/rashifal" element={<BhavishyaPage />} />
              <Route path="/panchang" element={<BhavishyaPage />} />

              <Route path="/category/:categorySlug" element={<CategoryPage />} />
              <Route path="/c/:categorySlug" element={<CategoryPage />} />
              <Route path="/search" element={<CategoryPage />} />
              <Route path="/latest" element={<CategoryPage />} />
              <Route path="/state/:stateId" element={<StatePage />} />
              <Route path="/city/:stateId/:cityName" element={<CityPage />} />
              
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
              
              <Route path="/page/:pageSlug" element={<StaticPage />} />
              <Route path="/about" element={<StaticPage />} />
              <Route path="/editorial-policy" element={<StaticPage />} />
              <Route path="/contact" element={<StaticPage />} />
              <Route path="/privacy" element={<StaticPage />} />
              <Route path="/terms" element={<StaticPage />} />
              <Route path="/advertise" element={<StaticPage />} />
              
              <Route path="/:categorySlug" element={<CategoryPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <GlobalFooter />
          <MobileBottomNav />
        </div>
      </BrowserRouter>
    </NewsProvider>
  );
}
