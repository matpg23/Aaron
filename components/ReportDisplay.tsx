
import React from 'react';
import { FishingRecommendation } from '../types';
import { SponsoredGear } from './SponsoredGear';
import { BiteWindowChart } from './BiteWindowChart';

interface ReportDisplayProps {
  report: FishingRecommendation;
  isElite?: boolean;
  onUpgrade?: () => void;
}

const EliteMap = () => (
  <div className="relative w-full h-48 bg-slate-900 rounded-lg overflow-hidden border border-blue-500/20 mb-4 group">
    {/* Grid Overlay */}
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
    {/* Animated Sonar Rings */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="w-16 h-16 border border-blue-500/50 rounded-full animate-ping"></div>
      <div className="absolute top-0 left-0 w-16 h-16 border border-blue-400/30 rounded-full animate-ping delay-75"></div>
      <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] animate-pulse"></div>
    </div>
    {/* Scan Line */}
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-scanline"></div>
    
    <div className="absolute bottom-2 right-2 flex flex-col items-end gap-1">
      <span className="text-[8px] font-mono text-blue-500 font-bold tracking-widest uppercase">High-Res Satellite Link</span>
      <span className="text-[7px] font-mono text-slate-500 uppercase tracking-tighter">Lat: 34.0522° N, Lon: 118.2437° W</span>
    </div>
    
    {/* Spot Markers */}
    <div className="absolute top-1/3 left-1/4 flex flex-col items-center">
      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_red]"></div>
      <span className="text-[7px] text-red-400 font-black mt-1 uppercase">Spot Alpha</span>
    </div>
    <div className="absolute bottom-1/4 right-1/3 flex flex-col items-center">
      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_green]"></div>
      <span className="text-[7px] text-green-400 font-black mt-1 uppercase">Drop Zone</span>
    </div>
  </div>
);

export const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, isElite, onUpgrade }) => {
  const parseSections = (text: string) => {
    const sections: Record<string, string[]> = {
      SUMMARY: [],
      CONDITIONS: [],
      SPOTS: [],
      TIMING: [],
      BITE_DATA: [],
      TACKLE: [],
      'PRO TIPS': []
    };

    let currentSection = '';
    const lines = text.split('\n');

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const headerMatch = trimmed.match(/^\[(SUMMARY|CONDITIONS|SPOTS|TIMING|BITE_DATA|TACKLE|PRO TIPS)\]/i);
      if (headerMatch) {
        currentSection = headerMatch[1].toUpperCase();
        const content = trimmed.replace(/^\[.*?\]/i, '').trim();
        if (content) sections[currentSection].push(content);
      } else if (currentSection) {
        sections[currentSection].push(trimmed.replace(/^[*-]\s*/, ''));
      }
    });

    return sections;
  };

  const sections = parseSections(report.summary);

  const SectionCard = ({ title, icon, color, items, children, restricted }: { title: string, icon: string, color: string, items?: string[], children?: React.ReactNode, restricted?: boolean }) => (
    <div className={`card-blur rounded-xl border border-slate-700/50 p-5 h-full flex flex-col relative overflow-hidden`}>
      <div className="flex items-center gap-2 mb-3">
        <i className={`fas ${icon} ${color} text-sm`}></i>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</h3>
      </div>
      
      {restricted && !isElite ? (
        <div className="relative flex-grow min-h-[150px]">
          {/* Blurred Preview */}
          <div className="filter blur-[6px] opacity-30 select-none pointer-events-none space-y-3">
             <div className="h-4 bg-slate-700 rounded w-3/4"></div>
             <div className="h-4 bg-slate-700 rounded w-1/2"></div>
             <div className="h-4 bg-slate-700 rounded w-2/3"></div>
             <div className="h-20 bg-slate-800 rounded w-full"></div>
          </div>
          {/* Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-yellow-500/50 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
              <i className="fas fa-lock text-yellow-500 text-xs"></i>
            </div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Restricted Intelligence</h4>
            <p className="text-[9px] text-slate-400 uppercase tracking-tighter mb-4 max-w-[200px]">Strategic Locations and Tactical Maps require Elite clearance.</p>
            <button 
              onClick={onUpgrade}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-[9px] font-black uppercase rounded-sm transition-all shadow-lg shadow-yellow-500/20"
            >
              Unlock for $2/mo
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2 flex-grow">
          {items?.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <span className={`text-[10px] mt-1 ${color}`}>▶</span>
              <p className="text-sm text-slate-200 leading-tight">{item}</p>
            </div>
          ))}
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Overview HUD */}
      <div className="card-blur rounded-2xl p-6 border-l-4 border-l-blue-500 border border-slate-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <i className="fas fa-satellite-dish fa-4x text-blue-500"></i>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold tracking-tighter uppercase">Signal Decrypted</div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Tactical Briefing</h2>
        </div>
        <p className="text-lg font-medium text-slate-100 italic leading-snug">
          "{sections.SUMMARY[0] || "Analysis complete. Target identified."}"
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SectionCard 
          title="Optimal Timing" 
          icon="fa-clock" 
          color="text-green-400" 
          items={sections.TIMING} 
        >
          {sections.BITE_DATA[0] && <BiteWindowChart dataString={sections.BITE_DATA[0]} />}
        </SectionCard>

        <SectionCard 
          title="Tackle Config" 
          icon="fa-briefcase" 
          color="text-orange-400" 
          items={sections.TACKLE} 
        >
          {sections.CONDITIONS.length > 0 && (
            <div className="mt-3 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <div className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1">Environmental Context</div>
              <p className="text-[11px] text-orange-200/80 font-mono leading-none">
                {sections.CONDITIONS[0]}
              </p>
            </div>
          )}
        </SectionCard>
        
        <SectionCard 
          title="Partner Gear" 
          icon="fa-tags" 
          color="text-blue-400"
        >
          <SponsoredGear />
        </SectionCard>

        <div className="md:col-span-2 lg:col-span-3">
          <SectionCard 
            title="Tactical Map & Strategic Spots" 
            icon="fa-location-crosshairs" 
            color="text-blue-400" 
            items={sections.SPOTS}
            restricted={true}
          >
            {isElite && <EliteMap />}
          </SectionCard>
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <SectionCard 
            title="Pro Maneuvers" 
            icon="fa-bolt" 
            color="text-yellow-400" 
            items={sections['PRO TIPS']} 
          />
        </div>
      </div>

      {/* Grounding HUD */}
      {report.sources.length > 0 && (
        <div className="card-blur rounded-xl p-4 border border-slate-800">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <i className="fas fa-satellite"></i> Grounding Sources
          </h4>
          <div className="flex flex-wrap gap-2">
            {report.sources.map((source, idx) => (
              <a
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-[11px] text-slate-300 hover:text-white hover:border-blue-500 transition-all group"
              >
                <i className={`fas ${source.uri.includes('maps') ? 'fa-location-dot' : 'fa-link'} text-blue-500/50 group-hover:text-blue-400`}></i>
                <span className="max-w-[150px] truncate">{source.title || 'Source'}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
