import { Article, Author, CategoryType, EpaperEdition, FactCheckItem, LiveUpdate, MarketIndex, PhotoGallery, VideoItem, WeatherData, WebStory } from '../types';

export const mockAuthors: Author[] = [
  {
    id: 'auth-1',
    name: 'Vikramaditya Sharma',
    role: 'Chief Political Correspondent',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'Covering Indian parliament, foreign diplomacy, and central government affairs for over 18 years.',
    twitter: '@vsharma_journal',
    email: 'vikram.s@indianrecord.com',
    location: 'New Delhi',
    articleCount: 142
  },
  {
    id: 'auth-2',
    name: 'Ananya Deshmukh',
    role: 'Senior Markets & Economy Editor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    bio: 'Specializes in Reserve Bank policy, macroeconomic indicators, corporate earnings, and stock markets.',
    twitter: '@ananya_markets',
    email: 'ananya.d@indianrecord.com',
    location: 'Mumbai',
    articleCount: 98
  },
  {
    id: 'auth-3',
    name: 'Rohan Mehta',
    role: 'Tech & AI Lead Reporter',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bio: 'Focuses on Indian tech startups, semiconductor policy, generative AI adoption, and cybersecurity.',
    twitter: '@rohantech_in',
    email: 'rohan.m@indianrecord.com',
    location: 'Bengaluru',
    articleCount: 115
  },
  {
    id: 'auth-4',
    name: 'Priya Sundaram',
    role: 'Cricket & Sports Bureau Chief',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    bio: 'Former national level athlete covering Indian cricket team tours, IPL, and Olympic sports.',
    twitter: '@priyasport_in',
    email: 'priya.s@indianrecord.com',
    location: 'Chennai',
    articleCount: 160
  },
  {
    id: 'auth-5',
    name: 'Karan Malhotra',
    role: 'Entertainment & Culture Critic',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    bio: 'Covers Hindi cinema, OTT releases, international film festivals, and pop culture trends.',
    twitter: '@karan_cinema',
    email: 'karan.m@indianrecord.com',
    location: 'Mumbai',
    articleCount: 88
  },
  {
    id: 'auth-6',
    name: 'Sunita Roy',
    role: 'World & Strategic Affairs Editor',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    bio: 'Specialist in Indo-Pacific geopolitics, global trade corridors, and UN summit analysis.',
    twitter: '@sunita_global',
    email: 'sunita.r@indianrecord.com',
    location: 'New Delhi',
    articleCount: 74
  },
  {
    id: 'auth-7',
    name: 'Dr. Harshvardhan Patel',
    role: 'Public Health & Science Analyst',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=300&q=80',
    bio: 'Epidemiologist and science writer focusing on healthcare infrastructure and space research.',
    twitter: '@harsh_science',
    email: 'harsh.p@indianrecord.com',
    location: 'Ahmedabad',
    articleCount: 62
  },
  {
    id: 'auth-8',
    name: 'Meera Iyer',
    role: 'Opinion & Editorial Page Director',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80',
    bio: 'Distinguished columnist writing on constitutional law, civil discourse, and societal evolution.',
    twitter: '@meera_columns',
    email: 'meera.i@indianrecord.com',
    location: 'New Delhi',
    articleCount: 110
  }
];

export const mockMarketIndices: MarketIndex[] = [
  { symbol: 'NIFTY50', name: 'NIFTY 50', value: 24852.40, change: 168.15, percentChange: 0.68, isPositive: true, high: 24890.10, low: 24710.00 },
  { symbol: 'SENSEX', name: 'BSE SENSEX', value: 81420.75, change: 502.30, percentChange: 0.62, isPositive: true, high: 81550.00, low: 80980.50 },
  { symbol: 'BANKNIFTY', name: 'BANK NIFTY', value: 51240.10, change: 230.80, percentChange: 0.45, isPositive: true, high: 51380.00, low: 51010.00 },
  { symbol: 'USDINR', name: 'USD / INR', value: 83.92, change: -0.04, percentChange: -0.05, isPositive: false, high: 83.98, low: 83.88 },
  { symbol: 'GOLD', name: 'GOLD (10g 24k)', value: 72450.00, change: 240.00, percentChange: 0.33, isPositive: true, high: 72600.00, low: 72200.00 }
];

export const mockWeatherData: WeatherData[] = [
  { city: 'New Delhi', temp: 28, condition: 'Partly Cloudy', high: 32, low: 24, humidity: 65, icon: 'cloud-sun' },
  { city: 'Mumbai', temp: 31, condition: 'Humid & Clear', high: 33, low: 27, humidity: 78, icon: 'sun' },
  { city: 'Bengaluru', temp: 24, condition: 'Pleasant Breeze', high: 27, low: 19, humidity: 58, icon: 'wind' },
  { city: 'Ahmedabad', temp: 32, condition: 'Sunny', high: 36, low: 26, humidity: 52, icon: 'sun' },
  { city: 'Kolkata', temp: 29, condition: 'Light Rain', high: 31, low: 25, humidity: 82, icon: 'cloud-rain' },
  { city: 'Chennai', temp: 30, condition: 'Scattered Clouds', high: 34, low: 26, humidity: 74, icon: 'cloud' }
];

export const mockArticles: Article[] = [
  {
    id: 'art-01',
    slug: 'india-announces-major-digital-infrastructure-roadmap-2026',
    title: '[DEMO NEWS] India Unveils ₹2.5 Lakh Crore Digital Highway Roadmap to Power AI Infrastructure',
    hindiTitle: '[डेमो न्यूज़] भारत ने एआई इंफ्रास्ट्रक्चर के लिए ₹2.5 लाख करोड़ डिजिटल रोडमैप की घोषणा की',
    subheadline: 'The comprehensive initiative focuses on next-generation optical fiber, rural gigabit connectivity, and domestic semiconductor manufacturing hubs across five states.',
    category: 'India',
    subcategory: 'National Policy',
    state: 'Delhi',
    city: 'New Delhi',
    author: mockAuthors[0],
    publishedAt: '2026-08-10T08:30:00Z',
    readTimeMinutes: 5,
    heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Engineers working at a high-speed fiber manufacturing facility in Gujarat. (File photo for demonstration)',
    isBreaking: true,
    isLeadHero: true,
    isTrending: true,
    isExclusive: true,
    isDemo: true,
    tags: ['Digital India', 'Semiconductors', 'Infrastructure', 'Policy', 'New Delhi'],
    viewsCount: 45200,
    commentsCount: 84,
    sharesCount: 1250,
    content: [
      'NEW DELHI — In a landmark policy announcement today, the Cabinet Committee on Economic Affairs approved a ₹2.5 lakh crore Digital Highway Framework aimed at establishing ultra-high-speed data corridors across India.',
      'The multi-phase scheme will connect over 250,000 village panchayats with high-capacity quantum-safe optical fiber lines, ensuring that tier-2 and tier-3 cities gain equal access to compute infrastructure for artificial intelligence applications.',
      'Addressing news reporters at Shastri Bhawan, Union Ministers emphasized that domestic semiconductor fab clusters in Gujarat, Maharashtra, and Assam will receive dedicated power and fiber grids under the mission.',
      'Key Highlights of the Roadmap:',
      '• Deployment of 1.2 million kilometers of submarine and terrestrial fiber by late 2027.',
      '• Establishment of 10 national AI compute data parks driven by clean solar energy.',
      '• Subsidized connectivity packages for schools, medical centers, and agrarian research institutes.',
      'Industry leaders have welcomed the announcement, noting that access to low-latency edge computing will accelerate indigenous software innovation in logistics, healthcare diagnostics, and fintech.'
    ],
    pullQuotes: [
      '“This infrastructure framework ensures that India moves from being a major digital consumer to a leading architect of global AI highways.”'
    ],
    infoBox: {
      title: 'Digital Highway Key Takeaways',
      points: [
        'Total Outlay: ₹2,50,000 Crore',
        'Target Villages Connected: 2,50,000 Panchayats',
        'State Hubs: Gujarat, Maharashtra, Assam, Karnataka, Uttar Pradesh'
      ]
    }
  },
  {
    id: 'art-02',
    slug: 'rbi-monetary-policy-benchmark-rates-steady-inflation',
    title: '[DEMO NEWS] RBI Holds Benchmark Repo Rate Steady at 6.5%; Highlights Buoyant Urban Demand',
    subheadline: 'Central bank Governor notes robust domestic macroeconomic fundamentals and stable capital inflows while keeping a watchful eye on monsoon crop yields.',
    category: 'Business',
    subcategory: 'Economy & Banking',
    state: 'Maharashtra',
    city: 'Mumbai',
    author: mockAuthors[1],
    publishedAt: '2026-08-10T07:15:00Z',
    readTimeMinutes: 4,
    heroImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'The Reserve Bank of India headquarters in South Mumbai. (Sample photo)',
    isBreaking: false,
    isLeadHero: false,
    isTrending: true,
    isDemo: true,
    tags: ['RBI', 'Repo Rate', 'Economy', 'Markets', 'Mumbai', 'Monetary Policy'],
    viewsCount: 38900,
    commentsCount: 42,
    sharesCount: 680,
    content: [
      'MUMBAI — The Reserve Bank of India’s Monetary Policy Committee (MPC) unanimously decided to maintain the benchmark repo rate at 6.50% for the eighth consecutive review cycle.',
      'Delivering the policy statement from Mint Road, Governor announced a real GDP growth projection of 7.2% for the current fiscal year, supported by private capital expenditure, resilient manufacturing output, and expanding service exports.',
      'Equity markets reacted positively to the rate pause, with the NIFTY 50 and SENSEX hitting intra-day highs during the afternoon session.',
      'Financial analysts highlighted that liquidity conditions in the banking system remain comfortable, paving the way for sustained credit expansion across retail housing and MSME sectors.'
    ]
  },
  {
    id: 'art-03',
    slug: 'parliament-monsoon-session-renewable-energy-bill-passed',
    title: '[DEMO NEWS] Parliament Passes Clean Energy Grid Transition Bill After Spirited Debate',
    subheadline: 'The legislation sets mandatory clean power procurement ratios for industrial clusters and provides sovereign green guarantees for offshore wind farms.',
    category: 'Politics',
    subcategory: 'Parliament',
    state: 'Delhi',
    city: 'New Delhi',
    author: mockAuthors[0],
    publishedAt: '2026-08-10T06:45:00Z',
    readTimeMinutes: 6,
    heroImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'Sansad Bhavan lit up in New Delhi. (Demonstration sample content)',
    isBreaking: false,
    isLeadHero: false,
    isTrending: false,
    isDemo: true,
    tags: ['Parliament', 'Clean Energy', 'Politics', 'Bills', 'Environment'],
    viewsCount: 29400,
    commentsCount: 56,
    sharesCount: 410,
    content: [
      'NEW DELHI — Both houses of Parliament today approved the Clean Energy Grid Transition Bill following a rigorous seven-hour parliamentary debate in the Lok Sabha.',
      'The landmark reform requires heavy industries, including steel, fertilizer, and cement manufacturers, to source at least 35% of their operational energy from renewable microgrids by 2028.',
      'Treasury benches emphasized that sovereign green bond issuances will fund grid modernization in coastal regions of Tamil Nadu, Gujarat, and Andhra Pradesh.',
      'Opposition members supported the core environmental principles while requesting periodic parliamentary review of utility tariffs to ensure consumer protection.'
    ]
  },
  {
    id: 'art-04',
    slug: 'indian-cricket-team-secures-historic-test-series-victory',
    title: '[DEMO NEWS] India Secures Thrilling Test Victory as Bowling Attack Shines on Day 5',
    subheadline: 'Pace bowler delivers a masterclass five-wicket haul to wrap up the match by 84 runs, sealing a memorable 3-1 series win.',
    category: 'Cricket',
    subcategory: 'Test Cricket',
    state: 'Gujarat',
    city: 'Ahmedabad',
    author: mockAuthors[3],
    publishedAt: '2026-08-10T09:10:00Z',
    readTimeMinutes: 4,
    heroImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'Indian cricket team celebrating a crucial wicket on Day 5. (Sample sports photo)',
    isBreaking: true,
    isLeadHero: false,
    isTrending: true,
    isDemo: true,
    tags: ['Cricket', 'Team India', 'Ahmedabad', 'Test Series', 'Sports'],
    viewsCount: 51200,
    commentsCount: 120,
    sharesCount: 2300,
    content: [
      'AHMEDABAD — In a dramatic final day at Narendra Modi Stadium, Team India recorded an 84-run victory against Australia to seal the five-match Test series 3-1.',
      'Chasing a target of 268 on a crumbling day five pitch, the visitors were dismantled for 183 inside two sessions as India’s seamers produced exceptional reverse swing.',
      'The Captain lauded the bowling group for their unrelenting discipline, while the Man of the Match trophy was awarded to the fast bowler who finished with match figures of 9 for 102.',
      'Fans packed the stadium stands in loud celebration as India consolidated its top rank on the World Test Championship standings.'
    ]
  },
  {
    id: 'art-05',
    slug: 'bengaluru-ai-startup-secures-100m-series-b-funding',
    title: '[DEMO NEWS] Bengaluru AI Frontier Startup Raises $100M to Scale Indic Language LLMs',
    subheadline: 'The funding round will accelerate research in foundational natural language processing across 22 scheduled Indian languages.',
    category: 'Technology',
    subcategory: 'Startups',
    state: 'Karnataka',
    city: 'Bengaluru',
    author: mockAuthors[2],
    publishedAt: '2026-08-10T05:20:00Z',
    readTimeMinutes: 5,
    heroImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'Software researchers working at an AI laboratory in Bengaluru. (Sample tech photo)',
    isBreaking: false,
    isLeadHero: false,
    isTrending: true,
    isDemo: true,
    tags: ['AI', 'Bengaluru', 'Startups', 'Venture Capital', 'Technology'],
    viewsCount: 31000,
    commentsCount: 38,
    sharesCount: 890,
    content: [
      'BENGALURU — Indic AI Systems, a deep-tech startup based in Koramangala, today announced a $100 million Series B investment led by global venture funds.',
      'The company builds proprietary foundational language models optimized for low-resource Indian dialects, enabling real-time voice synthesis and text translation for government and healthcare services.',
      'With over 15 million daily active API calls, the platform powers automated customer response systems across agricultural cooperatives, regional banking apps, and telemedicine portals.'
    ]
  },
  {
    id: 'art-06',
    slug: 'bollywood-epic-cinematic-trailer-breaks-online-records',
    title: '[DEMO NEWS] Epic Historical Film Trailer Surpasses 50 Million Views in 24 Hours',
    subheadline: 'Directed by visionary filmmakers, the magnum opus features cutting-edge visual effects and an ensemble star cast.',
    category: 'Entertainment',
    subcategory: 'Bollywood',
    state: 'Maharashtra',
    city: 'Mumbai',
    author: mockAuthors[4],
    publishedAt: '2026-08-09T18:40:00Z',
    readTimeMinutes: 3,
    heroImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'Cinema hall premiere crowd in Mumbai. (Demo photo)',
    isBreaking: false,
    isLeadHero: false,
    isTrending: true,
    isDemo: true,
    tags: ['Bollywood', 'Cinema', 'Mumbai', 'Entertainment', 'Trailers'],
    viewsCount: 64200,
    commentsCount: 190,
    sharesCount: 3100,
    content: [
      'MUMBAI — The theatrical trailer for the upcoming historical drama "Samrat - The Empire Beyond" has broken digital viewing benchmarks across YouTube and social platforms.',
      'Featuring grand set pieces shot across Rajasthan and Uttar Pradesh, the film showcases traditional warrior craftsmanship integrated with IMAX 3D cinematography.',
      'Trade analysts predict a record-breaking opening weekend box office turnout across both single screens and multiplex chains nationwide.'
    ]
  },
  {
    id: 'art-07',
    slug: 'global-supply-chains-semiconductor-corridor-summit',
    title: '[DEMO NEWS] Indo-Pacific Trade Summit Focuses on Resilient Clean Tech Supply Networks',
    subheadline: 'Delegates from 14 nations sign pacts to standardize battery component recycling and critical mineral corridors.',
    category: 'World',
    subcategory: 'Diplomacy',
    author: mockAuthors[5],
    publishedAt: '2026-08-09T16:10:00Z',
    readTimeMinutes: 5,
    heroImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'Global diplomats attending plenary talks at the international trade summit.',
    isBreaking: false,
    isDemo: true,
    tags: ['World', 'Diplomacy', 'Trade', 'Global Economy'],
    viewsCount: 21500,
    commentsCount: 24,
    sharesCount: 320,
    content: [
      'GENEVA / NEW DELHI — International trade ministers gathered today to establish standardized rules for green technology supply chains, focusing on rare earth processing and solar ingot manufacturing.',
      'The treaty aims to establish diversified trade routes that reduce single-region dependencies and promote collaborative R&D funding for zero-emission cargo fleets.'
    ]
  },
  {
    id: 'art-08',
    slug: 'opinion-constitutional-balance-federalism-governance-2026',
    title: '[DEMO OPINION] Why Strengthening Cooperative Federalism is Key to India’s $10 Trillion Vision',
    subheadline: 'Empowering state financial autonomy while aligning national strategic goals creates a multiplier effect for job creation.',
    category: 'Opinion',
    subcategory: 'Columns',
    author: mockAuthors[7],
    publishedAt: '2026-08-09T14:00:00Z',
    readTimeMinutes: 7,
    heroImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'The Supreme Court of India in New Delhi.',
    isBreaking: false,
    isDemo: true,
    tags: ['Opinion', 'Federalism', 'Governance', 'Economy'],
    viewsCount: 18400,
    commentsCount: 65,
    sharesCount: 520,
    content: [
      'In our journey toward becoming a $10 trillion economy, governance cannot remain top-down. The true engine of Indian growth resides in the laboratories of state capitals, municipal corporations, and rural district councils.',
      'When state governments compete on investor-friendly regulatory frameworks while collaborating on interstate transit and power sharing, national productivity leaps ahead naturally.',
      'It is time to re-examine fiscal transfer formulas to reward innovation, environmental conservation, and local governance accountability.'
    ]
  },
  {
    id: 'art-09',
    slug: 'explained-how-quantum-safe-encryption-protects-banking',
    title: '[DEMO EXPLAINER] Explained: How India’s Financial Sector is Preparing for Quantum Cyber Threats',
    subheadline: 'A comprehensive breakdown of post-quantum cryptography standards and why banks are upgrading security protocols.',
    category: 'Explainers',
    subcategory: 'Tech Explained',
    author: mockAuthors[2],
    publishedAt: '2026-08-09T11:30:00Z',
    readTimeMinutes: 6,
    heroImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'Digital security matrix representation.',
    isBreaking: false,
    isDemo: true,
    tags: ['Explainers', 'Cybersecurity', 'Banking', 'Quantum'],
    viewsCount: 27800,
    commentsCount: 31,
    sharesCount: 740,
    content: [
      'WHAT IS QUANTUM ENCRYPTION?',
      'As quantum supercomputers become reality, traditional RSA encryption methods used by internet banking portals could theoretically be decrypted in minutes.',
      'To prevent future data vulnerability, financial institutions are switching to lattice-based cryptography algorithm suites certified by national safety standards.',
      'KEY TAKEAWAYS FOR CONSUMERS:',
      '1. Your existing UPI pins and two-factor banking keys remain safe; server-side upgrades happen automatically.',
      '2. Core banking engines are testing zero-knowledge proofs to safeguard transaction privacy.',
      '3. Regulatory deadlines mandate full post-quantum readiness across all commercial banks by December 2027.'
    ]
  },
  {
    id: 'art-10',
    slug: 'fact-check-viral-social-media-claim-monsoons',
    title: '[DEMO FACT CHECK] Fact Check: Viral Video Claiming Artificial Rain Cloud Seeding Over Rajasthan is False',
    subheadline: 'The viral clip actually shows an old meteorological cloud monitoring experiment conducted in 2021.',
    category: 'Fact Check',
    subcategory: 'Verification',
    author: mockAuthors[6],
    publishedAt: '2026-08-09T09:00:00Z',
    readTimeMinutes: 3,
    heroImage: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'Cumulus storm clouds over desert landscape.',
    isBreaking: false,
    isDemo: true,
    tags: ['Fact Check', 'Rajasthan', 'Social Media', 'Verification'],
    viewsCount: 42100,
    commentsCount: 88,
    sharesCount: 1900,
    content: [
      'CLAIM: A viral post shared over 50,000 times on messaging apps claims that emergency cloud-seeding planes created unexpected rainfall over Western Rajasthan last week.',
      'RATING: FALSE.',
      'EXPLANATION: Reverse image search and metadata analysis reveal that the video clip was recorded during a research trial in August 2021. The Indian Meteorological Department (IMD) confirmed that recent rain activity in Jaisalmer was due to standard monsoon trough movements.'
    ]
  },
  {
    id: 'art-11',
    slug: 'gujarat-ahmedabad-bullet-train-depot-nearing-completion',
    title: '[DEMO NEWS] Gujarat State Feature: High-Speed Rail Corridor Depot Nears Completion in Ahmedabad',
    subheadline: 'State-of-the-art maintenance facilities equipped with automated inspection bots undergo trial testing.',
    category: 'State News',
    subcategory: 'Gujarat',
    state: 'Gujarat',
    city: 'Ahmedabad',
    author: mockAuthors[0],
    publishedAt: '2026-08-09T07:45:00Z',
    readTimeMinutes: 4,
    heroImage: 'https://images.unsplash.com/photo-1515165562839-538804960ab4?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'High speed rail terminal platform under development in Sabarmati.',
    isBreaking: false,
    isDemo: true,
    tags: ['Gujarat', 'Ahmedabad', 'State News', 'Railways', 'Infrastructure'],
    viewsCount: 33400,
    commentsCount: 45,
    sharesCount: 810,
    content: [
      'AHMEDABAD — Construction at Sabarmati high-speed rail depot in Ahmedabad has reached 92% completion, marking a significant milestone for the Mumbai-Ahmedabad bullet train corridor.',
      'The multi-level facility spans 80 hectares and features automated wheel-profiling machines, washing lines, and solar rooftops capable of generating 4.5 MW of clean power.'
    ]
  },
  {
    id: 'art-12',
    slug: 'maharashtra-mumbai-coastal-road-phase-two-opens',
    title: '[DEMO NEWS] Mumbai Coastal Road Phase II Opened for Light Traffic; Commute Times Cut by 60%',
    subheadline: 'The undersea twin tunnel and elevated promenade transform mobility between South Mumbai and western suburbs.',
    category: 'City News',
    subcategory: 'Maharashtra',
    state: 'Maharashtra',
    city: 'Mumbai',
    author: mockAuthors[1],
    publishedAt: '2026-08-08T15:20:00Z',
    readTimeMinutes: 4,
    heroImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'Panoramic view of Mumbai coastline and skyline.',
    isBreaking: false,
    isDemo: true,
    tags: ['Mumbai', 'Maharashtra', 'City News', 'Infrastructure', 'Transit'],
    viewsCount: 48900,
    commentsCount: 78,
    sharesCount: 1450,
    content: [
      'MUMBAI — Commuters across Mumbai experienced dramatic reductions in travel time today as traffic was opened on the northern stretch of the Mumbai Coastal Road Project.',
      'Travel from Marine Drive to Bandra now takes under 15 minutes during peak morning hours compared to the previous 45-minute journey.'
    ]
  },
  {
    id: 'art-13',
    slug: 'ev-charging-highway-corridor-delhi-jaipur',
    title: '[DEMO NEWS] Automobile: Green Highway Corridor Between Delhi and Jaipur Gets Ultra-Fast Charging Stations',
    subheadline: 'Heavy commercial vehicles can now recharge in under 20 minutes along national highway stops.',
    category: 'Automobile',
    subcategory: 'EVs',
    state: 'Rajasthan',
    city: 'Jaipur',
    author: mockAuthors[2],
    publishedAt: '2026-08-08T12:00:00Z',
    readTimeMinutes: 4,
    heroImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'Electric vehicle charging station along highway.',
    isBreaking: false,
    isDemo: true,
    tags: ['Automobile', 'EV', 'Delhi', 'Jaipur', 'Rajasthan'],
    viewsCount: 22100,
    commentsCount: 29,
    sharesCount: 490,
    content: [
      'JAIPUR — Electric vehicle owners traveling between New Delhi, Gurgaon, and Jaipur can now access 350kW ultra-fast charging stations stationed every 30 kilometers along NH-48.'
    ]
  },
  {
    id: 'art-14',
    slug: 'wellness-ayurveda-modern-clinical-trials-result',
    title: '[DEMO NEWS] Health & Wellness: Standardized Botanical Extract Shows Promise in Diabetes Management',
    subheadline: 'Multi-center clinical trial published in medical journal validates traditional wellness formulations.',
    category: 'Health',
    subcategory: 'Wellness',
    author: mockAuthors[6],
    publishedAt: '2026-08-08T10:10:00Z',
    readTimeMinutes: 5,
    heroImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'Herbal ingredients and laboratory glassware.',
    isBreaking: false,
    isDemo: true,
    tags: ['Health', 'Ayurveda', 'Medical Science', 'Wellness'],
    viewsCount: 26300,
    commentsCount: 33,
    sharesCount: 610,
    content: [
      'A two-year clinical trial conducted across five medical colleges has demonstrated that standardized herbal extracts significantly improve glycemic regulation when combined with balanced diet regimens.'
    ]
  },
  {
    id: 'art-15',
    slug: 'travel-spiti-valley-eco-tourism-initiative',
    title: '[DEMO NEWS] Travel: High-Altitude Eco-Tourism Framework Preserves Spiti Valley Himalayan Beauty',
    subheadline: 'Homestays adopt zero-plastic waste standards and solar water heating for eco-conscious travelers.',
    category: 'Travel',
    subcategory: 'Himalayas',
    state: 'Himachal Pradesh',
    city: 'Shimla',
    author: mockAuthors[4],
    publishedAt: '2026-08-07T16:30:00Z',
    readTimeMinutes: 4,
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'Majestic mountain landscape in Himalayan valley.',
    isBreaking: false,
    isDemo: true,
    tags: ['Travel', 'Spiti', 'Himachal', 'Eco Tourism', 'Himalayas'],
    viewsCount: 35100,
    commentsCount: 41,
    sharesCount: 1120,
    content: [
      'SPITI VALLEY — Local village councils in Himachal Pradesh have implemented a pioneer sustainable tourism pledge, ensuring zero single-use plastics and promoting authentic Himalayan cultural homestays.'
    ]
  }
];

export const mockLiveUpdates: LiveUpdate[] = [
  {
    id: 'live-1',
    timestamp: '10:45 AM',
    timeAgo: '5 min ago',
    title: '[DEMO LIVE] Cabinet Briefing Concludes in New Delhi',
    body: 'The Union Cabinet spokesman announced key decisions on agricultural infrastructure credit guarantees and state disaster mitigation fund allocations.',
    isKeyDevelopment: true,
    authorName: 'Vikramaditya Sharma',
    category: 'India',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'live-2',
    timestamp: '10:32 AM',
    timeAgo: '18 min ago',
    title: '[DEMO LIVE] Stock Markets Hit Intra-Day Peak',
    body: 'NIFTY 50 gains over 170 points driven by rally in banking majors and IT export heavyweights following favorable global rate sentiment.',
    isKeyDevelopment: false,
    authorName: 'Ananya Deshmukh',
    category: 'Markets'
  },
  {
    id: 'live-3',
    timestamp: '10:15 AM',
    timeAgo: '35 min ago',
    title: '[DEMO LIVE] Test Match Resumes in Ahmedabad',
    body: 'Morning session underway on Day 5 pitch; spinners getting substantial turn as fielders gather close around the bat.',
    isKeyDevelopment: true,
    authorName: 'Priya Sundaram',
    category: 'Cricket',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'live-4',
    timestamp: '09:50 AM',
    timeAgo: '1 hour ago',
    title: '[DEMO LIVE] ISRO Releases New Earth Observation Data Pack',
    body: 'Satellite telemetry highlights improved soil moisture index across central and western agricultural belts.',
    isKeyDevelopment: false,
    authorName: 'Dr. Harshvardhan Patel',
    category: 'Science'
  }
];

export const mockVideoItems: VideoItem[] = [
  {
    id: 'vid-1',
    title: '[DEMO VIDEO] Inside India’s Next-Gen Semiconductor Fabrication Plant in Dholera',
    description: 'An exclusive walkthrough of the cleanroom infrastructure and silicon wafer fabrication machinery.',
    duration: '08:42',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    category: 'Technology',
    publishedAt: '2 hours ago',
    authorName: 'Rohan Mehta',
    views: '124K'
  },
  {
    id: 'vid-2',
    title: '[DEMO VIDEO] Market Analysis: Why Banking Stocks are Leading the Financial Rally',
    description: 'Ananya Deshmukh breaks down Q1 corporate earnings, net interest margins, and NPAs.',
    duration: '05:15',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    category: 'Business',
    publishedAt: '4 hours ago',
    authorName: 'Ananya Deshmukh',
    views: '88K'
  },
  {
    id: 'vid-3',
    title: '[DEMO VIDEO] Match Highlights: Day 5 Thriller at Narendra Modi Stadium',
    description: 'Watch all the key wickets and top batting shots from India’s series-deciding test victory.',
    duration: '11:20',
    thumbnail: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    category: 'Cricket',
    publishedAt: '1 hour ago',
    authorName: 'Priya Sundaram',
    views: '310K'
  }
];

export const mockPhotoGalleries: PhotoGallery[] = [
  {
    id: 'photo-1',
    title: '[DEMO GALLERY] In Pictures: Independence Celebrations & Illuminated Landmarks Across India',
    description: 'A stunning visual tour of historical monuments, civic buildings, and coastal promenades lit up in tri-color lights.',
    category: 'India',
    coverImage: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1000&q=80',
    publishedAt: 'Yesterday',
    photographer: 'Editorial Photo Desk',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1200&q=80',
        caption: 'The iconic Red Fort adorned in ceremonial decorations in New Delhi.',
        credit: 'The Indian Record / Photo Desk'
      },
      {
        url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
        caption: 'Gateway of India reflecting brilliant sea lights along Mumbai harbor.',
        credit: 'The Indian Record / Photo Desk'
      },
      {
        url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
        caption: 'Victoria Memorial illuminated under clear evening skies in Kolkata.',
        credit: 'The Indian Record / Photo Desk'
      }
    ]
  }
];

export const mockWebStories: WebStory[] = [
  {
    id: 'ws-1',
    title: 'Top 5 Vande Bharat Scenic Routes You Must Travel in 2026',
    category: 'Travel',
    coverImage: 'https://images.unsplash.com/photo-1515165562839-538804960ab4?auto=format&fit=crop&w=800&q=80',
    publishedAt: '3 hours ago',
    slides: [
      {
        image: 'https://images.unsplash.com/photo-1515165562839-538804960ab4?auto=format&fit=crop&w=800&q=80',
        headline: 'Mumbai to Goa Vande Bharat Express',
        caption: 'Passes through 92 tunnels and magnificent Konkan viaducts with breathtaking mountain views.'
      },
      {
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        headline: 'Kalka to Shimla Heritage Rail',
        caption: 'Experience snow-capped Himalayan peaks and pine forests from glass-domed vistadome coaches.'
      }
    ]
  },
  {
    id: 'ws-2',
    title: '5 Indian AI Startups Making Waves Globally',
    category: 'Technology',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    publishedAt: '5 hours ago',
    slides: [
      {
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        headline: 'Indic Language Generative Voice Models',
        caption: 'Transforming rural healthcare access with instant dialect translation.'
      }
    ]
  }
];

export const mockFactChecks: FactCheckItem[] = [
  {
    id: 'fc-1',
    claim: 'Viral post claims that 2,000 rupee notes are being re-issued with microchips.',
    claimedBy: 'Social Media Forward',
    verdict: 'FALSE',
    explanation: 'The Reserve Bank of India has issued no such notification. Reverse image search shows digital mockups created by satirical accounts.',
    publishedAt: '2026-08-09',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80',
    articleId: 'art-10'
  }
];

export const mockEpapers: EpaperEdition[] = [
  {
    id: 'ep-delhi-2026-08-10',
    date: '10 August 2026',
    editionName: 'New Delhi National Edition',
    totalPages: 16,
    pages: [
      { pageNumber: 1, title: 'Front Page - Digital Highway Roadmap', thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80' },
      { pageNumber: 2, title: 'National Affairs & Parliament', thumbnail: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80' },
      { pageNumber: 3, title: 'Economy & RBI Monetary Review', thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80' },
      { pageNumber: 4, title: 'Opinion & Editorial Columns', thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80' },
      { pageNumber: 5, title: 'Sports & Ahmedabad Test Match', thumbnail: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=80' }
    ]
  }
];
