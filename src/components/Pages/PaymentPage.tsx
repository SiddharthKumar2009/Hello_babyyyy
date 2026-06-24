import React, { useState, useRef } from 'react';
import { Product, WebsiteSettings } from '../../types';
import { ShieldCheck, ArrowRight, Loader2, UploadCloud, FileImage, Trash2, CreditCard, ArrowLeft, AlertTriangle } from 'lucide-react';
import EditableField from './EditableField';

interface PaymentPageProps {
  selectedProduct: Product;
  uid: string;
  playerName: string;
  websiteSettings?: WebsiteSettings;
  onBack: () => void;
  onSubmit: (redeemCode: string, screenshot: string | null, screenshotFile?: File | null) => void;
  loading: boolean;
  onEditField?: (fieldKey: string, label: string) => void;
}

export default function PaymentPage({ selectedProduct, uid, playerName, websiteSettings, onBack, onSubmit, loading, onEditField }: PaymentPageProps) {
  const [redeemCode, setRedeemCode] = useState('');
  const [screenshotBase64, setScreenshotBase64] = useState<string | null>(null);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Read upload and convert to base64 for persistent tracking
  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setValidationError('Please upload a valid image file (PNG, JPG).');
      return;
    }
    
    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setValidationError('Image size exceeds 5MB limit.');
      return;
    }

    setValidationError(null);
    setScreenshotFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setScreenshotBase64(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveScreenshot = () => {
    setScreenshotBase64(null);
    setScreenshotFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!redeemCode.trim()) {
      setValidationError('Please enter your Google Play Redeem Code.');
      return;
    }

    if (redeemCode.trim().length < 8) {
      setValidationError('The Google Play Redeem Code seems too short (must be at least 8 characters).');
      return;
    }

    setValidationError(null);
    onSubmit(redeemCode.trim(), screenshotBase64, screenshotFile);
  };

  return (
    <div id="payment-page" className="max-w-2xl mx-auto px-4 py-6 md:py-10 pb-24 md:pb-12 space-y-6 animate-fade-in">
      
      {/* Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-150 p-4 shadow-3xs">
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
          <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-black font-mono transition-all duration-300 bg-amber-400 text-slate-900 border-2 border-amber-400 shadow-sm scale-110">
            2
          </div>

          {/* Connection Dots */}
          <div className="flex gap-0.5 px-2 font-black text-slate-200 text-sm tracking-widest">
            <span>...</span><span>...</span><span>...</span>
          </div>

          {/* Step 3 */}
          <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-black font-mono transition-all duration-300 bg-slate-100 text-slate-400 border-2 border-slate-200">
            3
          </div>
        </div>
      </div>

      {/* Verified Invoice Overview Receipt */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-16 w-16 bg-blue-50 rounded-bl-3xl flex items-center justify-center text-blue-600 select-none">
          <CreditCard className="h-6 w-6 stroke-[1.5px]" />
        </div>

        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Order Summary Receipt</h3>
        
        <div className="space-y-3 pt-2">
          {/* Item details */}
          <div className="flex justify-between items-start border-b border-dashed border-slate-100 pb-3">
            <div>
              <span className="text-xs text-slate-400 font-mono">Product Name</span>
              <p className="text-sm font-extrabold text-slate-900 mt-1">{selectedProduct.name}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-mono">Total Due</span>
              <p className="text-sm font-black text-blue-600 mt-1 font-mono">₹{selectedProduct.discountPrice}</p>
            </div>
          </div>

          {/* Player details */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <span className="text-xs text-slate-400 font-mono">Verified Nickname</span>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5 font-mono">{playerName}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-mono">Character UID</span>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5 font-mono tracking-wider">{uid}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment details inputs */}
      <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl border border-slate-100 p-5 md:p-6 shadow-xs space-y-6">
        
        {/* Bilingual Mandatory Redeem Code Instruction Banner */}
        <div id="mandatory-payment-warning" className="bg-red-50 border border-red-200/80 rounded-2xl p-4.5 space-y-2.5 text-left">
          <div className="flex items-center gap-2 text-red-700 font-extrabold text-sm">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
            <span>MANDATORY BILLING WARNING / अनिवार्य भुगतान निर्देश</span>
          </div>
          <div className="text-xs space-y-1.5 text-red-950 font-bold leading-relaxed">
            <p className="text-red-900 font-sans">
              ⚠ <span className="underline">Payment accepted via redeem code only</span>.{" "}
              <EditableField fieldKey="paymentNoticeEn" label="Notice English" onEditField={onEditField}>
                <span>{websiteSettings?.paymentNoticeEn || 'You must enter your Google Play redeem code and submit screenshot proof! It is mandatory to initiate your order.'}</span>
              </EditableField>
            </p>
            <p className="text-red-950 pt-0.5 border-t border-red-200/50 font-sans">
              ⚠ <span className="underline">पेमेंट केवल रिडीम कोड से ही स्वीकार की जाएगी</span>।{" "}
              <EditableField fieldKey="paymentNoticeHi" label="Notice Hindi" onEditField={onEditField}>
                <span>{websiteSettings?.paymentNoticeHi || 'कृपया अपना असली रिडीम कोड और स्क्रीनशॉट प्रूफ यहाँ ज़रूर दर्ज करें, इसी से भुगतान स्वीकार और कन्फर्म किया जाएगा!'}</span>
              </EditableField>
            </p>
          </div>
        </div>

        <div className="space-y-1 text-left">
          <h3 className="text-base font-extrabold text-slate-900">
            <EditableField fieldKey="paymentTitleText" label="Payment Title" onEditField={onEditField}>
              <span>{websiteSettings?.paymentTitleText || 'Redemption Submission'}</span>
            </EditableField>
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            <EditableField fieldKey="paymentSubtext" label="Payment Subtext" onEditField={onEditField}>
              <span>{websiteSettings?.paymentSubtext || 'Please enter your pre-purchased Google Play Redeem Code with equivalent or higher value.'}</span>
            </EditableField>{" "}
            (₹{selectedProduct.discountPrice}).
          </p>
        </div>

        {/* Google Play Redeem Code Field */}
        <div className="space-y-2 text-left">
          <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Google Play Redeem Code</label>
          <EditableField fieldKey="paymentPlaceholder" label="Code Placeholder" onEditField={onEditField} className="w-full">
            <input
              type="text"
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value)}
              placeholder={websiteSettings?.paymentPlaceholder || 'ABCD-EFGH-IJKL-MNOP'}
              disabled={loading || !!onEditField}
              readOnly={!!onEditField}
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-2xl px-4 py-3.5 text-sm font-mono tracking-wider font-bold text-slate-900 placeholder:text-slate-400 transition-all focus:outline-hidden uppercase cursor-pointer"
              id="redeem-code-input"
            />
          </EditableField>
        </div>

        {/* Drag-and-drop Image Upload Option (Usability Pattern implementation) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 tracking-wide uppercase">Payment Screenshot (Optional)</label>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">Max size 5MB</span>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && e.target.files[0] && handleFileChange(e.target.files[0])}
            accept="image/*"
            className="hidden"
            id="screenshot-input-file"
          />

          {!screenshotBase64 ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group ${
                dragOver 
                  ? 'border-blue-500 bg-blue-50/40' 
                  : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/50'
              }`}
              id="file-dropzone"
            >
              <div className="bg-blue-50 text-blue-600 rounded-2xl p-3 mb-3 group-hover:scale-105 transition-transform duration-200">
                <UploadCloud className="h-6 w-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">Drag & drop or Click to upload screenshot</h4>
              <p className="text-[10px] text-slate-400 mt-1 max-w-xs font-medium">PNG, JPG formats supported. Best used to verify double-payments.</p>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center justify-between gap-3 animate-scale-up" id="uploaded-file-indicator">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-14 w-14 rounded-xl overflow-hidden shrink-0 border border-slate-200 relative bg-white">
                  <img src={screenshotBase64} alt="Upload cover preview" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-slate-800 truncate">{screenshotFile?.name || 'receipt_screenshot.png'}</h5>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Size: {((screenshotFile?.size || 0) / 1024).toFixed(1)} KB (Image Verified)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveScreenshot}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                id="remove-screenshot-btn"
              >
                <Trash2 className="h-4.5 w-4.5" />
              </button>
            </div>
          )}
        </div>

        {validationError && (
          <div className="bg-red-50 text-red-600 rounded-xl p-3.5 text-xs font-semibold flex items-center gap-2 border border-red-100">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Actions panel Buttons */}
        <div className="pt-3 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="text-slate-500 hover:text-slate-800 font-bold text-xs uppercase tracking-wider px-4 py-2 hover:bg-slate-50 rounded-xl transition-all flex items-center gap-1 bg-white border border-slate-150 shadow-xs"
            id="payment-back-btn"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            disabled={loading || (!onEditField && !redeemCode.trim())}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs tracking-wider uppercase px-7 py-3 flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            id="payment-submit-btn"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Submitting to Telegram...</span>
              </>
            ) : (
              <>
                <EditableField fieldKey="paymentSubmitLabel" label="Submit Button text" onEditField={onEditField}>
                  <span>{websiteSettings?.paymentSubmitLabel || 'Submit Order'}</span>
                </EditableField>
                <ShieldCheck className="h-4.5 w-4.5" />
              </>
            )}
          </button>
        </div>
      </form>

    </div>
  );
}
