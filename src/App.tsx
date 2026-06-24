import { useState, useEffect } from 'react';
import { Menu, ShieldCheck, HelpCircle, PhoneCall, Send, ArrowUpRight, CheckCircle2, ChevronRight, Sparkles, X } from 'lucide-react';
import { Product, Category, Announcement, LiveFeedEntry, ApiSettings, TelegramSettings, WebsiteSettings, OrderState } from './types';
import { 
  DEFAULT_CATEGORIES, DEFAULT_PRODUCTS, DEFAULT_ANNOUNCEMENT, 
  DEFAULT_LIVE_FEEDS, DEFAULT_API_SETTINGS, DEFAULT_TELEGRAM_SETTINGS, DEFAULT_WEBSITE_SETTINGS 
} from './data';

// Import all modular sub-pages
import DashboardPage from './components/Pages/Dashboard';
import ProductsShowcasePage from './components/Pages/ProductsShowcase';
import UidVerificationPage from './components/Pages/UidVerification';
import PaymentPage from './components/Pages/PaymentPage';
import SuccessPage from './components/Pages/SuccessPage';
import AdminPanelPage from './components/Pages/AdminPanel';

// Import components
import AnnouncementBar from './components/AnnouncementBar';
import Sidebar from './components/Sidebar';
import GarenaFooter from './components/GarenaFooter';

export default function App() {
  
  // Define States (backed by LocalStorage for deep persistent testing)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('egs_products');
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('egs_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [announcement, setAnnouncement] = useState<Announcement>(() => {
    const saved = localStorage.getItem('egs_announcement');
    return saved ? JSON.parse(saved) : DEFAULT_ANNOUNCEMENT;
  });

  const [feeds, setFeeds] = useState<LiveFeedEntry[]>(() => {
    const saved = localStorage.getItem('egs_feeds');
    return saved ? JSON.parse(saved) : DEFAULT_LIVE_FEEDS;
  });

  const [apiSettings, setApiSettings] = useState<ApiSettings>(() => {
    const saved = localStorage.getItem('egs_api_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.apiUrl || parsed.apiUrl.includes('mocky.io')) {
          parsed.apiUrl = 'https://info.killersharmabot.online/player-info?uid={uid}';
          parsed.fieldNickname = 'nickname';
        }
        return parsed;
      } catch (e) {
        return DEFAULT_API_SETTINGS;
      }
    }
    return DEFAULT_API_SETTINGS;
  });

  const [telegramSettings, setTelegramSettings] = useState<TelegramSettings>(() => {
    const saved = localStorage.getItem('egs_telegram_settings');
    const envBotToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const envChatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Automatically override local storage value if environment variable is set
        if (envBotToken) parsed.botToken = envBotToken;
        if (envChatId) parsed.chatId = envChatId;

        // Automatically upgrade if they had the old preview default token
        if (!parsed.botToken || parsed.botToken === '6854124967:AAF_SampleBotTokenForPreviewOnlyAndLocalOverrides') {
          parsed.botToken = envBotToken || '8870096902:AAHtgaJms7ffrn6fZRGNhWk0ljGWnI0JerQ';
        }
        return parsed;
      } catch (e) {
        return {
          ...DEFAULT_TELEGRAM_SETTINGS,
          ...(envBotToken ? { botToken: envBotToken } : {}),
          ...(envChatId ? { chatId: envChatId } : {})
        };
      }
    }
    return DEFAULT_TELEGRAM_SETTINGS;
  });

  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(() => {
    const saved = localStorage.getItem('egs_website_settings');
    return saved ? JSON.parse(saved) : DEFAULT_WEBSITE_SETTINGS;
  });

  const [isConfigLoaded, setIsConfigLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  // logo image path
  const [logoUrl, setLogoUrl] = useState(() => websiteSettings.logoUrl);

  // Sync state to local storage when changed
  useEffect(() => {
    localStorage.setItem('egs_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('egs_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('egs_announcement', JSON.stringify(announcement));
  }, [announcement]);

  useEffect(() => {
    localStorage.setItem('egs_feeds', JSON.stringify(feeds));
  }, [feeds]);

  useEffect(() => {
    localStorage.setItem('egs_api_settings', JSON.stringify(apiSettings));
  }, [apiSettings]);

  useEffect(() => {
    localStorage.setItem('egs_telegram_settings', JSON.stringify(telegramSettings));
  }, [telegramSettings]);

  useEffect(() => {
    localStorage.setItem('egs_website_settings', JSON.stringify(websiteSettings));
    setLogoUrl(websiteSettings.logoUrl);
  }, [websiteSettings]);

  // 1. Initial Load Config from Express server database
  useEffect(() => {
    const loadConfigFromServer = async () => {
      try {
        const response = await fetch('/api/config');
        const data = await response.json();
        if (response.ok && data.success && data.config) {
          const remote = data.config;
          console.log('[App Boot] Loading remote server configurations:', remote);
          if (remote.products) setProducts(remote.products);
          if (remote.categories) setCategories(remote.categories);
          if (remote.announcement) setAnnouncement(remote.announcement);
          if (remote.feeds) setFeeds(remote.feeds);
          if (remote.apiSettings) setApiSettings(remote.apiSettings);
          if (remote.telegramSettings) setTelegramSettings(remote.telegramSettings);
          if (remote.websiteSettings) setWebsiteSettings(remote.websiteSettings);
        }
      } catch (err) {
        console.error('[App Boot] Error fetching global database config:', err);
      } finally {
        setIsConfigLoaded(true);
      }
    };
    loadConfigFromServer();
  }, []);

  // 2. Debounced save back to server db.json (ensuring all client modifications sync to all other users)
  useEffect(() => {
    if (!isConfigLoaded) return;

    // Only automatically save if we are on the admin page and logged in as admin!
    const isAdmin = currentPage === 'admin' && localStorage.getItem('egs_admin_logged_in') === 'true';
    if (!isAdmin) return;

    const handler = setTimeout(async () => {
      try {
        const currentPayload = {
          products,
          categories,
          announcement,
          feeds,
          apiSettings,
          telegramSettings,
          websiteSettings
        };
        await fetch('/api/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config: currentPayload })
        });
        console.log('[Sync] Config updated successfully on the server');
      } catch (err) {
        console.error('[Sync] Error syncing config with persistent host server:', err);
      }
    }, 1200);

    return () => clearTimeout(handler);
  }, [isConfigLoaded, currentPage, products, categories, announcement, feeds, apiSettings, telegramSettings, websiteSettings]);

  // Routing State based on URL Hash for SPA flexibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Multi-step Checkout details state
  const [orderState, setOrderState] = useState<OrderState>({
    selectedProduct: null,
    uid: '',
    playerName: '',
    verified: false,
    redeemCode: '',
    screenshot: null
  });

  // Temporary file holder so uploader works correctly
  const [orderScreenshotFile, setOrderScreenshotFile] = useState<File | null>(null);
  const [submittingToTelegram, setSubmittingToTelegram] = useState(false);

  // Modal display states for secondary guides/help pages (e.g. static Payment Page help)
  const [isPayInfoModalOpen, setIsPayInfoModalOpen] = useState(false);

  // Monitor location hashes for navigation fallback redirection
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/admin') {
        setCurrentPage('admin');
      } else if (hash === '#/items') {
        setCurrentPage('dashboard');
      } else if (hash === '#/') {
        setCurrentPage('dashboard');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Trigger initial on render
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: string) => {
    if (page === 'pay_info') {
      setIsPayInfoModalOpen(true);
      return;
    }
    let targetPage = page;
    const isItemsClick = targetPage === 'items';
    if (targetPage === 'items') {
      targetPage = 'dashboard';
    }
    setCurrentPage(targetPage);
    
    // If user clicked the items tab, scroll down to products grid
    if (isItemsClick) {
      setTimeout(() => {
        const element = document.getElementById('browse-products-section') || document.getElementById('products-grid');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }

    // Sync browser hash silently for bookmarks/reloads to work without disruption
    if (targetPage === 'dashboard') window.location.hash = '#/';
    else if (targetPage === 'admin') window.location.hash = '#/admin';
  };

  // Triggered when a product is selected
  const handleSelectProduct = (product: Product) => {
    setOrderState({
      selectedProduct: product,
      uid: '',
      playerName: '',
      verified: false,
      redeemCode: '',
      screenshot: null
    });
    setOrderScreenshotFile(null);
    setCurrentPage('verify'); // Transition to Step 1: UID Verification Screen
  };

  // Step 1 COMPLETE Character verified
  const handleUIDVerified = (verifiedUid: string, characterNickname: string) => {
    setOrderState((prev) => ({
      ...prev,
      uid: verifiedUid,
      playerName: characterNickname,
      verified: true
    }));
    setCurrentPage('payment'); // Transition to Step 2: Payment Page
  };

  // Step 2 COMPLETE Order submitted - dispatches to Telegram Delivery channel
  const handleOrderSubmitted = async (code: string, imageBase64: string | null, uploadFile?: File | null) => {
    setSubmittingToTelegram(true);

    const targetProduct = orderState.selectedProduct;
    if (!targetProduct) return;

    // Build Formatted Telegram Message exactly as specified in the PRD instruction
    const dateFormatted = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
    const messageText = `NEW ORDER\n\nPlayer Name:\n${orderState.playerName}\n\nUID:\n${orderState.uid}\n\nPackage:\n${targetProduct.name}\n\nPrice:\n₹${targetProduct.discountPrice}\n\nRedeem Code:\n${code}\n\nDate:\n${dateFormatted}`;

    let successfullyDispatched = false;

    if (telegramSettings.enabled && telegramSettings.botToken && telegramSettings.chatId) {
      try {
        const response = await fetch('/api/telegram/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            botToken: telegramSettings.botToken,
            chatId: telegramSettings.chatId,
            text: messageText,
            photoBase64: imageBase64 // Native base64 screenshot image if attached, or null
          })
        });

        const resData = await response.json();
        if (response.ok && resData.ok) {
          successfullyDispatched = true;
          console.log('Telegram order dispatch successful server-side!');
        } else {
          console.error('Telegram dispatch failed:', resData.description);
        }
      } catch (err) {
        console.error('Telegram Delivery network connection exception error:', err);
      }
    } else {
      console.warn('Telegram API Settings are currently disabled or incomplete in Admin Panel.');
    }

    // Capture the submission in state and direct to Step 3: Success Screen
    setOrderState((prev) => ({
      ...prev,
      redeemCode: code,
      screenshot: imageBase64
    }));

    setSubmittingToTelegram(false);
    setCurrentPage('success'); // Transition to Step 3: Success feedback screen page
  };

  const handlePublishConfig = async () => {
    try {
      const payload = {
        products,
        categories,
        announcement,
        feeds,
        apiSettings,
        telegramSettings,
        websiteSettings
      };
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: payload })
      });

      if (response.ok) {
        // As soon as config is saved, notify the Telegram Bot if configured
        if (telegramSettings.enabled && telegramSettings.botToken && telegramSettings.chatId) {
          const dateStr = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
          const adminNotifyText = `⚙️ ADMIN SETTINGS UPDATE\n--------------------------\nThe admin configuration was successfully updated on the server.\n\n🌐 Website Name:\n${websiteSettings.websiteName || 'Epic Game Shop'}\n\n📁 Page Customizations Applied:\n- Taskbar Labs: Dashboard ("${websiteSettings.navDashboardLabel || 'Dashboard'}"), Items ("${websiteSettings.navProductsLabel || 'Items'}"), Profile ("${websiteSettings.navProfileLabel || 'Profile'}")\n- Profile Heading: "${websiteSettings.profileHeading || 'Gaming Dashboard Profile'}"\n- UID Screen Heading: "${websiteSettings.uidPageTitle || 'Order Verification'}"\n- UID Input Placeholder: "${websiteSettings.uidPlaceholderText || 'Please enter Player ID'}"\n- Payment Action Label: "${websiteSettings.paymentSubmitLabel || 'Submit Order'}"\n- Success Headline: "${websiteSettings.successHeadline || 'Order Submitted Successfully'}"\n\n🔔 Date & Time:\n${dateStr}`;
          
          try {
            await fetch('/api/telegram/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                botToken: telegramSettings.botToken,
                chatId: telegramSettings.chatId,
                text: adminNotifyText,
                photoBase64: null
              })
            });
            console.log('Successfully broadcast configuration change alert to Admin Telegram Bot channel.');
          } catch (tErr) {
            console.error('Failed to dispatch config change notification to Telegram:', tErr);
          }
        }
      }

      return response.ok;
    } catch (err) {
      console.error('[Publish] Error publishing live config:', err);
      return false;
    }
  };

  return (
    <div style={{ backgroundColor: websiteSettings.colorWebsiteBg || '#F8FAFC' }} className="min-h-screen flex flex-col transition-all duration-300">
      
      {/* 1. Header component */}
      <header 
        id="website-header" 
        style={{ backgroundColor: websiteSettings.colorHeaderBg || '#ffffff' }}
        className="border-b border-slate-150 rounded-b-3xl shadow-3xs sticky top-0 z-30 px-4 py-3 flex items-center justify-between select-none max-w-2xl mx-auto w-full"
      >
        <div className="w-full flex items-center justify-between">
          
          {/* Left: Brand logo */}
          <button 
            onClick={() => handleNavigate('dashboard')}
            className="flex items-center gap-2.5 hover:opacity-95 transition-all select-none focus:outline-hidden"
            id="brand-logo-btn"
          >
            <div 
              style={{ backgroundColor: websiteSettings.colorBrandYellow || '#f59e0b' }}
              className="h-10 w-10 text-slate-900 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-3xs relative select-none"
            >
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="Epic Shop logo" 
                  className="object-contain h-full w-full rounded-xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="font-black text-[13px] tracking-tight">EPIC</span>
              )}
            </div>
            <div className="text-left select-none">
              <h1 
                style={{ color: websiteSettings.colorHeaderText || '#0f172a' }}
                className="font-black text-[15px] tracking-tight leading-none"
              >
                {websiteSettings.websiteName || 'EPIC GAME SHOP'}
              </h1>
              <p 
                style={{ color: websiteSettings.colorTaglineText || '#f59e0b' }}
                className="text-[10px] font-extrabold tracking-tight mt-0.5 font-sans uppercase"
              >
                {websiteSettings.tagline || 'Cheap Diamond Topup'}
              </p>
            </div>
          </button>

          {/* Right: Hamburger button (Trigger sidebar drawer) */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all shadow-3xs"
              id="hamburger-sidebar-trigger"
              aria-label="Open navigation sidebar"
            >
              <Menu className="h-5.5 w-5.5 stroke-[2.2]" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. Top Announcement Bar - Below website-header */}
      <AnnouncementBar announcement={announcement} websiteSettings={websiteSettings} />

      {/* Right sliding Drawer menu (Sidebar) */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        currentPage={currentPage}
        onNavigate={handleNavigate}
        websiteSettings={websiteSettings}
      />

      {/* Main page router viewport content */}
      <main style={{ backgroundColor: websiteSettings.colorWebsiteBg || '#F8FAFC' }} className="flex-1 pb-24 md:pb-12 text-slate-900 transition-all duration-300">
        
        {currentPage === 'dashboard' && (
          <DashboardPage
            products={products}
            categories={categories}
            feeds={feeds}
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
            websiteSettings={websiteSettings}
          />
        )}

        {currentPage === 'items' && (
          <ProductsShowcasePage
            products={products}
            categories={categories}
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
            websiteSettings={websiteSettings}
          />
        )}

        {currentPage === 'verify' && orderState.selectedProduct && (
          <UidVerificationPage
            selectedProduct={orderState.selectedProduct}
            apiSettings={apiSettings}
            websiteSettings={websiteSettings}
            onVerified={handleUIDVerified}
            onBack={() => handleNavigate('dashboard')}
          />
        )}

        {currentPage === 'payment' && orderState.selectedProduct && (
          <PaymentPage
            selectedProduct={orderState.selectedProduct}
            uid={orderState.uid}
            playerName={orderState.playerName}
            websiteSettings={websiteSettings}
            onBack={() => setCurrentPage('verify')}
            onSubmit={handleOrderSubmitted}
            loading={submittingToTelegram}
          />
        )}

        {currentPage === 'success' && (
          <SuccessPage
            selectedProduct={orderState.selectedProduct}
            uid={orderState.uid}
            playerName={orderState.playerName}
            redeemCode={orderState.redeemCode}
            supportTelegram={websiteSettings.supportTelegram}
            websiteSettings={websiteSettings}
            onGoHome={() => handleNavigate('dashboard')}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPanelPage
            products={products}
            categories={categories}
            announcement={announcement}
            logoUrl={logoUrl}
            feeds={feeds}
            apiSettings={apiSettings}
            telegramSettings={telegramSettings}
            websiteSettings={websiteSettings}
            onUpdateProducts={setProducts}
            onUpdateCategories={setCategories}
            onUpdateAnnouncement={setAnnouncement}
            onUpdateLogo={setLogoUrl}
            onUpdateFeeds={setFeeds}
            onUpdateApi={setApiSettings}
            onUpdateTelegram={setTelegramSettings}
            onUpdateWebsite={setWebsiteSettings}
            onPublishConfig={handlePublishConfig}
          />
        )}

      </main>

      {/* Authentic Garena Free Fire Footer for maximum credibility and brand fidelity */}
      {currentPage !== 'admin' && (
        <GarenaFooter websiteSettings={websiteSettings} />
      )}

      {/* MODAL WINDOW: Payment Guide Modal (Triggered by "Payment Page" in sidebar) */}
      {isPayInfoModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 animate-scale-up border border-slate-100">
            <button 
              onClick={() => setIsPayInfoModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
              id="close-guide-modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                <HelpCircle className="h-5.5 w-5.5 stroke-[2.5px]" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">How Google Play Redeem Codes Work</h4>
                <p className="text-[10px] text-slate-400 font-mono">Store Purchase Guide</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-600 leading-normal">
              <p>We use official Google Play redeem codes to process high-speed manual diamond collections directly to your game accounts. Please review the simple steps below:</p>
              <div className="space-y-3 font-medium">
                <div className="flex gap-2.5 items-start">
                  <span className="bg-blue-50 text-blue-600 h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                  <p>Purchase a Google Play Redeem gift code from digital merchants like <span className="font-bold text-slate-800">PhonePe, Amazon Pay, Paytm</span>, or retail outlets.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="bg-blue-50 text-blue-600 h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                  <p>Browse products in our shop, click <span className="font-bold text-slate-800">Buy Now</span>, and enter your precise character UID code to verify your nickname.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="bg-blue-50 text-blue-600 h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                  <p>Paste your gift code, upload an optional upload coupon screenshot, and hit submit. The details are dispatched instantly securely for automated delivery!</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Instant automated dispatch system is active
              </span>
            </div>

            <button
              onClick={() => {
                setIsPayInfoModalOpen(false);
                handleNavigate('items');
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl text-xs uppercase tracking-wider transition-all"
            >
              Start shopping products
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
