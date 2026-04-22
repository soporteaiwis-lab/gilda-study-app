import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { fileBase64, mimeType, fileName } = req.body;
    if (!fileBase64) return res.status(400).json({ error: 'File data is required' });

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let prompt = '';
    if (mimeType.startsWith('image/')) {
      prompt = 'Describe todo el texto y contenido de esta imagen con el mayor detalle posible. Si es un documento, transcribe todo el texto.';
    } else if (mimeType.startsWith('audio/')) {
      prompt = 'Transcribe exactamente todo lo que se dice en este audio. Si es una clase o lección, organiza los puntos clave.';
    } else if (mimeType.startsWith('video/')) {
      prompt = 'Resume el contenido de este video y transcribe el audio. Explica visualmente qué sucede si es relevante para el estudio.';
    } else if (mimeType === 'application/pdf') {
      prompt = 'Transcribe el contenido de este documento PDF a texto plano de forma organizada.';
    } else {
      prompt = 'Extrae y organiza el contenido de este archivo para estudio.';
    }

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: fileBase64,
          mimeType: mimeType
        }
      }
    ]);

    const text = result.response.text();
    return res.status(200).json({ text });
  } catch (error: any) {
    console.error('Transcription Error:', error);
    return res.status(500).json({ error: error.message || 'Transcription failed' });
  }
}
