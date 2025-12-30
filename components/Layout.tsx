
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <header className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-2">
          <i className="fas fa-fish-fins text-blue-400 text-4xl"></i>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Angler<span className="text-blue-500">Pro</span> AI
          </h1>
        </div>
        <p className="text-slate-400 max-w-md mx-auto">
          Hyper-local intelligence for the serious angler. Find your next trophy catch with AI precision.
        </p>
      </header>
      <main>
        {children}
      </main>
      <footer className="mt-20 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} AnglerPro AI. Powered by Gemini 2.5.</p>
      </footer>
    </div>
  );
};
