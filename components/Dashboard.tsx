
import React, { useEffect, useState, useMemo } from 'react';
import { MoodLog, MoodType, FavoriteItem } from '../types';
import { getMoodHistory, clearMoodHistory } from '../services/historyService';
import { getFavorites, removeFavorite } from '../services/favoriteService';
import { getMoodConfig, MOOD_CONFIGS, DAILY_IBADAH } from '../constants';

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'history' | 'favorites' | 'checklist';

const Dashboard: React.FC<DashboardProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('history');
  const [history, setHistory] = useState<MoodLog[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [checkedIbadah, setCheckedIbadah] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setHistory(getMoodHistory());
      setFavorites(getFavorites());
      
      const savedChecklist = localStorage.getItem('qalbu_checklist');
      if (savedChecklist) {
        setCheckedIbadah(JSON.parse(savedChecklist));
      }
    }
  }, [isOpen, activeTab]);

  const toggleIbadah = (id: string) => {
    const newChecked = checkedIbadah.includes(id)
      ? checkedIbadah.filter(item => item !== id)
      : [...checkedIbadah, id];
    
    setCheckedIbadah(newChecked);
    localStorage.setItem('qalbu_checklist', JSON.stringify(newChecked));
  };

  const handleClearHistory = () => {
    if (window.confirm("Hapus semua jejak spiritual Anda?")) {
      clearMoodHistory();
      setHistory([]);
    }
  };

  const handleRemoveFavorite = (id: string) => {
    if (window.confirm("Hapus dari favorit?")) {
      removeFavorite(id);
      setFavorites(prev => prev.filter(item => item.id !== id));
    }
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  const allTimeStats = useMemo(() => {
    if (history.length === 0) return null;
    const total = history.length;
    const counts: Record<string, number> = {};
    history.forEach(h => { counts[h.mood] = (counts[h.mood] || 0) + 1; });
    let dominantMood = history[0].mood;
    let maxCount = 0;
    Object.entries(counts).forEach(([mood, count]) => {
      if (count > maxCount) { maxCount = count; dominantMood = mood as MoodType; }
    });
    return { total, dominant: getMoodConfig(dominantMood), counts };
  }, [history]);

  const monthlyStats = useMemo(() => {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentLogs = history.filter(h => h.timestamp >= thirtyDaysAgo);
    const counts: Record<string, number> = {};
    MOOD_CONFIGS.forEach(config => { counts[config.type] = 0; });
    let maxVal = 0;
    recentLogs.forEach(log => {
      counts[log.mood] = (counts[log.mood] || 0) + 1;
      if (counts[log.mood] > maxVal) maxVal = counts[log.mood];
    });
    return { counts, maxVal, total: recentLogs.length };
  }, [history]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-midnight-950/90 backdrop-blur-xl transition-opacity animate-fadeIn" onClick={onClose}></div>

      <div className="relative bg-midnight-900 w-full max-w-5xl h-[90vh] rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-gold-600/30 flex flex-col overflow-hidden animate-scaleIn">
        
        {/* Header */}
        <div className="relative bg-midnight-950 p-8 md:p-12 border-b border-gold-600/20 shrink-0">
          <div className="absolute inset-0 opacity-10 islamic-bg invert"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-gold-100 mb-2">Jurnal Ketenangan Hati</h2>
                <p className="text-gold-500/80 text-lg font-light tracking-wide uppercase tracking-[0.2em]">Pencatatan Perjalanan Ruhiyah</p>
              </div>
              <button onClick={onClose} className="p-3 bg-midnight-800 border border-gold-600/30 hover:bg-midnight-700 rounded-full transition-colors text-gold-500 shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 scrollbar-hide">
              <button 
                onClick={() => setActiveTab('history')}
                className={`px-8 py-3 rounded-full text-sm font-bold transition-all border shrink-0 ${
                  activeTab === 'history' 
                    ? 'bg-gold-500 text-midnight-950 border-gold-400 shadow-[0_5px_15px_rgba(245,158,11,0.3)]' 
                    : 'bg-midnight-800 text-gold-400 border-gold-600/30 hover:border-gold-500/50'
                }`}
              >
                📊 Riwayat Hati
              </button>
              <button 
                onClick={() => setActiveTab('checklist')}
                className={`px-8 py-3 rounded-full text-sm font-bold transition-all border shrink-0 ${
                  activeTab === 'checklist' 
                    ? 'bg-gold-500 text-midnight-950 border-gold-400 shadow-[0_5px_15px_rgba(245,158,11,0.3)]' 
                    : 'bg-midnight-800 text-gold-400 border-gold-600/30 hover:border-gold-500/50'
                }`}
              >
                🌙 Amalan Harian
              </button>
              <button 
                onClick={() => setActiveTab('favorites')}
                className={`px-8 py-3 rounded-full text-sm font-bold transition-all border shrink-0 ${
                  activeTab === 'favorites' 
                    ? 'bg-gold-500 text-midnight-950 border-gold-400 shadow-[0_5px_15px_rgba(245,158,11,0.3)]' 
                    : 'bg-midnight-800 text-gold-400 border-gold-600/30 hover:border-gold-500/50'
                }`}
              >
                ❤️ Favorit
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-midnight-900/40 p-8 md:p-12 space-y-12">
            
            {activeTab === 'history' && (
              <>
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                    <div className="text-8xl mb-6 filter grayscale opacity-30">📖</div>
                    <h3 className="text-2xl font-bold text-gold-600/50 uppercase tracking-[0.2em]">Lembaran Masih Kosong</h3>
                    <p className="mt-2 text-slate-600 font-medium">Mulailah refleksi pertamamu hari ini.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-midnight-950/50 p-8 rounded-[2rem] border border-gold-600/20 shadow-xl flex flex-col justify-center gap-2">
                          <p className="text-gold-600 text-xs font-bold uppercase tracking-widest">Total Refleksi</p>
                          <p className="text-4xl font-serif font-bold text-gold-100">{allTimeStats?.total} <span className="text-lg font-light text-slate-500 tracking-normal">kali</span></p>
                        </div>
                        <div className="bg-midnight-950/50 p-8 rounded-[2rem] border border-gold-600/20 shadow-xl flex flex-col justify-center gap-2">
                          <p className="text-gold-600 text-xs font-bold uppercase tracking-widest">Dominan Terasa</p>
                          <p className="text-4xl font-serif font-bold text-gold-100 flex items-center gap-3">
                            <span className="text-3xl">{allTimeStats?.dominant?.icon}</span>
                            {allTimeStats?.dominant?.type}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-gold-700 to-gold-500 p-8 rounded-[2rem] shadow-2xl flex flex-col justify-center text-midnight-950">
                          <p className="text-midnight-900/60 text-xs font-bold uppercase tracking-widest mb-1">Mutiara Hikmah</p>
                          <p className="font-serif italic text-xl font-bold leading-tight">"Berdoalah kepada-Ku, niscaya akan Aku perkenankan bagimu."</p>
                        </div>
                    </div>

                    <div className="bg-midnight-950/80 p-10 rounded-[2.5rem] border border-gold-600/20 shadow-2xl overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-gold-900/10 rounded-full blur-[80px]"></div>
                      <div className="flex items-center justify-between mb-10">
                        <div>
                          <h3 className="text-2xl font-serif font-bold text-gold-100">Statistik Ruhiyah</h3>
                          <p className="text-gold-600/70 text-sm font-medium uppercase tracking-[0.1em]">30 Hari Terakhir</p>
                        </div>
                      </div>
                      <div className="h-56 flex items-end gap-3 md:gap-5 overflow-x-auto pb-4">
                        {MOOD_CONFIGS.map((config) => {
                          const count = monthlyStats.counts[config.type] || 0;
                          const percentage = monthlyStats.maxVal > 0 ? (count / monthlyStats.maxVal) * 100 : 0;
                          return (
                            <div key={config.type} className="flex-1 flex flex-col items-center group min-w-[50px]">
                              <div className="w-full h-full bg-midnight-900 rounded-2xl relative flex items-end justify-center overflow-hidden border border-gold-600/10 group-hover:border-gold-500/40 transition-all">
                                <div className="w-full bg-gradient-to-t from-gold-700 to-gold-400 rounded-t-xl transition-all duration-1000 ease-out-spring relative shadow-[0_0_15px_rgba(245,158,11,0.2)]" style={{ height: `${percentage === 0 ? 0 : Math.max(percentage, 5)}%` }}>
                                  {count > 0 && <span className="absolute top-2 w-full text-center text-midnight-950 text-xs font-black">{count}</span>}
                                </div>
                              </div>
                              <div className="mt-4 text-center">
                                <div className="text-3xl mb-1 transform group-hover:scale-125 transition-transform duration-300 drop-shadow-lg">{config.icon}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-8">
                      <h3 className="text-3xl font-serif font-bold text-gold-100 mb-10 flex items-center gap-4">
                        <span className="h-10 w-1.5 bg-gradient-to-b from-gold-600 to-transparent rounded-full"></span>
                        Jejak Hati Setiap Hari
                      </h3>
                      <div className="relative border-l-2 border-gold-600/20 ml-6 space-y-10 pb-4">
                        {history.map((log, index) => {
                          const config = getMoodConfig(log.mood);
                          return (
                            <div key={log.id} className="relative pl-12 opacity-0 animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                              <div className="absolute -left-[23px] top-0 w-11 h-11 rounded-full border-4 border-midnight-900 bg-midnight-800 flex items-center justify-center text-xl shadow-xl z-10 border-gold-600/40">{config?.icon}</div>
                              <div className="bg-midnight-950/60 rounded-[2rem] p-8 border border-gold-600/10 shadow-xl hover:shadow-gold-950/30 transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                  <div>
                                    <h4 className="font-serif font-bold text-gold-200 text-2xl group-hover:text-gold-100 transition-colors">{log.mood}</h4>
                                    <p className="text-xs text-gold-700 font-black uppercase tracking-[0.2em] mt-1">{formatDate(log.timestamp)}</p>
                                  </div>
                                </div>
                                {log.note ? (
                                  <div className="bg-midnight-900/80 rounded-2xl p-6 text-slate-300 text-lg font-serif italic border border-gold-600/5 relative">
                                    <span className="absolute top-2 left-3 text-5xl text-gold-600 opacity-10 pointer-events-none font-serif">"</span>
                                    {log.note}
                                  </div>
                                ) : (
                                  <p className="text-sm text-slate-600 italic">Meninggalkan jejak hening tanpa catatan.</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {activeTab === 'checklist' && (
              <div className="space-y-8 animate-fadeIn max-w-2xl mx-auto">
                <div className="text-center mb-12">
                   <h3 className="text-3xl font-serif font-bold text-gold-100">Amalan Harian</h3>
                   <p className="text-gold-600/70 text-sm mt-2 font-medium">Melacak ketaatan dan menjaga hubungan dengan Sang Pencipta.</p>
                </div>

                <div className="grid gap-6">
                   {DAILY_IBADAH.map((item, idx) => {
                      const isChecked = checkedIbadah.includes(item.id);
                      return (
                         <div 
                           key={item.id}
                           onClick={() => toggleIbadah(item.id)}
                           className={`group flex items-center gap-6 p-6 md:p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-500 ease-out-spring opacity-0 animate-fadeInUp ${
                              isChecked 
                                ? 'bg-gold-500/5 border-gold-500/20 opacity-50 scale-[0.98]' 
                                : 'bg-midnight-950/40 border-gold-600/10 hover:border-gold-500/40 shadow-xl'
                           }`}
                           style={{ animationDelay: `${idx * 0.1}s` }}
                         >
                            <div className={`shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                               isChecked ? 'bg-gold-500 border-gold-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'border-gold-600/30 bg-midnight-900/50'
                            }`}>
                               {isChecked && (
                                  <svg className="w-6 h-6 text-midnight-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                     <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                               )}
                            </div>
                            <div className="flex-1">
                               <h4 className={`text-xl md:text-2xl font-serif font-bold transition-all duration-500 ${
                                  isChecked ? 'line-through text-gold-600/60 italic' : 'text-gold-100'
                               }`}>
                                  {item.label}
                               </h4>
                               <p className={`text-sm mt-1 transition-colors duration-500 ${isChecked ? 'text-gold-800/40' : 'text-gold-600/70'}`}>
                                  {item.desc}
                               </p>
                            </div>
                         </div>
                      );
                   })}
                </div>

                <div className="mt-12 bg-gold-600/10 p-6 rounded-3xl border border-gold-600/20 text-center">
                   <p className="text-gold-500 font-serif italic text-lg">
                      "Barangsiapa yang tulus dalam ketaatannya, Allah akan berikan jalan keluar dari segala kesulitannya."
                   </p>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {favorites.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-24 text-slate-500">
                    <div className="text-8xl mb-6 text-gold-900 opacity-20">❤️</div>
                    <h3 className="text-2xl font-bold text-gold-600/50 uppercase tracking-[0.2em]">Belum Ada Mutiara Simpanan</h3>
                    <p className="mt-2 text-slate-600 font-medium max-w-sm text-center">Simpan ayat atau hadist yang paling menyentuh kalbumu untuk dibaca kembali nanti.</p>
                  </div>
                ) : (
                  favorites.map((item, index) => {
                    const moodConfig = getMoodConfig(item.moodContext as MoodType);
                    const isQuran = item.type === 'quran';
                    return (
                      <div key={item.id} className="bg-midnight-950/60 rounded-[2.5rem] p-10 border border-gold-600/20 shadow-xl relative group opacity-0 animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="flex justify-between items-start mb-8">
                          <div className="flex gap-3">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${isQuran ? 'bg-gold-600/20 text-gold-400 border border-gold-600/30' : 'bg-midnight-800 text-slate-400 border border-slate-700'}`}>
                              {isQuran ? 'Al-Quran' : 'Hadist'}
                            </span>
                            {moodConfig && (
                              <span className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-midnight-950 text-gold-500 border border-gold-600/10">
                                {moodConfig.icon} {item.moodContext}
                              </span>
                            )}
                          </div>
                          <button onClick={() => handleRemoveFavorite(item.id)} className="text-slate-600 hover:text-red-500 transition-colors p-2" title="Hapus">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11(0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                        {isQuran ? (
                          <div className="space-y-6">
                            <h4 className="font-serif font-bold text-gold-200 text-2xl">QS. {(item.content as any).surahName}: {(item.content as any).ayahNumber}</h4>
                            <p className="font-arabic text-3xl md:text-4xl text-right leading-loose text-gold-100 drop-shadow-sm" dir="rtl">{(item.content as any).arabicText}</p>
                            <p className="text-slate-400 italic text-lg leading-relaxed font-serif">"{(item.content as any).translation}"</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <blockquote className="font-serif text-2xl text-gold-100 italic border-l-4 border-gold-600/40 pl-6 py-2 leading-relaxed">
                              "{(item.content as any).text}"
                            </blockquote>
                            <p className="text-gold-600 text-xs font-black uppercase tracking-[0.3em]">{(item.content as any).source}</p>
                          </div>
                        )}
                        <div className="mt-8 pt-6 border-t border-gold-600/10 text-xs text-slate-500 font-bold uppercase tracking-widest">
                           Disimpan: {formatDate(item.timestamp)}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

        </div>
        
        {/* Footer */}
        {activeTab === 'history' && history.length > 0 && (
          <div className="bg-midnight-950 border-t border-gold-600/20 p-6 flex justify-end shrink-0">
             <button onClick={handleClearHistory} className="text-red-500 text-sm font-bold uppercase tracking-widest hover:text-red-400 px-6 py-2 transition-colors">
               Bersihkan Jejak Hati
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
