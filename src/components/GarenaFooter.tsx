import { ChevronUp } from 'lucide-react';
import { WebsiteSettings } from '../types';

interface GarenaFooterProps {
  websiteSettings: WebsiteSettings;
}

export default function GarenaFooter({ websiteSettings }: GarenaFooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A0B0E] border-t border-slate-900 text-slate-500 py-10 px-6 select-none font-sans relative">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
        
        {/* Garena Swirl Brand Logo */}
        <div className="flex items-center gap-3 justify-center">
          {websiteSettings.footerLogoUrl ? (
            <img 
              src={websiteSettings.footerLogoUrl} 
              alt={websiteSettings.footerLogoText || 'Garena'} 
              className="h-10 w-auto object-contain max-h-12"
              referrerPolicy="no-referrer"
            />
          ) : (
            <svg 
              style={{ color: websiteSettings.footerLogoColor || '#FF1F25' }} 
              className="h-10 w-auto" 
              viewBox="0 0 100 100" 
              fill="currentColor"
            >
              {/* Authentic Garena Swirl Flame Vector Path */}
              <path d="M72.2 24.2C64.6 15.6 52.8 11 38.6 11 17.5 11 1.6 25.4 1.6 44.5c0 14.7 9.8 26.5 24.4 30.6-1.5-2.2-2.5-4.8-2.5-7.8 0-7.3 5.9-13.2 13.2-13.2 5.5 0 10.2 3.4 12.2 8.2 1 2.3 1.5 4.9 1.5 7.6 0 9.8-8 17.8-17.8 17.8-2.4 0-4.6-.5-6.7-1.3C33 88.3 41.5 90 50.4 90c21.8 0 39.5-17.7 39.5-39.5 0-10.2-3.9-19.5-10.2-26.4.8.8 1.5 1.7 2.2 2.6 1.1 1.5 2.5 2.4 3.7 2.4 1.1 0 2-.8 2-2 0-1.4-.9-2.8-2-3.9-1.5-1.5-2.8-3-3.7-4.6-.8-1.5-1.5-3.3-1.5-5 0-3.1 2.3-5.5 5.5-5.5 1 0 1.9.3 2.7.8-2.3-2.3-5.5-3.7-9.1-3.7-5.1 0-9.4 2.8-11.7 7-.6 1-1.1 2.2-1.4 3.4-.3 1.2-.5 2.5-.5 3.8 0 5 2.8 9.3 7 11.5.8.4 1.7.8 2.6 1.1-.9-.4-1.8-.9-2.6-1.5z"/>
            </svg>
          )}
          <span 
            style={{ color: websiteSettings.footerLogoColor || '#FF1F25' }} 
            className="font-extrabold text-2.5xl tracking-[0.08em] uppercase"
          >
            {websiteSettings.footerLogoText || 'Garena'}
          </span>
        </div>

        {/* Corporate / Legal Disclaimer */}
        <div className="space-y-2">
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-lg mx-auto">
            Copyright © Garena International. Trademarks belong to their respective owners. All rights reserved.
          </p>
          <p className="text-[9px] text-slate-500 leading-normal max-w-md mx-auto">
            Epic Game Shop is an independent gaming store. This application is designed solely for entertainment and rapid UID manual dispatch services.
          </p>
        </div>

        {/* Links Row */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-2">
          <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
          <span className="h-3 w-px bg-slate-800 hidden sm:inline" />
          <span className="hover:text-white transition-colors cursor-pointer">For Parents FAQ</span>
          <span className="h-3 w-px bg-slate-800 hidden sm:inline" />
          <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
        </div>

        {/* Floating Back to Top Button Container (Matches Garena layout) */}
        <div className="pt-4 flex justify-center w-full">
          <button
            onClick={scrollToTop}
            className="h-10 w-10 bg-[#161821] hover:bg-[#1f222e] border border-slate-800 text-slate-300 hover:text-white rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 cursor-pointer"
            title="Scroll to top"
            id="garena-scroll-top-btn"
          >
            <ChevronUp className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </footer>
  );
}
