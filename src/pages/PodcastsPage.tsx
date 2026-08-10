import React, { useState } from 'react';
import { Mic, Play, Pause, Volume2, Clock, Share2, Radio } from 'lucide-react';

const mockPodcasts = [
  {
    id: 'pod-1',
    title: 'The Daily Indian Record: Inside Parliament’s Tech Infrastructure Bill',
    host: 'Aditi Sharma',
    duration: '24:15',
    date: 'Today, 06:00 AM',
    description: 'We unpack the bipartisan policy framework aiming to decentralize cloud infrastructure and promote domestic chip manufacturing with an initial outlay of ₹2.5 trillion.',
    cover: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pod-2',
    title: 'Market Pulse: Sensex Hits 73,800 — What It Means For Retail Investors',
    host: 'Vikramaditya Roy',
    duration: '18:40',
    date: 'Yesterday',
    description: 'Financial editors discuss foreign institutional inflows, semiconductor sector surges, and market valuation metrics in 2026.',
    cover: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pod-3',
    title: 'The Cricket Blueprint: Data Analytics Transformation in Border-Gavaskar Trophy',
    host: 'Karan Mehra',
    duration: '32:10',
    date: '3 days ago',
    description: 'Former test captains analyze how real-time pitch tracking and bowling velocity metrics governed India’s victory in Ahmedabad.',
    cover: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80'
  }
];

export const PodcastsPage: React.FC = () => {
  const [playingId, setPlayingId] = useState<string | null>('pod-1');

  const togglePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="pb-3 mb-6 border-b-2 border-red-900 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Radio className="w-6 h-6 text-red-800 dark:text-red-500" />
          <h1 className="font-serif-title font-black text-2xl sm:text-3xl uppercase tracking-tight text-slate-900 dark:text-slate-100">
            AUDIO NEWSROOM & PODCASTS
          </h1>
        </div>
        <span className="text-xs font-mono font-semibold text-slate-500 uppercase">
          DAILY BRIEFINGS
        </span>
      </div>

      <div className="space-y-6">
        {mockPodcasts.map((pod) => (
          <div
            key={pod.id}
            className={`p-6 rounded-xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
              playingId === pod.id
                ? 'bg-red-950 text-white border-red-800 shadow-xl'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-black">
                <img src={pod.cover} alt={pod.title} className="w-full h-full object-cover" />
                <button
                  onClick={() => togglePlay(pod.id)}
                  className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-red-800 text-white flex items-center justify-center shadow">
                    {playingId === pod.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </div>
                </button>
              </div>

              <div>
                <span className={`text-[10px] font-bold uppercase font-mono ${playingId === pod.id ? 'text-amber-400' : 'text-red-800 dark:text-red-400'}`}>
                  HOSTED BY {pod.host.toUpperCase()} • {pod.date}
                </span>
                <h2 className="font-serif-title font-bold text-lg sm:text-xl mt-0.5 leading-snug">
                  {pod.title}
                </h2>
                <p className={`text-xs mt-1.5 font-serif-body line-clamp-2 max-w-2xl ${playingId === pod.id ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>
                  {pod.description}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 shrink-0 font-mono text-xs">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{pod.duration}</span>
              </span>
              <button
                onClick={() => togglePlay(pod.id)}
                className={`px-4 py-2 rounded-lg font-bold uppercase transition-colors ${
                  playingId === pod.id
                    ? 'bg-amber-400 text-black hover:bg-amber-300'
                    : 'bg-red-900 hover:bg-red-800 text-white'
                }`}
              >
                {playingId === pod.id ? 'Playing' : 'Listen Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
