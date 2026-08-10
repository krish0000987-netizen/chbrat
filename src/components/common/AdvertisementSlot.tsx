import React from 'react';

interface AdvertisementSlotProps {
  type?: 'banner' | 'billboard' | 'sidebar' | 'inline';
  className?: string;
}

export const AdvertisementSlot: React.FC<AdvertisementSlotProps> = ({ type = 'banner', className = '' }) => {
  return (
    <div className={`my-6 text-center no-print ${className}`}>
      <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 dark:text-slate-500 block mb-1">
        ADVERTISEMENT
      </span>
      <div className={`mx-auto bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded flex flex-col items-center justify-center p-4 text-slate-400 dark:text-slate-600 ${
        type === 'billboard' ? 'h-32 sm:h-44 max-w-5xl' :
        type === 'sidebar' ? 'h-64 max-w-xs' :
        type === 'inline' ? 'h-24 max-w-2xl' :
        'h-20 sm:h-28 max-w-4xl'
      }`}>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Reserved Commercial Showcase
        </p>
        <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-0.5">
          Reach 10M+ Readers on The Indian Record
        </p>
      </div>
    </div>
  );
};
