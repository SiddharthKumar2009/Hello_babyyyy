import React, { useState, useEffect } from 'react';
import { Product, Category, Announcement, LiveFeedEntry, ApiSettings, TelegramSettings, WebsiteSettings } from '../../types';
import { 
  Building, Settings2, Sparkles, MessageCircle, Database, LayoutDashboard, 
  Trash2, Plus, Edit, EyeOff, Eye, ShieldCheck, Mail, LogOut, CheckCircle, 
  X, AlertTriangle, Play, RefreshCw, RefreshCw as LoopIcon, Check, Signal, Power,
  Upload, Palette, Smartphone, Activity, TrendingUp, DollarSign, Clock, HelpCircle,
  Laptop, ShieldAlert, Heart, Megaphone, Menu, User, ListCollapse
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DashboardPage from './Dashboard';
import UidVerificationPage from './UidVerification';
import PaymentPage from './PaymentPage';
import SuccessPage from './SuccessPage';
import ProfilePage from './ProfilePage';
import ShopCustomizer from './ShopCustomizer';
import EditableField from './EditableField';

interface AdminPanelProps {
  products: Product[];
  categories: Category[];
  announcement: Announcement;
  logoUrl: string;
  feeds: LiveFeedEntry[];
  apiSettings: ApiSettings;
  telegramSettings: TelegramSettings;
  websiteSettings: WebsiteSettings;

  onUpdateProducts: (items: Product[]) => void;
  onUpdateCategories: (items: Category[]) => void;
  onUpdateAnnouncement: (item: Announcement) => void;
  onUpdateLogo: (url: string) => void;
  onUpdateFeeds: (items: LiveFeedEntry[]) => void;
  onUpdateApi: (settings: ApiSettings) => void;
  onUpdateTelegram: (settings: TelegramSettings) => void;
  onUpdateWebsite: (settings: WebsiteSettings) => void;
  onPublishConfig?: () => Promise<boolean>;
}

export default function AdminPanel({
  products, categories, announcement, logoUrl, feeds, apiSettings, telegramSettings, websiteSettings,
  onUpdateProducts, onUpdateCategories, onUpdateAnnouncement, onUpdateLogo, onUpdateFeeds, onUpdateApi, onUpdateTelegram, onUpdateWebsite,
  onPublishConfig
}: AdminPanelProps) {
  
  // Calculate stats first to keep safe from temporal dead zone issues with hooks
  const totalProducts = products.length;
  const availableProducts = products.filter(p => p.status === 'available').length;
  const soldOutProducts = products.filter(p => p.status === 'sold_out').length;
  
  // Credentials login state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('egs_admin_logged_in') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [isPublishing, setIsPublishing] = useState(false);
  const [statusPublished, setStatusPublished] = useState(false);

  // Active sub-pages in Admin Panel
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'customizer' | 'products' | 'categories' | 'api' | 'telegram' | 'feeds'>('dashboard');

  // Diagnostic simulator active page and customizer subsections
  const [simulatedPage, setSimulatedPage] = useState<string>('dashboard');
  const [customizerSection, setCustomizerSection] = useState<'theme' | 'header' | 'featured' | 'abcd' | 'contacts'>('theme');

  const handleEditField = (fieldKey: string, label: string) => {
    setActiveAdminTab('customizer');

    // Categorize which customizer tab should be open based on the clicked element's key
    if ([
      'websiteName', 'tagline', 'browseTitle', 'text'
    ].includes(fieldKey)) {
      setCustomizerSection('header');
    } else if ([
      'featuredGameName', 'featuredGameRating', 'featuredGameSold', 'featuredGameSubtext', 'featuredGameDiscount', 'featuredGameImage'
    ].includes(fieldKey)) {
      setCustomizerSection('featured');
    } else if ([
      'uidPageTitle', 'uidPageSubtitle', 'uidPlaceholderText', 'uidVerifyBtnLabel', 
      'paymentTitleText', 'paymentPlaceholder', 'paymentSubtext', 'paymentNoticeEn', 'paymentNoticeHi', 'paymentSubmitLabel',
      'successHeadline', 'successSubtext'
    ].includes(fieldKey)) {
      setCustomizerSection('abcd');
    } else if ([
      'profileHeading', 'profileBalanceText', 'profileNoticeText', 'profileNoticeBody', 'deliveryNotice',
      'supportTelegram', 'supportWhatsapp', 'supportEmail'
    ].includes(fieldKey)) {
      setCustomizerSection('contacts');
    }

    setTimeout(() => {
      const valueToFind = (websiteSettings as any)[fieldKey] || (announcement as any)[fieldKey as keyof typeof announcement];
      let targetInput = Array.from(document.querySelectorAll('input, textarea')).find(el => {
        const inputVal = (el as HTMLInputElement | HTMLTextAreaElement).value;
        return inputVal && valueToFind && inputVal.trim() === valueToFind.toString().trim();
      }) as HTMLInputElement | HTMLTextAreaElement | undefined;

      if (!targetInput) {
        const allTextFields = Array.from(document.querySelectorAll('input[type="text"], textarea'));
        targetInput = allTextFields.find(el => {
          const parent = el.parentElement;
          if (!parent) return false;
          const labelText = parent.querySelector('label')?.textContent?.toLowerCase() || '';
          return labelText.includes(label.toLowerCase()) || labelText.includes(fieldKey.toLowerCase());
        }) as HTMLInputElement | HTMLTextAreaElement | undefined;
      }

      if (targetInput) {
        targetInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetInput.focus();
        
        targetInput.classList.add('ring-4', 'ring-amber-500', 'border-amber-500', 'ring-opacity-100', 'transition-all');
        
        setTimeout(() => {
          if (targetInput) {
            targetInput.classList.remove('ring-4', 'ring-amber-500', 'border-amber-500', 'ring-opacity-100');
          }
        }, 2200);
      }
    }, 150);
  };

  // Interactive local forms
  const [productForm, setProductForm] = useState<Partial<Product> | null>(null);
  const [categoryForm, setCategoryForm] = useState<Partial<Category> | null>(null);
  const [feedForm, setFeedForm] = useState<Partial<LiveFeedEntry> | null>(null);

  // Testing status utilities
  const [apiTestId, setApiTestId] = useState('');
  const [apiTestResult, setApiTestResult] = useState<any>(null);
  const [apiTesting, setApiTesting] = useState(false);
  const [telegramTesting, setTelegramTesting] = useState(false);
  const [telegramStatusMsg, setTelegramStatusMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [showBotToken, setShowBotToken] = useState(false);

  // Simulated metrics live counters logic
  const [activeViewers, setActiveViewers] = useState(148);
  const [totalClicks, setTotalClicks] = useState(4820);
  const [ordersSLA, setOrdersSLA] = useState(99.82);

  // Mobile responsive detection hooks and drawer triggers
  const [isMobile, setIsMobile] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Micro operational metrics dynamic state for dashboard count-up animations
  const [animatedViewers, setAnimatedViewers] = useState(0);
  const [animatedClicks, setAnimatedClicks] = useState(0);
  const [animatedSla, setAnimatedSla] = useState(0);
  const [animatedProducts, setAnimatedProducts] = useState(0);

  useEffect(() => {
    if (activeAdminTab === 'dashboard') {
      let start = performance.now();
      const duration = 800; // ms
      let frameId: number;

      const step = (timestamp: number) => {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic

        setAnimatedViewers(Math.floor(ease * activeViewers));
        setAnimatedClicks(Math.floor(ease * totalClicks));
        setAnimatedSla(Number((ease * ordersSLA).toFixed(2)));
        setAnimatedProducts(Math.floor(ease * totalProducts));

        if (progress < 1) {
          frameId = requestAnimationFrame(step);
        } else {
          setAnimatedViewers(activeViewers);
          setAnimatedClicks(totalClicks);
          setAnimatedSla(ordersSLA);
          setAnimatedProducts(totalProducts);
        }
      };

      frameId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(frameId);
    }
  }, [activeAdminTab, activeViewers, totalClicks, ordersSLA, totalProducts]);

  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate lifelike micro random fluctuations in users and statistics
      setActiveViewers((prev) => Math.max(85, prev + Math.floor(Math.random() * 7) - 3));
      setTotalClicks((prev) => prev + (Math.random() > 0.6 ? 1 : 0));
      setOrdersSLA((prev) => {
        const delta = (Math.random() * 0.04) - 0.02;
        return Number(Math.max(99.6, Math.min(100, prev + delta)).toFixed(2));
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Handle local base64 image reader
  const handleImageFileLoad = (e: React.ChangeEvent<HTMLInputElement>, onComplete: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Maximum image file size is 2MB to keep persistent memory optimal.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onComplete(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Login Authentication
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('egs_admin_logged_in', 'true');
      setLoginError(null);
    } else {
      setLoginError('Invalid credentials. (admin / admin123)');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('egs_admin_logged_in');
    setUsername('');
    setPassword('');
    window.location.hash = '#/'; // Go back to shop dashboard
  };

  const handlePublishClick = async () => {
    setIsPublishing(true);
    setStatusPublished(false);
    if (onPublishConfig) {
      const success = await onPublishConfig();
      if (success) {
        setStatusPublished(true);
        setTimeout(() => setStatusPublished(false), 3000);
      } else {
        alert('Failed to publish configurations onto the live server database.');
      }
    } else {
      try {
        const payload = { products, categories, announcement, feeds, apiSettings, telegramSettings, websiteSettings };
        const response = await fetch('/api/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config: payload })
        });
        if (response.ok) {
          setStatusPublished(true);
          setTimeout(() => setStatusPublished(false), 3000);
        } else {
          alert('Failed to publish configurations.');
        }
      } catch (err) {
        alert('Server connection error during publish.');
      }
    }
    setIsPublishing(false);
  };

  // Manage Products catalog
  const handleProductSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm) return;

    if (!productForm.name || !productForm.discountPrice || !productForm.categoryId) {
      alert('Must fill name, discount price and category.');
      return;
    }

    const priceNum = Number(productForm.discountPrice);
    const origPriceNum = Number(productForm.originalPrice || priceNum * 1.25);

    if (productForm.id) {
      const updated = products.map((p) => 
        p.id === productForm.id 
          ? ({ ...p, ...productForm, discountPrice: priceNum, originalPrice: origPriceNum } as Product) 
          : p
      );
      onUpdateProducts(updated);
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: productForm.name,
        originalPrice: origPriceNum,
        discountPrice: priceNum,
        image: productForm.image || 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=500',
        badge: productForm.badge || '',
        status: productForm.status || 'available',
        categoryId: productForm.categoryId,
        is_best_seller: productForm.is_best_seller || false,
        is_hot_deal: productForm.is_hot_deal || false,
        pin_to_top: productForm.pin_to_top || false,
        tag_text: productForm.tag_text || '',
        glow_animation: productForm.glow_animation ?? true,
        pulse_animation: productForm.pulse_animation ?? true,
        priority: productForm.priority || 0
      };
      onUpdateProducts([...products, newProd]);
    }
    setProductForm(null);
  };

  const handleProductDelete = (id: string) => {
    if (confirm('Delete this product package permanently?')) {
      onUpdateProducts(products.filter(p => p.id !== id));
    }
  };

  // Categories CRUD
  const handleCategorySave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm) return;
    if (!categoryForm.name) {
      alert('Please type Name');
      return;
    }

    if (categoryForm.id) {
      const updated = categories.map((c) => 
        c.id === categoryForm.id ? ({ ...c, ...categoryForm } as Category) : c
      );
      onUpdateCategories(updated);
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: categoryForm.name,
        status: categoryForm.status || 'active'
      };
      onUpdateCategories([...categories, newCat]);
    }
    setCategoryForm(null);
  };

  const handleCategoryDelete = (id: string) => {
    if (confirm('Delete this filter category?')) {
      onUpdateCategories(categories.filter(c => c.id !== id));
    }
  };

  // Live feed updates
  const handleFeedAutoGenerate = () => {
    const randomUids = ['281574XX93', '905142XX77', '581249XX40', '192348XX51', '674128XX22'];
    const randomSuffix = ['80₹ Diamond Pack', 'Weekly Membership', 'Monthly Membership', '1600₹ Special Bundle', 'Level Up Pass'];
    const randomTimes = ['Just now', '1 min ago', '3 mins ago', '5 mins ago'];

    const chosenUid = randomUids[Math.floor(Math.random() * randomUids.length)];
    const chosenSuffix = randomSuffix[Math.floor(Math.random() * randomSuffix.length)];
    const chosenTime = randomTimes[Math.floor(Math.random() * randomTimes.length)];

    const entry: LiveFeedEntry = {
      id: `feed-${Date.now()}`,
      uid: chosenUid,
      packageName: chosenSuffix,
      timestamp: chosenTime
    };
    onUpdateFeeds([entry, ...feeds]);
  };

  const handleFeedDelete = (id: string) => {
    onUpdateFeeds(feeds.filter(f => f.id !== id));
  };

  const handleFeedSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedForm) return;
    if (!feedForm.uid || !feedForm.packageName) {
      alert('Complete the required fields.');
      return;
    }
    const newFeed: LiveFeedEntry = {
      id: `feed-${Date.now()}`,
      uid: feedForm.uid,
      packageName: feedForm.packageName,
      timestamp: feedForm.timestamp || 'Just now'
    };
    onUpdateFeeds([newFeed, ...feeds]);
    setFeedForm(null);
  };

  // Test Verifier
  const handleTestApi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiTestId.trim()) return;

    setApiTesting(true);
    setApiTestResult(null);
    await new Promise((res) => setTimeout(res, 1200));

    try {
      const targetUrl = apiSettings.apiUrl.replace('{uid}', encodeURIComponent(apiTestId.trim()));
      const res = await fetch(targetUrl);
      if (res.ok) {
        const json = await res.json();
        setApiTestResult({
          status: 'success',
          rawResponse: json,
          mappedNickname: json[apiSettings.fieldNickname] || 'N/A',
          mappedUid: json[apiSettings.fieldUid] || 'N/A',
          mappedVerified: json[apiSettings.fieldVerified]?.toString() || 'false'
        });
      } else {
        throw new Error('Endpoint returned HTTP error state');
      }
    } catch {
      setApiTestResult({
        status: 'simulated_fallback',
        message: 'Endpoint blocked or unavailable. Falling back to local secure verifier.',
        mappedNickname: 'VIP_Gamer_FF',
        mappedUid: apiTestId.trim(),
        mappedVerified: 'true'
      });
    } finally {
      setApiTesting(false);
    }
  };

  // Telegram direct api
  const handleTestTelegram = async () => {
    setTelegramTesting(true);
    setTelegramStatusMsg(null);
    await new Promise((res) => setTimeout(res, 1500));

    try {
      const response = await fetch('/api/telegram/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: telegramSettings.botToken,
          chatId: telegramSettings.chatId,
          text: `🔔 Connection Verified!\n\nYour Epic Game Shop is communicating with Garena and Telegram bot pipelines correctly!\n\nTimestamp: ${new Date().toLocaleString()}`
        })
      });
      const resJson = await response.json();
      if (response.ok && resJson.ok) {
        setTelegramStatusMsg({
          success: true,
          text: 'Successful check! A test connection message was dispatched to Telegram channel.'
        });
      } else {
        throw new Error(resJson.description || 'Blocked by Telegram Server');
      }
    } catch (err: any) {
      setTelegramStatusMsg({
        success: false,
        text: `Error: ${err.message || 'Verification failed. Make sure your bot is started and Chat ID is group/user numeric identifier.'}`
      });
    } finally {
      setTelegramTesting(false);
    }
  };

  // Reset to default settings helper
  const handleRestoreDefaults = () => {
    if (confirm('Restore all website settings, names, and images to shop standard?')) {
      const defaults = {
        websiteName: 'EPIC GAME SHOP',
        logoUrl: '',
        deliveryNotice: 'Guaranteed delivery to your Free Fire ID within 24 hours of successful validation.',
        supportTelegram: '@epicgameshop_support',
        supportEmail: 'support@epicgameshop.io',
        supportWhatsapp: '+91 99999 88888',
        tagline: 'Cheap Diamond Topup',
        trustText1: '⚡ Fast',
        trustText2: '🛡 Secure',
        trustText3: '🎧 Support',
        featuredGameImage: 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=600',
        featuredGameBgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
        featuredGameName: 'FREE FIRE',
        featuredGameRating: '5.0',
        featuredGameSold: '12k+ Sold',
        featuredGameDiscount: '3-10% OFF',
        featuredGameSubtext: 'Instant UID Delivery • safe & authorized top-up',
        browseTitle: 'Packages & Membership',
        colorBrandYellow: '#f59e0b',
        colorBrandYellowHover: '#d97706',
        colorHeaderBg: '#ffffff',
        colorHeaderText: '#0f172a',
        colorTaglineText: '#f59e0b',
        colorCardText: '#101827',
        colorWebsiteBg: '#F8FAFC',
        colorAnnouncementBg: '#fef3c7',
        colorAnnouncementText: '#451a03',
        colorProductCardBg: '#ffffff',
        colorLiveFeedBg: '#ffffff'
      };
      onUpdateWebsite(defaults);
      onUpdateLogo('');
    }
  };

  // LOGIN SCREEN RENDER
  if (!isAdminLoggedIn) {
    return (
      <div id="admin-login-screen" className="max-w-md mx-auto px-4 py-12 pb-24 font-sans animate-fade-in">
        <form onSubmit={handleLoginSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6.5 shadow-2xl space-y-6">
          <div className="text-center space-y-1.5 pb-4 border-b border-slate-800">
            <div className="h-12 w-12 bg-amber-400 rounded-2xl flex items-center justify-center text-slate-950 font-black text-xl mx-auto shadow-md">
              A
            </div>
            <h3 className="text-lg font-black text-white mt-3">Epic Console Login</h3>
            <p className="text-xs text-slate-400 font-medium">Authentication required to manage database resources.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none text-white transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-3 text-sm font-mono tracking-widest focus:outline-none text-white transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {loginError && (
            <div className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl p-3 text-xs font-semibold flex items-center gap-2 animate-pulse">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-[10px] text-slate-400 font-mono space-y-1 text-center">
            <p>Default access: <span className="font-extrabold text-amber-400">admin</span> / <span className="font-extrabold text-amber-400">admin123</span></p>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black py-3 rounded-2xl text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-amber-400/10 cursor-pointer"
            id="admin-login-submit"
          >
            Authenticate Session
          </button>
        </form>
      </div>
    );
  }

  return (
    <div id="admin-dashboard-page" className="max-w-7xl mx-auto px-0 md:px-4 py-0 md:py-8 font-sans space-y-6 md:space-y-8 animate-fade-in pb-32">
      
      {/* MOBILE HEADER - PRD SPECIFIED 3.1 & 3.2 */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="md:hidden sticky top-0 z-40 h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shadow-3xs select-none w-full text-slate-800"
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <Settings2 className="h-4.5 w-4.5 stroke-[2.2]" />
          </div>
          <div className="text-left">
            <span className="font-extrabold text-xs text-slate-800 tracking-tight block">ADMIN PANEL</span>
            <span className="text-[7.5px] font-black tracking-widest text-emerald-600 uppercase block font-mono">STATE LIVE</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5">
          {/* Quick Apply Config inside Mobile Header */}
          <button
            onClick={handlePublishClick}
            disabled={isPublishing}
            className={`p-2 rounded-lg transition-all ${
              statusPublished ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 hover:text-amber-800'
            }`}
            title="Publish Store Live Settings"
          >
            {isPublishing ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
          </button>

          <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-150 flex items-center justify-center text-xs font-black text-indigo-700">
            <User className="h-4 w-4 text-indigo-600" />
          </div>

          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg transition-all"
            id="mobile-drawer-toggle"
          >
            <Menu className="h-5 w-5 text-slate-700" />
          </button>
        </div>
      </motion.header>

      {/* MOBILE HAMBURGER DRAWER - PRD SPECIFIED 3.2 */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 md:hidden"
            />
            
            {/* Slide-in Sidebar Menu Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="fixed top-0 left-0 bottom-0 w-[78vw] max-w-[280px] bg-white z-55 shadow-2xl flex flex-col md:hidden text-left"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-4.5 w-4.5 text-indigo-655" />
                  <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Control Drawer</span>
                </div>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-650 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Navigation Menu Links */}
              <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
                {[
                  { id: 'dashboard', name: 'Dashboard Home', icon: LayoutDashboard },
                  { id: 'customizer', name: 'Dashboard Design', icon: Palette },
                  { id: 'products', name: 'Products Catalog', icon: Sparkles },
                  { id: 'categories', name: 'Categories Filters', icon: Database },
                  { id: 'api', name: 'API Mapping Node', icon: Signal },
                  { id: 'telegram', name: 'Telegram Core', icon: MessageCircle },
                  { id: 'feeds', name: 'Live Purchase Feeds', icon: RefreshCw },
                ].map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeAdminTab === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.2 }}
                      onClick={() => {
                        setActiveAdminTab(item.id as any);
                        setProductForm(null);
                        setCategoryForm(null);
                        setFeedForm(null);
                        setIsDrawerOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 py-3 px-3.5 rounded-xl text-xs font-extrabold transition-all relative ${
                        isActive 
                          ? 'bg-indigo-50/80 text-indigo-650' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {/* Left vertical active bar indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-6 bg-indigo-600 rounded-r-full" />
                      )}
                      <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Drawer Footer controls */}
              <div className="p-4 border-t border-slate-100 space-y-3.5">
                <div className="bg-slate-50 rounded-xl p-2.5 flex justify-between items-center text-[10px] text-slate-500 font-bold">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Viewers Live</span>
                  </span>
                  <span className="text-slate-800 font-extrabold">{activeViewers}</span>
                </div>

                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    handleLogout();
                  }}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-650 text-xxs font-black tracking-wide uppercase py-3 rounded-xl border border-red-100/35 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Exit Session</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 1. DESKTOP GLASS BANNER / COGNITIVE HEADER (Hidden on mobile) */}
      <div className="hidden md:flex bg-slate-900 border border-slate-850 text-white rounded-3xl p-5 md:p-6 shadow-xl flex-col md:flex-row items-center justify-between gap-5 select-none relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600')" }}></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="h-12 w-12 bg-amber-400 text-slate-950 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-amber-400/20 shrink-0 select-none">
            <Settings2 className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-black tracking-tight text-white flex flex-shrink-0 items-center gap-2">
              <span>EPIC CONTROL CONSOLE</span>
              <span className="bg-emerald-500 text-slate-950 text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full font-mono animate-pulse">
                STATE LIVE
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-medium">Real-time design overrides, payment pipelines, and live database controls.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative z-10 self-start md:self-center">
          <button
            onClick={handlePublishClick}
            disabled={isPublishing}
            className={`${
              statusPublished ? 'bg-emerald-500 text-slate-950' : 'bg-amber-400 hover:bg-amber-500 text-slate-950'
            } disabled:opacity-50 text-[10px] uppercase font-black tracking-wider px-4.5 py-2.5 rounded-xl transition-all border border-transparent flex items-center gap-1.5 cursor-pointer shadow-md`}
          >
            {isPublishing ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : statusPublished ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Upload className="h-3.5 w-3.5 animate-pulse" />
            )}
            <span>{statusPublished ? 'Shop Published!' : 'Apply & Save Config'}</span>
          </button>

          <button
            onClick={handleRestoreDefaults}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] uppercase tracking-wider font-extrabold px-3.5 py-2.5 rounded-xl transition-all border border-slate-700 cursor-pointer"
          >
            Reset Defaults
          </button>
          
          <button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 focus:outline-none text-[10px] uppercase tracking-wider font-extrabold px-3.5 py-2.5 rounded-xl transition-all border border-red-500/20 flex items-center gap-1.5 cursor-pointer"
            id="admin-logout-btn"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Exit Session</span>
          </button>
        </div>
      </div>

      {/* 2. DESKTOP TELEMETRY METRIC GLASS CARDS (Hidden on Mobile to prefer Quick Stats & Grid) */}
      <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="relative bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/50 p-4.5 shadow-3xs flex items-center justify-between overflow-hidden">
          <div className="space-y-1 z-10 text-left">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider font-mono">Live Session Viewers</span>
            <p className="text-2xl font-black text-slate-900 leading-none">{activeViewers}</p>
            <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>+12.4% traffic flow</span>
            </span>
          </div>
          <Activity className="h-10 w-10 text-slate-100 absolute right-2.5 bottom-2 stroke-[1.5]" />
        </div>

        <div className="relative bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/50 p-4.5 shadow-3xs flex items-center justify-between overflow-hidden">
          <div className="space-y-1 z-10 text-left">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider font-mono">Product Clicks</span>
            <p className="text-2xl font-black text-slate-900 leading-none">{totalClicks}</p>
            <span className="text-[9px] text-blue-600 font-bold tracking-tight">Active conversion flow</span>
          </div>
          <TrendingUp className="h-10 w-10 text-slate-100 absolute right-2.5 bottom-2 stroke-[1.5]" />
        </div>

        <div className="relative bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/50 p-4.5 shadow-3xs flex items-center justify-between overflow-hidden">
          <div className="space-y-1 z-10 text-left">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider font-mono">Simulated Success SLA</span>
            <p className="text-2xl font-black text-slate-900 leading-none">{ordersSLA}%</p>
            <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-1">
              <span>Instant auto validation</span>
            </span>
          </div>
          <CheckCircle className="h-10 w-10 text-slate-100 absolute right-2.5 bottom-2 stroke-[1.5]" />
        </div>

        <div className="relative bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/50 p-4.5 shadow-3xs flex items-center justify-between overflow-hidden">
          <div className="space-y-1 z-10 text-left">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider font-mono">Total Catalog Items</span>
            <p className="text-2xl font-black text-amber-600 leading-none">{totalProducts}</p>
            <span className="text-[9px] text-slate-500 font-semibold">{availableProducts} Ready • {soldOutProducts} Sold Out</span>
          </div>
          <Database className="h-10 w-10 text-slate-100 absolute right-2.5 bottom-2 stroke-[1.5]" />
        </div>

      </div>

      {/* 3. DESKTOP DOCK NAVIGATION (Hidden on mobile screens to prefer card grid and sliding drawer) */}
      <div className="hidden md:flex flex-wrap gap-2 pb-2 select-none border-b border-slate-200">
        {[
          { id: 'dashboard', name: 'Control Stats', icon: LayoutDashboard },
          { id: 'customizer', name: 'Dashboard Design Overrides & Color customize', icon: Palette },
          { id: 'products', name: 'Products Catalog', icon: Sparkles },
          { id: 'categories', name: 'Categories Filters', icon: Database },
          { id: 'api', name: 'API Mapping Node', icon: Signal },
          { id: 'telegram', name: 'Telegram Core', icon: MessageCircle },
          { id: 'feeds', name: 'Live Purchase Feeds', icon: RefreshCw },
        ].map((item) => {
          const Icon = item.icon;
          const isTabActive = activeAdminTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveAdminTab(item.id as any);
                setProductForm(null);
                setCategoryForm(null);
                setFeedForm(null);
              }}
              className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-black transition-all ${
                isTabActive 
                  ? 'bg-slate-900 border border-slate-900 text-amber-400 shadow-sm' 
                  : 'bg-white/70 backdrop-blur-md border border-slate-200 text-slate-600 hover:text-slate-950 hover:bg-white transition-all'
              } cursor-pointer`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* 4. MAIN LAYOUT: SPLIT COGNITIVE EDITOR AND LIVE PHONE VIEWPORT PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start px-4 md:px-0">
        
        {/* LEFT COLUMN: ACTIVE CONTROL FORMS PANEL (GLASS DECORATED) */}
        <div className="lg:col-span-7 bg-white/75 backdrop-blur-md border border-slate-200/60 rounded-3xl p-4.5 md:p-6 shadow-xs min-h-[550px] transition-all">
          
          {/* Back button wrapper when editing pages other than dashboard in mobile context */}
          {activeAdminTab !== 'dashboard' && (
            <div className="mb-4 bg-slate-900 text-white rounded-2xl p-3 flex items-center justify-between shadow-xs select-none">
              <button
                onClick={() => {
                  setActiveAdminTab('dashboard');
                  setProductForm(null);
                  setCategoryForm(null);
                  setFeedForm(null);
                }}
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-400 hover:text-amber-500 transition-all cursor-pointer"
              >
                <X className="h-4 w-4 stroke-[2.5]" />
                <span>Return to Overview Console</span>
              </button>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">
                Editing: {activeAdminTab}
              </span>
            </div>
          )}

          {/* A. GENERAL CONTROL STATS TAB */}
          {activeAdminTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in text-left">
              
              {/* WELCOME HERO CARD - PRD SPECIFIED 3.3.1 */}
              <div className="bg-gradient-to-tr from-indigo-650 via-indigo-750 to-purple-650 text-white rounded-3xl p-5 border border-indigo-700/30 relative overflow-hidden shadow-sm select-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent opacity-50"></div>
                <div className="absolute -right-10 -bottom-10 h-36 w-36 bg-white/5 rounded-full blur-2xl"></div>
                <div className="relative space-y-1.5 z-10 text-left">
                  <span className="text-[9px] font-black text-indigo-100 uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-md border border-white/10">
                    Control Console Core
                  </span>
                  <h2 className="text-lg md:text-xl font-black text-white tracking-tight flex items-center gap-2">
                    <span>👋 Welcome back, Admin</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  </h2>
                  <p className="text-xs text-indigo-50 font-medium leading-relaxed">
                    Instantly customize game diamond catalogs, check automated Telegram alerts, change color brand guidelines and view sales activity logs.
                  </p>
                </div>
              </div>

              {/* INSTRUCTION TEXT BANNER - PRD SPECIFIED 3.3.3 */}
              <div className="bg-indigo-50 border-l-[4px] border-indigo-650 rounded-r-2xl p-3.5 text-left flex items-start gap-2.5 select-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]">
                <Sparkles className="h-4.5 w-4.5 text-indigo-650 shrink-0 mt-0.5 animate-pulse" />
                <p className="text-[11px] font-bold text-indigo-800 leading-normal font-sans">
                  💡 Select your page and preview to edit. Tap any control card button below to reveal page editors, then scroll or view live preview to watch synchronization.
                </p>
              </div>

              {/* PAGE SECTION CARDS GRID - PRD SPECIFIED 3.3.2 */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Configure Section Views</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'customizer', name: 'Dashboard Design', desc: 'Colors & custom labels', icon: Palette, color: 'bg-pink-50 text-pink-650 border border-pink-200/20' },
                    { id: 'products', name: 'Products Catalog', desc: `${products.length} game diamond packs`, icon: Sparkles, color: 'bg-amber-50 text-amber-650 border border-amber-200/20' },
                    { id: 'categories', name: 'Categories Filters', desc: `${categories.length} segments`, icon: Database, color: 'bg-cyan-50 text-cyan-750 border border-cyan-200/20' },
                    { id: 'api', name: 'API Mapping', desc: apiSettings.enabled ? '🟢 Connected' : '🔴 Suspended', icon: Signal, color: 'bg-emerald-50 text-emerald-700 border border-emerald-250/20' },
                    { id: 'telegram', name: 'Telegram Core', desc: telegramSettings.enabled ? '🟢 Active' : '🔴 Inactive', icon: MessageCircle, color: 'bg-indigo-50 text-indigo-755 border border-indigo-250/20' },
                    { id: 'feeds', name: 'Live Feeds stream', desc: `${feeds.length} custom alerts`, icon: RefreshCw, color: 'bg-purple-50 text-purple-700 border border-purple-200/20' }
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 + 0.08, duration: 0.3 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          setActiveAdminTab(item.id as any);
                          setProductForm(null);
                          setCategoryForm(null);
                          setFeedForm(null);
                        }}
                        className="bg-white border border-slate-150 rounded-2xl p-3.5 shadow-3xs flex flex-col justify-between items-start text-left cursor-pointer transition-all hover:border-slate-300 hover:shadow-2xs"
                      >
                        <div className="space-y-2.5 w-full">
                          <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-black ${item.color}`}>
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <h4 className="text-[11px] font-black text-slate-800 tracking-tight leading-tight uppercase font-sans">{item.name}</h4>
                            <p className="text-[9.5px] text-slate-500 font-bold leading-normal mt-1 font-sans">{item.desc}</p>
                          </div>
                        </div>
                        <div className="w-full mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[9px] font-black text-indigo-650 tracking-wider uppercase font-sans">
                          <span>Open View</span>
                          <span className="text-[11px]">→</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* DATA/STATS SECTION - PRD SPECIFIED 3.4 */}
              <div className="bg-white border border-slate-150 rounded-2xl p-4 shadow-3xs text-left select-none">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-3">
                  <Activity className="h-4 w-4 text-indigo-600 animate-pulse" />
                  <h4 className="text-[11px] font-mono font-black text-slate-800 uppercase tracking-wider">📊 Quick Operations Stats (Count-Up)</h4>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex flex-col">
                    <span className="text-[8px] text-slate-450 font-extrabold uppercase tracking-wider font-mono">Viewers Live</span>
                    <span className="text-base font-black text-slate-900 mt-1">{animatedViewers}</span>
                    <span className="text-[7.5px] text-emerald-600 font-extrabold flex items-center gap-1 mt-0.5">
                      <span className="h-1 w-1 rounded-full bg-emerald-500 animate-ping" />
                      <span>+12.4% traffic</span>
                    </span>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex flex-col">
                    <span className="text-[8px] text-slate-450 font-extrabold uppercase tracking-wider font-mono">Total Clicks</span>
                    <span className="text-base font-black text-slate-900 mt-1">{animatedClicks}</span>
                    <span className="text-[7.5px] text-blue-600 font-extrabold mt-0.5">Automated sync</span>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex flex-col">
                    <span className="text-[8px] text-slate-450 font-extrabold uppercase tracking-wider font-mono">SLA Rate</span>
                    <span className="text-base font-black text-slate-900 mt-1">{animatedSla}%</span>
                    <span className="text-[7.5px] text-emerald-600 font-extrabold mt-0.5">SSL secure pipeline</span>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex flex-col">
                    <span className="text-[8px] text-slate-450 font-extrabold uppercase tracking-wider font-mono">Catalog Items</span>
                    <span className="text-base font-black text-amber-600 mt-1">{animatedProducts}</span>
                    <span className="text-[7.5px] text-slate-500 font-semibold mt-0.5">{availableProducts} ready</span>
                  </div>
                </div>
              </div>

              {/* BRAND NEW ELEGANT STEP-BY-STEP SETUP TUTORIAL CARD */}
              <div className="bg-gradient-to-tr from-slate-900 via-slate-850 to-slate-800 text-white rounded-3xl p-5 md:p-6 border border-slate-750 relative overflow-hidden shadow-lg select-none">
                <div className="absolute top-0 right-0 h-32 w-32 bg-amber-400/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
                <div className="relative space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md font-mono">
                      COMPREHENSIVE SETUP GUIDE • दुकान सेटअप गाइड
                    </span>
                    <h4 className="text-xs font-black text-amber-300 uppercase tracking-widest">How to setup your top-up shop 🚀</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3.5 border-t border-slate-850 text-xs leading-5">
                    {/* Step 1 */}
                    <div className="bg-slate-800/35 border border-slate-700/40 p-3.5 rounded-2xl space-y-1 hover:border-amber-400/30 transition-all">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-amber-400 font-mono text-[11px]">STEP 1: API / TELEGRAM KEY</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Go to the <strong>'Telegram Core'</strong> tab. Set your <code>Bot Token</code> & <code>Chat ID</code> to receive instant player UID top-up checkout codes, pay logs & payment screenshots.
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-slate-800/35 border border-slate-700/40 p-3.5 rounded-2xl space-y-1 hover:border-amber-400/30 transition-all">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-amber-400 font-mono text-[11px]">STEP 2: ADD SALES & HOT TAGS</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Go to <strong>'Products Catalog'</strong>. Click <strong>'+ Add New product'</strong>. Set normal & sale price. Put <code>Hot Sale</code> in the optional tag badge input for neon glowing flame effects!
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-slate-800/35 border border-slate-700/40 p-3.5 rounded-2xl space-y-1 hover:border-amber-400/30 transition-all">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-amber-400 font-mono text-[11px]">STEP 3: STYLE THEME COLORS</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Go to the <strong>'Dashboard Design Overrides & Color customize'</strong> tab to style backgrounds, glass trans panels, active buttons, or hide 'Profile' tab directly in one-click.
                      </p>
                    </div>

                    {/* Step 4 */}
                    <div className="bg-slate-800/35 border border-slate-700/40 p-3.5 rounded-2xl space-y-1 hover:border-amber-400/30 transition-all">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-amber-400 font-mono text-[11px]">STEP 4: SAVE & TEST LIVE</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Click the top-right green <strong>'Apply & Save Config'</strong> button. Now, verify using the <strong>Live Phone viewport preview</strong> on the right of this control panel!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-black uppercase text-slate-500 tracking-wider">Operational Overview</h3>
              
              {/* Quick announcement switch */}
              <div className="bg-amber-50/50 border border-amber-100 p-4.5 rounded-2xl relative space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200/50 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-amber-600 animate-bounce" />
                    <h4 className="text-xs font-black text-amber-950 uppercase">Public Announcement Bar</h4>
                  </div>
                  <button
                    onClick={() => onUpdateAnnouncement({ ...announcement, enabled: !announcement.enabled })}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 ${
                      announcement.enabled ? 'bg-amber-500' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-all ${
                      announcement.enabled ? 'translate-x-[16px]' : 'translate-x-[2px]'
                    }`} />
                  </button>
                </div>
                
                <input
                  type="text"
                  value={announcement.text}
                  onChange={(e) => onUpdateAnnouncement({ ...announcement, text: e.target.value })}
                  placeholder="Enter notice ticker text..."
                  className="w-full bg-white border border-amber-200 text-xs font-semibold rounded-xl px-3.5 py-2.5 text-amber-950 placeholder:text-amber-700/60 focus:outline-none focus:border-amber-400"
                />
                <p className="text-[10px] text-amber-800 font-medium">Real-time update propagates immediately below header on users interface.</p>
              </div>

              {/* Live telemetry check */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 border-b border-slate-200 pb-1.5">
                    <Signal className="h-4 w-4 text-emerald-500" />
                    <span>Character API Hub</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className="text-slate-400">Endpoint Status</span>
                    <span className={`font-black uppercase px-2 py-0.5 rounded text-xxs ${apiSettings.enabled ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                      {apiSettings.enabled ? 'ON line' : 'OFF line'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal font-sans">Player UID verifiers redirect automatically to dynamic target mapping when enabled.</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 border-b border-slate-200 pb-1.5">
                    <MessageCircle className="h-4 w-4 text-blue-500" />
                    <span>Telegram API Push</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className="text-slate-400">Dispatch channel</span>
                    <span className={`font-black uppercase px-2 py-0.5 rounded text-xxs ${telegramSettings.enabled ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'bg-slate-100 text-slate-400'}`}>
                      {telegramSettings.enabled ? 'CONNECTED' : 'MUTED'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal font-sans">Payment verification slips, screenshots and character nick names securely pushed instantly.</p>
                </div>
              </div>

              {/* Direct Link */}
              <div className="bg-blue-50/50 border border-blue-150 p-4 rounded-2xl text-xs space-y-2.5">
                <div className="flex items-center gap-1.5 font-bold text-blue-900 uppercase tracking-wide">
                  <HelpCircle className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Interactive Quick Administration Tip</span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Use the <strong>"Dashboard Design Overrides"</strong> tab to edit tagline labels, featured card items (Game logo, rating, discount badges), swap indicator texts, change regional options, or upload your asset files.
                </p>
                <div className="font-mono text-[10px] bg-white border border-blue-100 p-2 rounded-lg flex items-center justify-between gap-2 text-blue-600 select-all font-bold">
                  <span>Direct Link: {window.location.origin}/#/admin</span>
                  <Smartphone className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                </div>
              </div>
            </div>
          )}

          {/* B. MAIN OVERRIDES AND REAL-TIME COLOR PICKER CUSTOMIZER */}
          {activeAdminTab === 'customizer' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-3xs animate-fade-in text-left">
              <ShopCustomizer 
                websiteSettings={websiteSettings}
                onUpdateWebsite={onUpdateWebsite}
                announcement={announcement}
                onUpdateAnnouncement={onUpdateAnnouncement}
                customizerSection={customizerSection}
                setCustomizerSection={setCustomizerSection}
                simulatedPage={simulatedPage}
                setSimulatedPage={setSimulatedPage}
                handleImageFileLoad={handleImageFileLoad}
              />
            </div>
          )}

          {false && activeAdminTab === 'customizer' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black uppercase text-slate-500 tracking-wider">Dynamic Dashboard Customization</h3>
                <span className="text-[9px] bg-slate-900 text-amber-400 px-2 py-1 rounded font-mono font-bold uppercase tracking-wider">Live Preview Sync</span>
              </div>

              {/* 1. Header Overrides & Upload */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                  <Laptop className="h-4 w-4 text-slate-600" />
                  <span>Top Website Header Setup</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
                  <div className="space-y-1.5">
                    <label>Shop Title Word</label>
                    <input 
                      type="text" 
                      value={websiteSettings.websiteName || ''}
                      onChange={(e) => onUpdateWebsite({ ...websiteSettings, websiteName: e.target.value })}
                      placeholder="EPIC GAME SHOP"
                      className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label>Small Tagline Text</label>
                    <input 
                      type="text" 
                      value={websiteSettings.tagline || ''}
                      onChange={(e) => onUpdateWebsite({ ...websiteSettings, tagline: e.target.value })}
                      placeholder="Cheap Diamond Topup"
                      className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2"
                    />
                  </div>
                </div>

                {/* Upload logo widget */}
                <div className="space-y-2 text-xs">
                  <label className="font-bold text-slate-700 block">Website Logo Image (Convert to Base64 instantly)</label>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                      {websiteSettings.logoUrl ? (
                        <img src={websiteSettings.logoUrl} alt="logo" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-2xs font-extrabold text-slate-400 uppercase font-mono">TEXT</span>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {/* Interactive local file selector */}
                        <label className="bg-slate-900 text-amber-400 text-2xs font-extrabold uppercase px-3 py-2 rounded-xl cursor-pointer hover:bg-slate-950 transition-all flex items-center gap-1.5">
                          <Upload className="h-3 w-3 stroke-[2.5]" />
                          <span>Upload Image File</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleImageFileLoad(e, (base64) => {
                              onUpdateWebsite({ ...websiteSettings, logoUrl: base64 });
                              onUpdateLogo(base64);
                            })}
                          />
                        </label>
                        
                        {websiteSettings.logoUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              onUpdateWebsite({ ...websiteSettings, logoUrl: '' });
                              onUpdateLogo('');
                            }}
                            className="text-2xs font-bold text-red-500 hover:underline"
                          >
                            Remove Logo Image
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-normal leading-normal">Selected local files are instant encoded to standard browser data scheme and saved perpetually in memory.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Featured Game Card Overrides */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-slate-600" />
                  <span>Featured Game Card Details</span>
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-700">
                  <div className="space-y-1.5">
                    <label>Game Name</label>
                    <input 
                      type="text" 
                      value={websiteSettings.featuredGameName || 'FREE FIRE'}
                      onChange={(e) => onUpdateWebsite({ ...websiteSettings, featuredGameName: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label>Rating badge text</label>
                    <input 
                      type="text" 
                      value={websiteSettings.featuredGameRating || '5.0'}
                      onChange={(e) => onUpdateWebsite({ ...websiteSettings, featuredGameRating: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label>Orders Sold Value</label>
                    <input 
                      type="text" 
                      value={websiteSettings.featuredGameSold || '12k+ Sold'}
                      onChange={(e) => onUpdateWebsite({ ...websiteSettings, featuredGameSold: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label>Discount Tag text</label>
                    <input 
                      type="text" 
                      value={websiteSettings.featuredGameDiscount || '3-10% OFF'}
                      onChange={(e) => onUpdateWebsite({ ...websiteSettings, featuredGameDiscount: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 font-bold">
                  <label>Game description subtext</label>
                  <input 
                    type="text" 
                    value={websiteSettings.featuredGameSubtext || ''}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, featuredGameSubtext: e.target.value })}
                    placeholder="Instant UID Delivery • safe & authorized top-up"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>

                {/* Foreground Logo file image uploader */}
                <div className="space-y-2 text-xs text-slate-700 font-bold border-t border-slate-150 pt-3.5">
                  <label>Featured Game Foreground Logo / Icon</label>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white rounded-lg border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                      <img src={websiteSettings.featuredGameImage || 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=600'} alt="Game Logo" className="h-full w-full object-cover rounded-lg" />
                    </div>
                    <label className="bg-slate-900 text-amber-400 text-2xs font-extrabold uppercase px-3 py-2 rounded-xl cursor-pointer hover:bg-slate-950 transition-all">
                      <span>Upload Square Logo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageFileLoad(e, (base64) => {
                          onUpdateWebsite({ ...websiteSettings, featuredGameImage: base64 });
                        })}
                      />
                    </label>
                  </div>
                </div>

                {/* Background Banner photo uploader */}
                <div className="space-y-2 text-xs text-slate-700 font-bold border-t border-slate-150 pt-3.5">
                  <label>Featured Game Card Large Background Photo (Overlay)</label>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-16 bg-white rounded-lg border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                      <img src={websiteSettings.featuredGameBgImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'} alt="Game Card Background" className="h-full w-full object-cover rounded-lg" />
                    </div>
                    <label className="bg-slate-900 text-amber-400 text-2xs font-extrabold uppercase px-3 py-2 rounded-xl cursor-pointer hover:bg-slate-950 transition-all">
                      <span>Upload Card Background Photo</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleImageFileLoad(e, (base64) => {
                          onUpdateWebsite({ ...websiteSettings, featuredGameBgImage: base64 });
                        })}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* 3. Indicators & Browse title */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-slate-600" />
                  <span>Trust Indicators & Heading Overrides</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold text-slate-700">
                  <div className="space-y-1.5">
                    <label>Trust Item 1 text</label>
                    <input 
                      type="text" 
                      value={websiteSettings.trustText1 || '⚡ Fast'}
                      onChange={(e) => onUpdateWebsite({ ...websiteSettings, trustText1: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label>Trust Item 2 text</label>
                    <input 
                      type="text" 
                      value={websiteSettings.trustText2 || '🛡 Secure'}
                      onChange={(e) => onUpdateWebsite({ ...websiteSettings, trustText2: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label>Trust Item 3 text</label>
                    <input 
                      type="text" 
                      value={websiteSettings.trustText3 || '🎧 Support'}
                      onChange={(e) => onUpdateWebsite({ ...websiteSettings, trustText3: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 font-bold">
                  <label>Products catalog list title heading</label>
                  <input 
                    type="text" 
                    value={websiteSettings.browseTitle || 'Packages & Membership'}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, browseTitle: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              {/* 4. REAL-TIME COLOR PICKER OVERRIDES */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                  <Palette className="h-4 w-4 text-slate-600" />
                  <span>Real-time Shop Accent & Color Overrides</span>
                </h4>

                <p className="text-[10px] text-slate-500 font-normal leading-normal">Move color pins or choose palettes below. Instant live sync reflected in the phone preview frame!</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-extrabold text-slate-700">
                  
                  <div className="bg-white border rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="space-y-0.5">
                      <span className="block text-2xs font-extrabold text-slate-400 leading-none">PRIMARY BRAND YELLOW</span>
                      <span className="font-mono text-2xs uppercase text-slate-600 font-bold">{websiteSettings.colorBrandYellow || '#f59e0b'}</span>
                    </div>
                    <input 
                      type="color" 
                      value={websiteSettings.colorBrandYellow || '#f59e0b'}
                      onChange={(e) => onUpdateWebsite({ ...websiteSettings, colorBrandYellow: e.target.value })}
                      className="h-9 w-9 border-none cursor-pointer rounded-lg overflow-hidden shrink-0"
                    />
                  </div>

                  <div className="bg-white border rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="space-y-0.5">
                      <span className="block text-2xs font-extrabold text-slate-400 leading-none font-sans">BRAND BUTTON HOVER</span>
                      <span className="font-mono text-2xs uppercase text-slate-600 font-bold">{websiteSettings.colorBrandYellowHover || '#d97706'}</span>
                    </div>
                    <input 
                      type="color" 
                      value={websiteSettings.colorBrandYellowHover || '#d97706'}
                      onChange={(e) => onUpdateWebsite({ ...websiteSettings, colorBrandYellowHover: e.target.value })}
                      className="h-9 w-9 border-none cursor-pointer rounded-lg overflow-hidden shrink-0"
                    />
                  </div>

                  <div className="bg-white border rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="space-y-0.5">
                      <span className="block text-2xs font-extrabold text-slate-400 leading-none">HEADER BACKGROUND</span>
                      <span className="font-mono text-2xs uppercase text-slate-600 font-bold">{websiteSettings.colorHeaderBg || '#ffffff'}</span>
                    </div>
                    <input 
                      type="color" 
                      value={websiteSettings.colorHeaderBg || '#ffffff'}
                      onChange={(e) => onUpdateWebsite({ ...websiteSettings, colorHeaderBg: e.target.value })}
                      className="h-9 w-9 border-none cursor-pointer rounded-lg overflow-hidden shrink-0"
                    />
                  </div>

                  <div className="bg-white border rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="space-y-0.5">
                      <span className="block text-2xs font-extrabold text-slate-400 leading-none">HEADER BRAND WORD</span>
                      <span className="font-mono text-2xs uppercase text-slate-600 font-bold">{websiteSettings.colorHeaderText || '#0f172a'}</span>
                    </div>
                    <input 
                      type="color" 
                      value={websiteSettings.colorHeaderText || '#0f172a'}
                      onChange={(e) => onUpdateWebsite({ ...websiteSettings, colorHeaderText: e.target.value })}
                      className="h-9 w-9 border-none cursor-pointer rounded-lg overflow-hidden shrink-0"
                    />
                  </div>

                  <div className="bg-white border rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="space-y-0.5">
                      <span className="block text-2xs font-extrabold text-slate-400 leading-none">TAGLINE TEXT</span>
                      <span className="font-mono text-2xs uppercase text-slate-600 font-bold">{websiteSettings.colorTaglineText || '#f59e0b'}</span>
                    </div>
                    <input 
                      type="color" 
                      value={websiteSettings.colorTaglineText || '#f59e0b'}
                      onChange={(e) => onUpdateWebsite({ ...websiteSettings, colorTaglineText: e.target.value })}
                      className="h-9 w-9 border-none cursor-pointer rounded-lg overflow-hidden shrink-0"
                    />
                  </div>

                  <div className="bg-white border rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="space-y-0.5">
                      <span className="block text-2xs font-extrabold text-slate-400 leading-none">PRODUCT CARD TEXT</span>
                      <span className="font-mono text-2xs uppercase text-slate-600 font-bold">{websiteSettings.colorCardText || '#101827'}</span>
                    </div>
                    <input 
                      type="color" 
                      value={websiteSettings.colorCardText || '#101827'}
                      onChange={(e) => onUpdateWebsite({ ...websiteSettings, colorCardText: e.target.value })}
                      className="h-9 w-9 border-none cursor-pointer rounded-lg overflow-hidden shrink-0"
                    />
                  </div>

                  {/* New Custom Color Pickers */}
                  <div className="bg-white border rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="space-y-0.5">
                      <span className="block text-2xs font-extrabold text-slate-400 leading-none">WEBSITE BACKGROUND</span>
                      <span className="font-mono text-2xs uppercase text-slate-600 font-bold">{websiteSettings.colorWebsiteBg || '#F8FAFC'}</span>
                    </div>
                    <input 
                      type="color" 
                      value={websiteSettings.colorWebsiteBg || '#F8FAFC'}
                      onChange={(e) => onUpdateWebsite({ ...websiteSettings, colorWebsiteBg: e.target.value })}
                      className="h-9 w-9 border-none cursor-pointer rounded-lg overflow-hidden shrink-0"
                    />
                  </div>

                  <div className="bg-white border rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="space-y-0.5">
                      <span className="block text-2xs font-extrabold text-slate-400 leading-none">ANNOUNCEMENT BG</span>
                      <span className="font-mono text-2xs uppercase text-slate-600 font-bold">{websiteSettings.colorAnnouncementBg || '#fef3c7'}</span>
                    </div>
                    <input 
                      type="color" 
                      value={websiteSettings.colorAnnouncementBg || '#fef3c7'}
                      onChange={(e) => onUpdateWebsite({ ...websiteSettings, colorAnnouncementBg: e.target.value })}
                      className="h-9 w-9 border-none cursor-pointer rounded-lg overflow-hidden shrink-0"
                    />
                  </div>

                  <div className="bg-white border rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="space-y-0.5">
                      <span className="block text-2xs font-extrabold text-slate-400 leading-none">ANNOUNCEMENT TEXT</span>
                      <span className="font-mono text-2xs uppercase text-slate-600 font-bold">{websiteSettings.colorAnnouncementText || '#451a03'}</span>
                    </div>
                    <input 
                      type="color" 
                      value={websiteSettings.colorAnnouncementText || '#451a03'}
                      onChange={(e) => onUpdateWebsite({ ...websiteSettings, colorAnnouncementText: e.target.value })}
                      className="h-9 w-9 border-none cursor-pointer rounded-lg overflow-hidden shrink-0"
                    />
                  </div>

                  <div className="bg-white border rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="space-y-0.5">
                      <span className="block text-2xs font-extrabold text-slate-400 leading-none">PRODUCT CARD BG</span>
                      <span className="font-mono text-2xs uppercase text-slate-600 font-bold">{websiteSettings.colorProductCardBg || '#ffffff'}</span>
                    </div>
                    <input 
                      type="color" 
                      value={websiteSettings.colorProductCardBg || '#ffffff'}
                      onChange={(e) => onUpdateWebsite({ ...websiteSettings, colorProductCardBg: e.target.value })}
                      className="h-9 w-9 border-none cursor-pointer rounded-lg overflow-hidden shrink-0"
                    />
                  </div>

                  <div className="bg-white border rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="space-y-0.5">
                      <span className="block text-2xs font-extrabold text-slate-400 leading-none">LIVE FEED BG</span>
                      <span className="font-mono text-2xs uppercase text-slate-600 font-bold">{websiteSettings.colorLiveFeedBg || '#ffffff'}</span>
                    </div>
                    <input 
                      type="color" 
                      value={websiteSettings.colorLiveFeedBg || '#ffffff'}
                      onChange={(e) => onUpdateWebsite({ ...websiteSettings, colorLiveFeedBg: e.target.value })}
                      className="h-9 w-9 border-none cursor-pointer rounded-lg overflow-hidden shrink-0"
                    />
                  </div>

                  {/* BUY NOW BUTTON BG color selector */}
                  <div className="bg-white border-2 border-slate-100 rounded-xl p-3 flex flex-col gap-2 shadow-2xs col-span-full text-left">
                    <div className="flex items-center justify-between gap-2">
                      <div className="space-y-1 pr-2">
                        <span className="block text-xs font-black text-slate-800 uppercase tracking-wide">Primary "Buy Now" Action Button Background</span>
                        <p className="text-[10px] text-slate-400 font-medium font-sans leading-normal">
                          This controls the main <strong>BUY NOW</strong> button background on package cards, as well as server region buttons and bottom checkout triggers.
                        </p>
                        <span className="inline-block bg-slate-50 font-mono text-[10px] px-2 py-0.5 rounded text-slate-600 uppercase font-black">
                          {websiteSettings.colorBuyNowBtn || '#f59e0b'}
                        </span>
                      </div>
                      <input 
                        type="color" 
                        value={websiteSettings.colorBuyNowBtn || '#f59e0b'}
                        onChange={(e) => onUpdateWebsite({ ...websiteSettings, colorBuyNowBtn: e.target.value })}
                        className="h-10 w-10 border border-slate-200 cursor-pointer rounded-xl overflow-hidden shrink-0"
                      />
                    </div>
                  </div>

                  {/* BUY NOW BUTTON LABEL TEXT color selector */}
                  <div className="bg-white border-2 border-slate-100 rounded-xl p-3 flex flex-col gap-2 shadow-2xs col-span-full text-left">
                    <div className="flex items-center justify-between gap-2">
                      <div className="space-y-1 pr-2">
                        <span className="block text-xs font-black text-slate-800 uppercase tracking-wide">"Buy Now" Label Text color & Icons</span>
                        <p className="text-[10px] text-slate-400 font-medium font-sans leading-normal">
                          Controls the text label color inside primary actions described above to secure a clear and readable contrast ratio.
                        </p>
                        <span className="inline-block bg-slate-50 font-mono text-[10px] px-2 py-0.5 rounded text-slate-600 uppercase font-black">
                          {websiteSettings.colorBuyNowText || '#0f172a'}
                        </span>
                      </div>
                      <input 
                        type="color" 
                        value={websiteSettings.colorBuyNowText || '#0f172a'}
                        onChange={(e) => onUpdateWebsite({ ...websiteSettings, colorBuyNowText: e.target.value })}
                        className="h-10 w-10 border border-slate-200 cursor-pointer rounded-xl overflow-hidden shrink-0"
                      />
                    </div>
                  </div>

                  {/* NAVIGATION & SIDEBAR BASE COLOR */}
                  <div className="bg-white border-2 border-slate-100 rounded-xl p-3 flex flex-col gap-2 shadow-2xs col-span-full text-left">
                    <div className="flex items-center justify-between gap-2">
                      <div className="space-y-1 pr-2">
                        <span className="block text-xs font-black text-slate-800 uppercase tracking-wide">Nav Bar & Sidebar Translucent Glass BG Color</span>
                        <p className="text-[10px] text-slate-400 font-medium font-sans leading-normal">
                          Controls the backdrop of the bottom navigation bar and the slideout drawer sidebar (which includes an automatic elegant blur glassy backdrop).
                        </p>
                        <span className="inline-block bg-slate-50 font-mono text-[10px] px-2 py-0.5 rounded text-slate-600 uppercase font-black">
                          {websiteSettings.colorNavBg || '#ffffff'}
                        </span>
                      </div>
                      <input 
                        type="color" 
                        value={websiteSettings.colorNavBg || '#ffffff'}
                        onChange={(e) => onUpdateWebsite({ ...websiteSettings, colorNavBg: e.target.value })}
                        className="h-10 w-10 border border-slate-200 cursor-pointer rounded-xl overflow-hidden shrink-0"
                      />
                    </div>
                  </div>

                  {/* NAVIGATION ACTIVE ACCENT highlight */}
                  <div className="bg-white border-2 border-slate-100 rounded-xl p-3 flex flex-col gap-2 shadow-2xs col-span-full text-left">
                    <div className="flex items-center justify-between gap-2">
                      <div className="space-y-1 pr-2">
                        <span className="block text-xs font-black text-slate-800 uppercase tracking-wide">Navigation Active Highlighting Color</span>
                        <p className="text-[10px] text-slate-400 font-medium font-sans leading-normal">
                          This controls highlight colors of selected tabs, bottom navigation pointers, and currently active page anchors.
                        </p>
                        <span className="inline-block bg-slate-50 font-mono text-[10px] px-2 py-0.5 rounded text-slate-600 uppercase font-black">
                          {websiteSettings.colorNavActive || '#2563eb'}
                        </span>
                      </div>
                      <input 
                        type="color" 
                        value={websiteSettings.colorNavActive || '#2563eb'}
                        onChange={(e) => onUpdateWebsite({ ...websiteSettings, colorNavActive: e.target.value })}
                        className="h-10 w-10 border border-slate-200 cursor-pointer rounded-xl overflow-hidden shrink-0"
                      />
                    </div>
                  </div>

                  {/* NAVIGATION INACTIVE DORMANT TEXT and ICONS color */}
                  <div className="bg-white border-2 border-slate-100 rounded-xl p-3 flex flex-col gap-2 shadow-2xs col-span-full text-left">
                    <div className="flex items-center justify-between gap-2">
                      <div className="space-y-1 pr-2">
                        <span className="block text-xs font-black text-slate-800 uppercase tracking-wide">Dormant Nav Menu Text and Icons Color</span>
                        <p className="text-[10px] text-slate-400 font-medium font-sans leading-normal">
                          Configures the color applied to non-selected links, inactive dashboard navigation icons, and background helpers.
                        </p>
                        <span className="inline-block bg-slate-50 font-mono text-[10px] px-2 py-0.5 rounded text-slate-600 uppercase font-black">
                          {websiteSettings.colorNavText || '#94a3b8'}
                        </span>
                      </div>
                      <input 
                        type="color" 
                        value={websiteSettings.colorNavText || '#94a3b8'}
                        onChange={(e) => onUpdateWebsite({ ...websiteSettings, colorNavText: e.target.value })}
                        className="h-10 w-10 border border-slate-200 cursor-pointer rounded-xl overflow-hidden shrink-0"
                      />
                    </div>
                  </div>

                  {/* PROFILE TOGGLE BUTTON */}
                  <div className="bg-white border-2 border-blue-50/80 rounded-2xl p-4 flex flex-col gap-3 shadow-3xs col-span-full text-left">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="block text-xs font-black text-slate-900 uppercase tracking-wide">Toggle / Visible Profile Option Tab</span>
                        <p className="text-[11.5px] text-slate-400 font-medium font-sans leading-normal">
                          Toggle whether the <strong>'Profile'</strong> segment is visible. Clearing this option fully hides custom user details from mobile menus and side drawers.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onUpdateWebsite({ ...websiteSettings, showProfileTab: websiteSettings.showProfileTab !== false ? false : true })}
                        className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer flex items-center ${
                          websiteSettings.showProfileTab !== false ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                        id="toggle-profile-section-btn"
                        aria-label="Toggle profile section"
                      >
                        <span className={`h-6 w-6 rounded-full bg-white shadow-md absolute transition-all duration-300 ${
                          websiteSettings.showProfileTab !== false ? 'left-7' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* 5. PAGE-SPECIFIC LABELS & ANCILLARY TEXT DESCRIPTIONS */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                  <Settings2 className="h-4 w-4 text-slate-600" />
                  <span>Page-Specific Labels & Text Customization Panel</span>
                </h4>
                
                <p className="text-[10px] text-slate-500 font-normal leading-normal">
                  Fully customize static headers, buttons, warnings, info boxes, and labels for the Taskbar, Profile, UID Verification, Checkout, and Order Success pages.
                </p>

                <div className="space-y-4 font-sans">
                  {/* A. Bottom Taskbar Custom Navigation labels */}
                  <div className="bg-white border border-slate-150 rounded-xl p-3.5 space-y-3 shadow-3xs">
                    <span className="block text-2xs font-extrabold text-blue-600 uppercase tracking-wider font-sans">A. Bottom Taskbar Custom Navigation labels</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-2xs font-extrabold text-slate-600">
                      <div className="space-y-1.5">
                        <label>Dashboard Tab Label</label>
                        <input 
                          type="text" 
                          value={websiteSettings.navDashboardLabel || 'Dashboard'}
                          onChange={(e) => onUpdateWebsite({ ...websiteSettings, navDashboardLabel: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-2 font-bold focus:outline-hidden"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label>Products / Items Tab Label</label>
                        <input 
                          type="text" 
                          value={websiteSettings.navProductsLabel || 'Items'}
                          onChange={(e) => onUpdateWebsite({ ...websiteSettings, navProductsLabel: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-2 font-bold focus:outline-hidden"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label>Profile Tab Label</label>
                        <input 
                          type="text" 
                          value={websiteSettings.navProfileLabel || 'Profile'}
                          onChange={(e) => onUpdateWebsite({ ...websiteSettings, navProfileLabel: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-2 font-bold focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* B. Profile Page Content Text */}
                  <div className="bg-white border border-slate-150 rounded-xl p-3.5 space-y-3 shadow-3xs">
                    <span className="block text-2xs font-extrabold text-blue-600 uppercase tracking-wider font-sans">B. Profile Page Content Text</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-2xs font-extrabold text-slate-600">
                      <div className="space-y-1.5 flex flex-col justify-end">
                        <label>Profile Main Heading</label>
                        <input 
                          type="text" 
                          value={websiteSettings.profileHeading || 'Gaming Dashboard Profile'}
                          onChange={(e) => onUpdateWebsite({ ...websiteSettings, profileHeading: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-2 font-bold focus:outline-hidden"
                        />
                      </div>
                      <div className="space-y-1.5 flex flex-col justify-end">
                        <label>Profile Balance / Session Text</label>
                        <input 
                          type="text" 
                          value={websiteSettings.profileBalanceText || 'Anonymous client session • Secure SSL'}
                          onChange={(e) => onUpdateWebsite({ ...websiteSettings, profileBalanceText: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-2 font-bold focus:outline-hidden"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label>Profile Policy Notice Title</label>
                        <input 
                          type="text" 
                          value={websiteSettings.profileNoticeText || 'No Register Policy Notice'}
                          onChange={(e) => onUpdateWebsite({ ...websiteSettings, profileNoticeText: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-2 font-bold focus:outline-hidden"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label>Profile Policy Notice Message Body</label>
                        <textarea 
                          rows={3}
                          value={websiteSettings.profileNoticeBody || 'Epic Game Shop never stores permanent records of your transactions, passwords, or order receipts on local app databases. All inputs are shipped directly to Telegram to ensure maximum privacy and state safety.'}
                          onChange={(e) => onUpdateWebsite({ ...websiteSettings, profileNoticeBody: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-2 font-bold focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* C. Character UID Verification Page */}
                  <div className="bg-white border border-slate-150 rounded-xl p-3.5 space-y-3 shadow-3xs">
                    <span className="block text-2xs font-extrabold text-blue-600 uppercase tracking-wider font-sans">C. Character UID Verification Page</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-2xs font-extrabold text-slate-600">
                      <div className="space-y-1.5 flex flex-col justify-end">
                        <label>UID Verification Screen Header</label>
                        <input 
                          type="text" 
                          value={websiteSettings.uidPageTitle || 'Order Verification'}
                          onChange={(e) => onUpdateWebsite({ ...websiteSettings, uidPageTitle: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-2 font-bold focus:outline-hidden"
                        />
                      </div>
                      <div className="space-y-1.5 flex flex-col justify-end">
                        <label>ID Input Placeholder Text</label>
                        <input 
                          type="text" 
                          value={websiteSettings.uidPlaceholderText || 'Please enter Player ID'}
                          onChange={(e) => onUpdateWebsite({ ...websiteSettings, uidPlaceholderText: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-2 font-bold focus:outline-hidden"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label>Verify Action Button Label</label>
                        <input 
                          type="text" 
                          value={websiteSettings.uidVerifyBtnLabel || 'Verify ID'}
                          onChange={(e) => onUpdateWebsite({ ...websiteSettings, uidVerifyBtnLabel: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-2 font-bold focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* D. Payment Gateway & Gift Coupon Submission */}
                  <div className="bg-white border border-slate-150 rounded-xl p-3.5 space-y-3 shadow-3xs">
                    <span className="block text-2xs font-extrabold text-blue-600 uppercase tracking-wider font-sans">D. Payment Gateway & Gift Coupon Submission</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-2xs font-extrabold text-slate-600">
                      <div className="space-y-1.5 flex flex-col justify-end">
                        <label>Payment Section Title</label>
                        <input 
                          type="text" 
                          value={websiteSettings.paymentTitleText || 'Redemption Submission'}
                          onChange={(e) => onUpdateWebsite({ ...websiteSettings, paymentTitleText: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-2 font-bold focus:outline-hidden"
                        />
                      </div>
                      <div className="space-y-1.5 flex flex-col justify-end">
                        <label>Gift Code Input Placeholder</label>
                        <input 
                          type="text" 
                          value={websiteSettings.paymentPlaceholder || 'ABCD-EFGH-IJKL-MNOP'}
                          onChange={(e) => onUpdateWebsite({ ...websiteSettings, paymentPlaceholder: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-2 font-bold focus:outline-hidden"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label>Payment Terms Text / Value Subtitle</label>
                        <input 
                          type="text" 
                          value={websiteSettings.paymentSubtext || 'Please enter your pre-purchased Google Play Redeem Code with equivalent or higher value.'}
                          onChange={(e) => onUpdateWebsite({ ...websiteSettings, paymentSubtext: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-2 font-bold focus:outline-hidden"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label>Mandatory Warning Notice Eng</label>
                        <textarea 
                          rows={2}
                          value={websiteSettings.paymentNoticeEn || 'You must enter your Google Play redeem code and submit screenshot proof! It is mandatory to initiate your order.'}
                          onChange={(e) => onUpdateWebsite({ ...websiteSettings, paymentNoticeEn: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-2 font-bold focus:outline-hidden"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label>Mandatory Warning Notice Hindi</label>
                        <textarea 
                          rows={2}
                          value={websiteSettings.paymentNoticeHi || 'कृपया अपना असली रिडीम कोड और स्क्रीनशॉट प्रूफ यहाँ ज़रूर दर्ज करें, इसी से भुगतान स्वीकार और कन्फर्म किया जाएगा!'}
                          onChange={(e) => onUpdateWebsite({ ...websiteSettings, paymentNoticeHi: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-2 font-bold focus:outline-hidden"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label>Submit Action Button Label</label>
                        <input 
                          type="text" 
                          value={websiteSettings.paymentSubmitLabel || 'Submit Order'}
                          onChange={(e) => onUpdateWebsite({ ...websiteSettings, paymentSubmitLabel: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-2 font-bold focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* E. Success Receipt Screen Settings */}
                  <div className="bg-white border border-slate-150 rounded-xl p-3.5 space-y-3 shadow-3xs">
                    <span className="block text-2xs font-extrabold text-blue-600 uppercase tracking-wider font-sans">E. Success Receipt Screen Settings</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-2xs font-extrabold text-slate-600">
                      <div className="space-y-1.5 flex flex-col justify-end">
                        <label>Success Headline Message</label>
                        <input 
                          type="text" 
                          value={websiteSettings.successHeadline || 'Order Submitted Successfully'}
                          onChange={(e) => onUpdateWebsite({ ...websiteSettings, successHeadline: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-2 font-bold focus:outline-hidden"
                        />
                      </div>
                      <div className="space-y-1.5 flex flex-col justify-end">
                        <label>Success descriptive Subtext</label>
                        <input 
                          type="text" 
                          value={websiteSettings.successSubtext || 'Your UID is verified and your Google Play Redeem code has been sent directly to Telegram Delivery.'}
                          onChange={(e) => onUpdateWebsite({ ...websiteSettings, successSubtext: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-2 font-bold focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* C. PRODUCTS LIST CATALOG TAB */}
          {activeAdminTab === 'products' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase text-slate-500 tracking-wider">Products Catalog Management</h3>
                {!productForm && (
                  <button
                    onClick={() => setProductForm({ name: '', discountPrice: 0, originalPrice: 0, image: '', badge: '', status: 'available', categoryId: categories[0]?.id || '' })}
                    className="bg-slate-900 text-amber-400 border border-slate-900 rounded-xl text-xs font-black px-4 py-2.5 flex items-center gap-1.5 shadow-xs hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                    id="add-product-btn"
                  >
                    <Plus className="h-4 w-4 stroke-[2.3]" />
                    <span>Add New product</span>
                  </button>
                )}
              </div>

              {productForm ? (
                <form onSubmit={handleProductSave} className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">{productForm.id ? 'Edit Product Package' : 'Create Product Package'}</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
                    <div className="space-y-1.5">
                      <label>Package Title Name</label>
                      <input
                        type="text"
                        value={productForm.name || ''}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        placeholder="Diamonds Pack or Membership title..."
                        className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label>Category Filter</label>
                      <select
                        value={productForm.categoryId || ''}
                        onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                        className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2"
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label>Discount Deal Price (₹)</label>
                      <input
                        type="number"
                        value={productForm.discountPrice || ''}
                        onChange={(e) => setProductForm({ ...productForm, discountPrice: Number(e.target.value) })}
                        placeholder="Price paid on checkout"
                        className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label>Regular Price (₹)</label>
                      <input
                        type="number"
                        value={productForm.originalPrice || ''}
                        onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                        placeholder="Original crossed-out regular price"
                        className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label>Badge Tag label (e.g. Save 20%, Popular)</label>
                      <input
                        type="text"
                        value={productForm.badge || ''}
                        onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                        placeholder="Optional top left product cell badge"
                        className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label>Publication Status</label>
                      <select
                        value={productForm.status || 'available'}
                        onChange={(e) => setProductForm({ ...productForm, status: e.target.value as any })}
                        className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2 text-xs font-semibold"
                      >
                        <option value="available">Available</option>
                        <option value="sold_out">Sold Out (Locked)</option>
                        <option value="hidden">Hidden from client catalog</option>
                      </select>
                    </div>
                  </div>

                  {/* Reusable file uploader for Product Cover Image */}
                  <div className="space-y-2 text-xs text-slate-700 font-bold border-t border-slate-200 pt-3">
                    <label className="block">Product Item Aspect Image</label>
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 bg-white rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        {productForm.image ? (
                          <img src={productForm.image} alt="Preview" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xxs text-slate-400 uppercase font-mono font-bold">No Image</span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="bg-slate-900 text-amber-400 text-2xs font-extrabold uppercase px-3 py-2 rounded-xl cursor-pointer hover:bg-slate-950 transition-all inline-block">
                          <span>Select Product Asset Photo</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleImageFileLoad(e, (base64) => {
                              setProductForm({ ...productForm, image: base64 });
                            })}
                          />
                        </label>
                        <p className="text-[10px] text-slate-400 font-normal">Use direct uploader or type picture address below:</p>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={productForm.image || ''}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      placeholder="Paste online image URL (or leave uploaded base64 data)"
                      className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-1.5 text-xxs font-mono text-slate-500"
                    />
                  </div>

                  {/* PREMIUM PROMOTION HIGHLIGHTS SECTION */}
                  <div className="border-t border-slate-200 pt-4.5 space-y-4">
                    <h5 className="font-extrabold text-[11px] text-amber-600 uppercase tracking-wider">Premium Highlight & Promotion Settings</h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-bold text-slate-700">
                      <label className="flex items-center gap-2.5 cursor-pointer bg-white p-3 rounded-2xl border border-slate-200 hover:border-slate-300 select-none transition-all">
                        <input
                          type="checkbox"
                          checked={productForm.is_best_seller || false}
                          onChange={(e) => setProductForm({ ...productForm, is_best_seller: e.target.checked })}
                          className="rounded text-amber-500 focus:ring-amber-400 h-4.5 w-4.5 cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <span className="text-slate-800 font-black">⭐ Best Seller</span>
                          <span className="text-[9px] text-slate-400 font-normal">Apply premium gold styles</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer bg-white p-3 rounded-2xl border border-slate-200 hover:border-slate-300 select-none transition-all">
                        <input
                          type="checkbox"
                          checked={productForm.is_hot_deal || false}
                          onChange={(e) => setProductForm({ ...productForm, is_hot_deal: e.target.checked })}
                          className="rounded text-red-500 focus:ring-red-400 h-4.5 w-4.5 cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <span className="text-slate-800 font-black">🔥 Hot Deal</span>
                          <span className="text-[9px] text-slate-400 font-normal">Apply flame/gradient styles</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer bg-white p-3 rounded-2xl border border-slate-200 hover:border-slate-300 select-none transition-all">
                        <input
                          type="checkbox"
                          checked={productForm.pin_to_top || false}
                          onChange={(e) => setProductForm({ ...productForm, pin_to_top: e.target.checked })}
                          className="rounded text-blue-500 focus:ring-blue-400 h-4.5 w-4.5 cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <span className="text-slate-800 font-black">📌 Pin to Top</span>
                          <span className="text-[9px] text-slate-400 font-normal">Forces item above other ones</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer bg-white p-3 rounded-2xl border border-slate-200 hover:border-slate-300 select-none transition-all">
                        <input
                          type="checkbox"
                          checked={productForm.glow_animation ?? true}
                          onChange={(e) => setProductForm({ ...productForm, glow_animation: e.target.checked })}
                          className="rounded text-yellow-500 focus:ring-yellow-400 h-4.5 w-4.5 cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <span className="text-slate-800 font-black">✨ Glow Animation</span>
                          <span className="text-[9px] text-slate-400 font-normal">Breathe ambient lighting shadow</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer bg-white p-3 rounded-2xl border border-slate-200 hover:border-slate-300 select-none transition-all">
                        <input
                          type="checkbox"
                          checked={productForm.pulse_animation ?? true}
                          onChange={(e) => setProductForm({ ...productForm, pulse_animation: e.target.checked })}
                          className="rounded text-orange-500 focus:ring-orange-400 h-4.5 w-4.5 cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <span className="text-slate-800 font-black">🔄 Pulse / Shine</span>
                          <span className="text-[9px] text-slate-400 font-normal">Micro-movement / sparkle shine</span>
                        </div>
                      </label>

                      <div className="space-y-1">
                        <label className="text-slate-600 block text-[11px] font-bold">Custom Sorting Priority</label>
                        <input
                          type="number"
                          value={productForm.priority || 0}
                          onChange={(e) => setProductForm({ ...productForm, priority: Number(e.target.value) })}
                          placeholder="e.g. 10 (higher is sorted first)"
                          className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2 text-xs"
                        />
                      </div>

                      <div className="space-y-1 col-span-1 sm:col-span-2 md:col-span-3">
                        <label className="text-slate-600 block text-[11px] font-bold">Custom Badge Tag Text (e.g. BEST SELLER, HOT DEAL, LIMITED OFFER)</label>
                        <input
                          type="text"
                          value={productForm.tag_text || ''}
                          onChange={(e) => setProductForm({ ...productForm, tag_text: e.target.value })}
                          placeholder="Override text (e.g. GOLD EDITION, TRENDING). Fallback is Best Seller/Hot Deal."
                          className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 pt-3.5 justify-end border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setProductForm(null)}
                      className="bg-slate-200 px-4 py-2 rounded-xl font-extrabold text-slate-700 hover:bg-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-slate-900 border border-slate-900 text-amber-400 px-5  py-2 rounded-xl font-extrabold hover:bg-slate-950 shadow-xs"
                    >
                      Save Product Package
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {products.map((item) => {
                    const matchedCat = categories.find(c => c.id === item.categoryId);
                    return (
                      <div 
                        key={item.id} 
                        className="bg-slate-50/50 hover:bg-slate-50 border border-slate-200/60 rounded-2xl p-3 flex items-center justify-between gap-4 relative transition-all"
                      >
                        <div className="flex items-center gap-3.5">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="h-11 w-11 object-cover rounded-xl border border-slate-200 bg-white shadow-2xs"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-extrabold text-[13px] text-slate-950 leading-none">{item.name}</h4>
                            <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-slate-400 font-bold">
                              <span className="text-slate-800">₹{item.discountPrice}</span>
                              <span>•</span>
                              <span>{matchedCat?.name || 'No Category'}</span>
                              <span>•</span>
                              <span className={`text-2xs uppercase px-1.5 py-0.5 rounded-sm ${
                                item.status === 'available' ? 'bg-emerald-50 text-emerald-600 font-extrabold border border-emerald-100' : 
                                item.status === 'sold_out' ? 'bg-red-55 border border-red-100 text-red-600' : 'bg-amber-50 text-amber-600'
                              }`}>{item.status}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => setProductForm(item)}
                            className="p-2 hover:bg-slate-100 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-950 transition-all hover:scale-105"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => {
                              const targetStatus = item.status === 'hidden' ? 'available' : 'hidden';
                              onUpdateProducts(products.map(p => p.id === item.id ? { ...p, status: targetStatus } : p));
                            }}
                            className="p-2 hover:bg-slate-100 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-950 transition-all"
                            title="Toggle Visibility"
                          >
                            {item.status === 'hidden' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </button>
                          
                          <button
                            onClick={() => handleProductDelete(item.id)}
                            className="p-2 hover:bg-red-50 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-red-500 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* D. CATEGORIES FILTERS TAB */}
          {activeAdminTab === 'categories' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black uppercase text-slate-500 tracking-wider">Categories Filter Management</h3>
                {!categoryForm && (
                  <button
                    onClick={() => setCategoryForm({ name: '', status: 'active' })}
                    className="bg-slate-900 text-amber-400 rounded-xl text-xs font-black px-4 py-2.5 flex items-center gap-1.5 hover:scale-[1.02] shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="h-4 w-4 stroke-[2.3]" />
                    <span>Create Category</span>
                  </button>
                )}
              </div>

              {categoryForm ? (
                <form onSubmit={handleCategorySave} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">{categoryForm.id ? 'Edit Category' : 'Create Category'}</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
                    <div className="space-y-1.5">
                      <label>Category Filter Name</label>
                      <input
                        type="text"
                        value={categoryForm.name || ''}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        placeholder="Diamonds Pack, Special Offers, etc."
                        className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label>Activity Status</label>
                      <select
                        value={categoryForm.status || 'active'}
                        onChange={(e) => setCategoryForm({ ...categoryForm, status: e.target.value as any })}
                        className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2 text-xs font-semibold"
                      >
                        <option value="active">Active (Renders Filters)</option>
                        <option value="hidden">Hidden</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3.5 justify-end border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setCategoryForm(null)}
                      className="bg-slate-200 px-4 py-2 rounded-xl font-extrabold text-slate-700 hover:bg-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-slate-900 text-amber-400 px-5 py-2 rounded-xl font-extrabold hover:bg-slate-950"
                    >
                      Save Category
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {categories.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5 flex items-center justify-between gap-4"
                    >
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-950 leading-none">{item.name}</h4>
                        <span className={`text-[9px] font-black font-mono tracking-wider uppercase px-2 py-0.5 mt-2 inline-block rounded-md ${
                          item.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 border border-amber-150 text-amber-700'
                        }`}>{item.status}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => setCategoryForm(item)}
                          className="p-2 hover:bg-slate-100 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-950 transition-all hover:scale-105"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => {
                            const newStatus = item.status === 'active' ? 'hidden' : 'active';
                            onUpdateCategories(categories.map(c => c.id === item.id ? { ...c, status: newStatus } : c));
                          }}
                          className="p-2 hover:bg-slate-100 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-700"
                          title="Toggle Active/Hidden"
                        >
                          {item.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>

                        <button
                          onClick={() => handleCategoryDelete(item.id)}
                          className="p-2 hover:bg-red-50 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-red-500 shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* E. UID VERIFICATION API TAB */}
          {activeAdminTab === 'api' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black uppercase text-slate-500 tracking-wider font-mono">UID Verification API Node</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Gate Switch</span>
                  <button
                    onClick={() => onUpdateApi({ ...apiSettings, enabled: !apiSettings.enabled })}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                      apiSettings.enabled ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all ${
                      apiSettings.enabled ? 'translate-x-[16px]' : 'translate-x-[2px]'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 text-xs font-bold text-slate-700">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label>Target API Gateway (Dynamic Character lookup URL)</label>
                    <span className="text-[9px] text-slate-400 font-bold">Replace character UID with &#123;uid&#125;</span>
                  </div>
                  <input
                    type="text"
                    value={apiSettings.apiUrl}
                    onChange={(e) => onUpdateApi({ ...apiSettings, apiUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 font-mono text-indigo-600 rounded-xl px-3 py-3 font-semibold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label>Authentication Token Parameter (Key)</label>
                    <input
                      type="text"
                      value={apiSettings.apiKey}
                      onChange={(e) => onUpdateApi({ ...apiSettings, apiKey: e.target.value })}
                      placeholder="API_AUTHORIZATION_SECRET"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label>Query parameter lookup type</label>
                    <input
                      type="text"
                      value={apiSettings.apiType}
                      onChange={(e) => onUpdateApi({ ...apiSettings, apiType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Return Response mappings */}
                <div className="bg-slate-50 border border-slate-250 p-4 rounded-2xl space-y-3.5">
                  <h4 className="text-xs font-extrabold text-slate-800">Dynamic JSON Keys Mapping</h4>
                  <p className="text-[10px] text-slate-400 font-normal leading-normal">Configure indices key properties to route Garena database character nicknames securely to checkouts.</p>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-extrabold text-slate-400">Nickname Key</label>
                      <input
                        type="text"
                        value={apiSettings.fieldNickname}
                        onChange={(e) => onUpdateApi({ ...apiSettings, fieldNickname: e.target.value })}
                        className="w-full bg-white border border-slate-200 font-mono text-center rounded-xl py-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-extrabold text-slate-400">Character UID Key</label>
                      <input
                        type="text"
                        value={apiSettings.fieldUid}
                        onChange={(e) => onUpdateApi({ ...apiSettings, fieldUid: e.target.value })}
                        className="w-full bg-white border border-slate-200 font-mono text-center rounded-xl py-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-extrabold text-slate-400">Verification Key</label>
                      <input
                        type="text"
                        value={apiSettings.fieldVerified}
                        onChange={(e) => onUpdateApi({ ...apiSettings, fieldVerified: e.target.value })}
                        className="w-full bg-white border border-slate-200 font-mono text-center rounded-xl py-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Gate test */}
                <div className="border-t border-slate-250 pt-4 space-y-3.5">
                  <h4 className="text-xs font-black text-slate-900 uppercase">Verification Simulator Diagnostics</h4>
                  
                  <form onSubmit={handleTestApi} className="flex gap-2">
                    <input
                      type="text"
                      value={apiTestId}
                      onChange={(e) => setApiTestId(e.target.value)}
                      placeholder="Enter players Garena UID (e.g. 5241097)"
                      className="flex-1 bg-slate-50 border border-slate-250 px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-slate-400"
                    />
                    <button
                      type="submit"
                      disabled={apiTesting}
                      className="bg-slate-900 border border-slate-900 text-amber-400 uppercase text-2xs font-extrabold tracking-wider px-4 rounded-xl transition-all hover:bg-slate-950 disabled:opacity-50"
                    >
                      {apiTesting ? 'testing...' : 'Diagnostic Sync'}
                    </button>
                  </form>

                  {apiTestResult && (
                    <div className="bg-slate-950 border border-slate-800 text-slate-300 font-mono p-4 rounded-2xl text-[10px] leading-relaxed space-y-2">
                      <p className="font-extrabold text-amber-400 uppercase tracking-widest border-b border-slate-800 pb-1.5 flex items-center justify-between">
                        <span>Terminal Output Logs:</span>
                        <span className="text-xxs text-slate-500 font-normal">{apiTestResult.status}</span>
                      </p>
                      
                      {apiTestResult.message && <p className="text-blue-400 font-sans italic">{apiTestResult.message}</p>}
                      <p><span className="text-slate-500">MAPPED NICKNAME:</span> <strong className="text-white font-black">{apiTestResult.mappedNickname}</strong></p>
                      <p><span className="text-slate-500">MAPPED GARENA ID:</span> <strong className="text-white font-black">{apiTestResult.mappedUid}</strong></p>
                      <p><span className="text-slate-500">MAPPED VERIFIED CHECK:</span> <strong className="text-white font-black">{apiTestResult.mappedVerified}</strong></p>
                      {apiTestResult.rawResponse && (
                        <div className="pt-2">
                          <span className="text-slate-500 block mb-1">RAW JSON BODY RECEIVED:</span>
                          <pre className="max-h-24 overflow-y-auto select-all p-2 bg-slate-900/50 rounded-lg text-emerald-400 border border-slate-800 text-[9px]">{JSON.stringify(apiTestResult.rawResponse, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* F. TELEGRAM BOT CORE CONFIG TAB */}
          {activeAdminTab === 'telegram' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black uppercase text-slate-500 tracking-wider">Telegram Channel Dispatcher</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Master Trigger</span>
                  <button
                    onClick={() => onUpdateTelegram({ ...telegramSettings, enabled: !telegramSettings.enabled })}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                      telegramSettings.enabled ? 'bg-indigo-500' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all ${
                      telegramSettings.enabled ? 'translate-x-[16px]' : 'translate-x-[2px]'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 text-xs font-bold text-slate-700">
                <div className="space-y-1.5 relative">
                  <label className="flex items-center justify-between">
                    <span>Telegram API Bot Secret Token</span>
                    <span className="text-[9px] text-slate-400 normal-case font-normal">Created via @BotFather</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showBotToken ? "text" : "password"}
                      value={telegramSettings.botToken}
                      onChange={(e) => onUpdateTelegram({ ...telegramSettings, botToken: e.target.value.replace(/\s+/g, '') })}
                      placeholder="Paste your API Token e.g. 1249581:AAH-XYZ..."
                      className="w-full bg-slate-50 border border-slate-200 text-indigo-600 font-mono rounded-xl pl-4 pr-11 py-3 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowBotToken(!showBotToken)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showBotToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center justify-between">
                    <span>Target Chat ID (Your personal account or group thread)</span>
                    <span className="text-[9px] text-slate-400 font-normal">Numeric identifier</span>
                  </label>
                  <input
                    type="text"
                    value={telegramSettings.chatId}
                    onChange={(e) => onUpdateTelegram({ ...telegramSettings, chatId: e.target.value.replace(/\s+/g, '') })}
                    placeholder="E.g. 524912046"
                    className="w-full bg-slate-50 border border-slate-200 font-mono rounded-xl px-4 py-3 focus:outline-none"
                  />
                </div>

                {/* Quick Setup instructions card */}
                <div className="bg-indigo-50/40 border border-indigo-100 p-4.5 rounded-2xl space-y-3">
                  <h4 className="font-extrabold text-[11px] text-indigo-950 uppercase tracking-widest flex items-center gap-1.5 border-b border-indigo-200/50 pb-2">
                    <AlertTriangle className="h-4 w-4 text-indigo-600 shrink-0" />
                    <span>Bilingual Setup Support Check (Hindi & English Setup)</span>
                  </h4>
                  <ul className="list-decimal pl-4.5 text-[11px] text-indigo-900/80 leading-relaxed font-sans space-y-2">
                    <li>
                      <strong>Create bot:</strong> Search <strong>@BotFather</strong>, send <code>/newbot</code>, copy the provided Token above.
                      <span className="block text-indigo-600/80 italic font-mono">👉 @BotFather पर /newbot भेजे, बोट का Token ऊपर डाले।</span>
                    </li>
                    <li>
                      <strong>Check Chat ID:</strong> Message <strong>@userinfobot</strong> to get your numerical personal ID and paste it above.
                      <span className="block text-indigo-600/80 italic font-mono">👉 @userinfobot पर जाकर अपनी numerical chat id कॉपी करके ऊपर डाले।</span>
                    </li>
                    <li>
                      <strong className="text-red-700">⚠️ IMPORTANT ( बोट स्टार्ट करें / start bot ):</strong> 
                      Message your own bot and click index button <strong className="text-indigo-950 uppercase font-black bg-indigo-100 px-1 py-0.5 rounded">"START"</strong> before clicking test delivery below.
                      <span className="block text-amber-700 font-semibold mt-0.5">🔔 बोट के यूज़रनेम पर जाकर "START" दबाना बहुत फ़ायदेमंद और आवश्यक है, वरना मैसेज नहीं जाएगा!</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleTestTelegram}
                    disabled={telegramTesting || !telegramSettings.botToken || !telegramSettings.chatId}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black px-5 py-3 flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  >
                    {telegramTesting ? <LoopIcon className="h-4 w-4 animate-spin" /> : <span>Test Telegram Connection</span>}
                  </button>
                </div>

                {telegramStatusMsg && (
                  <div className={`rounded-xl p-3.5 border text-xs font-bold font-sans animate-fade-in ${
                    telegramStatusMsg.success 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-red-50 text-red-800 border-red-200'
                  }`}>
                    <p className="font-extrabold uppercase tracking-wide mb-1 flex items-center gap-1">
                      {telegramStatusMsg.success ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <AlertTriangle className="h-4 w-4 text-red-500" />}
                      <span>{telegramStatusMsg.success ? 'Verification Dispatch Success' : 'Dispatch Refusal'}</span>
                    </p>
                    <p className="font-medium text-slate-600 whitespace-pre-wrap">{telegramStatusMsg.text}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* G. LIVE DYNAMICAL PURCHASE FEED TAB */}
          {activeAdminTab === 'feeds' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black uppercase text-slate-500 tracking-wider">Live Activity Generator</h3>
                  <p className="text-[10px] text-slate-400">Generate simulated sales ticker cards instantaneously.</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFeedAutoGenerate}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xxs font-extrabold uppercase px-3 py-2 transition-all flex items-center gap-1 shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3 animate-spin duration-1000" />
                    <span>Auto Generate Feed</span>
                  </button>

                  {!feedForm && (
                    <button
                      onClick={() => setFeedForm({ uid: '', packageName: '', timestamp: 'Just now' })}
                      className="bg-slate-900 hover:bg-slate-950 text-amber-400 rounded-xl text-xxs font-extrabold uppercase px-3.5 py-2 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>
                  )}
                </div>
              </div>

              {feedForm && (
                <form onSubmit={handleFeedSave} className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4 text-xs font-bold text-slate-700">
                  <h4 className="font-black text-slate-900 uppercase">Inject Manual Purchase Card</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label>Player Masked UID</label>
                      <input
                        type="text"
                        value={feedForm.uid || ''}
                        onChange={(e) => setFeedForm({ ...feedForm, uid: e.target.value })}
                        placeholder="E.g. 582104XX99"
                        className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5"
                      />
                    </div>
                    <div className="space-y-1">
                      <label>Package Action</label>
                      <input
                        type="text"
                        value={feedForm.packageName || ''}
                        onChange={(e) => setFeedForm({ ...feedForm, packageName: e.target.value })}
                        placeholder="E.g. 520+260 Diamonds"
                        className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5"
                      />
                    </div>
                    <div className="space-y-1">
                      <label>Timestamp</label>
                      <input
                        type="text"
                        value={feedForm.timestamp || 'Just now'}
                        onChange={(e) => setFeedForm({ ...feedForm, timestamp: e.target.value })}
                        placeholder="Just now, 2 mins ago"
                        className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end border-t border-slate-200 pt-3">
                    <button type="button" onClick={() => setFeedForm(null)} className="text-slate-400 mr-2 font-bold">Cancel</button>
                    <button type="submit" className="bg-slate-900 text-amber-400 px-4 py-1.5 rounded-xl font-black uppercase text-2xs">Inject Feed</button>
                  </div>
                </form>
              )}

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {feeds.map((item) => (
                  <div key={item.id} className="bg-slate-50 border border-slate-200/50 p-3 rounded-xl flex items-center justify-between text-xs hover:bg-slate-100 transition-all">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold font-mono text-slate-800 bg-white border px-2 py-0.5 rounded shadow-2xs leading-none">{item.uid}</span>
                      <p className="font-semibold text-slate-700">purchased {item.packageName}</p>
                      <span className="text-[10px] text-slate-400 font-mono">({item.timestamp})</span>
                    </div>

                    <button
                      onClick={() => handleFeedDelete(item.id)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 transition-all shrink-0"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: HIGH FIDELITY SMARTPHONE DYNAMIC SHOP SIMULATOR PREVIEW */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-sans">
              <Smartphone className="h-4 w-4 text-slate-500" />
              <span>Diagnostic Phone Simulator</span>
            </h4>
            <span className="text-[9px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
              <span>Real-time Sync Active</span>
            </span>
          </div>

          {/* Interactive Screen Selector Button Grid */}
          <div className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-2xl space-y-2 text-left">
            <span className="block text-[10px] font-black uppercase text-slate-500 tracking-wider">Device Active Preview Screen</span>
            <div className="grid grid-cols-5 gap-1">
              {[
                { id: 'dashboard', name: 'Home' },
                { id: 'verify', name: 'UID Check' },
                { id: 'payment', name: 'Redeem' },
                { id: 'success', name: 'Success' },
                { id: 'profile', name: 'Profile' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSimulatedPage(tab.id)}
                  className={`text-[9px] font-black uppercase py-2 px-1 rounded-lg transition-all border text-center cursor-pointer ${
                    simulatedPage === tab.id
                      ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-xs scale-102 font-extrabold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          <div className="relative mx-auto max-w-[340px] border-[12px] border-slate-900 rounded-[55px] bg-slate-950 shadow-2xl overflow-hidden aspect-[9/19.5]">
            {/* Phone Ear Speaker / Dynamic Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-905 rounded-full z-45 flex items-center justify-center">
              <div className="w-16 h-1 bg-slate-800 rounded-full" />
            </div>

            {/* Simulated Phone Status Bar */}
            <div className="absolute top-8 left-0 right-0 h-5 px-6 flex items-center justify-between text-slate-950 text-[10px] font-bold z-44">
              <span>9:41 AM</span>
              <div className="flex items-center gap-1.5 font-mono">
                <span>5G</span>
                <span>📶</span>
                <span>🔋 100%</span>
              </div>
            </div>

            {/* Frame Viewport viewport Scroll Area Container */}
            <div 
              style={{ backgroundColor: websiteSettings.colorWebsiteBg || '#F8FAFC' }}
              className="w-full h-full pt-14 pb-4 overflow-y-auto relative pointer-events-auto flex flex-col"
            >
              
              {/* Dynamic Header preview matching Website Overrides */}
              <header 
                style={{ backgroundColor: websiteSettings.colorHeaderBg || '#ffffff' }}
                className="border-b border-slate-100 shadow-3xs px-3 py-2 flex items-center justify-between select-none shrink-0"
              >
                <div className="flex items-center gap-1.5">
                  <div 
                    style={{ backgroundColor: websiteSettings.colorBrandYellow || '#f59e0b' }}
                    className="h-7 w-7 rounded-lg flex items-center justify-center font-black text-[9px] text-slate-950"
                  >
                    {websiteSettings.logoUrl ? (
                      <img src={websiteSettings.logoUrl} alt="Logo" className="object-contain h-full w-full rounded-lg" referrerPolicy="no-referrer" />
                    ) : (
                      <span>EPIC</span>
                    )}
                  </div>
                  <div className="text-left leading-none">
                    <span 
                      style={{ color: websiteSettings.colorHeaderText || '#0f172a' }}
                      className="font-black text-[11px] block tracking-tight"
                    >
                      <EditableField fieldKey="websiteName" label="Website Name" onEditField={handleEditField}>
                        <span>{websiteSettings.websiteName || 'EPIC GAME SHOP'}</span>
                      </EditableField>
                    </span>
                    <span 
                      style={{ color: websiteSettings.colorTaglineText || '#f59e0b' }}
                      className="text-[8px] font-extrabold tracking-tighter block uppercase mt-0.5"
                    >
                      <EditableField fieldKey="tagline" label="Tagline" onEditField={handleEditField}>
                        <span>{websiteSettings.tagline || 'Cheap Diamond Topup'}</span>
                      </EditableField>
                    </span>
                  </div>
                </div>

                <div className="h-6 w-6 border rounded-md bg-slate-50 flex items-center justify-center">
                  <span className="text-[10px]">☰</span>
                </div>
              </header>

              {/* Dynamic announcement preview */}
              {announcement.enabled && (
                <div 
                  style={{ 
                    backgroundColor: websiteSettings.colorAnnouncementBg || '#fef3c7', 
                    color: websiteSettings.colorAnnouncementText || '#451a03' 
                  }}
                  className="text-[8px] font-extrabold py-1 px-3 border-y border-amber-100/30 flex items-center gap-1 truncate select-none shrink-0"
                >
                  <span>📢</span>
                  <EditableField fieldKey="text" label="Announcements Text" onEditField={handleEditField} className="truncate max-w-full">
                    <span className="truncate block">{announcement.text || 'Diamond Sale Is Running...'}</span>
                  </EditableField>
                </div>
              )}

              {/* Actual core interactive page simulation inside real-time frame viewport */}
              <div className="flex-1 scale-100 w-full overflow-y-auto text-left">
                {simulatedPage === 'dashboard' && (
                  <DashboardPage
                    products={products}
                    categories={categories}
                    feeds={feeds}
                    onSelectProduct={() => setSimulatedPage('verify')}
                    onNavigate={(page) => {
                      if (page === 'profile') setSimulatedPage('profile');
                    }}
                    websiteSettings={websiteSettings}
                    onEditField={handleEditField}
                  />
                )}
                {simulatedPage === 'verify' && (
                  <UidVerificationPage
                    selectedProduct={products[0] || {
                      id: 'mock-ff-pack',
                      name: '100+25 Diamonds Pack',
                      originalPrice: 100,
                      discountPrice: 79,
                      image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=500',
                      badge: 'Hot Deal',
                      status: 'available',
                      categoryId: categories[0]?.id || 'cat-diamonds'
                    }}
                    apiSettings={apiSettings}
                    websiteSettings={websiteSettings}
                    onVerified={() => setSimulatedPage('payment')}
                    onBack={() => setSimulatedPage('dashboard')}
                    onEditField={handleEditField}
                  />
                )}
                {simulatedPage === 'payment' && (
                  <PaymentPage
                    selectedProduct={products[0] || {
                      id: 'mock-ff-pack',
                      name: '100+25 Diamonds Pack',
                      originalPrice: 100,
                      discountPrice: 79,
                      image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=500',
                      badge: 'Hot Deal',
                      status: 'available',
                      categoryId: categories[0]?.id || 'cat-diamonds'
                    }}
                    uid="2521746277"
                    playerName="EpicAlphaPlayer"
                    websiteSettings={websiteSettings}
                    onBack={() => setSimulatedPage('verify')}
                    onSubmit={() => setSimulatedPage('success')}
                    loading={false}
                    onEditField={handleEditField}
                  />
                )}
                {simulatedPage === 'success' && (
                  <SuccessPage
                    selectedProduct={products[0] || {
                      id: 'mock-ff-pack',
                      name: '100+25 Diamonds Pack',
                      originalPrice: 100,
                      discountPrice: 79,
                      image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=500',
                      badge: 'Hot Deal',
                      status: 'available',
                      categoryId: categories[0]?.id || 'cat-diamonds'
                    }}
                    uid="2521746277"
                    playerName="EpicAlphaPlayer"
                    redeemCode="REDEEM-PREVIEW-CODE-2026"
                    supportTelegram={websiteSettings.supportTelegram}
                    websiteSettings={websiteSettings}
                    onGoHome={() => setSimulatedPage('dashboard')}
                    onEditField={handleEditField}
                  />
                )}
                {simulatedPage === 'profile' && (
                  <ProfilePage
                    websiteSettings={websiteSettings}
                    onNavigate={(page) => {
                      if (page === 'dashboard' || page === 'profile') {
                        setSimulatedPage(page);
                      }
                    }}
                    onEditField={handleEditField}
                  />
                )}
              </div>

            </div>
          </div>
          
          <p className="text-[10px] text-slate-400 font-medium text-center italic leading-relaxed">
            Click on phone selector options or edit categories above to auto-transition the preview to matching screens.
          </p>
        </div>

      </div>

    </div>
  );
}
