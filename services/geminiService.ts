
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { HealingContent, MoodType } from "../types";

export const generateHealingContent = async (mood: MoodType): Promise<HealingContent> => {
  // Selalu inisialisasi instance baru untuk memastikan kunci terbaru digunakan (syarat Gemini API)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const systemInstruction = `
    Anda adalah 'Qur'an Mood AI', pendamping spiritual yang bijaksana. 
    Tugas Anda: Memberikan dukungan emosional melalui ayat Al-Quran dan Hadist.
    Kepribadian: Sangat empati, menyejukkan, dan penuh kasih.
    Bahasa: Indonesia yang puitis namun mudah dipahami.
    Instruksi Khusus: Pilih Ayat dan Hadist yang SECARA LANGSUNG menjawab perasaan "${mood}".
  `;

  const prompt = `
    User saat ini merasa "${mood}".
    Berikan respons dalam format JSON dengan struktur:
    - mood: nama perasaan
    - summary: satu kalimat sapaan hangat yang menenangkan
    - quran: { surahName, surahNumber, ayahNumber, arabicText, translation, reflection }
    - hadith: { source (misal: HR. Bukhari), text, reflection }
    - wisdom: satu petuah bijak singkat
    - practicalSteps: [3 langkah nyata untuk merasa lebih baik]
    - reflectionQuestions: [2 pertanyaan renungan]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mood: { type: Type.STRING },
            summary: { type: Type.STRING },
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
            wisdom: { type: Type.STRING },
            practicalSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            reflectionQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["mood", "summary", "quran", "hadith", "wisdom", "practicalSteps", "reflectionQuestions"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("AI returned empty content");
    
    return JSON.parse(resultText.trim());
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Gagal mengambil cahaya petunjuk. Pastikan kunci API aktif.");
  }
};

export const generateSpeech = async (text: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Bacakan dengan nada tenang: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, 
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio returned");
    return base64Audio;
  } catch (error) {
    console.error("TTS Error:", error);
    throw error;
  }
};
