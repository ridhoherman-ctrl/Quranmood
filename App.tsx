import React, { useState, useEffect, useRef } from 'react';
import MoodSelector from './components/MoodSelector';
import ContentDisplay from './components/ContentDisplay';
import Dashboard from './components/Dashboard';
import Cover from './components/Cover';
import { HealingContent, MoodType } from './types';
import { generateHealingContent } from './services/geminiService';
import { saveMoodLog } from './services/historyService';
import { getMoodConfig, getRandomLoadingMessage } from './constants';

const App: React.FC = () => {
  // Navigation State
  const [showCover, setShowCover] = useState<boolean>(true);

  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [content, setContent] = useState<HealingContent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [currentLogId, setCurrentLogId] = useState<string | undefined>(undefined);
  
  // Ref for clearing interval
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Initialize Theme on Mount
  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      // If no local storage, check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  // Effect to cycle loading messages
  useEffect(() => {
    if (loading && selectedMood) {
      // Set initial message
      setLoadingMessage(getRandomLoadingMessage(selectedMood));
      
      // Rotate message every 2.5 seconds to make waiting feel shorter
      loadingIntervalRef.current = setInterval(() => {
        setLoadingMessage(getRandomLoadingMessage(selectedMood));
      }, 2500);
    } else {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
    }

    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
    };
  }, [loading, selectedMood]);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Get current config for theming
  const currentConfig = selectedMood ? getMoodConfig(selectedMood) : null;
  
  // Default theme properties if no mood selected
  const themeClass = currentConfig ? currentConfig.theme.background : 'bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 dark:from-slate-900 dark:via-emerald-950 dark:to-teal-950';
  const textClass = currentConfig ? currentConfig.theme.primaryText : 'text-emerald-950 dark:text-emerald-50';
  const secondaryTextClass = currentConfig ? currentConfig.theme.secondaryText : 'text-slate-600 dark:text-slate-400';
  const accentButtonClass = currentConfig ? currentConfig.theme.ui.buttonSecondary : 'bg-white/80 text-emerald-800 border-emerald-100 hover:bg-emerald-50 dark:bg-slate-800 dark:text-emerald-200 dark:border-emerald-800 dark:hover:bg-emerald-900';

  // Separated fetching logic to reuse for refresh
  const fetchContent = async (mood: MoodType) => {
    setLoading(true);
    // Message logic is now handled by useEffect
    setError(null);
    setContent(null);

    try {
      const data = await generateHealingContent(mood);
      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan yang tidak terduga.");
      // Only reset selection on error if we don't have content yet (initial load)
      if (!content) setSelectedMood(null);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = async (mood: MoodType) => {
    setSelectedMood(mood);
    // Save mood to history immediately and capture the ID
    const log = saveMoodLog(mood);
    setCurrentLogId(log.id);
    
    await fetchContent(mood);
  };

  const handleRefresh = async () => {
    if (selectedMood) {
      await fetchContent(selectedMood);
    }
  };

  const handleReset = () => {
    setSelectedMood(null);
    setContent(null);
    setError(null);
    setCurrentLogId(undefined);
  };

  const handleStartApp = () => {
    setShowCover(false);
  };

  // --- RENDER COVER IF STATE IS TRUE ---
  if (showCover) {
    return <Cover onStart={handleStartApp} />;
  }

  // --- MAIN APP RENDER ---

  // Helper to render loading UI
  const renderLoading = () => {
    // Fallback if config is null (shouldn't happen if selectedMood is set)
    const colorClass = currentConfig?.color.split(' ')[0] || 'bg-emerald-200';
    
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-[fadeIn_0.5s_ease-out]">
        <div className="relative w-24 h-24 mb-8">
           {/* Outer Breathing Circle */}
           <div className={`absolute inset-0 rounded-full opacity-20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] ${colorClass}`}></div>
           <div className={`absolute inset-2 rounded-full opacity-40 animate-[pulse_2s_ease-in-out_infinite] ${colorClass}`}></div>
           
           {/* Inner Icon Container */}
           <div className={`absolute inset-0 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 z-10`}>
              <span className="text-4xl animate-[bounce_3s_infinite]">{currentConfig?.icon || '🤲'}</span>
           </div>
        </div>
        
        {/* Animated Text Container */}
        <div className="h-20 flex flex-col items-center">
            <h3 key={loadingMessage} className={`text-xl font-serif font-medium mb-2 animate-[fadeInUp_0.3s_ease-out] text-center ${textClass}`}>
            {loadingMessage}
            </h3>
            <p className={`text-sm ${secondaryTextClass}`}>
            Mohon tunggu, sedang memilihkan ayat terbaik...
            </p>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-fixed relative transition-colors duration-1000 ease-in-out ${themeClass}`}>
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] dark:invert"></div>
      
      {/* Gradient Overlay for better text readability at bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/60 dark:to-slate-900/60 pointer-events-none"></div>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-10 md:py-16 min-h-screen flex flex-col items-center animate-[fadeIn_1s_ease-out]">
        
        {/* Header */}
        <header className="text-center mb-12 space-y-4 w-full relative">
          {/* Top Controls */}
          <div className="absolute top-0 right-0 md:right-4 flex gap-2">
            {/* Theme Toggle */}
            <button 
               onClick={toggleTheme}
               className={`p-2 backdrop-blur-sm border rounded-full transition-all shadow-sm ${accentButtonClass}`}
               title={darkMode ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-yellow-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>
            
            {/* Dashboard Button */}
            <button 
              onClick={() => setShowDashboard(true)}
              className={`flex items-center gap-2 px-4 py-2 backdrop-blur-sm border rounded-full text-sm font-medium transition-all shadow-sm group ${accentButtonClass}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:scale-110 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              Jurnal Mood
            </button>
          </div>

          <div className={`inline-flex items-center justify-center p-3 rounded-full mb-4 shadow-sm bg-white/50 dark:bg-slate-800/50 backdrop-blur-md`}>
             <span className="text-3xl">🕌</span>
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold font-serif tracking-tight transition-colors duration-700 ${textClass}`}>
            Qur'an Mood
          </h1>
          <p className={`text-lg max-w-md mx-auto transition-colors duration-700 ${secondaryTextClass}`}>
            Temukan ketenangan melalui Al-Quran dan Hadist yang menyapa suasana hatimu saat ini.
          </p>
        </header>

        {/* Loading State */}
        {loading && renderLoading()}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center max-w-md animate-bounce-in">
            <div className="text-red-500 text-4xl mb-3">⚠️</div>
            <h3 className="text-red-800 dark:text-red-200 font-bold mb-2">Terjadi Kesalahan</h3>
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Initial View: Mood Selection */}
        {!content && !loading && !error && (
          <div className="w-full flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
            <h2 className={`text-xl font-medium mb-8 ${secondaryTextClass}`}>
              Apa yang sedang kamu rasakan?
            </h2>
            <MoodSelector 
              onSelect={handleMoodSelect} 
              disabled={loading} 
              selectedMood={selectedMood}
            />
          </div>
        )}

        {/* Result View: Content Display */}
        {content && !loading && currentConfig && (
          <ContentDisplay 
            data={content} 
            onReset={handleReset}
            onRefresh={handleRefresh}
            logId={currentLogId}
            config={currentConfig}
          />
        )}

        {/* Footer */}
        <footer className={`mt-auto pt-16 text-center text-sm ${secondaryTextClass} opacity-70`}>
          <p>&copy; {new Date().getFullYear()} Qur'an Mood. Dibuat dengan niat baik.</p>
        </footer>

      </main>

      {/* Dashboard Modal */}
      <Dashboard isOpen={showDashboard} onClose={() => setShowDashboard(false)} />
    </div>
  );
};

export default App;