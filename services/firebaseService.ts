
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Mengambil config dari environment variable (Firebase Studio) atau fallback ke placeholder
const firebaseConfig = {
  // Fix: Cast import.meta to any to resolve Property 'env' does not exist on type 'ImportMeta' error in TypeScript
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID"
};

// Cek apakah konfigurasi sudah diisi secara valid
const isConfigValid = firebaseConfig.apiKey !== "YOUR_API_KEY" && firebaseConfig.apiKey !== "";

let app;
let auth: any;
let db: any;

if (isConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully");
  } catch (e) {
    console.warn("Firebase initialization failed, falling back to Demo Mode:", e);
  }
}

export { auth, db, isConfigValid };
