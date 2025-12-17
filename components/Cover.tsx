import React from 'react';

interface CoverProps {
  onStart: () => void;
}

const Cover: React.FC<CoverProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 dark:from-slate-950 dark:via-emerald-950 dark:to-teal-950 flex flex-col items-center justify-center p-6 text-center transition-colors duration-1000">
      
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] dark:invert"></div>
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-200 dark:bg-emerald-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-200 dark:bg-teal-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 max-w-lg w-full flex flex-col items-center gap-8">
        
        {/* Bismillah Calligraphy */}
        <div className="mb-4 animate-[fadeInUp_1s_ease-out]">
           <p className="font-arabic text-3xl md:text-4xl text-emerald-800 dark:text-emerald-200 opacity-80 leading-relaxed">
             بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
           </p>
        </div>

        {/* Main Logo/Icon Area */}
        <div className="relative group animate-[scaleIn_0.8s_ease-out]">
          <div className="absolute inset-0 bg-emerald-400 dark:bg-emerald-600 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-1000"></div>
          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white dark:bg-slate-800 rounded-full shadow-2xl flex items-center justify-center border border-emerald-50 dark:border-emerald-900">
             {/* Simple Mosque/Dome Icon */}
             <div className="text-6xl md:text-7xl">
                🕌
             </div>
          </div>
          {/* Orbiting Decor */}
          <div className="absolute inset-0 border border-emerald-200 dark:border-emerald-800 rounded-full animate-[spin_10s_linear_infinite] opacity-50"></div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-4 animate-[fadeInUp_1.2s_ease-out]">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Qur'an <span className="text-emerald-600 dark:text-emerald-400">Mood</span>
          </h1>
          <div className="h-1 w-24 bg-emerald-400 mx-auto rounded-full"></div>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-xs mx-auto leading-relaxed">
            "Temukan ketenangan jiwa melalui ayat-ayat yang mengerti perasaanmu."
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-8 animate-[fadeInUp_1.4s_ease-out]">
          <button
            onClick={onStart}
            className="group relative px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full shadow-xl shadow-emerald-200 dark:shadow-none transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
            <span className="relative flex items-center gap-3 font-semibold text-lg tracking-wide">
              Mulai Refleksi Diri
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cover;