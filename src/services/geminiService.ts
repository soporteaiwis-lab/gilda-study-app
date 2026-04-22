import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export const askGemini = async (prompt: string, context: string = "") => {
  try {
    const fullPrompt = context ? `Utiliza el siguiente contexto para responder a la pregunta de la mejor manera posible.\n\nContexto:\n${context}\n\nPregunta:\n${prompt}` : prompt;
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error with Gemini:", error);
    throw error;
  }
};
