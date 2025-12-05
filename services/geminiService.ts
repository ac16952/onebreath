// Lazy-load and initialize GoogleGenAI only when needed in order to avoid
// runtime errors during client-side bundle evaluation (and to allow missing
// VITE_API_KEY to be handled gracefully).
export const generateMindfulnessContent = async (mood: string): Promise<string> => {
  try {
    const resp = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood }),
    });

    if (!resp.ok) {
      console.error('Gemini API returned', resp.status);
      return '似乎暫時無法連結到 AI 導師，請稍後再試。';
    }

    const data = await resp.json();
    return data?.text || '請深呼吸，感受當下的寧靜。';
  } catch (err) {
    console.error('Gemini fetch error:', err);
    return '似乎暫時無法連結到 AI 導師，請稍後再試。';
  }
};