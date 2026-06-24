import { motion, AnimatePresence } from 'motion/react';
import { Home, Zap, CreditCard, User, X, ShieldAlert } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
  websiteSettings?: WebsiteSettings;
}

export default function Sidebar({ isOpen, onClose, currentPage, onNavigate, websiteSettings }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Home', icon: Home },
    { id: 'items', name: 'Services', icon: Zap },
    { id: 'pay_info', name: 'Payment Page', icon: CreditCard }, // A static payment info/page instruction
  ];

  const sidebarBg = websiteSettings?.colorNavBg || '#ffffff';
  const activeColor = websiteSettings?.colorNavActive || '#2563eb'; // blue-600
  const inactiveColor = websiteSettings?.colorNavText || '#4b5563'; // slate-600
  const primaryYellow = websiteSettings?.colorBrandYellow || '#f59e0b';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Blur Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 pointer-events-auto"
          />

          {/* Transparent Glass Drawer Element with configured glass sidebar styles */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 210 }}
            style={{ 
              backgroundColor: `${sidebarBg}c8`, // c8 is hex alpha for ~78% opacity
              color: inactiveColor,
              borderColor: `${inactiveColor}18`
            }}
            className="fixed top-0 right-0 h-full w-[280px] backdrop-blur-xl shadow-2xl z-55 flex flex-col p-6 pointer-events-auto border-l"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100/30">
              <div className="flex items-center gap-2">
                <div 
                  style={{ backgroundColor: activeColor }}
                  className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md"
                >
                  E
                </div>
                <span className="font-extrabold tracking-tight" style={{ color: websiteSettings?.colorHeaderText || '#1e293b' }}>
                  {websiteSettings?.websiteName || 'Epic Topup'}
                </span>
              </div>
              <button
                onClick={onClose}
                style={{ color: inactiveColor }}
                className="p-2 hover:bg-black/5 rounded-xl transition-all"
                id="close-sidebar-btn"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 py-6 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id || (item.id === 'items' && currentPage === 'verify') || (item.id === 'items' && currentPage === 'payment');
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      onClose();
                    }}
                    style={{ 
                      backgroundColor: isActive ? activeColor : 'transparent',
                      color: isActive ? '#ffffff' : inactiveColor
                    }}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-black text-sm transition-all text-left ${
                      isActive 
                        ? 'shadow-md shadow-blue-500/10' 
                        : 'hover:bg-black/5'
                    }`}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Subtle disclaimer / note in sidebar */}
            <div className="pt-6 border-t border-slate-100/30 text-xs font-mono space-y-1 opacity-80">
              <div className="flex items-center gap-1.5 font-bold mb-1" style={{ color: primaryYellow }}>
                <ShieldAlert className="h-4 w-4 shrink-0 animate-bounce" />
                <span>Delivery Channels</span>
              </div>
              <p>Manual processing via secure integration nodes is status active.</p>
              <p className="text-[10px]">Secure Sandbox View Active</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
