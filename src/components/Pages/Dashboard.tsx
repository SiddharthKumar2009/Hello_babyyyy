import { useState, useEffect, CSSProperties } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Headphones, 
  Star, 
  Info, 
  PackageOpen,
  ChevronDown,
  Gift
} from 'lucide-react';
import { Product, Category, WebsiteSettings } from '../../types';
import LivePurchaseFeed from '../LivePurchaseFeed';
import EditableField from './EditableField';

interface DashboardProps {
  products: Product[];
  categories: Category[];
  feeds: any[];
  onSelectProduct: (product: Product) => void;
  onNavigate: (page: string) => void;
  websiteSettings: WebsiteSettings;
  onEditField?: (fieldKey: string, label: string) => void;
}

export default function Dashboard({ products, categories, feeds, onSelectProduct, onNavigate, websiteSettings, onEditField }: DashboardProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products that are actively set to available
  const availableProducts = products.filter((product) => {
    return product.status !== 'hidden';
  });

  // Automatically select the first available product on render to pre-populate the top-up bar
  useEffect(() => {
    if (availableProducts.length > 0 && !selectedProduct) {
      setSelectedProduct(availableProducts[0]);
    }
  }, [availableProducts, selectedProduct]);

  const handleTopupNowSubmit = (prodOverride?: Product) => {
    const targetProduct = prodOverride || selectedProduct;
    if (targetProduct) {
      onSelectProduct(targetProduct);
    }
  };

  // Customizable properties with fallback values
  const tagline = websiteSettings.tagline || 'Cheap Diamond Topup';
  
  const trustText1 = websiteSettings.trustText1 || '⚡ Fast';
  const trustText2 = websiteSettings.trustText2 || '🛡 Secure';
  const trustText3 = websiteSettings.trustText3 || '🎧 Support';

  const featuredGameImage = websiteSettings.featuredGameImage || 'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=600';
  const featuredGameBgImage = websiteSettings.featuredGameBgImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800';
  const featuredGameName = websiteSettings.featuredGameName || 'FREE FIRE';
  const featuredGameRating = websiteSettings.featuredGameRating || '5.0';
  const featuredGameSold = websiteSettings.featuredGameSold || '12k+ Sold';
  const featuredGameDiscount = websiteSettings.featuredGameDiscount || '3-10% OFF';
  const featuredGameSubtext = websiteSettings.featuredGameSubtext || 'Instant UID Delivery • safe & authorized top-up';

  const browseTitle = websiteSettings.browseTitle || 'Packages & Membership';

  // Customizable colors
  const primaryYellow = websiteSettings.colorBrandYellow || '#f59e0b';
  const primaryYellowHover = websiteSettings.colorBrandYellowHover || '#d97706';
  const cardTextColor = websiteSettings.colorCardText || '#101827';
  const buyNowBtnColor = websiteSettings.colorBuyNowBtn || primaryYellow;
  const buyNowTextColor = websiteSettings.colorBuyNowText || '#0f172a';

  return (
    <div 
      id="dashboard-page" 
      style={{ backgroundColor: websiteSettings.colorWebsiteBg || '#ffffff' }}
      className="max-w-2xl mx-auto min-h-screen pb-32 animate-fade-in relative transition-all duration-300"
    >
      <style>{`
        @keyframes shine-sweep {
          0% { transform: translateX(-150%) skewX(-25deg); }
          40% { transform: translateX(150%) skewX(-25deg); }
          100% { transform: translateX(150%) skewX(-25deg); }
        }
        @keyframes float-breathing {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes fire-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.45); }
          50% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.7); }
        }
        @keyframes gold-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(245, 158, 11, 0.45); }
          50% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.7); }
        }
        .animate-shine-sweep {
          position: relative;
          overflow: hidden;
        }
        .animate-shine-sweep::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 200%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.35) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: translateX(-150%) skewX(-25deg);
          animation: shine-sweep 3s infinite ease-in-out;
          pointer-events: none;
          z-index: 5;
        }
        .animate-float-card {
          animation: float-breathing 2.8s infinite ease-in-out;
        }
        .glow-gold-card {
          animation: gold-glow 2.5s infinite ease-in-out;
        }
        .glow-fire-card {
          animation: fire-glow 2.5s infinite ease-in-out;
        }
      `}</style>
      
      {/* 1. LIVE PURCHASE FEED - Annoucement ke niche (Below announcement bar) */}
      <div className="px-4 pt-4 pb-1 max-w-md mx-auto">
        <LivePurchaseFeed feeds={feeds} websiteSettings={websiteSettings} />
      </div>

      {/* 2. TRUST INDICATORS - Center Layout row */}
      <div className="flex items-center justify-center gap-7 py-3 bg-slate-50/70 border-y border-slate-100 text-xs font-bold text-slate-500 mt-3 select-none">
        <div className="flex items-center gap-1">
          <Zap className="h-4 w-4 text-amber-500 fill-amber-400" />
          <EditableField fieldKey="trustText1" label="Trust Badge 1" onEditField={onEditField}>
            <span>{trustText1}</span>
          </EditableField>
        </div>
        <div className="flex items-center gap-1">
          <ShieldCheck className="h-4 w-4 text-emerald-500 fill-emerald-100/10" />
          <EditableField fieldKey="trustText2" label="Trust Badge 2" onEditField={onEditField}>
            <span>{trustText2}</span>
          </EditableField>
        </div>
        <div className="flex items-center gap-1">
          <Headphones className="h-4 w-4 text-sky-500" />
          <EditableField fieldKey="trustText3" label="Trust Badge 3" onEditField={onEditField}>
            <span>{trustText3}</span>
          </EditableField>
        </div>
      </div>

      <div className="px-4 py-4 space-y-5">
        
        {/* 3. FEATURED GAME CARD - Rounded Premium Card with customizable info */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-850 text-white rounded-3xl p-4.5 relative shadow-md overflow-hidden select-none">
          {/* Faded Background graphic overlay */}
          <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" style={{ backgroundImage: `url('${featuredGameBgImage}')` }}></div>
          
          <div className="relative flex items-center justify-between gap-4 z-10">
            <div className="flex items-center gap-4">
              {/* Premium image wrapper */}
              <div className="h-20 w-20 relative bg-slate-800 rounded-2xl overflow-hidden border border-white/10 shadow-lg shrink-0 cursor-pointer" onClick={(e) => { if (onEditField) { e.stopPropagation(); onEditField('featuredGameImage', 'Featured Game Cover Image'); } }}>
                <img 
                  src={featuredGameImage} 
                  alt="Game Logo cover" 
                  className="h-full w-full object-cover"
                />
                <div 
                  style={{ backgroundColor: primaryYellowHover }}
                  className="absolute bottom-0 inset-x-0 text-slate-950 font-black text-[7px] text-center py-0.5 uppercase tracking-wider"
                >
                  Garena
                </div>
              </div>

              {/* Game details */}
              <div className="space-y-1">
                <h3 className="text-lg font-black tracking-tight leading-none text-white font-sans uppercase">
                  <EditableField fieldKey="featuredGameName" label="Featured Game Title" onEditField={onEditField}>
                    <span>{featuredGameName}</span>
                  </EditableField>
                </h3>
                
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Rating box */}
                  <EditableField fieldKey="featuredGameRating" label="Rating" onEditField={onEditField}>
                    <div 
                      style={{ backgroundColor: primaryYellow }}
                      className="inline-flex items-center gap-0.5 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded-md"
                    >
                      <span>{featuredGameRating}</span>
                      <Star className="h-2.5 w-2.5 fill-slate-950 stroke-none" />
                    </div>
                  </EditableField>
                  
                  <EditableField fieldKey="featuredGameSold" label="SoldCount Badge" onEditField={onEditField}>
                    <span className="text-xs text-slate-300 font-bold">{featuredGameSold}</span>
                  </EditableField>
                </div>
                
                <EditableField fieldKey="featuredGameSubtext" label="Featured Instructions" onEditField={onEditField} className="block">
                  <p className="text-[10px] text-slate-400 font-bold tracking-tight">{featuredGameSubtext}</p>
                </EditableField>
              </div>
            </div>

            {/* Discount Badge */}
            <div className="shrink-0">
              <EditableField fieldKey="featuredGameDiscount" label="Featured Discount badge" onEditField={onEditField}>
                <span 
                  style={{ backgroundColor: primaryYellowHover, color: '#ffffff' }}
                  className="text-xs font-black bg-red-500 rounded-xl px-2.5 py-1.5 shadow-sm inline-block tracking-tight uppercase border border-white/10 animate-pulse"
                >
                  {featuredGameDiscount}
                </span>
              </EditableField>
            </div>
          </div>
        </div>

        {/* 4. BROWSE PRODUCTS HEADER - Packages & Membership */}
        <div className="space-y-4" id="browse-products-section">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 
              style={{ color: cardTextColor }}
              className="text-sm font-black tracking-tight"
            >
              <EditableField fieldKey="browseTitle" label="Grid Title" onEditField={onEditField}>
                <span>{browseTitle}</span>
              </EditableField>
            </h4>
          </div>

          {/* DYNAMIC PRODUCTS GRID (2 COLUMNS FIT TO MOBILE) */}
          {availableProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-slate-50 rounded-2xl border border-slate-150">
              <PackageOpen className="h-10 w-10 text-slate-400 stroke-1" />
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800">No Packages Published</h4>
                <p className="text-xs text-slate-400 max-w-xs">There are no top-up packages available in the database.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3" id="products-grid">
              {(() => {
                const sortedProducts = [...availableProducts].sort((a, b) => {
                  const pinA = a.pin_to_top ? 1 : 0;
                  const pinB = b.pin_to_top ? 1 : 0;
                  if (pinA !== pinB) return pinB - pinA;

                  const getPromoWeight = (p: Product) => {
                    if (p.is_best_seller && p.is_hot_deal) return 3;
                    if (p.is_best_seller) return 2;
                    if (p.is_hot_deal) return 1;
                    return 0;
                  };
                  const weightA = getPromoWeight(a);
                  const weightB = getPromoWeight(b);
                  if (weightA !== weightB) return weightB - weightA;

                  const prioA = a.priority ?? 0;
                  const prioB = b.priority ?? 0;
                  if (prioA !== prioB) return prioB - prioA;

                  return a.id.localeCompare(b.id);
                });

                return sortedProducts.map((product) => {
                  const isSelected = selectedProduct?.id === product.id;
                  const isSoldOut = product.status === 'sold_out';
                  const computedSavings = product.originalPrice - product.discountPrice;

                  const isBestSeller = product.is_best_seller;
                  const isHotDeal = product.is_hot_deal;

                  // Build premium animation and class states
                  let cardHighlightClass = '';
                  let customStyles: CSSProperties = {
                    backgroundColor: websiteSettings.colorProductCardBg || '#ffffff'
                  };

                  if (isSelected) {
                    customStyles.borderColor = primaryYellow;
                  }

                  if (isBestSeller && product.pulse_animation) {
                    cardHighlightClass += ' animate-shine-sweep';
                  }
                  if (isHotDeal && product.pulse_animation) {
                    cardHighlightClass += ' animate-float-card';
                  }

                  if (isBestSeller && product.glow_animation) {
                    cardHighlightClass += ' glow-gold-card';
                    customStyles.borderColor = '#fbbf24';
                  } else if (isHotDeal && product.glow_animation) {
                    cardHighlightClass += ' glow-fire-card';
                    customStyles.borderColor = '#f97316';
                  }

                  return (
                    <div
                      key={product.id}
                      onClick={() => !isSoldOut && setSelectedProduct(product)}
                      style={customStyles}
                      className={`rounded-[20px] p-3 transition-all flex flex-col justify-between relative cursor-pointer select-none border-2 shadow-3xs ${
                        isSelected
                          ? 'shadow-[0_4px_16px_rgba(245,158,11,0.12)]'
                          : 'border-slate-150 hover:border-slate-350'
                      } ${cardHighlightClass}`}
                      id={`product-card-${product.id}`}
                    >
                      {/* Information icon on top right overlay */}
                      <button 
                        type="button"
                        title="Item Details Information"
                        className="absolute right-3 top-3 z-20 p-1 rounded-full bg-slate-900/40 hover:bg-slate-900/60 text-white backdrop-blur-xs transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Information: ${product.name}\n\n- Regular Price: ₹${product.originalPrice}\n- Limited Deal Price: ₹${product.discountPrice}\n- Status: Instant Processing\n- Secure Garena Direct API delivery.`);
                        }}
                      >
                        <Info className="h-3 w-3 stroke-[2.5]" />
                      </button>

                      {/* Product Image Area */}
                      <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden mb-2.5 relative flex items-center justify-center select-none">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="object-cover w-full h-full"
                          referrerPolicy="no-referrer"
                        />
                        {isSoldOut && (
                          <div className="absolute inset-0 bg-slate-900/65 flex flex-col items-center justify-center backdrop-blur-[2px] rounded-xl z-20 p-2 text-center select-none">
                            <div className="bg-red-600/90 text-white text-[9px] uppercase tracking-widest font-mono font-black px-2.5 py-1 rounded-md border border-red-500/20 shadow-md">
                              SOLD OUT
                            </div>
                            <span className="text-[7.5px] uppercase font-bold text-red-300 tracking-wider mt-1 animate-pulse select-none">
                              RESTOCKING SOON
                            </span>
                          </div>
                        )}
                        
                        {/* Premium Stackable Overlays */}
                        <div className="absolute top-1.5 left-1.5 z-10 flex flex-col gap-1 max-w-[85%]">
                          {isBestSeller && (
                            <div className={`text-[7.5px] font-black uppercase px-1.5 py-0.5 rounded-md tracking-wider flex items-center gap-0.5 shadow-[0_2px_8px_rgba(245,158,11,0.4)] bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 text-slate-950 border border-amber-300 select-none ${product.pulse_animation ? 'animate-pulse' : ''}`}>
                              <span>⭐</span>
                              <span className="truncate">{product.tag_text || 'BEST SELLER'}</span>
                            </div>
                          )}
                          {isHotDeal && (
                            <div className={`text-[7.5px] font-black uppercase px-1.5 py-0.5 rounded-md tracking-wider flex items-center gap-0.5 shadow-[0_2px_8px_rgba(239,68,68,0.4)] bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white border border-red-500 select-none ${product.pulse_animation ? 'animate-bounce' : ''}`}>
                              <span>🔥</span>
                              <span className="truncate">{product.tag_text || 'HOT DEAL'}</span>
                            </div>
                          )}
                        </div>

                        {/* Fallback badges shown only if NO premium badge is active */}
                        {!isBestSeller && !isHotDeal && product.badge && (
                          <div className={`absolute bottom-1.5 left-1.5 z-10 text-[8.5px] font-black uppercase px-2 py-0.5 rounded-md tracking-wide flex items-center gap-1 shadow-sm leading-none ${
                            product.badge.toLowerCase().includes('hot') || product.badge.toLowerCase().includes('sale')
                            ? 'bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white animate-pulse border border-red-400 scale-102 font-serif' 
                            : 'bg-slate-950/80 backdrop-blur-xs text-white'
                          }`}>
                            {(product.badge.toLowerCase().includes('hot') || product.badge.toLowerCase().includes('sale')) && (
                              <span className="animate-bounce">🔥</span>
                            )}
                            <span>{product.badge}</span>
                          </div>
                        )}
                      </div>

                      {/* Metadata Content area */}
                      <div className="space-y-2 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h4 
                            style={{ color: cardTextColor }}
                            className="text-[12px] font-black line-clamp-2 leading-snug font-sans"
                          >
                            {product.name}
                          </h4>
                          
                          {/* Price Area */}
                          <div className="flex items-center justify-between gap-1 pt-1">
                            <span className="text-sm font-extrabold text-orange-600 tracking-tight font-mono">
                              ₹{product.discountPrice}
                            </span>
                            
                            {/* Discount percent or savings value */}
                            <span className="bg-orange-50 text-orange-600 font-extrabold text-[9px] px-1.5 py-0.5 rounded-lg border border-orange-100 font-mono">
                              -₹{computedSavings}
                            </span>
                          </div>

                          {/* Slash price */}
                          <div className="text-[10px] font-bold text-slate-400 line-through font-mono">
                            ₹{product.originalPrice}
                          </div>
                        </div>

                        {/* BUY NOW Button per Product Card specification */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isSoldOut) {
                              setSelectedProduct(product);
                              handleTopupNowSubmit(product);
                            }
                          }}
                          disabled={isSoldOut}
                          style={{
                            backgroundColor: isSoldOut 
                              ? undefined
                              : isSelected 
                                ? buyNowBtnColor 
                                : '#0f172a',
                            color: isSelected ? buyNowTextColor : '#ffffff'
                          }}
                          className={`w-full mt-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider select-none transition-all active:scale-95 ${
                            isSoldOut
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'hover:opacity-90'
                          }`}
                        >
                          BUY NOW
                        </button>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}
        </div>

      </div>

      {/* 5. LOOTBAR EXCLUSIVE STICKY BOTTOM TOP-UP ACTION DRAWER */}
      {selectedProduct && (
        <div 
          className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-150 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] px-4 py-3 pb-4 md:pb-3 max-w-2xl mx-auto flex items-center justify-between animate-fade-in"
          id="lootbar-sticky-bar"
        >
          {/* Left info: Savings and active selection pricing */}
          <div className="space-y-1 text-left">
            {/* Savings pill */}
            <div className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-red-100 font-mono">
              <span>Savings ₹{selectedProduct.originalPrice - selectedProduct.discountPrice}</span>
              <span>&gt;</span>
            </div>
            {/* Big price display */}
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-orange-600 font-mono">₹{selectedProduct.discountPrice}</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase font-mono">INR</span>
            </div>
          </div>

          {/* Right Action: Huge Yellow button matching Screenshot 1 */}
          <button
            type="button"
            onClick={() => handleTopupNowSubmit()}
            style={{ 
              backgroundColor: buyNowBtnColor,
              color: buyNowTextColor
            }}
            className="hover:scale-[1.02] font-black text-xs uppercase tracking-wider px-6.5 py-3.5 rounded-xl transition-all active:scale-95 shadow-sm min-w-[140px] flex items-center justify-center cursor-pointer"
            id="lootbar-topup-now-btn"
          >
            <Gift className="h-4 w-4 mr-1.5 stroke-[2.5]" style={{ color: buyNowTextColor }} />
            <span style={{ color: buyNowTextColor }}>Top-up Now</span>
          </button>
        </div>
      )}

    </div>
  );
}
