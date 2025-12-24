import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from '../services/firebaseService';

const Login: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Simpan status ke Firestore: status 'pending' agar disetujui manual nanti
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          status: 'pending',
          createdAt: Date.now()
        });
        
        setMessage("Pendaftaran berhasil! Akun Anda sedang menunggu persetujuan admin.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      let friendlyError = "Terjadi kesalahan. Silakan coba lagi.";
      if (err.code === 'auth/user-not-found') friendlyError = "Email tidak terdaftar.";
      if (err.code === 'auth/wrong-password') friendlyError = "Password salah.";
      if (err.code === 'auth/email-already-in-use') friendlyError = "Email sudah terdaftar.";
      if (err.code === 'auth/weak-password') friendlyError = "Password minimal 6 karakter.";
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Masukkan email Anda terlebih dahulu.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Email reset password telah dikirim.");
    } catch (err) {
      setError("Gagal mengirim email reset.");
    }
  };

  return (
    <div className="min-h-screen bg-midnight-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 islamic-bg invert"></div>
      
      <div className="relative z-10 w-full max-w-md animate-scaleIn">
        <div className="text-center mb-10">
          <div className="text-6xl mb-4 drop-shadow-md">🌙</div>
          <h1 className="text-4xl font-serif font-bold text-gold-100">Qur'an Mood</h1>
          <p className="text-gold-600/70 text-sm uppercase tracking-widest mt-2">Pintu Menuju Ketenangan</p>
        </div>

        <div className="bg-midnight-900/80 backdrop-blur-xl p-8 rounded-[3rem] border border-gold-600/30 shadow-2xl">
          <h2 className="text-2xl font-serif font-bold text-gold-200 mb-6 text-center">
            {isRegistering ? "Buat Akun Baru" : "Selamat Datang Kembali"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gold-600 uppercase tracking-widest mb-2 ml-4">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-midnight-950/50 border border-gold-600/20 text-gold-100 focus:outline-none focus:border-gold-500 transition-all shadow-inner"
                placeholder="nama@email.com"
              />
            </div>

            <div className="relative">
              <label className="block text-xs font-bold text-gold-600 uppercase tracking-widest mb-2 ml-4">Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-midnight-950/50 border border-gold-600/20 text-gold-100 focus:outline-none focus:border-gold-500 transition-all shadow-inner"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-[42px] text-gold-600/50 hover:text-gold-500 transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>

            {error && <p className="text-red-400 text-xs text-center font-bold px-4">{error}</p>}
            {message && <p className="text-gold-400 text-xs text-center font-bold px-4">{message}</p>}

            <button 
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-gold-700 to-gold-500 text-midnight-950 font-bold rounded-full shadow-lg hover:shadow-gold-500/20 transform hover:scale-[1.02] active:scale-95 transition-all"
            >
              {loading ? "Memproses..." : isRegistering ? "Daftar Akun" : "Masuk"}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-3">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-gold-500/80 hover:text-gold-400 text-sm font-medium underline underline-offset-4"
            >
              {isRegistering ? "Sudah punya akun? Login" : "Belum punya akun? Daftar"}
            </button>
            {!isRegistering && (
              <button 
                onClick={handleResetPassword}
                className="text-slate-500 hover:text-slate-400 text-xs font-medium"
              >
                Lupa Password?
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;