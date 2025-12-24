import React from 'react';

interface CoverProps {
  onStart: () => void;
}

const Cover: React.FC<CoverProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-midnight-950 flex flex-col items-center justify-center p-6 text-center transition-colors duration-1000">
      
      {/* Islamic Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none islamic-bg invert"></div>
      
      {/* Golden Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold-900/20 rounded-full filter blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold-900/10 rounded-full filter blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center gap-10">
        
        {/* Ramadhan 1447H / 2026 Indicator */}
        <div className="animate-[fadeInUp_1s_ease-out]">
           <span className="px-4 py-1.5 rounded-full border border-gold-600/30 bg-gold-600/10 text-gold-400 text-sm font-semibold tracking-[0.2em] uppercase">
             Edisi Spesial Ramadhan 1447H • 2026
           </span>
        </div>

        {/* Bismillah Calligraphy */}
        <div className="animate-[fadeInUp_1.2s_ease-out]">
           <p className="font-arabic text-4xl md:text-5xl text-gold-300 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)] leading-relaxed">
             بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
           </p>
        </div>

        {/* Main Logo/Icon Area */}
        <div className="relative group animate-[scaleIn_0.8s_ease-out]">
          <div className="absolute inset-[-20px] bg-gold-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-1000"></div>
          <div className="relative w-40 h-40 md:w-52 md:h-52 bg-midnight-900 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center border-2 border-gold-600/40">
             {/* Animated Crescent and Star */}
             <div className="text-8xl md:text-9xl filter drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                🌙
             </div>
             {/* Orbiting Ring */}
             <div className="absolute inset-0 border border-gold-600/20 rounded-full animate-[spin_15s_linear_infinite]"></div>
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-4 animate-[fadeInUp_1.4s_ease-out]">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-100 tracking-tight">
            Qur'an <span className="text-gold-500">Mood</span>
          </h1>
          <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto rounded-full"></div>
          <p className="text-lg md:text-2xl text-slate-400 font-light max-w-lg mx-auto leading-relaxed font-sans">
            "Tenangkan jiwamu di bulan suci melalui ayat-ayat yang mengerti perasaanmu."
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-6 animate-[fadeInUp_1.6s_ease-out]">
          <button
            onClick={onStart}
            className="group relative px-10 py-5 bg-gradient-to-r from-gold-700 to-gold-500 text-midnight-950 rounded-full shadow-[0_10px_30px_rgba(217,119,6,0.3)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden active:scale-95"
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
            <span className="relative flex items-center gap-3 font-bold text-xl tracking-wide">
              Mulai Refleksi Ramadhan
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </button>
          <p className="mt-6 text-gold-500/60 text-sm font-medium animate-pulse">
            Dimulai 18 Februari 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cover;