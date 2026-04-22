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

    // Use Gemini API Key from environment
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Gemini API Key not configured in environment' });

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use 1.5 Flash for speed and large context
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let prompt = '';
    if (mimeType.startsWith('image/')) {
      prompt = 'Transcribe todo el texto de esta imagen. Si es un documento de estudio, organiza los temas principales.';
    } else if (mimeType.startsWith('audio/')) {
      prompt = 'Transcribe el audio de forma completa y profesional. Divide por temas si es una clase.';
    } else if (mimeType.startsWith('video/')) {
      prompt = 'Resume el video y transcribe los diálogos más importantes para el estudio.';
    } else if (mimeType === 'application/pdf' || mimeType.includes('document')) {
      prompt = 'Digitaliza este documento extrayendo TODO el texto de forma fiel. No omitas detalles importantes.';
    } else {
      prompt = 'Extrae el contenido de este archivo para integrarlo en una base de conocimientos RAG.';
    }

    // Safety check for base64 size (approx 20MB limit for inlineData)
    if (fileBase64.length > 25000000) { // ~25MB base64
       return res.status(413).json({ error: 'El archivo es demasiado grande para procesamiento directo (>20MB). Por favor recórtalo o sube una versión más ligera.' });
    }

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          data: fileBase64,
          mimeType: mimeType
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();

    if (!text) throw new Error('La IA no devolvió ningún texto.');

    return res.status(200).json({ text });
  } catch (error: any) {
    console.error('Transcription Error:', error);
    return res.status(500).json({ 
      error: 'Falla en la digitalización', 
      details: error.message,
      suggestion: 'Intenta con un archivo más pequeño o de otro formato.'
    });
  }
}
