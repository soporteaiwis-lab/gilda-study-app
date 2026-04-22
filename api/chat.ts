import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `
      Eres un asistente de estudio especializado en Administración de Empresas.
      
      CONTEXTO DEL USUARIO:
      - Estudiante: Gilda Cuvertino
      - Carrera: Administración de Empresas
      - Nivel: Universitario
      - Idioma: Español de Chile
      
      INSTRUCCIONES:
      - Responde basándote en el contexto proporcionado
      - Si no hay suficiente información, sugiere cargar material relevante
      - Usa ejemplos del contexto empresarial chileno/latinoamericano
      - Sé claro y conciso
    `;

    const prompt = context 
      ? `${systemPrompt}\n\nCONTEXTO DE DOCUMENTOS:\n${context}\n\nPregunta: ${message}`
      : `${systemPrompt}\n\nPregunta: ${message}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return res.status(200).json({ text: responseText });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}
