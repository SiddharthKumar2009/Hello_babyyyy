import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { LiveFeedEntry, WebsiteSettings } from '../types';

interface LivePurchaseFeedProps {
  feeds: LiveFeedEntry[];
  websiteSettings?: WebsiteSettings;
}

// A collection of potential packages to show to simulate real high activity
const RANDOM_PACKAGES = [
  '100+25 Diamonds Pack',
  '310+50 Diamonds Pack',
  '520+75 Diamonds Pack',
  '1060+150 Diamonds Pack',
  '2180+300 Diamonds Pack',
  'Weekly Membership',
  'Monthly Membership',
  'BOOYAH PASS',
  'BOOYAH PASS PLUS',
  'EVO VAULT - Gun Skin Voucher',
  'Level Up Pass Special',
  '5600+800 Diamonds Mega Stash'
];

export default function LivePurchaseFeed({ feeds, websiteSettings }: LivePurchaseFeedProps) {
  const [activeFeeds, setActiveFeeds] = useState<LiveFeedEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Initialize with initial feeds and generate a rich list of dynamic transactions
  useEffect(() => {
    // Generate some randomized highly unique variations
    const generated: LiveFeedEntry[] = [];
    const baseFeeds = feeds.length > 0 ? feeds : [
      { id: 'f-1', uid: '252174XX77', packageName: '100+50 Diamonds Pack', timestamp: 'Just now' },
      { id: 'f-2', uid: '887412XX99', packageName: 'Weekly Membership', timestamp: 'Just now' }
    ];

    // Combine base feeds and cook 25 more completely unique ones to feel absolutely live
    generated.push(...baseFeeds);

    for (let i = 0; i < 25; i++) {
      // Create random UID
      const randomPrefix = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
      const randomSuffix = Math.floor(10 + Math.random() * 90).toString(); // 2 digits
      const randomPack = RANDOM_PACKAGES[Math.floor(Math.random() * RANDOM_PACKAGES.length)];
      
      generated.push({
        id: `gen-feed-${i}-${Math.random()}`,
        uid: `${randomPrefix}XX${randomSuffix}`,
        packageName: randomPack,
        timestamp: 'Just now'
      });
    }

    // Shuffle them slightly to make it highly unpredictable/dynamic
    const shuffled = [...generated].sort(() => Math.random() - 0.5);
    setActiveFeeds(shuffled);
  }, [feeds]);

  // Rotate index safely
  useEffect(() => {
    if (activeFeeds.length === 0) return;
    const interval = setInterval(() => {
      // Move to next and periodically re-randomize one item to keep it forever fresh
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % activeFeeds.length;
        
        // Inject a newly cooked random event at current index to maintain absolute uniqueness
        if (Math.random() > 0.6) {
          const randomPrefix = Math.floor(100000 + Math.random() * 900000).toString();
          const randomSuffix = Math.floor(10 + Math.random() * 90).toString();
          const randomPack = RANDOM_PACKAGES[Math.floor(Math.random() * RANDOM_PACKAGES.length)];
          
          activeFeeds[prevIndex] = {
            id: `gen-feed-inject-${Date.now()}`,
            uid: `${randomPrefix}XX${randomSuffix}`,
            packageName: randomPack,
            timestamp: 'Just now'
          };
        }
        
        return nextIndex;
      });
    }, 3200); // 3.2 seconds rotation for better live pace

    return () => clearInterval(interval);
  }, [activeFeeds]);

  if (activeFeeds.length === 0) return null;

  const currentFeed = activeFeeds[currentIndex] || activeFeeds[0];

  const bgCol = websiteSettings?.colorLiveFeedBg || '#ffffff';
  const textColor = websiteSettings?.colorCardText || '#1e293b';
  const primaryYellow = websiteSettings?.colorBrandYellow || '#f59e0b';

  return (
    <div 
      id="live-purchase-feed" 
      style={{ backgroundColor: bgCol, borderColor: `${textColor}15` }}
      className="rounded-xl shadow-xs border py-1.5 px-3.5 w-full max-w-md mx-auto flex items-center justify-between overflow-hidden relative select-none animate-fade-in font-sans h-10.5 my-2 border-slate-100 transition-all duration-300"
    >
      {/* Left Active Blinking indicator */}
      <div className="flex items-center gap-1.5 shrink-0 select-none">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[9px] font-black tracking-wider uppercase text-emerald-600 font-mono">LIVE FEED</span>
      </div>

      {/* Carousel dynamic text */}
      <div className="flex-1 min-w-0 px-2.5 relative h-6 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFeed?.id || 'empty'}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center gap-1 w-full text-center"
          >
            <p style={{ color: textColor }} className="text-[11.5px] font-bold tracking-tight truncate leading-none">
              <span style={{ color: textColor, borderColor: `${textColor}20`, backgroundColor: `${textColor}05` }} className="font-mono font-black border px-1.5 py-0.5 rounded text-[10px] mr-1">
                UID: {currentFeed?.uid}
              </span>
              <span className="opacity-60 font-medium">bought</span>{' '}
              <span className="font-black text-blue-600 bg-blue-50/50 px-1 rounded">
                {currentFeed?.packageName}
              </span>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Secure Badge */}
      <div 
        style={{ color: primaryYellow, borderColor: `${primaryYellow}30`, backgroundColor: `${primaryYellow}10` }} 
        className="text-[9px] font-black font-mono tracking-wider shrink-0 flex items-center gap-0.5 border rounded-lg px-2 py-0.5 leading-none select-none"
      >
        <ShieldCheck style={{ color: primaryYellow }} className="h-3 w-3 shrink-0" />
        <span>PASSED</span>
      </div>
    </div>
  );
}
