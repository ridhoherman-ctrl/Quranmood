
import React, { useState, useEffect } from 'react';
import { HealingContent, MoodConfig, FavoriteItem } from '../types';
import AudioPlayer from './AudioPlayer';
import { updateMoodLog } from '../services/historyService';
import { 
  saveFavorite, 
  removeFavorite, 
  isFavorited, 
  generateQuranId, 
  generateHadithId 
} from '../services/favoriteService';

interface ContentDisplayProps {
  data: HealingContent;
  onReset: () => void;
  onRefresh: () => void;
  logId?: string;
  config: MoodConfig; 
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ data, onReset, onRefresh, logId, config }) => {
  const [journalEntry, setJournalEntry] = useState('');
  const [savedEntry, setSavedEntry] = useState('');
  const [isEditing, setIsEditing] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [isQuranSaved, setIsQuranSaved] = useState(false);
  const [isHadithSaved, setIsHadithSaved] = useState(false);

  const { theme } = config;

  const quranId = generateQuranId(data.quran.surahNumber, data.quran.ayahNumber);
  const hadithId = generateHadithId(data.hadith.text);

  useEffect(() => {
    setIsQuranSaved(isFavorited(quranId));
    setIsHadithSaved(isFavorited(hadithId));
  }, [quranId, hadithId, data]);

  const surahPad = data.quran.surahNumber.toString().padStart(3, '0');
  const ayahPad = data.quran.ayahNumber.toString().padStart(3, '0');
  const quranAudioUrl = `https://everyayah.com/data/Alafasy_128kbps/${surahPad}${ayahPad}.mp3`;

  const handleSaveJournal = () => {
    if (!journalEntry.trim()) return;
    if (logId) updateMoodLog(logId, journalEntry);
    setSavedEntry(journalEntry);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const toggleFavoriteQuran = () => {
    if (isQuranSaved) {
      removeFavorite(quranId);
      setIsQuranSaved(false);
    } else {
      const item: FavoriteItem = {
        id: quranId,
        type: 'quran',
        content: data.quran,
        timestamp: Date.now(),
        moodContext: data.mood
      };
      saveFavorite(item);
      setIsQuranSaved(true);
    }
  };

  const toggleFavoriteHadith = () => {
    if (isHadithSaved) {
      removeFavorite(hadithId);
      setIsHadithSaved(false);
    } else {
      const item: FavoriteItem = {
        id: hadithId,
        type: 'hadith',
        content: data.hadith,
        timestamp: Date.now(),
        moodContext: data.mood
      };
      saveFavorite(item);
      setIsHadithSaved(true);
    }
  };

  const HeartIcon = ({ filled }: { filled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-7 h-7 transition-all duration-300 ${filled ? 'text-gold-500 scale-110 drop-shadow-md' : 'text-slate-400 hover:text-gold-500'}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );

  const cardBaseClass = "dark:bg-midnight-900/90 bg-white/95 backdrop-blur-md rounded-[3rem] shadow-2xl overflow-hidden border-2 transition-all duration-500";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 pb-24 animate-fadeIn">
      
      {/* Intro Summary */}
      <div 
        className={`opacity-0 animate-fadeInUp dark:bg-midnight-900/60 bg-white/60 backdrop-blur-xl border-2 rounded-[2rem] p-8 text-center shadow-lg ${theme.border}`}
        style={{ animationDelay: '0.1s' }}
      >
        <h2 className={`text-2xl font-serif font-bold italic ${theme.accent}`}>
          "{data.summary}"
        </h2>
      </div>

      {/* Al-Quran Card */}
      <div 
        className={`opacity-0 animate-bounce-in ${cardBaseClass} ${theme.border} relative`}
        style={{ animationDelay: '0.2s' }}
      >
        <div className="p-8 md:p-12">
          <div className="flex justify-between items-start mb-10">
            <span className={`text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] ${theme.ui.pill}`}>
              Kalam Ilahi
            </span>
            <div className="flex items-center gap-4">
               <button onClick={toggleFavoriteQuran} className="p-3 rounded-full hover:bg-gold-500/10 transition-colors">
                 <HeartIcon filled={isQuranSaved} />
               </button>
               <div className={`font-serif text-xl dark:text-gold-300 text-gold-700`}>
                QS. {data.quran.surahName}: {data.quran.ayahNumber}
               </div>
            </div>
          </div>

          <div className="mb-12 text-right" dir="rtl">
            <p className={`font-arabic text-4xl md:text-5xl leading-[2.2] ${theme.primaryText}`}>
              {data.quran.arabicText}
            </p>
          </div>

          <div className="space-y-6 text-center">
            <p className={`${theme.secondaryText} italic text-xl font-serif px-4`}>
              "{data.quran.translation}"
            </p>
            <div className={`h-px w-20 mx-auto ${theme.ui.highlight} opacity-30`}></div>
            <p className={`${theme.secondaryText} text-sm max-w-2xl mx-auto leading-relaxed`}>
              {data.quran.reflection}
            </p>
            <div className="pt-4">
              <AudioPlayer mode="url" src={quranAudioUrl} label="Dengar Ayat" className="bg-gold-500/10 text-gold-500 border border-gold-500/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Hadith Section */}
      <div 
        className={`opacity-0 animate-bounce-in ${cardBaseClass} ${theme.border}`}
        style={{ animationDelay: '0.3s' }}
      >
         <div className="p-8 md:p-12">
          <div className="flex justify-between items-center mb-8">
            <span className={`${theme.ui.pill} text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest`}>
              Sabda Nabi
            </span>
            <button onClick={toggleFavoriteHadith} className="p-3 rounded-full hover:bg-gold-500/10 transition-colors">
              <HeartIcon filled={isHadithSaved} />
            </button>
          </div>
          
          <blockquote className={`text-2xl font-serif leading-relaxed mb-8 text-center italic ${theme.primaryText}`}>
            "{data.hadith.text}"
          </blockquote>

          <div className="text-center">
             <cite className={`not-italic text-sm font-bold uppercase tracking-widest ${theme.accent}`}>
              — {data.hadith.source}
            </cite>
          </div>
         </div>
      </div>

      {/* Hikmah & Amalan */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className={`opacity-0 animate-fadeInUp rounded-[2rem] p-8 shadow-xl border-2 dark:bg-midnight-900/60 bg-white/90 ${theme.border}`} style={{ animationDelay: '0.4s' }}>
          <h3 className={`font-serif text-2xl font-bold ${theme.accent} mb-4 flex items-center gap-2`}>
            <span>💡</span> Mutiara Hikmah
          </h3>
          <p className={`leading-relaxed text-lg font-medium italic ${theme.secondaryText}`}>
            "{data.wisdom}"
          </p>
        </div>

        <div className={`opacity-0 animate-fadeInUp dark:bg-midnight-900/60 bg-white/90 border-2 ${theme.border} rounded-[2rem] p-8 shadow-xl`} style={{ animationDelay: '0.5s' }}>
          <h3 className={`font-serif text-2xl font-bold ${theme.accent} mb-4 flex items-center gap-2`}>
            <span>🌿</span> Langkah Ketenangan
          </h3>
          <ul className="space-y-4">
            {data.practicalSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${theme.ui.pill}`}>{idx + 1}</span>
                <span className={`text-base ${theme.secondaryText}`}>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center pt-10">
        <button
          onClick={onReset}
          className={`flex items-center gap-3 px-10 py-4 rounded-full transition-all shadow-xl hover:scale-105 active:scale-95 font-bold ${theme.ui.buttonSecondary}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Ganti Suasana Hati
        </button>
      </div>

    </div>
  );
};

export default ContentDisplay;
