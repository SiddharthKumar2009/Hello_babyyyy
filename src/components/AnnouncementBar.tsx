import { Megaphone } from 'lucide-react';
import { Announcement, WebsiteSettings } from '../types';

interface AnnouncementBarProps {
  announcement: Announcement;
  websiteSettings?: WebsiteSettings;
}

export default function AnnouncementBar({ announcement, websiteSettings }: AnnouncementBarProps) {
  if (!announcement.enabled || !announcement.text) return null;

  const bgCol = websiteSettings?.colorAnnouncementBg || '#fef3c7'; // default amber-50/90
  const textCol = websiteSettings?.colorAnnouncementText || '#451a03'; // default amber-950

  // Combine multiple sequences of the text so it can scroll seamlessly
  const repeatedText = `${announcement.text}   •   ${announcement.text}   •   ${announcement.text}   •   ${announcement.text}   •   `;

  return (
    <div 
      id="announcement-bar" 
      style={{ backgroundColor: bgCol, color: textCol, borderColor: `${textCol}20` }}
      className="mx-4 mt-3 py-2.5 px-4 shadow-3xs rounded-2xl border flex items-center overflow-hidden z-20 h-10 select-none animate-fade-in"
    >
      <div className="w-full flex items-center relative gap-2 overflow-hidden">
        {/* Notice badge on left */}
        <div 
          style={{ backgroundColor: bgCol, color: textCol, borderRightColor: `${textCol}25` }}
          className="flex items-center gap-1.5 pr-3 z-10 font-black text-xs uppercase tracking-wider shrink-0 opacity-95 border-r"
        >
          <Megaphone style={{ color: textCol }} className="h-4 w-4 animate-bounce stroke-[2.5]" id="announcement-meg-icon" />
          <span>Notice</span>
        </div>

        {/* Scrollbox viewport */}
        <div className="relative w-full overflow-hidden h-5 flex items-center">
          <div className="animate-marquee-smooth flex items-center text-xs font-extrabold tracking-wide select-none gap-4">
            <span className="shrink-0">{repeatedText}</span>
            <span className="shrink-0">{repeatedText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
