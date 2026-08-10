import React, { useState } from 'react';
import { Mail, CheckCircle, Sparkles } from 'lucide-react';

export const NewsletterCard: React.FC<{ title?: string; subtitle?: string }> = ({
  title = 'THE MORNING BRIEF',
  subtitle = '5 minutes every morning. The crucial national, market & global news you need to start your day.'
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="bg-gradient-to-br from-red-950 via-slate-900 to-black text-white p-6 rounded-xl border border-red-900/50 shadow-xl my-8 relative overflow-hidden">
      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-red-800/20 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 max-w-xl mx-auto text-center">
        <div className="inline-flex items-center space-x-1.5 bg-red-800/40 border border-red-700/50 text-amber-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>INSIDER NEWSLETTER</span>
        </div>

        <h3 className="font-serif-title font-bold text-2xl sm:text-3xl tracking-tight text-white uppercase">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 font-serif-body">
          {subtitle}
        </p>

        {isSubmitted ? (
          <div className="mt-5 p-4 bg-emerald-950/80 border border-emerald-800 rounded-lg flex items-center justify-center space-x-2 text-emerald-300 text-sm font-semibold">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>Welcome! Check your inbox for your first edition.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto">
            <div className="relative w-full">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full bg-slate-900/90 border border-slate-700 focus:border-amber-400 text-white pl-9 pr-3 py-2.5 rounded-lg text-xs outline-none transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-red-800 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-colors shrink-0 whitespace-nowrap shadow-md"
            >
              SUBSCRIBE FREE
            </button>
          </form>
        )}

        <p className="text-[10px] text-slate-400 mt-3">
          Join 850,000+ decision makers. One-click unsubscribe anytime. Zero spam.
        </p>
      </div>
    </div>
  );
};
