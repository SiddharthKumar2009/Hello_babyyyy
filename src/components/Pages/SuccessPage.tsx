import { CheckCircle2, ChevronRight, ShoppingCart, MessageCircle, Copy, Check } from 'lucide-react';
import { Product, WebsiteSettings } from '../../types';
import { useState } from 'react';
import EditableField from './EditableField';

interface SuccessPageProps {
  selectedProduct: Product | null;
  uid: string;
  playerName: string;
  redeemCode: string;
  supportTelegram: string;
  websiteSettings?: WebsiteSettings;
  onGoHome: () => void;
  onEditField?: (fieldKey: string, label: string) => void;
}

export default function SuccessPage({ selectedProduct, uid, playerName, redeemCode, supportTelegram, websiteSettings, onGoHome, onEditField }: SuccessPageProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const triggerCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 1800);
    }).catch(() => {
      // Robust browser legacy element fallback selection
      const node = document.createElement('textarea');
      node.value = text;
      node.style.position = 'fixed';
      document.body.appendChild(node);
      node.focus();
      node.select();
      try {
        document.execCommand('copy');
        setCopiedType(type);
        setTimeout(() => setCopiedType(null), 1800);
      } catch (err) {
        console.error('Legacy fallback copy copy failed', err);
      }
      document.body.removeChild(node);
    });
  };

  return (
    <div id="success-page" className="max-w-xl mx-auto px-4 py-8 pb-24 md:pb-12 text-center animate-scale-up space-y-6">
      
      {/* Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-150 p-4 shadow-3xs max-w-md mx-auto">
        <div className="flex items-center justify-center gap-1.5 max-w-xs mx-auto py-1 select-none">
          {/* Step 1 */}
          <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-black font-mono transition-all duration-300 bg-amber-400 text-slate-900 border-2 border-amber-400 shadow-sm">
            1
          </div>
          
          {/* Connection Dots */}
          <div className="flex gap-0.5 px-2 font-black text-amber-400 text-sm tracking-widest">
            <span>...</span><span>...</span><span>...</span>
          </div>

          {/* Step 2 */}
          <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-black font-mono transition-all duration-300 bg-amber-400 text-slate-900 border-2 border-amber-400 shadow-sm">
            2
          </div>

          {/* Connection Dots */}
          <div className="flex gap-0.5 px-2 font-black text-amber-400 text-sm tracking-widest">
            <span>...</span><span>...</span><span>...</span>
          </div>

          {/* Step 3 */}
          <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-black font-mono transition-all duration-300 bg-amber-400 text-slate-900 border-2 border-amber-400 shadow-sm scale-110">
            3
          </div>
        </div>
      </div>

      {/* Big Animated Success Badge */}
      <div className="mx-auto bg-emerald-50 text-emerald-500 rounded-full h-20 w-20 flex items-center justify-center shadow-lg shadow-emerald-100 border border-emerald-100/30 animate-bounce">
        <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
      </div>

      <div className="space-y-2 text-center">
        <span className="text-2xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-widest font-mono">
          Order Transmitted
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight block">
          <EditableField fieldKey="successHeadline" label="Success Headline" onEditField={onEditField}>
            <span>{websiteSettings?.successHeadline || 'Order Submitted Successfully'}</span>
          </EditableField>
        </h2>
        <p className="text-xs md:text-sm text-slate-500 max-w-md mx-auto leading-relaxed block">
          <EditableField fieldKey="successSubtext" label="Success Subtext" onEditField={onEditField}>
            <span>{websiteSettings?.successSubtext || 'Your UID is verified and your Google Play Redeem code has been sent directly to Secure Delivery.'}</span>
          </EditableField>
        </p>
      </div>

      {/* order specification summary receipt */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 md:p-6 text-left shadow-xs space-y-4">
        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
          <ShoppingCart className="h-3.5 w-3.5 text-blue-600" />
          <span>Ticket Specifications</span>
        </h4>

        <div className="space-y-2.5 font-mono text-xs text-slate-600 border-b border-slate-50 pb-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Package item:</span>
            <span className="font-extrabold text-slate-900">{selectedProduct?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Paid amount:</span>
            <span className="font-extrabold text-blue-600">₹{selectedProduct?.discountPrice}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-slate-400">Character UID:</span>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 hover:bg-stone-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer select-none" onClick={() => triggerCopy(uid, 'uid')} title="Copy Character UID">
              <span className="font-extrabold text-slate-900">{uid}</span>
              {copiedType === 'uid' ? (
                <Check className="h-3.5 w-3.5 text-emerald-600 animate-scale-up" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-slate-400" />
              )}
            </div>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-slate-400">Player name:</span>
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 hover:bg-stone-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer select-none" onClick={() => triggerCopy(playerName, 'name')} title="Copy Player name">
              <span className="font-extrabold text-slate-900">{playerName}</span>
              {copiedType === 'name' ? (
                <Check className="h-3.5 w-3.5 text-emerald-600 animate-scale-up" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-slate-400" />
              )}
            </div>
          </div>
          <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg mt-1 border border-slate-100">
            <span className="text-slate-400 text-2xs">Redeem Code:</span>
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-xl transition-colors cursor-pointer select-none shadow-3xs" onClick={() => triggerCopy(redeemCode, 'redeem')} title="Copy Redeem code">
              <span className="font-extrabold text-slate-800 text-2xs tracking-wider uppercase truncate max-w-[180px]">
                {redeemCode}
              </span>
              {copiedType === 'redeem' ? (
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              )}
            </div>
          </div>
        </div>

        {/* Secure specific status notice */}
        <div className="space-y-3 pt-1">
          <div className="flex items-start gap-2.5 bg-blue-50/50 p-3 rounded-2xl border border-blue-100/50">
            <MessageCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <h5 className="font-bold text-slate-900">Secure Dispatch Notification Sent</h5>
              <p className="text-slate-500 mt-0.5 leading-normal">
                Our operator is validating your redeem code now. Top-up diamonds will be sent to your player mailbox within 30 minutes.
              </p>
            </div>
          </div>

          <div className="text-2xs text-center text-slate-400 font-mono italic">
            Please wait for manual processing to be completed.
          </div>
        </div>
      </div>

      {/* Go Back button */}
      <div>
        <button
          onClick={onGoHome}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-2xl transition-all shadow-md active:scale-95"
          id="success-gohome-btn"
        >
          Return to Dashboard
        </button>
      </div>

    </div>
  );
}
