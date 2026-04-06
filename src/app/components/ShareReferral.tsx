import { ArrowLeft, Copy, CheckCircle2, Share2, TrendingUp, ExternalLink, QrCode, Twitter, Facebook } from 'lucide-react';
import { useState } from 'react';
import { APP_NAME } from '../../config';

interface ShareReferralProps {
  onBack: () => void;
  user?: any;
}

export function ShareReferral({ onBack, user }: ShareReferralProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Referral code explicitly showing the underscore
  const referralCode = user?.referral_code || 'SWFT_U01_PRO'; 
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const registerUrl = `${baseUrl}/register`;
  const fullUrl = `${registerUrl}?referral_code=${referralCode}`;

  // Robust Copy Function with Fallback for Permissions Blocks
  const handleCopy = async (text: string, setter: (v: boolean) => void) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setter(true);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch (err) {
      // Fallback: Create a hidden textarea, select text, and copy
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setter(true);
      } catch (fallbackErr) {
        console.error('Fallback copy failed', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
    setTimeout(() => setter(false), 2000);
  };

  const handleShare = (platform: string) => {
    const message = `🚀 Join ${APP_NAME} & start earning daily profit! 💰\n\nRegister now:`;
    const encodedMessage = encodeURIComponent(message);
    const encodedUrl = encodeURIComponent(fullUrl);

    const platforms: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    };
    
    if (platforms[platform]) window.open(platforms[platform], '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 font-sans antialiased">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-12 space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between gap-4">
          <button onClick={onBack} className="flex items-center gap-3 group transition-colors hover:text-white">
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl group-hover:border-slate-600 transition-all active:scale-95">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-black tracking-widest text-[10px] uppercase italic hidden sm:block">Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full shadow-lg shadow-emerald-500/5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest italic">Global Node Active</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Left Column: Invitation Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 md:p-12 relative overflow-hidden flex flex-col justify-between shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[100px] -mr-32 -mt-32" />
            
            <div className="relative z-10 text-center lg:text-left mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-3xl flex items-center justify-center mx-auto lg:mx-0 mb-8 rotate-3 shadow-2xl shadow-cyan-500/20">
                <Share2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-white text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-4 leading-none">Expand<br/>Network</h2>
              <p className="text-slate-400 text-sm md:text-base max-w-sm font-medium leading-relaxed">
                Invite partners to the ecosystem and secure your <span className="text-cyan-400 font-black">17% Tiered Commission</span>.
              </p>
            </div>

            <div className="space-y-4 relative z-10">
              {/* Referral Code Box - Monospace for visible underscores */}
              <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 transition-all hover:border-slate-700 shadow-inner">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-500 text-[10px] font-black uppercase italic flex items-center gap-2">
                    <QrCode className="w-3.5 h-3.5 text-cyan-500" /> Invitation ID
                  </span>
                  {copiedCode && <span className="text-emerald-400 text-[10px] font-black animate-pulse">Copied!</span>}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    {/* font-mono used here to ensure _ is visible */}
                    <span className="block text-3xl md:text-5xl font-mono font-black tracking-tighter bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent truncate">
                      {referralCode}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleCopy(referralCode, setCopiedCode)}
                    className={`shrink-0 p-4 rounded-2xl border transition-all active:scale-90 ${copiedCode ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-900 border-slate-800 text-cyan-400 hover:border-cyan-500'}`}
                  >
                    {copiedCode ? <CheckCircle2 className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              {/* URL Box */}
              <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 transition-all hover:border-slate-700">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-slate-500 text-[10px] font-black uppercase italic flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5 text-purple-500" /> Portal Link
                  </span>
                  {copiedUrl && <span className="text-emerald-400 text-[10px] font-black animate-pulse">Link Saved</span>}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0 h-14 flex items-center bg-slate-900/50 border border-slate-800 rounded-xl px-4 overflow-hidden">
                    <span className="text-slate-400 font-mono text-[10px] md:text-xs truncate">{fullUrl}</span>
                  </div>
                  <button 
                    onClick={() => handleCopy(fullUrl, setCopiedUrl)}
                    className={`shrink-0 h-14 w-14 flex items-center justify-center rounded-xl border transition-all active:scale-90 ${copiedUrl ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-900 border-slate-800 text-purple-400 hover:border-purple-500'}`}
                  >
                    {copiedUrl ? <CheckCircle2 className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Socials & Tiers */}
          <div className="flex flex-col gap-6">
            {/* Social Sharing Grid */}
            <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-xl">
              <h3 className="text-white font-black text-[10px] uppercase tracking-[0.2em] italic mb-6">Social Broadcast</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'whatsapp', label: 'WhatsApp', color: 'bg-[#25D366]', icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' },
                  { id: 'telegram', label: 'Telegram', color: 'bg-[#0088cc]', icon: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z' },
                  { id: 'twitter', label: 'Twitter', color: 'bg-[#0F1419] border border-slate-700', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                  { id: 'facebook', label: 'Facebook', color: 'bg-[#1877F2]', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                ].map((p) => (
                  <button key={p.id} onClick={() => handleShare(p.id)} className={`${p.color} p-5 rounded-3xl flex flex-col items-center gap-3 active:scale-95 transition-all hover:brightness-110 shadow-lg shadow-black/30 overflow-hidden`}>
                    <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24"><path d={p.icon}/></svg>
                    <span className="text-white text-[9px] font-black uppercase italic tracking-widest">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Commission Engine: Tier 1, 2, and 3 */}
            <div className="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-[40px] p-8 flex-grow shadow-inner">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-emerald-400 font-black text-sm flex items-center gap-2 uppercase italic tracking-wider"><TrendingUp className="w-5 h-5"/> Revenue Tiers</h3>
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black rounded border border-emerald-500/20 uppercase">Global</span>
              </div>
              
              <div className="space-y-4">
                {[
                  { l: 'Tier 1', r: '10%', d: 'Direct Activation', c: 'from-emerald-400 to-emerald-600' },
                  { l: 'Tier 2', r: '5%', d: 'Network Partner', c: 'from-cyan-400 to-cyan-600' },
                  { l: 'Tier 3', r: '2%', d: 'Ecosystem Expansion', c: 'from-indigo-500 to-indigo-700' },
                ].map((t, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-900/40 backdrop-blur-sm rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${t.c} flex items-center justify-center text-slate-950 font-black text-sm italic shadow-inner`}>{i+1}</div>
                      <div>
                        <p className="text-white font-black text-sm uppercase italic tracking-tight">{t.l}</p>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-tight">{t.d}</p>
                      </div>
                    </div>
                    <p className="text-emerald-400 text-3xl font-black italic">{t.r}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Brand Footer */}
        <div className="pt-12 pb-6 text-center opacity-30 select-none">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] italic text-slate-500">{APP_NAME} 4.0 // Secured via AES-256 // Build 920</p>
        </div>
      </div>
    </div>
  );
}