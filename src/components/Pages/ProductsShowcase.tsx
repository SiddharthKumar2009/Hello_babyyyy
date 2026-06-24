import { useState, useEffect, CSSProperties } from 'react';
import { Product, Category, WebsiteSettings } from '../../types';
import { PackageOpen, Sparkles, ChevronLeft, Info, Star, Headphones, CheckCircle2, Zap } from 'lucide-react';

interface ProductsShowcaseProps {
  products: Product[];
  categories: Category[];
  onSelectProduct: (product: Product) => void;
  onNavigate?: (page: string) => void;
  websiteSettings?: WebsiteSettings;
}

export default function ProductsShowcase({ products, categories, onSelectProduct, onNavigate, websiteSettings }: ProductsShowcaseProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const buyNowBtnColor = websiteSettings?.colorBuyNowBtn || '#f59e0b';
  const buyNowTextColor = websiteSettings?.colorBuyNowText || '#0f172a';


  // Filter products that are actively set to available
  const availableProducts = products.filter((product) => {
    return product.status !== 'hidden';
  });

  // Automatically select the first available product on render to pre-populate the Lootbar sticky top-up bar
  useEffect(() => {
    if (availableProducts.length > 0 && !selectedProduct) {
      setSelectedProduct(availableProducts[0]);
    }
  }, [availableProducts, selectedProduct]);

  // Handle go back logic safely
  const handleGoBack = () => {
    if (onNavigate) {
      onNavigate('dashboard');
    } else {
      window.location.hash = '#/';
    }
  };

  const handleTopupNowSubmit = () => {
    if (selectedProduct) {
      onSelectProduct(selectedProduct);
    }
  };

  return (
    <div id="products-showcase" className="max-w-2xl mx-auto bg-white min-h-screen pb-32 animate-fade-in relative">
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
      
      {/* 1. TOP HEADER WITH BACK BUTTON & SERVICE TITLE MATCHING SCREENSHOT 1 */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleGoBack}
            className="p-1 hover:bg-slate-50 rounded-lg text-slate-700 transition-all active:scale-95"
            aria-label="Go back"
          >
            <ChevronLeft className="h-6 w-6 stroke-[2.5]" />
          </button>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Top-up</h2>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-mono">
          <span className="font-bold text-blue-600">EN</span>
          <span>/</span>
          <span>USD</span>
        </div>
      </div>

      {/* 2. FAST, SAFE, 24/7 TRUST BULLETS FOR THE HIGH INTENT STORE FEEL */}
      <div className="flex items-center justify-center gap-6 py-2.5 bg-slate-50/50 border-b border-slate-100/50 text-[10.5px] font-bold text-slate-500">
        <div className="flex items-center gap-1">
          <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
          <span>Fast</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 fill-emerald-100/10" />
          <span>Safe</span>
        </div>
        <div className="flex items-center gap-1">
          <Headphones className="h-3.5 w-3.5 text-sky-500" />
          <span>24/7</span>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        
        {/* 3. CORE GAME DESCRIPTION BANNER (LOOTBAR REPLICATION) */}
        <div className="flex items-start justify-between gap-3 bg-white border border-slate-100 p-3 rounded-2xl relative shadow-xs">
          
          <div className="flex gap-3">
            {/* Left game image with custom watermark */}
            <div className="h-16 w-16 relative bg-slate-100 rounded-xl overflow-hidden shadow-xs shrink-0 select-none">
              <img 
                src="https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=150" 
                alt="Free Fire cover" 
                className="h-full w-full object-cover"
              />
              {/* Little Garena watermark badge on cover */}
              <div className="absolute bottom-0 right-0 bg-red-600 text-white font-black text-[7px] px-1 py-0.5 rounded-l-md leading-none shadow-xs uppercase">
                garena
              </div>
            </div>

            {/* Middle ratings and counts */}
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900 leading-tight flex items-center gap-1.5">
                <span>Free Fire</span>
              </h3>
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Gold star box */}
                <div className="inline-flex items-center gap-0.5 bg-amber-400 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded">
                  <span>5.0</span>
                  <Star className="h-2.5 w-2.5 fill-slate-950 stroke-none" />
                </div>
                <span className="text-[11px] text-slate-400 font-medium">34,176 Reviews</span>
                <span className="text-slate-200 text-[11px]">|</span>
                <span className="text-[11px] text-slate-500 font-bold">100k+ Sold</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Epic Premium Instant Delivery</p>
            </div>
          </div>

          {/* Right Orange discount range badge */}
          <div className="shrink-0 text-right">
            <span className="text-xs font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-lg tracking-tight inline-block whitespace-nowrap">
              3~10% OFF
            </span>
          </div>

        </div>

          {/* 5. DYNAMIC PRODUCTS GRID (2 COLUMNS FIT TO MOBILE) */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Packages & Memberships</h4>
            </div>

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
                      backgroundColor: '#ffffff'
                    };

                    if (isSelected) {
                      customStyles.borderColor = buyNowBtnColor;
                      customStyles.backgroundColor = `${buyNowBtnColor}03`;
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
                        className={`rounded-[20px] p-3 transition-all flex flex-col justify-between relative cursor-pointer select-none border-2 ${
                          isSelected
                            ? 'shadow-[0_4px_16px_rgba(245,158,11,0.12)]'
                            : 'border-slate-150 hover:border-slate-350 bg-white shadow-3xs'
                        } ${cardHighlightClass}`}
                        id={`product-card-${product.id}`}
                      >
                        {/* Information "i" button on top right of image block */}
                        <button 
                          type="button"
                          title="Item Details Information"
                          className="absolute right-3.5 top-3.5 z-20 p-1 rounded-full bg-slate-900/40 hover:bg-slate-900/60 text-white backdrop-blur-xs transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Information about ${product.name}:\n\n- Original price: ₹${product.originalPrice}\n- Discount Price: ₹${product.discountPrice}\n- Instant Secure Delivery node.\n- Safe official Garena top-up.`);
                          }}
                        >
                          <Info className="h-3.5 w-3.5 stroke-[2.5]" />
                        </button>

                        {/* Image Area */}
                        <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden mb-2.5 relative flex items-center justify-center select-none">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="object-cover w-full h-full"
                            referrerPolicy="no-referrer"
                          />
                          {isSoldOut && (
                            <div className="absolute inset-0 bg-slate-900/65 flex flex-col items-center justify-center backdrop-blur-[2px] rounded-xl z-20 p-2 text-center select-none">
                              <div className="bg-red-650/90 text-white text-[9.5px] uppercase tracking-widest font-mono font-black px-2.5 py-1 rounded-md border border-red-500/20 shadow-md">
                                SOLD OUT
                              </div>
                              <span className="text-[7.5px] uppercase font-bold text-red-300 tracking-wider mt-1 animate-pulse select-none">
                                RESTOCKING SOON
                              </span>
                            </div>
                          )}
                          
                          {/* Premium Overlays */}
                          <div className="absolute top-1.5 left-1.5 z-10 flex flex-col gap-1 max-w-[85%]">
                            {isBestSeller && (
                              <div className={`text-[7.5px] font-black uppercase px-1.5 py-0.5 rounded-md tracking-wider flex items-center gap-0.5 shadow-[0_2px_8px_rgba(245,158,11,0.4)] bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 text-slate-950 border border-amber-300 select-none ${product.pulse_animation ? 'animate-pulse' : ''}`}>
                                <span>⭐</span>
                                <span className="truncate">{product.tag_text || 'BEST SELLER'}</span>
                              </div>
                            )}
                            {isHotDeal && (
                              <div className={`text-[7.5px] font-black uppercase px-1.5 py-0.5 rounded-md tracking-wider flex items-center gap-0.5 shadow-[0_2px_8px_rgba(239,68,68,0.4)] bg-gradient-to-r from-red-650 via-orange-500 to-amber-500 text-white border border-red-500 select-none ${product.pulse_animation ? 'animate-bounce' : ''}`}>
                                <span>🔥</span>
                                <span className="truncate">{product.tag_text || 'HOT DEAL'}</span>
                              </div>
                            )}
                          </div>

                          {/* Fallback overlay badge shown only if NO premium badge is active */}
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
                          <h4 className="text-[11.5px] font-black text-slate-800 line-clamp-2 leading-snug">
                            {product.name}
                          </h4>

                          <div className="space-y-0.5 pt-1">
                            {/* Row with Price and computed discount pill */}
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-sm font-extrabold text-orange-600 tracking-tight font-mono">
                                ₹{product.discountPrice}
                              </span>
                              
                              {/* Saving percentage pill */}
                              <span className="bg-orange-50 text-orange-600 font-extrabold text-[9px] px-1.5 py-0.5 rounded-lg border border-orange-100">
                                -₹{computedSavings}
                              </span>
                            </div>

                            {/* Struck-through original price underneath */}
                            <div className="text-[10px] font-bold text-slate-400 line-through font-mono">
                              ₹{product.originalPrice}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </div>

      </div>

      {/* 6. LOOTBAR EXCLUSIVE STICKY BOTTOM TOP-UP ACTION DRAWER */}
      {selectedProduct && (
        <div 
          className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-100 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] px-4 py-3 pb-4 md:pb-3 max-w-2xl mx-auto flex items-center justify-between"
          id="lootbar-sticky-bar"
        >
          {/* Left info: Savings and active selection pricing */}
          <div className="space-y-1 text-left">
            {/* Savings pill */}
            <div className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-red-100">
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
            onClick={handleTopupNowSubmit}
            style={{ 
              backgroundColor: buyNowBtnColor,
              color: buyNowTextColor
            }}
            className="hover:scale-[1.02] font-black text-xs uppercase tracking-wider px-6.5 py-3.5 rounded-xl transition-all active:scale-95 shadow-sm min-w-[140px] flex items-center justify-center cursor-pointer"
            id="lootbar-topup-now-btn"
          >
            <span style={{ color: buyNowTextColor }}>Top-up Now</span>
          </button>
        </div>
      )}

    </div>
  );
}
