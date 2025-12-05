// Serverless endpoint for calling Google Gemini (GenAI)
// This runs on Vercel (server-side) so the API key remains secret.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mood } = req.body || {};
  if (!mood) {
    return res.status(400).json({ error: 'Missing mood in request body' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server missing GEMINI API key' });
  }

  try {
    const mod = await import('@google/genai');
    const { GoogleGenAI } = mod;
    const ai = new GoogleGenAI({ apiKey });

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
      model,
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 0 } },
    });

    const text = response?.text || '';
    return res.status(200).json({ text });
  } catch (err) {
    console.error('Gemini server error:', err);
    return res.status(502).json({ error: 'AI service unavailable' });
  }
}
