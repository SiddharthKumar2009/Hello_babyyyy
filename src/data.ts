import { Product, Category, Announcement, LiveFeedEntry, ApiSettings, TelegramSettings, WebsiteSettings } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-diamonds', name: 'Diamond Packs', status: 'active' },
  { id: 'cat-memberships', name: 'Memberships', status: 'active' },
  { id: 'cat-bundles', name: 'Special Bundles', status: 'active' }
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-evo',
    name: 'EVO VAULT - one of the EVO Guns',
    originalPrice: 1120,
    discountPrice: 990,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=60', // Dark futuristic tech theme
    badge: 'Extra 10% Off',
    status: 'available',
    categoryId: 'cat-diamonds'
  },
  {
    id: 'prod-booyah',
    name: 'BOOYAH PASS',
    originalPrice: 350,
    discountPrice: 290,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=60', // Futuristic gaming card
    badge: 'Popular',
    status: 'available',
    categoryId: 'cat-memberships'
  },
  {
    id: 'prod-booyah-plus',
    name: 'BOOYAH PASS PLUS',
    originalPrice: 800,
    discountPrice: 699,
    image: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?w=500&auto=format&fit=crop&q=60', // Golden controller design
    badge: 'Best Value',
    status: 'available',
    categoryId: 'cat-memberships'
  },
  {
    id: 'prod-diamonds-100',
    name: '100+25 Diamonds Pack',
    originalPrice: 100,
    discountPrice: 79,
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=500&auto=format&fit=crop&q=60', // Blue diamonds spark
    badge: 'Hot Deal',
    status: 'available',
    categoryId: 'cat-diamonds',
    is_hot_deal: true,
    pin_to_top: true,
    tag_text: 'HOT DEAL',
    glow_animation: true,
    pulse_animation: true,
    priority: 3
  },
  {
    id: 'prod-diamonds-310',
    name: '310+50 Diamonds Pack',
    originalPrice: 300,
    discountPrice: 240,
    image: 'https://images.unsplash.com/photo-1599602431671-550ff8e515fa?w=500&auto=format&fit=crop&q=60', // Sparkling diamonds stash
    badge: 'Best Seller',
    status: 'available',
    categoryId: 'cat-diamonds',
    is_best_seller: true,
    pin_to_top: true,
    tag_text: 'BEST SELLER',
    glow_animation: true,
    pulse_animation: true,
    priority: 4
  },
  {
    id: 'prod-weekly',
    name: 'Weekly Membership',
    originalPrice: 200,
    discountPrice: 159,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&auto=format&fit=crop&q=60', // Card theme
    badge: 'Super Value',
    status: 'available',
    categoryId: 'cat-memberships'
  },
  {
    id: 'prod-monthly',
    name: 'Monthly Membership',
    originalPrice: 1000,
    discountPrice: 799,
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop&q=60', // Premium card theme
    badge: 'Save 20%',
    status: 'available',
    categoryId: 'cat-memberships'
  }
];

export const DEFAULT_ANNOUNCEMENT: Announcement = {
  text: 'Diamond Sale Live • Orders delivered within 7 working days',
  enabled: true
};

export const DEFAULT_LIVE_FEEDS: LiveFeedEntry[] = [
  { id: 'feed-1', uid: '252174XX77', packageName: '100+50 Diamonds Pack', timestamp: 'Just now' },
  { id: 'feed-2', uid: '887412XX99', packageName: 'Weekly Membership', timestamp: '2 mins ago' },
  { id: 'feed-3', uid: '541287XX41', packageName: 'Monthly Membership', timestamp: '5 mins ago' },
  { id: 'feed-4', uid: '124958XX52', packageName: '520+260 Diamonds Pack', timestamp: '8 mins ago' },
  { id: 'feed-5', uid: '908234XX01', packageName: '310+150 Diamonds Pack', timestamp: '12 mins ago' }
];

export const DEFAULT_API_SETTINGS: ApiSettings = {
  apiUrl: 'https://info.killersharmabot.online/player-info?uid={uid}',
  apiKey: 'DEMO_KEY_XYZ_2026',
  apiType: 'mobile',
  fieldNickname: 'nickname',
  fieldUid: 'uid',
  fieldVerified: 'verified',
  enabled: true
};

export const DEFAULT_TELEGRAM_SETTINGS: TelegramSettings = {
  botToken: '8870096902:AAHtgaJms7ffrn6fZRGNhWk0ljGWnI0JerQ',
  chatId: '8514206667',
  enabled: true
};

export const DEFAULT_WEBSITE_SETTINGS: WebsiteSettings = {
  websiteName: 'EPIC GAME SHOP',
  logoUrl: '', // Empty triggers the beautiful styled EPIC text logo by default
  deliveryNotice: 'Guaranteed delivery to your Free Fire ID within 24 hours of successful validation.',
  supportTelegram: '@epicgameshop_support',
  supportEmail: 'support@epicgameshop.io',
  supportWhatsapp: '+91 99999 88888',
  tagline: 'Cheap Diamond Topup',
  trustText1: '⚡ Fast',
  trustText2: '🛡 Secure',
  trustText3: '🎧 Support',
  featuredGameImage: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=600',
  featuredGameBgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', // Dark premium abstract mesh
  featuredGameName: 'FREE FIRE',
  featuredGameRating: '5.0',
  featuredGameSold: '12k+ Sold',
  featuredGameDiscount: '3-10% OFF',
  featuredGameSubtext: 'Instant UID Delivery • safe & authorized top-up',
  browseTitle: 'Packages & Membership',
  colorBrandYellow: '#f59e0b', // Primary Amber color
  colorBrandYellowHover: '#d97706', // Primary Amber hover
  colorHeaderBg: '#ffffff',
  colorHeaderText: '#0f172a',
  colorTaglineText: '#f59e0b',
  colorCardText: '#101827',
  colorWebsiteBg: '#F8FAFC',
  colorAnnouncementBg: '#fef3c7',
  colorAnnouncementText: '#451a03',
  colorProductCardBg: '#ffffff',
  colorLiveFeedBg: '#ffffff',
  colorBuyNowBtn: '#f59e0b',
  colorBuyNowText: '#0f172a',
  colorNavBg: '#ffffff',
  colorNavText: '#94a3b8',
  colorNavActive: '#2563eb',
  showProfileTab: true,

  // Default labels for Taskbar & Pages
  navDashboardLabel: 'Home',
  navProductsLabel: 'Showcase',
  navProfileLabel: 'Profile',

  profileHeading: 'Gaming Dashboard Profile',
  profileBalanceText: 'Anonymous client session • Secure SSL',
  profileNoticeText: 'No Register Policy Notice',
  profileNoticeBody: 'Epic Game Shop never stores permanent records of your transactions, passwords, or order receipts on local app databases. All inputs are shipped directly to Telegram to ensure maximum privacy and state safety.',

  uidPageTitle: 'Verify Player ID',
  uidPageSubtitle: 'Enter your Free Fire UID to verify character nickname before proceeding to payment.',
  uidPlaceholderText: 'Enter Free Fire UID (e.g. 2521746277)',
  uidVerifyBtnLabel: 'Verify Player Nickname',

  paymentNoticeEn: 'Payment accepted via redeem code only. You must enter your Google Play redeem code and submit screenshot proof! It is mandatory to initiate your order.',
  paymentNoticeHi: 'पेमेंट केवल रिडीम कोड से ही स्वीकार की जाएगी। कृपया अपना असली रिडीम कोड और स्क्रीनशॉट प्रूफ यहाँ ज़रूर दर्ज करें, इसी से भुगतान स्वीकार और कन्फर्म किया जाएगा!',
  paymentTitleText: 'Redemption Submission',
  paymentSubtext: 'Please enter your pre-purchased Google Play Redeem Code with equivalent or higher value.',
  paymentPlaceholder: 'ABCD-EFGH-IJKL-MNOP',
  paymentSubmitLabel: 'Submit Order',

  successHeadline: 'Order Completed Successfully! 🎉',
  successSubtext: 'Your Free Fire diamond top-up order has been transferred. Below are your verification credentials:'
};
