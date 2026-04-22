
export default function CanvasGen() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Canvas Gen</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-xl font-bold text-blue-400 mb-2">Generador de Infografías</h3>
          <p className="text-slate-400 mb-4">Usa Gemini para crear UI renderizable basada en el RAG.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full">
            Generar Infografía
          </button>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-xl font-bold text-purple-400 mb-2">Resumen de Audio</h3>
          <p className="text-slate-400 mb-4">Genera un guion y reprodúcelo con Web Speech API.</p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors w-full">
            Reproducir Resumen
          </button>
        </div>
      </div>
    </div>
  );
}
