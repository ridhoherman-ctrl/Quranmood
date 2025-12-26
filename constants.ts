
import { MoodConfig, MoodType, MoodTheme, IbadahItem } from './types';

const LUXURY_DARK: MoodTheme = {
  background: 'bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-950',
  primaryText: 'text-gold-100',
  secondaryText: 'text-slate-400',
  accent: 'text-gold-400',
  border: 'border-gold-600/30',
  ui: {
    pill: 'bg-gold-600/20 text-gold-300 border border-gold-600/40',
    buttonPrimary: 'bg-gradient-to-r from-gold-600 to-gold-400 text-midnight-950 hover:from-gold-500 hover:to-gold-300 font-bold shadow-lg shadow-gold-900/40',
    buttonSecondary: 'bg-midnight-900/50 text-gold-400 border border-gold-600/30 hover:bg-midnight-800 hover:text-gold-300',
    iconBg: 'bg-gold-600/10 text-gold-500',
    highlight: 'bg-gold-500',
  }
};

const LUXURY_LIGHT: MoodTheme = {
  background: 'bg-gradient-to-br from-[#FDFCF0] via-[#F8F5E4] to-[#FDFCF0]',
  primaryText: 'text-midnight-950',
  secondaryText: 'text-slate-600',
  accent: 'text-gold-700',
  border: 'border-gold-600/20',
  ui: {
    pill: 'bg-gold-500/10 text-gold-700 border border-gold-500/30',
    buttonPrimary: 'bg-gradient-to-r from-gold-600 to-gold-500 text-white hover:from-gold-700 hover:to-gold-600 font-bold shadow-lg shadow-gold-200',
    buttonSecondary: 'bg-white text-gold-700 border border-gold-500/40 hover:bg-gold-50 hover:text-gold-800',
    iconBg: 'bg-gold-500/10 text-gold-600',
    highlight: 'bg-gold-600',
  }
};

export const MOOD_CONFIGS: MoodConfig[] = [
  { type: MoodType.HAPPY, icon: '✨', color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', description: "Bersukacita", theme: LUXURY_DARK },
  { type: MoodType.GRATEFUL, icon: '🤲', color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', description: "Berterima kasih", theme: LUXURY_DARK },
  { type: MoodType.OPTIMISTIC, icon: '🚀', color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', description: "Penuh Harapan", theme: LUXURY_DARK },
  { type: MoodType.CONFUSED, icon: '🧭', color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', description: "Mencari Petunjuk", theme: LUXURY_DARK },
  { type: MoodType.ANXIOUS, icon: '🌪️', color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', description: "Gelisah", theme: LUXURY_DARK },
  { type: MoodType.RESTLESS, icon: '〰️', color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', description: "Hati Tidak Tenang", theme: LUXURY_DARK },
  { type: MoodType.GALAU, icon: '😶‍🌫️', color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', description: "Hati Bimbang", theme: LUXURY_DARK },
  { type: MoodType.TIRED, icon: '🔋', color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', description: "Lelah Lahir Batin", theme: LUXURY_DARK },
  { type: MoodType.ANGRY, icon: '🔥', color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', description: "Emosi memuncak", theme: LUXURY_DARK },
  { type: MoodType.DISAPPOINTED, icon: '🥀', color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', description: "Kecewa", theme: LUXURY_DARK },
  { type: MoodType.LONELY, icon: '🍂', color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', description: "Sendiri", theme: LUXURY_DARK },
  { type: MoodType.SAD, icon: '🌧️', color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', description: "Berduka", theme: LUXURY_DARK },
];

export const DAILY_IBADAH: IbadahItem[] = [
  { id: 'sholat_5_waktu', label: 'Shalat 5 Waktu', desc: 'Tiang agama yang tak boleh goyah.' },
  { id: 'tahajjud_malam', label: 'Shalat Tahajjud', desc: 'Mencari ketenangan di sepertiga malam.' },
  { id: 'tilawah_quran', label: 'Tilawah Al-Quran', desc: 'Membasuh hati dengan kalam Ilahi.' },
  { id: 'sedekah_harian', label: 'Sedekah', desc: 'Membersihkan harta, melapangkan jiwa.' },
  { id: 'dzikir_pagi_petang', label: 'Dzikir Pagi & Petang', desc: 'Benteng diri dari segala kegundahan.' },
  { id: 'shalawat_nabi', label: 'Shalawat', desc: 'Mendapat syafaat dan ketenangan.' },
];

// Alias for compatibility
export const RAMADHAN_IBADAH = DAILY_IBADAH;

export const getMoodConfig = (type: MoodType, isDarkMode: boolean = true): MoodConfig | undefined => {
  const base = MOOD_CONFIGS.find(m => m.type === type);
  if (!base) return undefined;
  return {
    ...base,
    theme: isDarkMode ? LUXURY_DARK : LUXURY_LIGHT
  };
};

export const MOOD_LOADING_MESSAGES: Record<MoodType, string[]> = {
  [MoodType.HAPPY]: ["Menjaga senyummu...", "Mengumpulkan syukur...", "Keberkahan sedang menyapamu..."],
  [MoodType.GRATEFUL]: ["Menghitung nikmat yang tiada tara...", "Alhamdulillah atas segala karunia..."],
  [MoodType.OPTIMISTIC]: ["Cahaya harapan menantimu...", "Masa depan cerah di setiap sujudmu..."],
  [MoodType.CONFUSED]: ["Petunjuk-Nya ada di tiap ayat suci...", "Al-Quran adalah pembeda jalan yang benar..."],
  [MoodType.ANXIOUS]: ["Tenangkan jiwamu dengan dzikir...", "Allah bersamamu di setiap hela napas..."],
  [MoodType.RESTLESS]: ["Mencari kedamaian hati...", "Biarkan Al-Quran membasuh kegelisahanmu..."],
  [MoodType.GALAU]: ["Menata kembali kepingan rasa di hadapan-Nya...", "Pintu harapan terbuka lebar untukmu..."],
  [MoodType.TIRED]: ["Lelahmu adalah lillah jika diniatkan karena-Nya...", "Istirahatlah sejenak dalam doa..."],
  [MoodType.ANGRY]: ["Sabar adalah kunci kemenangan diri...", "Mendinginkan hati dengan air wudhu..."],
  [MoodType.DISAPPOINTED]: ["Allah ganti kecewamu dengan hikmah...", "Setiap doa yang tulus pasti didengar..."],
  [MoodType.LONELY]: ["Engkau tak sendiri, Allah sedekat urat leher...", "Temukan kehangatan dalam tadarus..."],
  [MoodType.SAD]: ["Air matamu adalah permata di hadapan-Nya...", "Kebahagiaan sejati akan kembali menyinarimu..."]
};

export const getRandomLoadingMessage = (mood: MoodType): string => {
  const messages = MOOD_LOADING_MESSAGES[mood];
  if (!messages) return "Mencari ayat penenang untuk jiwamu...";
  return messages[Math.floor(Math.random() * messages.length)];
};
