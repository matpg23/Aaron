
import React, { useState, useCallback, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ReportDisplay } from './components/ReportDisplay';
import { AuthPortal } from './components/AuthPortal';
import { geminiService } from './services/geminiService';
import { FishingRecommendation, UserLocation, UserAccount } from './types';

const App: React.FC = () => {
  const [location, setLocation] = useState('');
  const [species, setSpecies] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<FishingRecommendation | null>(null);
  const [userLoc, setUserLoc] = useState<UserLocation | undefined>();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isCachedData, setIsCachedData] = useState(false);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('anglerpro_user');
    return saved ? JSON.parse(saved) : null;
  });

  const isElite = currentUser?.isElite || false;

  // Monitor connectivity
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Load cached report if available
    const cachedReport = localStorage.getItem('last_fishing_report');
    if (cachedReport) {
      try {
        setReport(JSON.parse(cachedReport));
        setIsCachedData(true);
      } catch (e) {
        console.error("Failed to load cached report", e);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleAuthSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem('anglerpro_user', JSON.stringify(user));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('anglerpro_user');
    setReport(null); // Clear active report for security
  };

  const handleGetLocation = () => {
    if (!isOnline) {
      setError("GPS synchronization requires active satellite uplink (Online).");
      return;
    }
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLoc({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError("Unable to access your location. Please type it manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  const handleScout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOnline) {
      setError("Cannot initiate new scan. Communications offline.");
      return;
    }
    if (!location) {
      setError("Please provide a location to begin scouting.");
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);
    setIsCachedData(false);

    try {
      const result = await geminiService.getFishingStrategy(location, species, userLoc);
      setReport(result);
      // Persist to local storage for offline use
      localStorage.setItem('last_fishing_report', JSON.stringify(result));
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate report. Target location unreachable.");
    } finally {
      setLoading(false);
    }
  };

  const loadingPhrases = [
    "DECRYPTING LOCAL REPORTS...",
    "TRIANGULATING HOT SPOTS...",
    "CALCULATING LUNAR WINDOWS...",
    "MAPPING TACKLE CONFIGS...",
    "UPLOADING TACTICAL DATA...",
  ];

  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setPhraseIdx((prev) => (prev + 1) % loadingPhrases.length);
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Connection & Auth HUD */}
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 animate-pulse'}`}></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              {isOnline ? 'Comms Link: Active' : 'Comms Link: Offline'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-white uppercase tracking-tighter leading-none">{currentUser.username}</p>
                  <p className="text-[8px] text-blue-500 uppercase tracking-widest font-bold">Clearance Level: {isElite ? 'Elite' : 'Basic'}</p>
                </div>
                <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 text-xs transition-colors" title="Terminate Session">
                  <i className="fas fa-power-off"></i>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest flex items-center gap-2"
              >
                <i className="fas fa-lock"></i> Personnel Login
              </button>
            )}
            {isCachedData && (
              <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                <i className="fas fa-database text-[8px] text-blue-400"></i>
                <span className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">Cached</span>
              </div>
            )}
          </div>
        </div>

        {/* Elite Upgrade Banner */}
        {!isElite && (
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse-subtle">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 rounded-lg shadow-lg shadow-blue-500/40">
                <i className="fas fa-crown text-white"></i>
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-tighter">AnglerPro Elite Upgrade</h4>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Unlock Live Satellite Maps & Hidden Spots</p>
              </div>
            </div>
            <button 
              onClick={() => setShowAuthModal(true)}
              className="whitespace-nowrap px-6 py-2 bg-white text-slate-900 text-[10px] font-black uppercase rounded hover:bg-blue-400 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Go Elite — $2/mo
            </button>
          </div>
        )}

        {/* Search Section */}
        <section className="card-blur rounded-2xl p-6 md:p-8 border border-slate-700 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <i className="fas fa-radar fa-5x"></i>
          </div>
          
          <form onSubmit={handleScout} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Scout Target Area
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="CITY, BODY OF WATER, OR COORDS"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 pl-11 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-white placeholder-slate-600 font-mono text-sm"
                  />
                  <i className="fas fa-crosshairs absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-700 rounded text-blue-500 transition-colors"
                    title="Acquire current position"
                  >
                    <i className="fas fa-location-arrow"></i>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Primary Species
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    placeholder="BASS, TROUT, PELAGIC, ETC."
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-3 pl-11 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-white placeholder-slate-600 font-mono text-sm uppercase"
                  />
                  <i className="fas fa-fish-fins absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isOnline}
              className={`w-full font-black py-4 rounded-lg flex items-center justify-center gap-3 transition-all uppercase tracking-tighter text-sm ${
                !isOnline 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                  : 'bg-white hover:bg-slate-200 text-slate-950 shadow-lg shadow-white/5'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                  <span>Transmitting...</span>
                </>
              ) : !isOnline ? (
                <>
                  <i className="fas fa-wifi-slash"></i>
                  <span>System Offline</span>
                </>
              ) : (
                <>
                  <i className="fas fa-bolt"></i>
                  <span>Initiate Recon Scan</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-3 bg-red-950/30 border-l-2 border-red-500 text-red-400 text-[11px] font-bold uppercase tracking-tight flex items-center gap-3">
              <i className="fas fa-triangle-exclamation"></i>
              {error}
            </div>
          )}
        </section>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="w-12 h-12 border border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="text-center">
              <p className="text-blue-500 text-[10px] font-black tracking-[0.3em] uppercase mb-1">{loadingPhrases[phraseIdx]}</p>
              <p className="text-slate-500 text-[10px] font-mono">ESTABLISHING UPLINK...</p>
            </div>
          </div>
        )}

        {report && <ReportDisplay report={report} isElite={isElite} onUpgrade={() => setShowAuthModal(true)} />}

        {!report && !loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-40">
            {['Tactical Maps', 'Bite Windows', 'Rig Advisor', 'Pro Intel'].map((feat, i) => (
              <div key={i} className="p-4 rounded-lg border border-slate-800 bg-slate-900/20 text-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{feat}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAuthModal && (
        <AuthPortal 
          onClose={() => setShowAuthModal(false)} 
          onAuthSuccess={handleAuthSuccess} 
        />
      )}
    </Layout>
  );
};

export default App;
