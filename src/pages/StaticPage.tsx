import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Mail, MapPin, Phone, FileText, CheckCircle2 } from 'lucide-react';

export const StaticPage: React.FC = () => {
  const { pageSlug } = useParams<{ pageSlug: string }>();

  const pageTitle = pageSlug
    ? pageSlug.replace('-', ' ').toUpperCase()
    : 'ABOUT BHARAT POST MEDIA';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      <div className="pb-3 mb-6 border-b-2 border-red-900">
        <h1 className="font-serif-title font-black text-3xl sm:text-4xl text-slate-900 dark:text-slate-100">
          {pageTitle}
        </h1>
        <p className="text-xs text-slate-500 font-mono mt-1">
          OFFICIAL CORPORATE & EDITORIAL CHARTER • NEW DELHI BUREAU
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm font-serif-body text-slate-800 dark:text-slate-200 space-y-6 text-sm sm:text-base leading-relaxed">
        
        {pageSlug === 'about' || !pageSlug ? (
          <>
            <p className="font-bold text-lg text-slate-900 dark:text-slate-100 italic">
              Bharat Post Media Network is India’s premier independent digital newspaper, committed to fearless reporting, rigorous fact-checking, and deep regional coverage.
            </p>

            <h2 className="font-serif-title font-bold text-xl text-slate-900 dark:text-slate-100 uppercase pt-4 border-t border-slate-200 dark:border-slate-800">
              Our Editorial Charter
            </h2>
            <p>
              Founded with the pledge to deliver unbiased journalism across the Indian subcontinent, Bharat Post operates correspondents across 28 states and union territories, with specialized bureaus covering National Politics, Supreme Court & Law, Economy & Markets, Silicon Corridor Technology, and Olympic Sports.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 font-sans-ui text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-red-800 dark:text-red-400 block mb-1">New Delhi Central Office</span>
                <p className="text-slate-600 dark:text-slate-400">12 Parliament Street, Connaught Place, New Delhi 110001</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-red-800 dark:text-red-400 block mb-1">Mumbai Bureau</span>
                <p className="text-slate-600 dark:text-slate-400">Nariman Point Media Complex, Fort, Mumbai 400021</p>
              </div>
            </div>
          </>
        ) : pageSlug === 'editorial-policy' ? (
          <>
            <h2 className="font-serif-title font-bold text-xl text-slate-900 dark:text-slate-100 uppercase">
              Verification & Fact-Checking Protocol
            </h2>
            <p>
              Every news piece published under the Bharat Post banner undergoes multi-editor cross-verification. Anonymous sources are permitted only under strict legal confidentiality agreements when public interest necessitates disclosure.
            </p>
            <p>
              Opinions and editorial columns represent the individual views of contributing authors and do not constitute corporate endorsement by Bharat Post Media Network.
            </p>
          </>
        ) : pageSlug === 'contact' ? (
          <>
            <h2 className="font-serif-title font-bold text-xl text-slate-900 dark:text-slate-100 uppercase">
              Get in Touch with our Newsroom Desk
            </h2>
            <p>
              Have a confidential news tip, press release, or editorial inquiry? Contact our central editorial team directly.
            </p>

            <form className="space-y-4 font-sans-ui text-xs max-w-lg mt-6">
              <div>
                <label className="block font-bold mb-1">Your Full Name</label>
                <input type="text" className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800" placeholder="e.g. Rajesh Kumar" required />
              </div>
              <div>
                <label className="block font-bold mb-1">Email Address</label>
                <input type="email" className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800" placeholder="e.g. rajesh@example.com" required />
              </div>
              <div>
                <label className="block font-bold mb-1">Message / Confidential News Tip</label>
                <textarea className="w-full bg-slate-50 dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-800 h-32" placeholder="Details of your news report or inquiry..." required />
              </div>
              <button type="submit" className="bg-red-900 hover:bg-red-800 text-white font-bold px-6 py-2.5 rounded uppercase tracking-wider">
                Send to Editorial Desk
              </button>
            </form>
          </>
        ) : (
          <>
            <p>
              This official document outlines the terms and conditions governing the access and use of Bharat Post digital services, e-Paper editions, mobile applications, and subscriber accounts.
            </p>
          </>
        )}

      </div>
    </div>
  );
};
