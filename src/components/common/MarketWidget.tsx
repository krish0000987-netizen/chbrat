import React from 'react';
import { mockMarketIndices } from '../../data/mockNewsData';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

export const MarketWidget: React.FC = () => {
  return (
    <div className="bg-[#111827] text-slate-200 text-xs py-1.5 px-4 overflow-x-auto border-b border-slate-800 flex items-center justify-between no-scrollbar">
      <div className="flex items-center space-x-6 min-w-max">
        <div className="flex items-center space-x-1.5 font-bold uppercase text-amber-400 tracking-wider">
          <span>MARKETS</span>
          <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1 rounded">LIVE DEMO</span>
        </div>

        {mockMarketIndices.map((item) => (
          <div key={item.symbol} className="flex items-center space-x-2 font-mono">
            <span className="font-sans font-semibold text-slate-300">{item.name}:</span>
            <span className="font-bold text-white">{item.value.toLocaleString('en-IN')}</span>
            <span className={`flex items-center space-x-0.5 text-[11px] font-semibold ${item.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {item.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{item.isPositive ? '+' : ''}{item.change} ({item.percentChange}%)</span>
            </span>
          </div>
        ))}
      </div>

      <div className="hidden lg:flex items-center space-x-2 text-[11px] text-slate-400 pl-4 border-l border-slate-700">
        <Info className="w-3 h-3" />
        <span>Market data delayed by 15 mins (Demonstration Feed)</span>
      </div>
    </div>
  );
};
