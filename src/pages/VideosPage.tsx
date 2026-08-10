import React, { useState } from 'react';
import { mockVideoItems } from '../data/mockNewsData';
import { Video, Play, Clock, Share2, Eye } from 'lucide-react';

export const VideosPage: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState(mockVideoItems[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="pb-3 mb-6 border-b-2 border-red-900 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Video className="w-6 h-6 text-red-800 dark:text-red-500" />
          <h1 className="font-serif-title font-black text-2xl sm:text-3xl uppercase tracking-tight text-slate-900 dark:text-slate-100">
            VIDEO NEWS DESK & DOCUMENTARIES
          </h1>
        </div>
        <span className="text-xs font-mono font-semibold text-slate-500 uppercase">
          HD NEWS BROADCAST
        </span>
      </div>

      {/* Featured Video Player */}
      {selectedVideo && (
        <div className="bg-slate-950 text-white rounded-xl overflow-hidden border border-slate-800 mb-10 shadow-2xl">
          <div className="relative aspect-video max-h-[520px] w-full bg-black flex items-center justify-center group">
            <img
              src={selectedVideo.thumbnail}
              alt={selectedVideo.title}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-6">
              <div className="flex justify-between items-center">
                <span className="bg-red-800 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                  {selectedVideo.category} BROADCAST
                </span>
                <span className="bg-black/70 text-white text-xs font-mono px-2.5 py-1 rounded">
                  Duration: {selectedVideo.duration}
                </span>
              </div>

              <div>
                <div className="w-16 h-16 rounded-full bg-red-800 text-white flex items-center justify-center mx-auto cursor-pointer hover:scale-110 transition-transform shadow-xl my-4">
                  <Play className="w-8 h-8 ml-1 fill-current" />
                </div>
                <h2 className="font-serif-title font-bold text-2xl sm:text-3xl text-white">
                  {selectedVideo.title}
                </h2>
                <p className="text-sm text-slate-300 mt-2 font-serif-body max-w-3xl line-clamp-2">
                  {selectedVideo.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Grid Selection */}
      <h2 className="font-serif-title font-bold text-xl uppercase text-slate-900 dark:text-slate-100 mb-4">
        EXPLORE MORE VIDEO REPORTS
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockVideoItems.map(vid => (
          <div
            key={vid.id}
            onClick={() => setSelectedVideo(vid)}
            className={`cursor-pointer rounded-xl overflow-hidden border transition-all ${
              selectedVideo.id === vid.id
                ? 'border-red-800 ring-2 ring-red-800'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-white dark:bg-slate-900'
            }`}
          >
            <div className="relative aspect-video bg-black">
              <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-red-800/90 text-white flex items-center justify-center">
                  <Play className="w-5 h-5 ml-0.5 fill-current" />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                {vid.duration}
              </span>
            </div>
            <div className="p-4">
              <span className="text-[10px] font-bold text-red-800 dark:text-red-400 uppercase">{vid.category}</span>
              <h3 className="font-serif-title font-bold text-sm text-slate-900 dark:text-slate-100 mt-1 line-clamp-2">
                {vid.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 font-serif-body">{vid.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
