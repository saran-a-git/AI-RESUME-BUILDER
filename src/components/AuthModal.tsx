import React, { useState } from 'react';
import { Mail, Shield, Check, Globe, RefreshCw, Star } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (email: string) => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess, addToast }) => {
  const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState<string>('saran8248850@gmail.com');
  const [password, setPassword] = useState<string>('********');
  const [fullname, setFullname] = useState<string>('Saran');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      addToast('Please enter a valid email.', 'error');
      return;
    }

    setIsLoading(true);
    addToast('Contacting secure credential nodes...', 'info');

    setTimeout(() => {
      setIsLoading(false);
      onSuccess(email.trim());
      addToast(`Logged in successfully as ${email}!`, 'success');
      onClose();
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    addToast('Initializing Google Sign-In gateway popup...', 'info');
    
    setTimeout(() => {
      setIsLoading(false);
      onSuccess('saran8248850@gmail.com');
      addToast('Authenticated with Google successfully!', 'success');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-100 dark:border-white/10 max-w-sm w-full p-6 space-y-5 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white text-lg font-bold cursor-pointer"
        >
          &times;
        </button>

        {/* Brand header */}
        <div className="text-center space-y-1 pt-2">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-white/10 text-white font-extrabold flex items-center justify-center mx-auto text-sm shadow">
            RA
          </div>
          <h3 className="text-md font-extrabold text-slate-800 dark:text-white">ResumeAI Pro</h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">Secure Gate Access</p>
        </div>

        {/* 1. LOGIN MODE */}
        {authView === 'login' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3.5">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border dark:border-white/10 rounded-lg text-xs focus:outline-none"
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Password</label>
                  <button 
                    type="button"
                    onClick={() => setAuthView('forgot')}
                    className="text-[10px] font-bold text-indigo-600 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    Forgot?
                  </button>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border dark:border-white/10 rounded-lg text-xs focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-slate-900 dark:bg-cyan-500 hover:bg-slate-800 dark:hover:bg-cyan-400 text-white dark:text-black font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow cursor-pointer"
            >
              {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-white dark:text-black" />}
              Sign In to Account
            </button>

            {/* Google Sign in Option */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-100 dark:border-white/10" />
              <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">or continue with</span>
              <div className="flex-grow border-t border-slate-100 dark:border-white/10" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-2 px-4 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              Sign in with Google
            </button>

            <div className="text-center pt-2">
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Don't have an account? <button type="button" onClick={() => setAuthView('signup')} className="font-bold text-indigo-600 dark:text-cyan-400 hover:underline cursor-pointer">Sign Up</button></p>
            </div>
          </form>
        )}

        {/* 2. SIGNUP MODE */}
        {authView === 'signup' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3.5">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Full Name</label>
                <input 
                  type="text" 
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="e.g. Saran"
                  className="w-full mt-1 px-3 py-2 border dark:border-white/10 rounded-lg text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border dark:border-white/10 rounded-lg text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Create Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border dark:border-white/10 rounded-lg text-xs"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-600 dark:bg-cyan-500 hover:bg-indigo-700 dark:hover:bg-cyan-400 text-white dark:text-black font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow cursor-pointer"
            >
              {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-white dark:text-black" />}
              Create Professional Account
            </button>

            <div className="text-center pt-2">
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Already registered? <button type="button" onClick={() => setAuthView('login')} className="font-bold text-indigo-600 dark:text-cyan-400 hover:underline cursor-pointer">Login</button></p>
            </div>
          </form>
        )}

        {/* 3. FORGOT PASSWORD MODE */}
        {authView === 'forgot' && (
          <form onSubmit={(e) => { e.preventDefault(); addToast('Recovery email mock sent successfully!', 'success'); setAuthView('login'); }} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Reset Password Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-3 py-2 border dark:border-white/10 rounded-lg text-xs animate-pulse"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 dark:bg-cyan-500 hover:bg-slate-800 dark:hover:bg-cyan-400 text-white dark:text-black font-bold rounded-xl text-xs transition flex items-center justify-center gap-1 cursor-pointer"
            >
              Send Password Link
            </button>

            <div className="text-center pt-2">
              <button type="button" onClick={() => setAuthView('login')} className="text-[10px] font-bold text-indigo-600 dark:text-cyan-400 hover:underline cursor-pointer">Back to Login</button>
            </div>
          </form>
        )}

        {/* Secure gate footer badges */}
        <div className="flex justify-center items-center gap-3 text-[10px] text-slate-400 dark:text-slate-500 border-t dark:border-white/10 pt-3.5 mt-2">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            End-To-End SSL Secure
          </span>
        </div>
      </div>
    </div>
  );
};
