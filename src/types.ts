export type CategoryType = 
  | 'India'
  | 'Politics'
  | 'Business'
  | 'Markets'
  | 'World'
  | 'Technology'
  | 'Startups'
  | 'Sports'
  | 'Cricket'
  | 'Entertainment'
  | 'Bollywood'
  | 'Lifestyle'
  | 'Health'
  | 'Education'
  | 'Science'
  | 'Automobile'
  | 'Travel'
  | 'Opinion'
  | 'Explainers'
  | 'Fact Check'
  | 'State News'
  | 'City News'
  | 'Videos'
  | 'Photos'
  | 'Web Stories'
  | 'Podcasts'
  | 'E-Paper';

export type LanguageCode = 'hi' | 'en' | 'bho' | 'ur' | 'bn';

export interface Author {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  twitter?: string;
  email?: string;
  location?: string;
  articleCount?: number;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  hindiTitle?: string;
  subheadline: string;
  content: string[];
  category: CategoryType;
  subcategory?: string;
  state?: string;
  city?: string;
  author: Author;
  publishedAt: string;
  readTimeMinutes: number;
  heroImage: string;
  imageCaption: string;
  isBreaking?: boolean;
  isLeadHero?: boolean;
  isTrending?: boolean;
  isExclusive?: boolean;
  isDemo?: boolean;
  tags: string[];
  viewsCount: number;
  commentsCount: number;
  sharesCount: number;
  relatedArticleIds?: string[];
  pullQuotes?: string[];
  infoBox?: {
    title: string;
    points: string[];
  };
}

export interface LiveUpdate {
  id: string;
  timestamp: string;
  timeAgo: string;
  title: string;
  body: string;
  isKeyDevelopment?: boolean;
  authorName: string;
  category: CategoryType;
  image?: string;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  percentChange: number;
  isPositive: boolean;
  high: number;
  low: number;
}

export interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  high: number;
  low: number;
  humidity: number;
  icon: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  category: CategoryType;
  publishedAt: string;
  authorName: string;
  views: string;
}

export interface PhotoGallery {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  coverImage: string;
  images: {
    url: string;
    caption: string;
    credit: string;
  }[];
  publishedAt: string;
  photographer: string;
}

export interface WebStory {
  id: string;
  title: string;
  category: CategoryType;
  coverImage: string;
  slides: {
    image: string;
    headline: string;
    caption: string;
  }[];
  publishedAt: string;
}

export interface FactCheckItem {
  id: string;
  claim: string;
  claimedBy: string;
  verdict: 'FALSE' | 'TRUE' | 'MISLEADING' | 'PARTIALLY TRUE';
  explanation: string;
  publishedAt: string;
  image: string;
  articleId: string;
}

export interface EpaperEdition {
  id: string;
  date: string;
  editionName: string;
  totalPages: number;
  pages: {
    pageNumber: number;
    title: string;
    thumbnail: string;
  }[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  subscriptionPlan: 'Free' | 'Premium' | 'Annual';
  savedArticleIds: string[];
  readingHistoryIds: string[];
  followedTopics: CategoryType[];
  followedAuthors: string[];
}
