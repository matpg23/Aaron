
import React, { useState } from 'react';

interface BiteWindowChartProps {
  dataString: string;
}

export const BiteWindowChart: React.FC<BiteWindowChartProps> = ({ dataString }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // More robust parsing: extract all numbers from the string
  const scores = (dataString.match(/\d+/g) || [])
    .map(v => parseInt(v))
    .filter(v => v >= 0 && v <= 10)
    .slice(0, 12);

  if (scores.length === 0) {
    return (
      <div className="mt-4 p-4 border border-slate-700/50 rounded bg-slate-900/50 text-center">
        <p className="text-[10px] text-slate-500 italic">Historical data stream unavailable.</p>
      </div>
    );
  }

  const hours = Array.from({ length: scores.length }, (_, i) => {
    const d = new Date();
    d.setHours(d.getHours() + i);
    return {
      hour: d.getHours(),
      label: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  });

  return (
    <div className="mt-4 pt-4 border-t border-slate-700/50">
      <div className="relative flex items-end justify-between h-24 gap-1.5 px-1">
        {scores.map((score, idx) => (
          <div 
            key={idx} 
            className="group relative flex-1 flex flex-col items-center h-full justify-end cursor-pointer"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Hover Tooltip */}
            <div 
              className={`absolute -top-10 left-1/2 -translate-x-1/2 transition-all duration-200 z-20 pointer-events-none
                ${hoveredIndex === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}
            >
              <div className="bg-slate-800 border border-blue-500/50 rounded px-2 py-1 shadow-xl whitespace-nowrap">
                <div className="text-[10px] font-black text-white leading-none mb-0.5">{score}/10 Activity</div>
                <div className="text-[8px] text-blue-400 font-mono leading-none">{hours[idx].label}</div>
              </div>
              <div className="w-2 h-2 bg-slate-800 border-r border-b border-blue-500/50 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
            </div>

            {/* The Bar */}
            <div 
              className={`w-full rounded-t transition-all duration-300 relative
                ${score > 7 ? 'bg-gradient-to-t from-green-600/80 to-green-400' : 
                  score > 4 ? 'bg-gradient-to-t from-blue-600/80 to-blue-400' : 
                  'bg-gradient-to-t from-slate-700/80 to-slate-500'}
                ${hoveredIndex === idx ? 'scale-x-110 brightness-125' : 'scale-x-100'}
              `}
              style={{ 
                height: `${Math.max((score / 10) * 100, 10)}%`, // Ensure at least 10% height for visibility
                boxShadow: hoveredIndex === idx ? '0 0 15px rgba(59, 130, 246, 0.4)' : 'none'
              }}
            >
              {idx === 0 && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_5px_white]"></div>
              )}
            </div>

            {/* Time Label */}
            <span className={`text-[8px] font-mono mt-2 transition-colors duration-200 
              ${hoveredIndex === idx ? 'text-white' : 'text-slate-500'}`}>
              {hours[idx].hour}:00
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">12H Bite Probability</span>
          <span className="text-[7px] text-slate-600 uppercase font-mono">Real-time predictive modeling</span>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-400 rounded-sm"></div>
            <span className="text-[8px] text-slate-500 uppercase font-bold tracking-tighter">Peak</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-blue-400 rounded-sm"></div>
            <span className="text-[8px] text-slate-500 uppercase font-bold tracking-tighter">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
