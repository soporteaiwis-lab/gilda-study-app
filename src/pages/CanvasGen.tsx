import { useState } from 'react';
import { askGemini } from '../services/geminiService';

export default function CanvasGen() {
  const [loadingHtml, setLoadingHtml] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [audioScript, setAudioScript] = useState('');

  const generateInfographic = async () => {
    setLoadingHtml(true);
    try {
      const prompt = `Genera una infografía moderna en formato HTML puro y Tailwind CSS sobre los conceptos básicos de Inteligencia Artificial. NO incluyas markdown, SOLO devuelve el código HTML que pueda ser inyectado directamente en un div. Usa clases de Tailwind para colores vibrantes, sombras y layout. Asegúrate de incluir el script de CDN de Tailwind si vas a usar clases directamente o asume que tailwind ya está configurado.`;
      let res = await askGemini(prompt);
      
      if (res.startsWith('```html')) {
        res = res.replace(/^```html\n?/, '').replace(/\n?```$/, '');
      } else if (res.startsWith('```')) {
        res = res.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }
      setHtmlContent(res);
    } catch (e) {
      console.error(e);
      alert('Error generando infografía.');
    } finally {
      setLoadingHtml(false);
    }
  };

  const generateAudioSummary = async () => {
    setLoadingAudio(true);
    try {
      const prompt = `Escribe un guion muy corto (2 párrafos) introduciendo a los estudiantes en qué es la plataforma Gilda Study v2. Que sea dinámico y motivador. Devuelve SOLO el texto a leer.`;
      const res = await askGemini(prompt);
      setAudioScript(res);
      
      const utterance = new SpeechSynthesisUtterance(res);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error(e);
      alert('Error generando resumen de audio.');
    } finally {
      setLoadingAudio(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Canvas Gen</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-xl font-bold text-blue-400 mb-2">Generador de Infografías</h3>
          <p className="text-slate-400 mb-4">Usa Gemini para crear UI renderizable basada en el RAG.</p>
          <button 
            onClick={generateInfographic}
            disabled={loadingHtml}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors w-full font-medium">
            {loadingHtml ? 'Generando...' : 'Generar Infografía Demo'}
          </button>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-xl font-bold text-purple-400 mb-2">Resumen de Audio</h3>
          <p className="text-slate-400 mb-4">Genera un guion y reprodúcelo con Web Speech API.</p>
          <button 
            onClick={generateAudioSummary}
            disabled={loadingAudio}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors w-full font-medium">
            {loadingAudio ? 'Generando y Hablando...' : 'Reproducir Resumen Demo'}
          </button>
          {audioScript && (
             <div className="mt-4 p-3 bg-slate-900 rounded border border-slate-700 text-sm text-slate-300">
               {audioScript}
             </div>
          )}
        </div>
      </div>

      {htmlContent && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-700 min-h-[400px]">
          <div className="p-2 bg-slate-200 border-b border-slate-300 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-xs text-slate-500 font-medium ml-2">Infografía Generada</span>
          </div>
          <div 
            className="p-8 w-full text-black"
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        </div>
      )}
    </div>
  );
}
