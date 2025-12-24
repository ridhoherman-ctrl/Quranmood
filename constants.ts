import { MoodConfig, MoodType, MoodTheme } from './types';

const RAMADHAN_LUXURY_DARK: MoodTheme = {
  background: 'bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-950',
  primaryText: 'text-gold-100',
  secondaryText: 'text-slate-400',
  accent: 'text-gold-500',
  border: 'border-gold-600/30',
  ui: {
    pill: 'bg-gold-600/20 text-gold-300 border border-gold-600/40',
    buttonPrimary: 'bg-gradient-to-r from-gold-700 to-gold-500 text-midnight-950 hover:from-gold-600 hover:to-gold-400 font-bold shadow-lg shadow-gold-900/20',
    buttonSecondary: 'bg-midnight-900/50 text-gold-400 border border-gold-600/30 hover:bg-midnight-800 hover:text-gold-300',
    iconBg: 'bg-gold-600/10 text-gold-500',
    highlight: 'bg-gold-500',
  }
};

const RAMADHAN_LUXURY_LIGHT: MoodTheme = {
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
  { 
    type: MoodType.HAPPY, 
    icon: '✨', 
    color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', 
    description: "Bersukacita",
    theme: RAMADHAN_LUXURY_DARK // Default, will be adjusted in App
  },
  { 
    type: MoodType.GRATEFUL, 
    icon: '🤲', 
    color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', 
    description: "Berterima kasih",
    theme: RAMADHAN_LUXURY_DARK
  },
  { 
    type: MoodType.OPTIMISTIC, 
    icon: '🚀', 
    color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', 
    description: "Penuh Harapan",
    theme: RAMADHAN_LUXURY_DARK
  },
  { 
    type: MoodType.CONFUSED, 
    icon: '🧭', 
    color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', 
    description: "Mencari Petunjuk",
    theme: RAMADHAN_LUXURY_DARK
  },
  { 
    type: MoodType.ANXIOUS, 
    icon: '🌪️', 
    color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', 
    description: "Gelisah",
    theme: RAMADHAN_LUXURY_DARK
  },
  { 
    type: MoodType.RESTLESS, 
    icon: '〰️', 
    color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', 
    description: "Hati Tidak Tenang",
    theme: RAMADHAN_LUXURY_DARK
  },
  { 
    type: MoodType.GALAU, 
    icon: '😶‍🌫️', 
    color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', 
    description: "Hati Bimbang",
    theme: RAMADHAN_LUXURY_DARK
  },
  { 
    type: MoodType.TIRED, 
    icon: '🔋', 
    color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', 
    description: "Lelah Lahir Batin",
    theme: RAMADHAN_LUXURY_DARK
  },
  { 
    type: MoodType.ANGRY, 
    icon: '🔥', 
    color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', 
    description: "Emosi memuncak",
    theme: RAMADHAN_LUXURY_DARK
  },
  { 
    type: MoodType.DISAPPOINTED, 
    icon: '🥀', 
    color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', 
    description: "Kecewa",
    theme: RAMADHAN_LUXURY_DARK
  },
  { 
    type: MoodType.LONELY, 
    icon: '🍂', 
    color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', 
    description: "Sendiri",
    theme: RAMADHAN_LUXURY_DARK
  },
  { 
    type: MoodType.SAD, 
    icon: '🌧️', 
    color: 'dark:bg-midnight-900/80 bg-white dark:text-gold-300 text-gold-700 border-gold-600/40 hover:border-gold-400 shadow-xl', 
    description: "Berduka",
    theme: RAMADHAN_LUXURY_DARK
  },
];

export const getMoodConfig = (type: MoodType, isDarkMode: boolean = true): MoodConfig | undefined => {
  const base = MOOD_CONFIGS.find(m => m.type === type);
  if (!base) return undefined;
  return {
    ...base,
    theme: isDarkMode ? RAMADHAN_LUXURY_DARK : RAMADHAN_LUXURY_LIGHT
  };
};

export const MOOD_LOADING_MESSAGES: Record<MoodType, string[]> = {
  [MoodType.HAPPY]: [
    "Menjaga senyum Ramadhanmu...",
    "Mengumpulkan syukur di bulan suci...",
    "Keberkahan Ramadhan sedang menyapamu...",
  ],
  [MoodType.GRATEFUL]: [
    "Menghitung nikmat di bulan ampunan...",
    "Alhamdulillah atas Ramadhan 2026...",
  ],
  [MoodType.OPTIMISTIC]: [
    "Cahaya Lailatul Qadar menantimu...",
    "Harapan baru di setiap sujud tarawih...",
  ],
  [MoodType.CONFUSED]: [
    "Petunjuk-Nya ada di tiap ayat suci...",
    "Ramadhan adalah bulan diturunkannya Al-Furqan...",
  ],
  [MoodType.ANXIOUS]: [
    "Tenangkan jiwamu dengan dzikir malam...",
    "Allah bersamamu di setiap hela napas puasa...",
  ],
  [MoodType.RESTLESS]: [
    "Mencari kedamaian di sepertiga malam...",
    "Biarkan Al-Quran membasuh kegelisahanmu...",
  ],
  [MoodType.GALAU]: [
    "Menata kembali kepingan rasa di hadapan-Nya...",
    "Pintu tobat terbuka lebar di bulan ini...",
  ],
  [MoodType.TIRED]: [
    "Lelahmu saat puasa adalah pahala tak terhingga...",
    "Istirahatlah sejenak dalam doa...",
  ],
  [MoodType.ANGRY]: [
    "Sabar adalah separuh dari puasa...",
    "Mendinginkan hati dengan air wudhu...",
  ],
  [MoodType.DISAPPOINTED]: [
    "Allah ganti kecewamu dengan keberkahan...",
    "Setiap doa di waktu iftar diijabah...",
  ],
  [MoodType.LONELY]: [
    "Engkau tak sendiri, Allah sedekat urat leher...",
    "Temukan kehangatan dalam tadarus malam...",
  ],
  [MoodType.SAD]: [
    "Air matamu adalah permata di hadapan-Nya...",
    "Senyum Ramadhan akan kembali menyinarimu...",
  ]
};

export const getRandomLoadingMessage = (mood: MoodType): string => {
  const messages = MOOD_LOADING_MESSAGES[mood];
  if (!messages) return "Mencari ayat penenang di bulan suci...";
  return messages[Math.floor(Math.random() * messages.length)];
};