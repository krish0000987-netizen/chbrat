import React, { useState } from 'react';
import { Check, ShieldCheck, Zap, Award, Star, CreditCard } from 'lucide-react';

export const SubscribePage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<'digital' | 'all-access'>('all-access');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="bg-red-900 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-3">
          SUPPORT INDEPENDENT JOURNALISM
        </span>
        <h1 className="font-serif-title font-black text-3xl sm:text-5xl text-slate-900 dark:text-slate-100 tracking-tight">
          Unlock Unlimited Digital Journalism & Daily E-Paper Access
        </h1>
        <p className="font-serif-body text-base text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
          Join over 250,000 readers supporting investigative journalism, unbiased editorial columns, and real-time state news desks across India.
        </p>

        {/* Monthly vs Annual Toggle */}
        <div className="mt-8 inline-flex items-center bg-slate-100 dark:bg-slate-900 p-1.5 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-full transition-colors ${
              billingCycle === 'monthly' ? 'bg-red-900 text-white shadow' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-5 py-2 rounded-full transition-colors flex items-center space-x-1.5 ${
              billingCycle === 'annual' ? 'bg-red-900 text-white shadow' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <span>Annual Billing</span>
            <span className="bg-amber-400 text-black text-[10px] px-1.5 py-0.5 rounded font-bold">SAVE 30%</span>
          </button>
        </div>
      </div>

      {subscribed ? (
        <div className="bg-green-900/10 border-2 border-green-700 p-8 rounded-2xl text-center max-w-xl mx-auto my-8">
          <div className="w-16 h-16 bg-green-700 text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10" />
          </div>
          <h2 className="font-serif-title font-bold text-2xl text-slate-900 dark:text-slate-100">
            Welcome to Bharat Post All-Access!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 font-serif-body">
            Your subscription has been activated. You now enjoy ad-free reading, audio voice articles, and full e-paper access across all devices.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
          
          {/* Plan 1: Digital Standard */}
          <div
            onClick={() => setSelectedPlan('digital')}
            className={`cursor-pointer rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border-2 transition-all flex flex-col justify-between ${
              selectedPlan === 'digital' ? 'border-red-800 ring-2 ring-red-800/50 shadow-xl' : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div>
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">STANDARD PLAN</span>
              <h3 className="font-serif-title font-bold text-2xl text-slate-900 dark:text-slate-100 mt-1">Digital Reader</h3>
              <p className="text-xs text-slate-500 mt-1">Unlimited web & app article access.</p>

              <div className="my-6">
                <span className="font-serif-title font-black text-4xl text-slate-900 dark:text-slate-100">
                  {billingCycle === 'annual' ? '₹149' : '₹199'}
                </span>
                <span className="text-xs text-slate-500"> / month</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 font-sans-ui">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Unlimited web & mobile app reading</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600 shrink-0" />
                  <span>AI Speech Voice Text-to-Speech playback</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Personalized bookmarks & offline reading</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => setSelectedPlan('digital')}
              className="mt-8 w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700"
            >
              Select Digital Reader
            </button>
          </div>

          {/* Plan 2: All-Access Premium */}
          <div
            onClick={() => setSelectedPlan('all-access')}
            className={`relative cursor-pointer rounded-2xl p-6 sm:p-8 bg-slate-900 text-white border-2 transition-all flex flex-col justify-between ${
              selectedPlan === 'all-access' ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-2xl' : 'border-slate-800'
            }`}
          >
            <span className="absolute -top-3 right-6 bg-amber-400 text-black font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow">
              RECOMMENDED EDITION
            </span>

            <div>
              <span className="text-xs font-bold uppercase text-amber-400 tracking-wider">ALL-ACCESS PREMIUM</span>
              <h3 className="font-serif-title font-bold text-2xl text-white mt-1">E-Paper & Ad-Free Pass</h3>
              <p className="text-xs text-slate-300 mt-1">Full print replica e-Paper + zero ads.</p>

              <div className="my-6">
                <span className="font-serif-title font-black text-4xl text-amber-400">
                  {billingCycle === 'annual' ? '₹249' : '₹349'}
                </span>
                <span className="text-xs text-slate-300"> / month</span>
              </div>

              <ul className="space-y-3 text-xs text-slate-200 font-sans-ui">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Everything in Digital Reader</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Daily High-Res E-Paper Replica (5 Cities)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>100% Ad-Free reading experience</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Exclusive subscriber-only investigative reports</span>
                </li>
              </ul>
            </div>

            <form onSubmit={handleSubscribe} className="mt-8">
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-black shadow-lg transition-colors"
              >
                Start 14-Day Free Trial
              </button>
            </form>
          </div>

        </div>
      )}

      {/* Security note */}
      <div className="mt-10 text-center text-xs text-slate-500 font-sans-ui flex items-center justify-center space-x-2">
        <ShieldCheck className="w-4 h-4 text-green-600" />
        <span>256-Bit SSL Encrypted Payment Processing • Cancel Anytime Online</span>
      </div>

    </div>
  );
};
