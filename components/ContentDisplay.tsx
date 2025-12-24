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

  const handleEdit = () => {
    setIsEditing(true);
    setShowSuccess(false);
  };

  const handleCancelEdit = () => {
    setJournalEntry(savedEntry);
    setIsEditing(false);
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

  const cardBaseClass = "dark:bg-midnight-900/80 bg-white/90 backdrop-blur-md rounded-[3rem] shadow-xl overflow-hidden border-2 transition-colors duration-500";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 pb-24">
      
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
        className={`opacity-0 animate-bounce-in ${cardBaseClass} ${theme.border} relative group`}
        style={{ animationDelay: '0.2s' }}
      >
        <div className={`h-1.5 w-full bg-gradient-to-r from-transparent via-gold-500 to-transparent`}></div>
        <div className="p-10 md:p-14">
          <div className="flex justify-between items-start mb-10">
            <span className={`text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] ${theme.ui.pill}`}>
              Al-Quranul Karim
            </span>
            <div className="flex flex-col items-end gap-4">
              <div className="flex items-center gap-4">
                 <button 
                  onClick={toggleFavoriteQuran}
                  className="p-3 rounded-full dark:bg-midnight-800 bg-white border dark:border-gold-600/20 border-gold-500/10 hover:shadow-md transition-all"
                 >
                   <HeartIcon filled={isQuranSaved} />
                 </button>
                 <div className={`font-serif text-2xl dark:text-gold-300 text-gold-700`}>
                  QS. {data.quran.surahName}: {data.quran.ayahNumber}
                 </div>
              </div>
              <AudioPlayer 
                mode="url" 
                src={quranAudioUrl} 
                label="Murottal" 
                className={`${isQuranSaved ? 'bg-gold-500 text-white' : 'dark:bg-gold-600/10 bg-gold-50 dark:text-gold-400 text-gold-700'} border border-gold-600/30 px-6 py-2.5 hover:shadow-md`}
              />
            </div>
          </div>

          <div className="mb-12 text-right" dir="rtl">
            <p className={`font-arabic text-4xl md:text-6xl leading-[2.2] md:leading-[2.4] transition-all duration-700 ${theme.primaryText} drop-shadow-sm`}>
              {data.quran.arabicText}
            </p>
          </div>

          <div className="space-y-6">
            <p className={`${theme.secondaryText} italic text-xl leading-relaxed text-center font-serif`}>
              "{data.quran.translation}"
            </p>
            <div className={`h-px w-20 mx-auto ${isQuranSaved ? 'bg-gold-500' : 'bg-gold-600/20'}`}></div>
            <p className={`${theme.accent} text-sm text-center uppercase tracking-[0.2em] font-bold opacity-80`}>Refleksi Ayat</p>
            <p className={`${theme.secondaryText} text-center max-w-2xl mx-auto`}>{data.quran.reflection}</p>
          </div>

          <div className="mt-12 pt-8 border-t border-gold-600/10 flex justify-center">
            <button
              onClick={onRefresh}
              className={`flex items-center gap-3 px-8 py-3 rounded-full text-sm font-bold transition-all transform active:scale-95 border-2 ${theme.ui.buttonSecondary}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Cari Ayat Penyejuk Lain
            </button>
          </div>
        </div>
      </div>

      {/* Hadith Section */}
      <div 
        className={`opacity-0 animate-bounce-in ${cardBaseClass} ${theme.border} relative`}
        style={{ animationDelay: '0.3s' }}
      >
         <div className="bg-gold-600/40 h-1.5 w-full"></div>
         <div className="p-10 md:p-14">
          <div className="flex justify-between items-center mb-8">
            <span className={`${theme.ui.pill} text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-widest`}>
              Hadist Nabawi
            </span>
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleFavoriteHadith}
                className="p-3 rounded-full dark:bg-midnight-800 bg-white border border-gold-500/10 hover:shadow-md transition-all"
              >
                <HeartIcon filled={isHadithSaved} />
              </button>
              <AudioPlayer 
                mode="tts" 
                src={data.hadith.text} 
                label="Dengar Hadist" 
                className={`${theme.ui.pill} hover:shadow-sm px-4 py-2`}
              />
            </div>
          </div>
          
          <blockquote className={`text-2xl md:text-3xl font-serif leading-relaxed mb-10 text-center italic ${theme.primaryText}`}>
            "{data.hadith.text}"
          </blockquote>

          <div className="text-center">
             <div className="h-px w-12 bg-gold-600/40 mx-auto mb-4"></div>
             <cite className={`not-italic text-sm font-bold uppercase tracking-[0.3em] ${theme.accent} opacity-70`}>
              {data.hadith.source}
            </cite>
          </div>
         </div>
      </div>

      {/* Hikmah & Amalan */}
      <div className="grid md:grid-cols-2 gap-8">
        <div 
          className={`opacity-0 animate-fadeInUp rounded-[2rem] p-10 shadow-xl border-2 dark:bg-midnight-900/60 bg-white/90 ${theme.border}`}
          style={{ animationDelay: '0.4s' }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center text-3xl">💡</div>
            <h3 className={`font-serif text-3xl font-bold ${theme.accent}`}>Hikmah</h3>
          </div>
          <p className={`leading-relaxed text-lg font-medium italic ${theme.secondaryText}`}>
            "{data.wisdom}"
          </p>
        </div>

        <div 
          className={`opacity-0 animate-fadeInUp dark:bg-midnight-900/60 bg-white/90 border-2 ${theme.border} rounded-[2rem] p-10 shadow-xl`}
          style={{ animationDelay: '0.5s' }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center text-3xl">🌿</div>
            <h3 className={`font-serif text-3xl font-bold ${theme.accent}`}>Amalan Penenang</h3>
          </div>
          <ul className="space-y-5">
            {data.practicalSteps.map((step, idx) => (
              <li 
                key={idx} 
                className="opacity-0 animate-fadeInUp flex items-start gap-4"
                style={{ animationDelay: `${0.6 + (idx * 0.15)}s` }}
              >
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mt-0.5 ${theme.ui.pill}`}>
                  {idx + 1}
                </span>
                <span className={`text-lg font-medium ${theme.secondaryText}`}>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Ruang Refleksi */}
      <div 
        className={`opacity-0 animate-fadeInUp dark:bg-midnight-900/80 bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-2xl border-2 ${theme.border} p-10 md:p-14 relative overflow-hidden`}
        style={{ animationDelay: '0.8s' }}
      >
        <div className={`absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 rounded-full blur-[100px] opacity-20 ${theme.ui.highlight}`}></div>

        <div className="relative z-10">
          <h3 className={`text-4xl font-serif font-bold ${theme.accent} mb-4`}>Mihrab Refleksi</h3>
          <p className={`${theme.secondaryText} text-lg mb-10 max-w-xl font-light`}>
            Tuliskan apa yang kau bisikkan dalam sujudmu. Di bulan Ramadhan ini, setiap keluh kesahmu adalah doa.
          </p>

          {isEditing ? (
            <div className="space-y-8 animate-fadeIn">
              <div className="dark:bg-midnight-950/50 bg-gold-50/50 p-6 rounded-2xl border border-gold-600/10">
                <p className={`text-xs font-bold uppercase tracking-[0.3em] mb-4 ${theme.accent} opacity-60`}>Pertanyaan Renungan:</p>
                <ul className={`space-y-3 italic font-serif text-lg ${theme.secondaryText}`}>
                  {data.reflectionQuestions.map((q, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-gold-500">✦</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>

              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Curahkan segala gundah dan syukurmu di sini..."
                className={`w-full h-48 p-6 rounded-2xl border-2 transition-all resize-none dark:bg-midnight-950/80 bg-white dark:text-gold-100 text-midnight-950 placeholder:text-slate-400 focus:outline-none text-xl font-serif focus:ring-4 focus:ring-gold-500/10 shadow-inner ${theme.border}`}
              ></textarea>

              <div className="flex justify-end gap-4">
                {savedEntry && (
                  <button onClick={handleCancelEdit} className="px-8 py-3 rounded-full text-slate-500 hover:text-slate-800 font-bold transition-colors">Batal</button>
                )}
                <button
                  onClick={handleSaveJournal}
                  disabled={!journalEntry.trim()}
                  className={`px-10 py-4 rounded-full font-bold transition-all transform active:scale-95 shadow-xl ${journalEntry.trim() ? theme.ui.buttonPrimary : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  {savedEntry ? 'Simpan Perubahan' : 'Rekam Jejak Hati'}
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-scaleIn">
              <div className={`dark:bg-midnight-950/80 bg-white p-10 rounded-3xl border-2 ${theme.border} relative shadow-inner group`}>
                 <div className={`absolute top-6 left-6 text-8xl opacity-5 font-serif pointer-events-none ${theme.accent}`}>"</div>
                 <div className="relative z-10 px-6">
                   <p className={`text-2xl font-serif italic whitespace-pre-line leading-relaxed tracking-wide ${theme.primaryText}`}>
                     {savedEntry}
                   </p>
                 </div>
                 <div className="mt-8 flex justify-end">
                   <button onClick={handleEdit} className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all shadow-md ${theme.ui.buttonSecondary}`}>
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                     Edit Catatan
                   </button>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Back Button */}
      <div className="opacity-0 animate-fadeInUp flex justify-center pt-10" style={{ animationDelay: '0.9s' }}>
        <button
          onClick={onReset}
          className={`group flex items-center gap-3 px-10 py-4 rounded-full transition-all shadow-xl hover:scale-105 active:scale-95 ${theme.ui.buttonSecondary}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span className="text-lg font-bold">Pilih Suasana Hati Lain</span>
        </button>
      </div>

    </div>
  );
};

export default ContentDisplay;