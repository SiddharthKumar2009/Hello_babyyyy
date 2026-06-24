import { User, PhoneCall, Send, Mail, ShieldAlert, Globe, ExternalLink, MessageSquareText, HelpCircle } from 'lucide-react';
import { WebsiteSettings } from '../../types';
import EditableField from './EditableField';

interface ProfilePageProps {
  websiteSettings: WebsiteSettings;
  onNavigate: (page: string) => void;
  onEditField?: (fieldKey: string, label: string) => void;
}

export default function ProfilePage({ websiteSettings, onNavigate, onEditField }: ProfilePageProps) {
  const supportChannels = [
    {
      id: 'tg',
      name: 'Direct Chat Support',
      value: 'Active Support Operator',
      icon: Send,
      link: `https://t.me/${websiteSettings.supportTelegram.replace('@', '')}`,
      color: 'bg-blue-50 text-blue-600 border-blue-100'
    },
    {
      id: 'wa',
      name: 'WhatsApp Support',
      value: websiteSettings.supportWhatsapp || 'Not Configured',
      icon: PhoneCall,
      link: websiteSettings.supportWhatsapp ? `https://wa.me/${websiteSettings.supportWhatsapp.replace(/[^0-9]/g, '')}` : undefined,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    },
    {
      id: 'email',
      name: 'Official Email',
      value: websiteSettings.supportEmail,
      icon: Mail,
      link: `mailto:${websiteSettings.supportEmail}`,
      color: 'bg-purple-50 text-purple-600 border-purple-100'
    }
  ];

  return (
    <div id="profile-page" className="max-w-2xl mx-auto px-4 py-6 md:py-10 pb-24 md:pb-12 space-y-6 animate-fade-in">
      
      {/* Profile Header Avatar Banner */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs flex flex-col sm:flex-row items-center gap-4.5 text-center sm:text-left">
        <div className="h-16 w-16 rounded-2xl bg-blue-100 border-2 border-white shadow-md flex items-center justify-center text-blue-600 shrink-0">
          <User className="h-8 w-8 stroke-1.5" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50/70 px-2 py-0.5 rounded-lg border border-blue-50">
            Player Session (Local)
          </span>
          <h2 className="text-xl font-extrabold text-slate-900">
            <EditableField fieldKey="profileHeading" label="Profile Title" onEditField={onEditField}>
              <span>{websiteSettings.profileHeading || 'Gaming Dashboard Profile'}</span>
            </EditableField>
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            <EditableField fieldKey="profileBalanceText" label="Profile Subtitle" onEditField={onEditField}>
              <span>{websiteSettings.profileBalanceText || 'Anonymous client session • Secure SSL'}</span>
            </EditableField>
          </p>
        </div>
      </div>

      {/* Support Details section */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 md:p-6 shadow-xs space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <HelpCircle className="h-4.5 w-4.5 text-blue-600" />
            <span>Contact & Support Information</span>
          </h3>
          <p className="text-xs text-slate-400">Get in touch with our live order processors if you experience issues with your codes.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {supportChannels.map((channel) => {
            const Icon = channel.icon;
            return (
              <div 
                key={channel.id} 
                className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">{channel.name}</span>
                  <p className="text-xs font-mono font-bold mt-1 text-slate-800 break-all">{channel.value}</p>
                </div>
                {channel.link ? (
                  <a
                    href={channel.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 flex items-center gap-1.5 self-start transition-all"
                  >
                    <span>Connect Now</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-[10px] font-bold text-slate-300 uppercase">Offline</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Website & Delivery SLA parameters */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 md:p-6 shadow-xs space-y-4">
        <div className="space-y-1Title">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Globe className="h-4.5 w-4.5 text-blue-600" />
            <span>Website Integrity Information</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Standard operation parameters for {websiteSettings.websiteName}.</p>
        </div>

        <div className="space-y-3.5 pt-1.5 border-t border-slate-50 text-xs">
          <div className="flex justify-between py-1 border-b border-dashed border-slate-50">
            <span className="text-slate-400">Domain Authority</span>
            <span className="font-extrabold text-slate-800">Secure Client SSL</span>
          </div>
          <div className="flex justify-between py-1 border-b border-dashed border-slate-50">
            <span className="text-slate-400">Delivery SLA Guarantee</span>
            <span className="font-extrabold text-emerald-600">30 Mins Auto Verification</span>
          </div>
          <div className="flex justify-between py-1 border-b border-dashed border-slate-50">
            <span className="text-slate-400">Core Network Target</span>
            <span className="font-extrabold text-slate-800">Direct Secure API Nodes</span>
          </div>
          <div className="flex flex-col gap-1 py-1 text-left">
            <span className="text-slate-400">Store Delivery Disclaimer Notice:</span>
            <EditableField fieldKey="deliveryNotice" label="Delivery Notice" onEditField={onEditField} className="w-full text-left">
              <p className="text-slate-500 text-2xs leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {websiteSettings.deliveryNotice || 'Delivery is manual. We require matching redeem codes and order credentials.'}
              </p>
            </EditableField>
          </div>
        </div>
      </div>

      {/* Support FAQ/T&C block */}
      <div className="bg-slate-900 text-slate-100 rounded-3xl p-5 border border-slate-800 flex items-start gap-3 text-left">
        <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-xs text-slate-200">
            <EditableField fieldKey="profileNoticeText" label="Policy Header" onEditField={onEditField}>
              <span>{websiteSettings.profileNoticeText || 'No Register Policy Notice'}</span>
            </EditableField>
          </h4>
          <p className="text-[10px] text-slate-400 leading-relaxed font-sans mt-1">
            <EditableField fieldKey="profileNoticeBody" label="Policy Body Notice" onEditField={onEditField}>
              <span>{websiteSettings.profileNoticeBody || 'Epic Game Shop never stores permanent records of your transactions, passwords, or order receipts on local app databases. All inputs are processed securely to ensure maximum privacy and state safety.'}</span>
            </EditableField>
          </p>
        </div>
      </div>

    </div>
  );
}
