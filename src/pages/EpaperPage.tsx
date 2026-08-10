import React, { useState } from 'react';
import { Newspaper, ZoomIn, ZoomOut, Calendar, Download, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

export const EpaperPage: React.FC = () => {
  const [selectedEdition, setSelectedEdition] = useState('New Delhi');
  const [selectedPage, setSelectedPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  const totalPages = 8;

  const pagesInfo = [
    { num: 1, title: 'Front Page & Breaking National News' },
    { num: 2, title: 'National Affairs & Parliament Bureau' },
    { num: 3, title: 'State Bureau & City Digest' },
    { num: 4, title: 'Editorial, Opinion & Letters to Editor' },
    { num: 5, title: 'Economy, Markets & World Trade' },
    { num: 6, title: 'Technology, Science & Innovation' },
    { num: 7, title: 'Cricket & Olympic Sports' },
    { num: 8, title: 'Culture, Entertainment & Lifestyle' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Top Bar Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4 font-sans-ui text-xs">
        
        {/* Edition Selector */}
        <div className="flex items-center space-x-2">
          <Newspaper className="w-5 h-5 text-red-800 dark:text-red-500" />
          <span className="font-bold text-slate-700 dark:text-slate-300">Edition:</span>
          <select
            value={selectedEdition}
            onChange={(e) => setSelectedEdition(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded px-3 py-1.5 outline-none focus:border-red-800"
          >
            <option value="New Delhi">New Delhi Bureau Edition</option>
            <option value="Mumbai">Mumbai Metro Edition</option>
            <option value="Ahmedabad">Gujarat State Edition</option>
            <option value="Bengaluru">Karnataka Silicon Valley Edition</option>
            <option value="Kolkata">West Bengal Edition</option>
          </select>
        </div>

        {/* Date Display */}
        <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
          <Calendar className="w-4 h-4 text-red-800" />
          <span className="font-bold">Friday, August 10, 2026</span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setZoomLevel((z) => Math.max(70, z - 15))}
            className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-slate-300 dark:border-slate-700"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono font-bold">{zoomLevel}%</span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
            className="p-1.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-slate-300 dark:border-slate-700"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Download PDF button */}
        <button className="bg-red-900 hover:bg-red-800 text-white font-bold px-3 py-1.5 rounded flex items-center space-x-1 uppercase tracking-wider">
          <Download className="w-3.5 h-3.5" />
          <span>Download PDF Edition</span>
        </button>

      </div>

      {/* Page Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-3 mb-6 border-b border-slate-200 dark:border-slate-800">
        {pagesInfo.map((p) => (
          <button
            key={p.num}
            onClick={() => setSelectedPage(p.num)}
            className={`px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap transition-colors ${
              selectedPage === p.num
                ? 'bg-red-900 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            }`}
          >
            Page {p.num}: {p.title.split('&')[0]}
          </button>
        ))}
      </div>

      {/* Simulated Newspaper Replica Viewer */}
      <div className="bg-stone-300 dark:bg-slate-950 p-6 sm:p-10 rounded-2xl overflow-auto border border-stone-400 dark:border-slate-800 shadow-inner flex justify-center">
        
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="bg-[#FBFBF9] text-[#121212] w-[800px] min-h-[1100px] p-8 border-4 border-black shadow-2xl transition-transform duration-200 flex flex-col justify-between font-serif selection:bg-red-200"
        >
          {/* Replica Header */}
          <div className="border-b-4 border-black pb-4 text-center">
            <div className="flex justify-between items-center text-[10px] font-sans font-bold tracking-widest text-slate-600 uppercase border-b border-stone-300 pb-1 mb-2">
              <span>RNI NO. 45892/86 • REG. NO. DL(S)-01/3021/2026</span>
              <span>VOL. XLII NO. 222 • NEW DELHI EDITION</span>
              <span>PRICE ₹ 7.00 • 24 PAGES</span>
            </div>

            <h1 className="text-6xl font-black italic tracking-tighter uppercase font-serif" style={{ fontFamily: 'Georgia, serif' }}>
              BHARAT POST
            </h1>
            <p className="text-[11px] font-sans font-bold uppercase tracking-widest text-red-900 mt-1">
              THE VOICE OF INDEPENDENT JOURNALISM SINCE 1948
            </p>
          </div>

          {/* Replica Content Grid */}
          <div className="my-6 grid grid-cols-12 gap-6 flex-1">
            
            {/* Col 8 - Main Lead */}
            <div className="col-span-8 border-r border-stone-300 pr-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-sans font-black text-red-900 uppercase tracking-widest">
                  PAGE {selectedPage} — LEAD REPORT
                </span>
                <h2 className="text-3xl font-black leading-tight mt-1 mb-3">
                  {pagesInfo[selectedPage - 1].title}: Major Cabinet Directive Standardized
                </h2>
                <p className="text-sm text-stone-700 leading-relaxed font-serif mb-4">
                  NEW DELHI — Parliament today approved the comprehensive infrastructure framework with bipartisan backing. Senior correspondents report that budget allocations will be disbursed across state treasuries starting next month...
                </p>

                <div className="aspect-[16/9] bg-stone-300 rounded border border-stone-400 overflow-hidden relative my-4">
                  <img
                    src="https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80"
                    alt="Parliament building"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white font-sans text-[9px] px-1">
                    PHOTO: BHARAT POST ARCHIVE
                  </span>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed">
                  Continued on Page {selectedPage + 1}... The legislative assembly conducted a 6-hour marathon discussion regarding regulatory oversight.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-300 bg-stone-100 p-3 text-xs font-sans">
                <span className="font-bold text-red-900 uppercase block mb-1">INTERACTIVE REPLICA HOTSPOT</span>
                <p className="text-slate-600">Clicking any section on this e-Paper loads the clean high-resolution digital text version.</p>
              </div>
            </div>

            {/* Col 4 - Sidebar Columns */}
            <div className="col-span-4 flex flex-col justify-between space-y-6">
              
              <div className="border-b border-stone-300 pb-4">
                <span className="text-[10px] font-sans font-black text-red-900 uppercase">IN BRIEF</span>
                <h3 className="text-base font-bold leading-tight mt-1">
                  Rupee Gains 18 Paise Against US Dollar
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Foreign institutional investments reached $420M in early session.
                </p>
              </div>

              <div className="border-b border-stone-300 pb-4">
                <span className="text-[10px] font-sans font-black text-red-900 uppercase">EDITORIAL</span>
                <h3 className="text-base font-bold leading-tight mt-1">
                  Strengthening Domestic Supply Chains
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Policy continuity remains key to maintaining investor confidence.
                </p>
              </div>

              <div className="bg-stone-200 p-4 border border-stone-300 rounded text-[11px] font-sans">
                <span className="font-bold uppercase text-stone-700 block mb-1">BHARAT POST CLASSIFIEDS</span>
                <p className="text-stone-600 italic">Public notices, tenders and appointments on page 14.</p>
              </div>

            </div>

          </div>

          {/* Replica Footer */}
          <div className="border-t-2 border-black pt-2 flex justify-between items-center text-[10px] font-sans text-stone-600">
            <span>PRINTED & PUBLISHED BY BHARAT POST MEDIA CORP, NEW DELHI</span>
            <span>PAGE {selectedPage} OF {totalPages}</span>
          </div>

        </div>

      </div>
    </div>
  );
};
