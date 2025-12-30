
import React from 'react';
import { FishingRecommendation } from '../types';
import { SponsoredGear } from './SponsoredGear';

interface ReportDisplayProps {
  report: FishingRecommendation;
}

export const ReportDisplay: React.FC<ReportDisplayProps> = ({ report }) => {
  const parseSections = (text: string) => {
    const sections: Record<string, string[]> = {
      SUMMARY: [],
      SPOTS: [],
      TIMING: [],
      TACKLE: [],
      'PRO TIPS': []
    };

    let currentSection = '';
    const lines = text.split('\n');

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const headerMatch = trimmed.match(/^\[(SUMMARY|SPOTS|TIMING|TACKLE|PRO TIPS)\]/i);
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

  const SectionCard = ({ title, icon, color, items, children }: { title: string, icon: string, color: string, items?: string[], children?: React.ReactNode }) => (
    <div className={`card-blur rounded-xl border border-slate-700/50 p-5 h-full`}>
      <div className="flex items-center gap-2 mb-3">
        <i className={`fas ${icon} ${color} text-sm`}></i>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</h3>
      </div>
      <div className="space-y-2">
        {items?.map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <span className={`text-[10px] mt-1 ${color}`}>▶</span>
            <p className="text-sm text-slate-200 leading-tight">{item}</p>
          </div>
        ))}
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Overview HUD */}
      <div className="card-blur rounded-2xl p-6 border-l-4 border-l-blue-500 border border-slate-700 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold tracking-tighter uppercase">Live Intelligence</div>
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
        />
        <SectionCard 
          title="Tackle Config" 
          icon="fa-briefcase" 
          color="text-orange-400" 
          items={sections.TACKLE} 
        />
        
        {/* SPONSORED CARD INJECTED */}
        <SectionCard 
          title="Partner Gear" 
          icon="fa-tags" 
          color="text-blue-400"
        >
          <SponsoredGear />
        </SectionCard>

        <div className="md:col-span-2 lg:col-span-3">
          <SectionCard 
            title="Strategic Spots" 
            icon="fa-location-crosshairs" 
            color="text-blue-400" 
            items={sections.SPOTS} 
          />
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
