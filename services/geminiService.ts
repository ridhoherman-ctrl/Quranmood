import { GoogleGenAI, Type, Modality } from "@google/genai";
import { HealingContent, MoodType } from "../types";

// Check for API Key
const API_KEY = process.env.API_KEY;

export const generateHealingContent = async (mood: MoodType): Promise<HealingContent> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Timestamp injection to ensure uniqueness and prevent caching similarity
  const uniqueSeed = Date.now();

  const prompt = `
    Seorang pengguna sedang merasa "${mood}". 
    Bertindaklah sebagai teman yang bijaksana, psikolog Islami, dan ustadz yang menenangkan.
    
    TUGAS PENTING:
    1. Pilihkan satu ayat Al-Quran (lengkap harakat & arti) yang relevan. 
       CATATAN: Lakukan pemilihan secara ACAK/RANDOM dari berbagai surat yang mungkin relevan. JANGAN memberikan ayat yang sama terus menerus untuk mood ini. Variasikan pilihannya.
    2. Pilihkan satu Hadist (sumber & isi) yang relevan sebagai penguat. Variasikan juga hadistnya.
    3. "wisdom": Sebuah paragraf hikmah mendalam yang menghubungkan perasaan user dengan ayat/hadist tersebut.
    4. "practicalSteps": Berikan 3 poin tindakan nyata.
    5. "reflectionQuestions": Berikan 2 pertanyaan renungan.
    
    Random Seed: ${uniqueSeed} (Gunakan ini untuk memastikan hasil yang berbeda dari request sebelumnya)

    Pastikan bahasa Indonesia yang digunakan hangat, menyentuh hati, dan empatik.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mood: { type: Type.STRING },
            summary: { type: Type.STRING, description: "Kalimat pembuka yang hangat." },
            quran: {
              type: Type.OBJECT,
              properties: {
                surahName: { type: Type.STRING },
                surahNumber: { type: Type.INTEGER },
                ayahNumber: { type: Type.INTEGER },
                arabicText: { type: Type.STRING },
                translation: { type: Type.STRING },
                reflection: { type: Type.STRING },
              },
              required: ["surahName", "surahNumber", "ayahNumber", "arabicText", "translation", "reflection"]
            },
            hadith: {
              type: Type.OBJECT,
              properties: {
                source: { type: Type.STRING },
                text: { type: Type.STRING },
                reflection: { type: Type.STRING },
              },
              required: ["source", "text", "reflection"]
            },
            wisdom: { type: Type.STRING, description: "Hikmah mendalam tentang perasaan ini dalam pandangan Islam" },
            practicalSteps: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3 langkah praktis/amalan"
            },
            reflectionQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 pertanyaan renungan"
            }
          },
          required: ["mood", "summary", "quran", "hadith", "wisdom", "practicalSteps", "reflectionQuestions"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(text) as HealingContent;

  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Maaf, kami mengalami kendala saat mencari penawar hatimu. Silakan coba lagi.");
  }
};

export const generateSpeech = async (text: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is missing.");
  }
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: { parts: [{ text }] },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' }, 
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data returned");
    return base64Audio;
  } catch (error) {
    console.error("Error generating speech:", error);
    throw new Error("Gagal menghasilkan suara. Silakan coba lagi nanti.");
  }
};