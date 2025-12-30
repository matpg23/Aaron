
import React from 'react';

export const SponsoredGear: React.FC = () => {
  const ads = [
    {
      brand: "SHIMANO",
      product: "Stradic FM Spinning Reel",
      price: "$199.99",
      desc: "Cold-forged HAGANE gears for ultimate durability.",
      icon: "fa-dharmachakra"
    },
    {
      brand: "GARMIN",
      product: "ECHOMAP™ UHD2",
      price: "$899.00",
      desc: "ClearVü scanning sonar with vivid color palettes.",
      icon: "fa-microchip"
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-black text-blue-500/60 tracking-widest uppercase">Sponsored Intel</span>
        <span className="text-[9px] text-slate-600 font-mono">ADVERTISEMENT</span>
      </div>
      {ads.map((ad, idx) => (
        <a 
          key={idx}
          href="#" 
          className="block p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 hover:bg-blue-500/10 transition-all group border-dashed"
        >
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-black text-blue-400 tracking-tighter">{ad.brand}</span>
            <span className="text-[10px] font-mono text-slate-400">{ad.price}</span>
          </div>
          <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">{ad.product}</h4>
          <p className="text-[10px] text-slate-400 mt-1 leading-tight">{ad.desc}</p>
        </a>
      ))}
      <button className="w-full py-2 border border-slate-700 rounded text-[9px] font-black text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all uppercase tracking-widest">
        View All Partner Gear
      </button>
    </div>
  );
};
