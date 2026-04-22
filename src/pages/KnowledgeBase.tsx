import React from 'react';

export default function KnowledgeBase() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Knowledge Base (RAG)</h2>
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <p className="text-slate-400">Selecciona un documento de Google Drive para chatear con Gemini.</p>
        <div className="mt-4 p-4 border border-dashed border-slate-600 rounded-lg text-center">
          Componente de subida/selección pendiente
        </div>
      </div>
    </div>
  );
}
