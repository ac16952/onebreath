// Lazy-load and initialize GoogleGenAI only when needed in order to avoid
// runtime errors during client-side bundle evaluation (and to allow missing
// VITE_API_KEY to be handled gracefully).
export const generateMindfulnessContent = async (mood: string): Promise<string> => {
  if (!import.meta.env.VITE_API_KEY) {
    return "請配置 Gemini API Key 以使用此功能。";
  }

  try {
    // Dynamically import - avoids bundling/initializing at module load time.
    const mod = await import('@google/genai');
    const { GoogleGenAI } = mod as any;
    const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY as string });

    const model = 'gemini-2.5-flash';
    const prompt = `
      You are a gentle, calm mindfulness coach for a web app called "One Breath Rest Stop".
      The user is feeling: "${mood}".
      
      Please provide a very short, soothing paragraph (max 100 words) in Traditional Chinese (Taiwanese usage).
      It should acknowledge their feeling and gently guide them back to the present moment using a metaphor from nature (ocean, forest, sky, etc.).
      
      Tone: Warm, slow, Morandi-like (soft), non-judgmental.
      Do NOT use Markdown formatting. Just plain text.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response?.text || "請深呼吸，感受當下的寧靜。";
  } catch (error) {
    console.error('Gemini Error:', error);
    return "似乎暫時無法連結到 AI 導師，請稍後再試。";
  }
};