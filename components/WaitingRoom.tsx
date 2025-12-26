
import React from 'react';
import { auth } from '../services/firebaseService';

const WaitingRoom: React.FC = () => {
  return (
    <div className="min-h-screen bg-midnight-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 opacity-10 pointer-events-none islamic-bg invert"></div>
      
      <div className="relative z-10 max-w-lg w-full flex flex-col items-center gap-8 animate-fadeIn">
        {/* Animated Spiritual Symbol */}
        <div className="relative w-40 h-40 flex items-center justify-center">
           <div className="absolute inset-0 bg-gold-500/10 rounded-full blur-3xl animate-pulse"></div>
           <div className="text-8xl animate-float">🕊️</div>
           <div className="absolute -bottom-4 bg-gold-600/20 px-4 py-1 rounded-full border border-gold-600/30 text-gold-400 text-xs font-bold uppercase tracking-widest">
             Sabar & Syukur
           </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-serif font-bold text-gold-100">Menanti Restu</h1>
          <div className="h-0.5 w-24 bg-gold-600/30 mx-auto"></div>
          <p className="text-lg text-slate-400 font-light leading-relaxed">
            "Sesuatu yang ditakdirkan untukmu tidak akan pernah menjadi milik orang lain."
          </p>
        </div>

        <div className="bg-midnight-900/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-gold-600/20 shadow-2xl">
          <p className="text-gold-200 font-serif italic text-xl mb-4">
            Terima kasih telah bergabung, Sahabat.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Akun Anda saat ini sedang dalam proses tinjauan manual oleh admin untuk menjaga kualitas komunitas <strong>Qur'an Mood</strong>. Silakan periksa kembali secara berkala.
          </p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gradient-to-r from-gold-700 to-gold-500 text-midnight-950 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
            >
              Cek Status Akses
            </button>
            <button 
              onClick={() => auth.signOut()}
              className="text-slate-500 hover:text-gold-500 text-sm font-medium transition-colors"
            >
              Keluar & Gunakan Akun Lain
            </button>
          </div>
        </div>

        <footer className="mt-8">
           <p className="text-gold-600/40 font-serif italic text-sm">
             "Allah menyukai orang-orang yang sabar."
           </p>
        </footer>
      </div>
    </div>
  );
};

export default WaitingRoom;
