
import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, isConfigValid } from './services/firebaseService';

import MoodSelector from './components/MoodSelector';
import ContentDisplay from './components/ContentDisplay';
import Dashboard from './components/Dashboard';
import Cover from './components/Cover';
import Login from './components/Login';
import WaitingRoom from './components/WaitingRoom';

import { HealingContent, MoodType } from './types';
import { generateHealingContent } from './services/geminiService';
import { saveMoodLog } from './services/historyService';
import { getMoodConfig, getRandomLoadingMessage } from './constants';

const App: React.FC = () => {
  // Auth & Approval State
  const [currentUser, setCurrentUser] = useState<User | any>(null);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // App Navigation State
  const [showCover, setShowCover] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [content, setContent] = useState<HealingContent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [currentLogId, setCurrentLogId] = useState<string | undefined>(undefined);
  
  const loadingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Monitor Auth State with Mock Fallback for Preview
  useEffect(() => {
    if (!isConfigValid || !auth) {
      console.log("Running in Demo Mode (No Firebase Config Found)");
      setCurrentUser({ email: 'demo@quranmood.com', uid: 'demo-user' });
      setIsApproved(true);
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && db) {
        const userDocRef = doc(db, "users", user.uid);
        const unsubDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setIsApproved(docSnap.data().status === 'approved');
          } else {
            setIsApproved(false);
          }
          setAuthLoading(false);
        }, (err) => {
          console.error("Firestore error:", err);
          setIsApproved(true); // Fallback for stability
          setAuthLoading(false);
        });
        return () => unsubDoc();
      } else {
        setIsApproved(null);
        setAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (loading && selectedMood) {
      setLoadingMessage(getRandomLoadingMessage(selectedMood));
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

  const currentConfig = selectedMood ? getMoodConfig(selectedMood, isDarkMode) : null;
  
  const themeClass = isDarkMode 
    ? 'bg-midnight-950 text-slate-100' 
    : 'bg-[#FDFCF0] text-midnight-950';

  const accentButtonClass = isDarkMode
    ? 'bg-midnight-900/80 text-gold-400 border-gold-600/30 hover:bg-midnight-800 hover:text-gold-300'
    : 'bg-white/80 text-gold-700 border-gold-500/20 hover:bg-gold-50 hover:text-gold-800 shadow-md';

  const fetchContent = async (mood: MoodType) => {
    setLoading(true);
    setError(null);
    setContent(null);

    try {
      const data = await generateHealingContent(mood);
      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kendala spiritual. Silakan coba lagi.");
      if (!content) setSelectedMood(null);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = async (mood: MoodType) => {
    setSelectedMood(mood);
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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    if (auth) auth.signOut();
    else setCurrentUser(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-midnight-950 flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-gold-600/20 border-t-gold-500 rounded-full animate-spin"></div>
        <p className="text-gold-500 font-serif animate-pulse tracking-widest uppercase text-xs">Mempersiapkan Mihrab...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  if (isApproved === false) {
    return <WaitingRoom />;
  }

  if (showCover) {
    return <Cover onStart={handleStartApp} />;
  }

  const renderLoading = () => {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-[fadeIn_0.5s_ease-out]">
        <div className="relative w-32 h-32 mb-10">
           <div className={`absolute inset-0 rounded-full opacity-10 animate-[ping_3s_infinite] bg-gold-500`}></div>
           <div className={`absolute inset-2 rounded-full opacity-30 animate-[pulse_2s_infinite] bg-gold-600`}></div>
           <div className={`absolute inset-0 flex items-center justify-center rounded-full shadow-xl border border-gold-600/30 z-10 ${isDarkMode ? 'bg-midnight-900' : 'bg-white'}`}>
              <span className="text-5xl animate-[bounce_3s_infinite]">{currentConfig?.icon || '🌙'}</span>
           </div>
        </div>
        <div className="h-24 flex flex-col items-center">
            <h3 key={loadingMessage} className={`text-2xl font-serif font-medium mb-3 animate-[fadeInUp_0.3s_ease-out] text-center px-4 ${isDarkMode ? 'text-gold-200' : 'text-gold-700'}`}>
            {loadingMessage}
            </h3>
            <p className={`text-sm uppercase tracking-widest font-bold ${isDarkMode ? 'text-gold-600' : 'text-gold-500'}`}>
            Mencari Ketenangan di antara ayat-Nya...
            </p>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-fixed relative overflow-x-hidden transition-colors duration-700 ${themeClass}`}>
      <div className={`absolute inset-0 opacity-[0.05] pointer-events-none islamic-bg ${isDarkMode ? 'invert' : ''}`}></div>
      
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-16 min-h-screen flex flex-col items-center animate-[fadeIn_1s_ease-out]">
        
        {/* Header Controls */}
        <div className="w-full flex justify-between items-center mb-10">
          <div className="flex gap-2">
            <button 
              onClick={toggleTheme}
              className={`p-3 rounded-full transition-all duration-300 ${accentButtonClass}`}
              title={isDarkMode ? "Ganti ke Mode Siang" : "Ganti ke Mode Malam"}
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gold-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gold-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>
            <button 
              onClick={handleLogout}
              className={`p-3 rounded-full transition-all duration-300 ${accentButtonClass}`}
              title="Keluar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </button>
          </div>

          <button 
            onClick={() => setShowDashboard(true)}
            className={`flex items-center gap-2 px-6 py-2.5 backdrop-blur-md border rounded-full text-sm font-bold transition-all group ${accentButtonClass}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 group-hover:scale-110 transition-transform ${isDarkMode ? 'text-gold-500' : 'text-gold-600'}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            Jurnal Spiritual
          </button>
        </div>

        {/* Header Title */}
        <header className="text-center mb-16 space-y-4 w-full relative">
          <div className={`inline-flex items-center justify-center p-4 rounded-full mb-2 backdrop-blur-md border shadow-xl ${isDarkMode ? 'bg-midnight-900/50 border-gold-600/20' : 'bg-white/80 border-gold-500/20'}`}>
             <span className="text-4xl filter drop-shadow-md">✨</span>
          </div>
          <h1 className={`text-5xl md:text-7xl font-bold font-serif tracking-tight ${isDarkMode ? 'text-gold-100' : 'text-midnight-950'}`}>
            Qur'an <span className={isDarkMode ? 'text-gold-500' : 'text-gold-600'}>Mood</span>
          </h1>
          <div className="flex flex-col gap-2 items-center">
            <p className={`text-xl md:text-2xl font-light max-w-2xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Refleksi Hati Melalui Cahaya Ayat
            </p>
            <div className={`h-0.5 w-24 rounded-full ${isDarkMode ? 'bg-gold-600/40' : 'bg-gold-500/30'}`}></div>
          </div>
        </header>

        {loading && renderLoading()}

        {!content && !loading && !error && (
          <div className="w-full flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
            <h2 className={`text-2xl font-light mb-12 italic ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              "Apa yang sedang dirasakan jiwamu hari ini?"
            </h2>
            <MoodSelector 
              onSelect={handleMoodSelect} 
              disabled={loading} 
              selectedMood={selectedMood}
            />
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center max-w-md">
            <p className="text-red-400 font-medium mb-4">{error}</p>
            <button 
              onClick={handleReset}
              className="px-6 py-2 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {content && !loading && currentConfig && (
          <ContentDisplay 
            data={content} 
            onReset={handleReset}
            onRefresh={handleRefresh}
            logId={currentLogId}
            config={currentConfig}
          />
        )}

        <footer className={`mt-auto pt-20 text-center font-medium ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
          <p className={`mb-2 font-serif text-lg tracking-widest ${isDarkMode ? 'text-gold-600/40' : 'text-gold-500/40'}`}>Cahaya Penerang Jiwa</p>
          <p>&copy; 2024 Qur'an Mood. Sampaikanlah walau satu ayat.</p>
        </footer>

      </main>

      <Dashboard isOpen={showDashboard} onClose={() => setShowDashboard(false)} />
    </div>
  );
};

export default App;
