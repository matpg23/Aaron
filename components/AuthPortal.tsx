
import React, { useState } from 'react';
import { UserAccount } from '../types';

interface AuthPortalProps {
  onClose: () => void;
  onAuthSuccess: (user: UserAccount) => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({ onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'payment'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Mock authentication delay
    setTimeout(() => {
      const mockUser: UserAccount = {
        username: email.split('@')[0],
        email: email,
        isElite: true,
        clearanceDate: new Date().toISOString()
      };
      onAuthSuccess(mockUser);
      setIsProcessing(false);
    }, 1500);
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      const mockUser: UserAccount = {
        username: email.split('@')[0] || 'EliteAngler',
        email: email || 'pro@angler.ai',
        isElite: true,
        clearanceDate: new Date().toISOString()
      };
      onAuthSuccess(mockUser);
      setIsProcessing(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-md card-blur border border-slate-700 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900/50 p-6 border-b border-slate-800">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                {mode === 'login' ? 'Operational Login' : mode === 'signup' ? 'New Recruit' : 'Clearance Acquisition'}
              </h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Elite Strategic Network</p>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="p-6">
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">Comm ID (Email)</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none transition-all font-mono"
                  placeholder="name@domain.com"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase">Access Cipher</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none transition-all font-mono"
                  placeholder="••••••••"
                />
              </div>
              <button 
                disabled={isProcessing}
                className="w-full bg-white text-slate-950 font-black py-3 rounded uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-blue-400 hover:text-white transition-all shadow-lg"
              >
                {isProcessing ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-key"></i>}
                {isProcessing ? 'Verifying...' : 'Initiate Session'}
              </button>
              <div className="text-center">
                <button type="button" onClick={() => setMode('signup')} className="text-[10px] font-bold text-slate-500 hover:text-blue-400 uppercase tracking-widest">
                  No clearance? Apply for Elite Access
                </button>
              </div>
            </form>
          )}

          {mode === 'signup' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl space-y-3">
                <h3 className="text-xs font-black text-blue-400 uppercase">Elite Tier Benefits</h3>
                <ul className="space-y-2">
                  {[
                    'Full Tactical Map Access',
                    'Strategic Coordinates for Hotspots',
                    'Advanced Rigging Diagrams',
                    'Zero-Latency Satellite Updates'
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-[10px] text-slate-300 uppercase font-bold">
                      <i className="fas fa-check text-blue-500 text-[8px]"></i>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <div className="pt-2 border-t border-blue-500/10 flex justify-between items-center">
                  <span className="text-xs font-black text-white">$2.00 / MONTH</span>
                  <span className="text-[9px] text-slate-500 uppercase">Billed Monthly</span>
                </div>
              </div>

              <button 
                onClick={() => setMode('payment')}
                className="w-full bg-blue-600 text-white font-black py-3 rounded uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
              >
                Proceed to Secure Terminal
              </button>
              
              <div className="text-center">
                <button type="button" onClick={() => setMode('login')} className="text-[10px] font-bold text-slate-500 hover:text-blue-400 uppercase tracking-widest">
                  Already have clearance? Log In
                </button>
              </div>
            </div>
          )}

          {mode === 'payment' && (
            <form onSubmit={handlePayment} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">
                  <i className="fas fa-shield-halved text-green-500"></i>
                  SSL Secured Terminal
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Card Holder</label>
                  <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm outline-none" placeholder="FULL NAME" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Card Number</label>
                  <div className="relative">
                    <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 pl-10 text-sm outline-none font-mono" placeholder="0000 0000 0000 0000" />
                    <i className="fas fa-credit-card absolute left-3 top-1/2 -translate-y-1/2 text-slate-700"></i>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase">Expiry</label>
                    <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm outline-none font-mono" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase">CVC</label>
                    <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm outline-none font-mono" placeholder="000" />
                  </div>
                </div>
              </div>

              <button 
                disabled={isProcessing}
                className="w-full bg-green-600 text-white font-black py-4 rounded uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-green-500 transition-all shadow-lg shadow-green-600/20"
              >
                {isProcessing ? <i className="fas fa-satellite-dish animate-spin"></i> : <i className="fas fa-lock"></i>}
                {isProcessing ? 'AUTHORIZING...' : 'AUTHORIZE $2.00 PAYMENT'}
              </button>
              
              <div className="flex justify-between items-center text-[8px] text-slate-600 uppercase font-black tracking-widest">
                <span><i className="fas fa-lock"></i> AES-256</span>
                <span>PCI-DSS COMPLIANT</span>
                <span><i className="fas fa-check-circle"></i> VERIFIED</span>
              </div>
            </div>
          )}
        </div>

        {/* Security Info Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800">
          <div className="flex gap-4 items-start">
            <div className="text-blue-500 pt-1">
              <i className="fas fa-shield-virus"></i>
            </div>
            <div className="space-y-1">
              <h4 className="text-[9px] font-black text-slate-300 uppercase">Security Protocols</h4>
              <p className="text-[8px] text-slate-600 uppercase leading-tight font-mono">
                Spots and user data are encrypted via military-grade AES-256 GCM. Your location is hashed using SHA-256 and never stored in plain text. Multi-factor biometrics supported on mobile devices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
