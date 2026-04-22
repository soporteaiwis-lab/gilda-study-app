import { GoogleGenerativeAI } from '@google/generative-ai';
declare var process: any;

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { message, context } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY no configurada en el servidor' });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt = `Eres un asistente de estudio especializado en Administración de Empresas.
CONTEXTO: Estudiante Gilda Cuvertino, Ing. en Administración de Empresas, modalidad online.
INSTRUCCIONES: Responde en español de Chile. Sé claro, educativo y conciso. Usa ejemplos prácticos.`;

    const prompt = context
      ? `${systemPrompt}\n\nFUENTES DEL USUARIO:\n${context}\n\nPregunta: ${message}`
      : `${systemPrompt}\n\nPregunta: ${message}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return res.status(200).json({ text });
  } catch (error: any) {
    console.error('Gemini API Error:', error?.message || error);
    return res.status(500).json({ error: error?.message || 'Failed to generate response' });
  }
}
