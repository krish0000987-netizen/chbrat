import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { NewsProvider } from './context/NewsContext';
import { AuthProvider } from './context/AuthContext';
import { GlobalHeader } from './components/common/GlobalHeader';
import { BreakingTicker } from './components/common/BreakingTicker';
import { GlobalFooter } from './components/common/GlobalFooter';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';

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
import { AuthorsPage } from './pages/AuthorsPage';
import { AuthorDetailPage } from './pages/AuthorDetailPage';
import { PodcastsPage } from './pages/PodcastsPage';
import { StaticPage } from './pages/StaticPage';
import { BhavishyaPage } from './pages/BhavishyaPage';

import { AdminLogin } from './pages/admin/AdminLogin';
import { Dashboard } from './pages/admin/Dashboard';
import { ArticlesList } from './pages/admin/ArticlesList';
import { ArticleEditor } from './pages/admin/ArticleEditor';
import { MediaLibrary } from './pages/admin/MediaLibrary';
import { CategoriesManager } from './pages/admin/CategoriesManager';
import { EpaperManager } from './pages/admin/EpaperManager';
import { AuthorsManager } from './pages/admin/AuthorsManager';
import { BreakingManager } from './pages/admin/BreakingManager';
import { AdminStub } from './pages/admin/Stub';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
};

const PublicLayout: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-[#FEFCF8] dark:bg-slate-950 text-[#121212] dark:text-slate-100 font-sans selection:bg-red-200 pb-16 lg:pb-0">
    <GlobalHeader />
    <BreakingTicker />
    <main className="flex-1"><Outlet /></main>
    <GlobalFooter />
    <MobileBottomNav />
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <NewsProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Admin Login - public */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Area */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout><Outlet /></AdminLayout></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="articles" element={<ArticlesList />} />
              <Route path="articles/new" element={<ArticleEditor />} />
              <Route path="articles/:id/edit" element={<ArticleEditor />} />
              <Route path="categories" element={<CategoriesManager />} />
              <Route path="locations" element={<AdminStub title="Locations" desc="State → District → City → Locality hierarchy. DB table locations ready. CRUD UI next." />} />
              <Route path="authors" element={<AuthorsManager />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="breaking-news" element={<BreakingManager />} />
              <Route path="epaper" element={<EpaperManager />} />
              <Route path="homepage" element={<AdminStub title="Homepage Builder" desc="Drag-and-drop ordering for hero, top stories, category blocks, e-paper. Stores in homepage_sections table." />} />
              <Route path="navigation" element={<AdminStub title="Navigation Manager" desc="Edit main/mega/mobile/footer menus. Table: navigation_items with drag reorder." />} />
              <Route path="advertisements" element={<AdminStub title="Advertisements" desc="Manage ad slots (header, sidebar, article, footer). Table: advertisements + AdvertisementSlot wired to DB." />} />
              <Route path="seo" element={<AdminStub title="SEO & Pages" desc="Global SEO, sitemap, robots, structured data. Per-article SEO already in article editor." />} />
              <Route path="comments" element={<AdminStub title="Comments Moderation" desc="Pending/Approved/Rejected/Spam workflow. Table: comments with RLS." />} />
              <Route path="subscribers" element={<AdminStub title="Subscribers" desc="Newsletter subscribers export + unsubscribe. Table: subscribers." />} />
              <Route path="analytics" element={<AdminStub title="Analytics" desc="Page views, article views, e-paper views, search trends. Table: analytics_events." />} />
              <Route path="activity" element={<AdminStub title="Activity Log" desc="Audit trail for logins, publishes, uploads. Table: audit_logs." />} />
              <Route path="users" element={<AdminStub title="Users & Roles" desc="Super_admin, admin, editor, reporter, viewer with RLS. Table: profiles.role" />} />
              <Route path="settings" element={<AdminStub title="Site Settings" desc="General, branding, social, SEO, footer, contact. Table: site_settings key-value JSON." />} />
            </Route>

            {/* Public Website */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/article/:articleId" element={<ArticlePage />} />
              <Route path="/desh-videsh" element={<CategoryPage defaultCategory="देश-विदेश" />} />
              <Route path="/pradesh" element={<CategoryPage defaultCategory="प्रदेश" />} />
              <Route path="/khel" element={<CategoryPage defaultCategory="खेल" />} />
              <Route path="/dharm" element={<CategoryPage defaultCategory="धर्म" />} />
              <Route path="/manoranjan" element={<CategoryPage defaultCategory="मनोरंजन" />} />
              <Route path="/vichar" element={<CategoryPage defaultCategory="विचार" />} />
              <Route path="/lifestyle-health" element={<CategoryPage defaultCategory="लाइफस्टाइल & हेल्थ" />} />
              <Route path="/tech" element={<CategoryPage defaultCategory="टेक" />} />
              <Route path="/technology" element={<CategoryPage defaultCategory="टेक" />} />
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
            </Route>
          </Routes>
        </BrowserRouter>
      </NewsProvider>
    </AuthProvider>
  );
}
