import React from 'react';
import { WebsiteSettings, Announcement } from '../../types';
import { 
  Sparkles, Palette, Laptop, ShieldCheck, MessageCircle, Megaphone, Upload, CheckCircle
} from 'lucide-react';

interface ShopCustomizerProps {
  websiteSettings: WebsiteSettings;
  onUpdateWebsite: (settings: WebsiteSettings) => void;
  announcement: Announcement;
  onUpdateAnnouncement: (announcement: Announcement) => void;
  customizerSection: 'theme' | 'header' | 'featured' | 'abcd' | 'contacts';
  setCustomizerSection: (section: 'theme' | 'header' | 'featured' | 'abcd' | 'contacts') => void;
  simulatedPage: string;
  setSimulatedPage: (page: string) => void;
  handleImageFileLoad: (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => void;
}

export default function ShopCustomizer({
  websiteSettings,
  onUpdateWebsite,
  announcement,
  onUpdateAnnouncement,
  customizerSection,
  setCustomizerSection,
  simulatedPage,
  setSimulatedPage,
  handleImageFileLoad
}: ShopCustomizerProps) {
  return (
    <div className="space-y-6 text-left font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">Dynamic Dashboard Customization</h3>
          <p className="text-[10px] text-slate-400 font-medium">Configure all headers, labels, and color templates in real-time</p>
        </div>
        <span className="text-[9px] bg-slate-900 text-amber-400 px-2 py-1 rounded font-mono font-bold uppercase tracking-wider">Live Preview Sync</span>
      </div>

      {/* Dynamic Theme customizer category tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 select-none text-xs font-bold">
        {[
          { id: 'theme', name: '🎨 Theme Colors' },
          { id: 'header', name: '🏢 Shop Info' },
          { id: 'featured', name: '🎮 Hero Banner' },
          { id: 'abcd', name: '✏ ABCD Labels' },
          { id: 'contacts', name: '📞 Contacts Info' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setCustomizerSection(tab.id as any);
              if (tab.id === 'theme' || tab.id === 'header' || tab.id === 'featured') {
                setSimulatedPage('dashboard');
              } else if (tab.id === 'contacts') {
                setSimulatedPage('profile');
              } else {
                setSimulatedPage('verify');
              }
            }}
            className={`text-[10px] font-black uppercase py-2.5 px-2 rounded-xl border transition-all text-center cursor-pointer ${
              customizerSection === tab.id
                ? 'bg-slate-900 border-slate-900 text-amber-400 font-black shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* SECTION 1: THEME & COLOR PRESETS */}
      {customizerSection === 'theme' && (
        <div className="space-y-4 animate-fade-in">
          {/* Color Preset Palette Selection Cards */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3.5">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-550" />
              <span>One-Click Website Theme Presets</span>
            </h4>
            <p className="text-[10.5px] text-slate-500 leading-relaxed">
              Select one of our highly crafted, balanced styling presets to instantly update high fidelity branding accents:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold">
              {[
                {
                  name: "🔥 Cyberpunk Amber & Dark Rose",
                  colors: {
                    colorBrandYellow: '#f59e0b',
                    colorBrandYellowHover: '#d97706',
                    colorHeaderBg: '#090d16',
                    colorHeaderText: '#ffffff',
                    colorTaglineText: '#e11d48',
                    colorCardText: '#ffffff',
                    colorWebsiteBg: '#030712',
                    colorAnnouncementBg: '#e11d48',
                    colorAnnouncementText: '#ffffff',
                    colorProductCardBg: '#111827',
                    colorLiveFeedBg: '#1f2937',
                    colorBuyNowBtn: '#e11d48',
                    colorBuyNowText: '#ffffff',
                    colorNavBg: '#111827',
                    colorNavText: '#9ca3af',
                    colorNavActive: '#e11d48'
                  }
                },
                {
                  name: "💙 Sapphire Quest & Cyan Blue",
                  colors: {
                    colorBrandYellow: '#2563eb',
                    colorBrandYellowHover: '#1d4ed8',
                    colorHeaderBg: '#1e293b',
                    colorHeaderText: '#ffffff',
                    colorTaglineText: '#38bdf8',
                    colorCardText: '#ffffff',
                    colorWebsiteBg: '#0f172a',
                    colorAnnouncementBg: '#1e293b',
                    colorAnnouncementText: '#38bdf8',
                    colorProductCardBg: '#1e293b',
                    colorLiveFeedBg: '#1e293b',
                    colorBuyNowBtn: '#38bdf8',
                    colorBuyNowText: '#0f172a',
                    colorNavBg: '#1e293b',
                    colorNavText: '#94a3b8',
                    colorNavActive: '#38bdf8'
                  }
                },
                {
                  name: "💚 Emerald Poison Gas",
                  colors: {
                    colorBrandYellow: '#10b981',
                    colorBrandYellowHover: '#059669',
                    colorHeaderBg: '#0a0f0d',
                    colorHeaderText: '#34d399',
                    colorTaglineText: '#10b981',
                    colorCardText: '#ffffff',
                    colorWebsiteBg: '#030504',
                    colorAnnouncementBg: '#064e3b',
                    colorAnnouncementText: '#34d399',
                    colorProductCardBg: '#111c17',
                    colorLiveFeedBg: '#0f1814',
                    colorBuyNowBtn: '#10b981',
                    colorBuyNowText: '#040705',
                    colorNavBg: '#111c17',
                    colorNavText: '#6ee7b7',
                    colorNavActive: '#10b981'
                  }
                },
                {
                  name: "✨ Pearl Cream Shop (Elegant Light)",
                  colors: {
                    colorBrandYellow: '#d97706',
                    colorBrandYellowHover: '#b45309',
                    colorHeaderBg: '#ffffff',
                    colorHeaderText: '#0f172a',
                    colorTaglineText: '#d97706',
                    colorCardText: '#1e293b',
                    colorWebsiteBg: '#F8FAFC',
                    colorAnnouncementBg: '#fef3c7',
                    colorAnnouncementText: '#451a03',
                    colorProductCardBg: '#ffffff',
                    colorLiveFeedBg: '#ffffff',
                    colorBuyNowBtn: '#d97706',
                    colorBuyNowText: '#ffffff',
                    colorNavBg: '#ffffff',
                    colorNavText: '#64748b',
                    colorNavActive: '#2563eb'
                  }
                }
              ].map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onUpdateWebsite({ ...websiteSettings, ...preset.colors })}
                  className="flex items-center justify-between p-2.5 bg-white border border-slate-200 hover:border-slate-400 hover:bg-slate-50 rounded-xl transition-all text-left cursor-pointer"
                >
                  <span className="truncate text-[11px] font-extrabold text-slate-800">{preset.name}</span>
                  <div className="flex gap-0.5 shrink-0 ml-1">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: preset.colors.colorBrandYellow }} />
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: preset.colors.colorWebsiteBg }} />
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: preset.colors.colorBuyNowBtn }} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Grid of Real-Time color pickers */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
            <div className="border-b border-slate-200 pb-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="h-4 w-4 text-slate-600" />
                <span>Interactive Accent & Palette Customizer</span>
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
              {[
                { key: 'colorBrandYellow', label: 'Primary Accent Theme Color' },
                { key: 'colorBrandYellowHover', label: 'Accent Border & Hover Highlight' },
                { key: 'colorHeaderBg', label: 'Header Backdrop Color' },
                { key: 'colorHeaderText', label: 'Header Brand Text' },
                { key: 'colorTaglineText', label: 'Header Tagline Word' },
                { key: 'colorCardText', label: 'Website Headers & Body Texts' },
                { key: 'colorWebsiteBg', label: 'General System Background' },
                { key: 'colorAnnouncementBg', label: 'Announcements Bar Background' },
                { key: 'colorAnnouncementText', label: 'Announcements Bar Labels' },
                { key: 'colorProductCardBg', label: 'Offers & Catalog Box Background' },
                { key: 'colorLiveFeedBg', label: 'Notification Feed Backing' },
                { key: 'colorBuyNowBtn', label: 'BUY NOW Redemptions Button Color' },
                { key: 'colorBuyNowText', label: 'BUY NOW Button Text Color' },
                { key: 'colorNavBg', label: 'Bottom Taskbar Background' },
                { key: 'colorNavText', label: 'Dormant Navigation Menu Icons' },
                { key: 'colorNavActive', label: 'Active Selected Navigation Item' }
              ].map(color => (
                <div key={color.key} className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-3xs hover:border-slate-300">
                  <div className="leading-tight text-left">
                    <span className="block font-extrabold text-[11px] text-slate-900">{color.label}</span>
                    <span className="font-mono text-[9px] text-slate-400">{(websiteSettings as any)[color.key] || '#------'}</span>
                  </div>
                  <input 
                    type="color"
                    value={(websiteSettings as any)[color.key] || '#ffffff'}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, [color.key]: e.target.value })}
                    className="h-7 w-7 rounded-md cursor-pointer border border-slate-200 p-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: SHOP INFO & TOP HEADER BRANDING */}
      {customizerSection === 'header' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
              <Laptop className="h-4 w-4 text-slate-600" />
              <span>Branding & Header Parameters</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
              <div className="space-y-1.5">
                <label>Main Portal Title Heading</label>
                <input 
                  type="text" 
                  value={websiteSettings.websiteName || ''}
                  onChange={(e) => onUpdateWebsite({ ...websiteSettings, websiteName: e.target.value })}
                  placeholder="EPIC GAME SHOP"
                  className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label>Underline Small Tagline</label>
                <input 
                  type="text" 
                  value={websiteSettings.tagline || ''}
                  onChange={(e) => onUpdateWebsite({ ...websiteSettings, tagline: e.target.value })}
                  placeholder="Instant redeem tool"
                  className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label>Shop Logo Logo Icon (File Upload or Web URL)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={websiteSettings.logoUrl || ''}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, logoUrl: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    className="flex-1 bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2 text-[11px]"
                  />
                  <label className="bg-slate-900 hover:bg-slate-800 text-amber-400 px-3 py-2 rounded-xl text-3xs font-black flex items-center justify-center gap-1 cursor-pointer shrink-0">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Logo</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleImageFileLoad(e, (base64) => onUpdateWebsite({ ...websiteSettings, logoUrl: base64 }))} 
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-slate-650" />
              <span>Security & Trust Indicator Boxes</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
              <div className="space-y-1.5">
                <label>Dynamic Trust Text Item 1</label>
                <input 
                  type="text" 
                  value={websiteSettings.trustText1 || '⭐ 4.9 Play Store Verified Portal'}
                  onChange={(e) => onUpdateWebsite({ ...websiteSettings, trustText1: e.target.value })}
                  className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label>Dynamic Trust Text Item 2</label>
                <input 
                  type="text" 
                  value={websiteSettings.trustText2 || '🔒 SSL Cert-Secured character UID scanning'}
                  onChange={(e) => onUpdateWebsite({ ...websiteSettings, trustText2: e.target.value })}
                  className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label>Dynamic Trust Text Item 3</label>
                <input 
                  type="text" 
                  value={websiteSettings.trustText3 || '⚡ Direct delivery completed by Admin Console'}
                  onChange={(e) => onUpdateWebsite({ ...websiteSettings, trustText3: e.target.value })}
                  className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: FEATURED GAME COVER HERO VIEW */}
      {customizerSection === 'featured' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-slate-600" />
              <span>Featured Category Hero Core Parameters</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
              <div className="space-y-1.5">
                <label>Highlighted Game Word title</label>
                <input 
                  type="text" 
                  value={websiteSettings.featuredGameName || 'FREE FIRE MAX DIAMONDS'}
                  onChange={(e) => onUpdateWebsite({ ...websiteSettings, featuredGameName: e.target.value })}
                  className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label>Promotions / Badge Label</label>
                <input 
                  type="text" 
                  value={websiteSettings.featuredGameDiscount || 'Discount active direct'}
                  onChange={(e) => onUpdateWebsite({ ...websiteSettings, featuredGameDiscount: e.target.value })}
                  className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label>Rating Badge score content</label>
                <input 
                  type="text" 
                  value={websiteSettings.featuredGameRating || '4.9 Star Rating'}
                  onChange={(e) => onUpdateWebsite({ ...websiteSettings, featuredGameRating: e.target.value })}
                  className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label>Total Redemp count display</label>
                <input 
                  type="text" 
                  value={websiteSettings.featuredGameSold || '2.5M orders checked'}
                  onChange={(e) => onUpdateWebsite({ ...websiteSettings, featuredGameSold: e.target.value })}
                  className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label>Category Subtitle tagline text</label>
                <input 
                  type="text" 
                  value={websiteSettings.featuredGameSubtext || 'Provide character UID to start live topup instantly'}
                  onChange={(e) => onUpdateWebsite({ ...websiteSettings, featuredGameSubtext: e.target.value })}
                  className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label>Lower Catalog Grid header title</label>
                <input 
                  type="text" 
                  value={websiteSettings.browseTitle || 'SELECT REDEMPTION CODES & PACKS'}
                  onChange={(e) => onUpdateWebsite({ ...websiteSettings, browseTitle: e.target.value })}
                  className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
              <Upload className="h-4 w-4 text-slate-650" />
              <span>Hero & Background Image Uploaders</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
              <div className="space-y-1.5">
                <label>Game Cover Image (Square Thumbnail)</label>
                <div className="flex gap-1">
                  <input 
                    type="text" 
                    value={websiteSettings.featuredGameImage || ''}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, featuredGameImage: e.target.value })}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-[11px]"
                  />
                  <label className="bg-slate-900 hover:bg-slate-800 text-amber-400 px-2 flex items-center justify-center rounded-xl text-3xs font-black cursor-pointer">
                    <span>Upload</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleImageFileLoad(e, (base64) => onUpdateWebsite({ ...websiteSettings, featuredGameImage: base64 }))} 
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label>Backing Canvas Banner Image</label>
                <div className="flex gap-1">
                  <input 
                    type="text" 
                    value={websiteSettings.featuredGameBgImage || ''}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, featuredGameBgImage: e.target.value })}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-[11px]"
                  />
                  <label className="bg-slate-900 hover:bg-slate-800 text-amber-400 px-2 flex items-center justify-center rounded-xl text-3xs font-black cursor-pointer">
                    <span>Upload</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleImageFileLoad(e, (base64) => onUpdateWebsite({ ...websiteSettings, featuredGameBgImage: base64 }))} 
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: ABCD DYNAMIC LABELS CUSTOMIZATION */}
      {customizerSection === 'abcd' && (
        <div className="space-y-4 animate-fade-in text-left">
          {/* Page Category Subtabs */}
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 font-bold">
            {[
              { id: 'dashboard', name: 'Dashboard Home', page: 'dashboard' },
              { id: 'verify', name: 'Verification Page', page: 'uid_verify' },
              { id: 'payment', name: 'Redemptions Page', page: 'payment' },
              { id: 'profile', name: 'User Profile Page', page: 'profile' },
              { id: 'success', name: 'Success Screen', page: 'success' }
            ].map(sub => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSimulatedPage(sub.page)}
                className={`flex-1 text-[9px] font-black uppercase py-2 px-1 rounded-lg transition-all text-center cursor-pointer ${
                  simulatedPage === sub.page
                    ? 'bg-white text-slate-900 shadow-3xs border-b'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>

          {/* SUBSECTION: DASHBOARD */}
          {simulatedPage === 'dashboard' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-4">
              <div className="border-b border-slate-100 pb-1.5">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">A. Shop Navigation labels & Menu items</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold text-slate-700">
                <div className="space-y-1">
                  <label>Home Menu Label</label>
                  <input 
                    type="text" 
                    value={websiteSettings.navDashboardLabel || 'Home'}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, navDashboardLabel: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-1.5 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label>Store catalog Label</label>
                  <input 
                    type="text" 
                    value={websiteSettings.navProductsLabel || 'Items'}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, navProductsLabel: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-1.5 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label>Profile Label</label>
                  <input 
                    type="text" 
                    value={websiteSettings.navProfileLabel || 'Profile'}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, navProfileLabel: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-1.5 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-left text-xs font-sans">
                  <span className="block font-semibold text-[11px] text-slate-800">Include custom User Profile Tab</span>
                  <span className="text-[9.5px] text-slate-400 block">Shows/hides the live profile screen in bottom navigation bar</span>
                </div>
                <input 
                  type="checkbox"
                  checked={websiteSettings.showProfileTab !== false}
                  onChange={(e) => onUpdateWebsite({ ...websiteSettings, showProfileTab: e.target.checked })}
                  className="h-4.5 w-4.5 cursor-pointer accent-slate-900 shrink-0"
                />
              </div>
            </div>
          )}

          {/* SUBSECTION: UID VERIFY */}
          {simulatedPage === 'uid_verify' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-4">
              <div className="border-b border-slate-100 pb-1.5">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">B. Character UID Checking screen fields</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-slate-700">
                <div className="space-y-1">
                  <label>Verification Screen Headline</label>
                  <input 
                    type="text" 
                    value={websiteSettings.uidPageTitle || 'CHARACTER IDENTIFICATION'}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, uidPageTitle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-1.5"
                  />
                </div>
                <div className="space-y-1">
                  <label>Verify Action Button text</label>
                  <input 
                    type="text" 
                    value={websiteSettings.uidVerifyBtnLabel || 'Verify Game Account'}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, uidVerifyBtnLabel: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-1.5"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label>Subtitle instructions</label>
                  <input 
                    type="text" 
                    value={websiteSettings.uidPageSubtitle || 'Provide your exact game account tag to proceed.'}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, uidPageSubtitle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-1.5"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label>UID Input placeholder</label>
                  <input 
                    type="text" 
                    value={websiteSettings.uidPlaceholderText || 'Enter player UID identifier value...'}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, uidPlaceholderText: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-1.5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SUBSECTION: PAYMENT (ABCD) */}
          {simulatedPage === 'payment' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-4">
              <div className="border-b border-slate-100 pb-1.5">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">C. Coupon Redemption & Screen Texts</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-slate-700">
                <div className="space-y-1">
                  <label>Redeem Screen Main Title</label>
                  <input 
                    type="text" 
                    value={websiteSettings.paymentTitleText || 'COUPON REWARD PASS'}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, paymentTitleText: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-1.5 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label>Code Box Placeholder</label>
                  <input 
                    type="text" 
                    value={websiteSettings.paymentPlaceholder || 'Enter promotional Code/Coupon...'}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, paymentPlaceholder: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-1.5 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label>Underline tiny descriptor note labels</label>
                  <input 
                    type="text" 
                    value={websiteSettings.paymentSubtext || 'Your character has been successfully matched. Direct delivery completes in 3-5 mins.'}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, paymentSubtext: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-1.5 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label>Claim Reward Button String</label>
                  <input 
                    type="text" 
                    value={websiteSettings.paymentSubmitLabel || 'Claim Code Coupon reward'}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, paymentSubmitLabel: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-1.5 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label>Mandatory guidelines English notice content</label>
                  <textarea 
                    rows={2}
                    value={websiteSettings.paymentNoticeEn || 'IMPORTANT NOTICE: Do not submit wrong screenshot file sizes.'}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, paymentNoticeEn: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-1.5 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label>Mandatory guidelines Hindi notice content</label>
                  <textarea 
                    rows={2}
                    value={websiteSettings.paymentNoticeHi || 'महत्वपूर्ण सूचना: कृपया गलत स्क्रीनशॉट फ़ाइल अपलोड न करें।'}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, paymentNoticeHi: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-1.5 text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SUBSECTION: PROFILE */}
          {simulatedPage === 'profile' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-4">
              <div className="border-b border-slate-100 pb-1.5">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">D. Profile page structure & policy parameters</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-slate-705">
                <div className="space-y-1">
                  <label>User Profile Heading page title</label>
                  <input 
                    type="text" 
                    value={websiteSettings.profileHeading || 'YOUR REDEMP STATUS'}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, profileHeading: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-1.5"
                  />
                </div>
                <div className="space-y-1">
                  <label>Coins/Tokens balance indicator</label>
                  <input 
                    type="text" 
                    value={websiteSettings.profileBalanceText || 'Status: Active G-Redeem User'}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, profileBalanceText: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-1.5"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label>Guidelines / Terms panel header</label>
                  <input 
                    type="text" 
                    value={websiteSettings.profileNoticeText || 'G-REDEEM OFFICIAL PROGRAM POLICY'}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, profileNoticeText: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-1.5"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label>Detailed system disclosure guidelines body content</label>
                  <textarea 
                    rows={3}
                    value={websiteSettings.profileNoticeBody || 'All reward items are delivered straight to your Character inbox.'}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, profileNoticeBody: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-1.5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SUBSECTION: SUCCESS */}
          {simulatedPage === 'success' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-4">
              <div className="border-b border-slate-100 pb-1.5">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">E. Success Response Receipt Panel labels</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-slate-700">
                <div className="space-y-1.5">
                  <label>Success headline banner</label>
                  <input 
                    type="text" 
                    value={websiteSettings.successHeadline || 'Order Submitted Successfully'}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, successHeadline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-1.5"
                  />
                </div>
                <div className="space-y-1.5">
                  <label>Successful descriptive details subtext</label>
                  <input 
                    type="text" 
                    value={websiteSettings.successSubtext || 'Your UID is verified and your Google Play Redeem code has been sent directly to Telegram Delivery.'}
                    onChange={(e) => onUpdateWebsite({ ...websiteSettings, successSubtext: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg px-2.5 py-1.5"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 5: CONTACT INFORMATION & TOP ALERTS BAR */}
      {customizerSection === 'contacts' && (
        <div className="space-y-4 animate-fade-in text-left">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4 text-slate-650" />
              <span>Live Helpdesk Contacts Setup</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
              <div className="space-y-1.5">
                <label>Support Telegram handler Link</label>
                <input 
                  type="text" 
                  value={websiteSettings.supportTelegram || ''}
                  onChange={(e) => onUpdateWebsite({ ...websiteSettings, supportTelegram: e.target.value })}
                  placeholder="https://t.me/your_admin"
                  className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label>Support Whatsapp Number Link</label>
                <input 
                  type="text" 
                  value={websiteSettings.supportWhatsapp || ''}
                  onChange={(e) => onUpdateWebsite({ ...websiteSettings, supportWhatsapp: e.target.value })}
                  placeholder="https://wa.me/91XXXXXXXXXX"
                  className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label>Customer Support Email Desk</label>
                <input 
                  type="text" 
                  value={websiteSettings.supportEmail || ''}
                  onChange={(e) => onUpdateWebsite({ ...websiteSettings, supportEmail: e.target.value })}
                  placeholder="support@epicshop.com"
                  className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
              <Megaphone className="h-4 w-4 text-slate-600" />
              <span>Top Header Announcement Marquee Ticker</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-700">
              <div className="space-y-1.5 sm:col-span-2">
                <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-300">
                  <div className="text-left font-sans">
                    <span className="block font-semibold text-xs text-slate-800">Enable Shop Announcement banner</span>
                    <span className="text-[10px] text-slate-400 font-medium tracking-tight">Controls the horizontal marquee strip at the top</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={announcement.enabled}
                    onChange={(e) => onUpdateAnnouncement({ ...announcement, enabled: e.target.checked })}
                    className="h-4.5 w-4.5 cursor-pointer accent-slate-900 shrink-0"
                  />
                </div>
              </div>

              {announcement.enabled && (
                <div className="space-y-1.5 sm:col-span-2">
                  <label>Banner Ticker description text</label>
                  <input 
                    type="text" 
                    value={announcement.text || ''}
                    onChange={(e) => onUpdateAnnouncement({ ...announcement, text: e.target.value })}
                    className="w-full bg-white border border-slate-200 focus:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
