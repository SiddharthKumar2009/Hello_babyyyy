import { LayoutGrid, Flame, User } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface BottomNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  websiteSettings?: WebsiteSettings;
}

export default function BottomNavigation({ currentPage, onNavigate, websiteSettings }: BottomNavigationProps) {
  // Map internal nested routes back to bottom tabs to keep correct highlight
  const getActiveTab = () => {
    if (currentPage === 'dashboard') return 'dashboard';
    if (currentPage === 'items' || currentPage === 'verify' || currentPage === 'payment' || currentPage === 'success') return 'items';
    if (currentPage === 'profile') return 'profile';
    return '';
  };

  const activeTab = getActiveTab();

  // Load custom visibility setting
  const showProfile = websiteSettings?.showProfileTab !== false;

  const tabs = [
    { id: 'dashboard', label: websiteSettings?.navDashboardLabel || 'Dashboard', icon: LayoutGrid },
    { id: 'items', label: websiteSettings?.navProductsLabel || 'Items', icon: Flame },
    ...(showProfile ? [{ id: 'profile', label: websiteSettings?.navProfileLabel || 'Profile', icon: User }] : [])
  ];

  if (currentPage === 'admin') return null; // Only hide bottom navigation in Admin panel completely

  const navBg = websiteSettings?.colorNavBg || '#ffffff';
  const activeColor = websiteSettings?.colorNavActive || '#2563eb'; // blue-600
  const inactiveColor = websiteSettings?.colorNavText || '#94a3b8'; // slate-400

  // Quick fallback check if custom hex values are supplied
  const containerStyle = {
    backgroundColor: `${navBg}ed`, // slightly transparent
    borderColor: `${inactiveColor}20`
  };

  return (
    <div id="bottom-navigation-container" className="fixed bottom-4 left-4 right-4 z-40 md:hidden pointer-events-none">
      <div 
        style={containerStyle}
        className="backdrop-blur-lg rounded-2xl shadow-xl border p-2 max-w-sm mx-auto flex items-center justify-around pointer-events-auto transition-all duration-300"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              style={{ color: isActive ? activeColor : inactiveColor }}
              className="flex flex-col items-center gap-1 py-1.5 px-4.5 rounded-xl transition-all duration-300 relative"
              id={`nav-${tab.id}-btn`}
            >
              <Icon className={`h-5 w-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5px]' : 'scale-100 stroke-2'}`} />
              <span className="text-[10px] font-bold tracking-tight">{tab.label}</span>
              {isActive && (
                <span 
                  style={{ backgroundColor: activeColor }}
                  className="absolute -bottom-1 left-4.5 right-4.5 h-0.75 rounded-full" 
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
