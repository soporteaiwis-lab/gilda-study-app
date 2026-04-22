import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { fetchDriveFiles, fetchFileContent } from '../services/driveService';
import { askGemini } from '../services/geminiService';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export default function KnowledgeBase() {
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [chatLog, setChatLog] = useState<{q: string, a: string}[]>([]);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    const folderId = import.meta.env.VITE_DRIVE_FOLDER_ID;
    if (folderId) {
      const f = await fetchDriveFiles(folderId);
      setFiles(f);
    }
  };

  const handleSelectFile = async (file: any) => {
    setSelectedFile(file);
    setLoading(true);
    setContext('');
    setAnswer('');
    setChatLog([]);
    try {
      const blob = await fetchFileContent(file.id);
      if (blob && file.mimeType === 'application/pdf') {
        const arrayBuffer = await blob.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          text += strings.join(' ') + '\n';
        }
        setContext(text);
      } else if (blob && file.mimeType.includes('text')) {
        const text = await blob.text();
        setContext(text);
      } else {
        alert("Formato no soportado para lectura directa (solo PDF/TXT).");
      }
    } catch (e) {
      console.error(e);
      alert('Error procesando el documento.');
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!question || !context) return;
    setLoading(true);
    try {
      const res = await askGemini(question, context);
      setAnswer(res);
      setChatLog(prev => [...prev, { q: question, a: res }]);
      setQuestion('');
    } catch (e) {
      console.error(e);
      alert('Error consultando a Gemini');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full gap-6">
      <div className="w-1/3 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col h-[calc(100vh-6rem)]">
        <h3 className="text-xl font-bold mb-4 text-slate-200">Drive Repository</h3>
        <ul className="flex-1 overflow-auto divide-y divide-slate-700">
          {files.map(f => (
            <li key={f.id} 
                className={`p-3 cursor-pointer hover:bg-slate-700 transition-colors ${selectedFile?.id === f.id ? 'bg-slate-700 border-l-4 border-blue-500' : ''}`}
                onClick={() => handleSelectFile(f)}>
              <span className="text-sm font-medium block truncate" title={f.name}>{f.name}</span>
            </li>
          ))}
          {files.length === 0 && <p className="text-sm text-slate-500 italic">No files found.</p>}
        </ul>
      </div>

      <div className="w-2/3 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col h-[calc(100vh-6rem)]">
        <h3 className="text-xl font-bold mb-4 text-slate-200">
          {selectedFile ? `Analizando: ${selectedFile.name}` : 'Selecciona un documento'}
        </h3>
        
        <div className="flex-1 overflow-auto mb-4 bg-slate-900 rounded-lg p-4 space-y-4">
          {loading && !context && <p className="text-blue-400 animate-pulse">Procesando documento...</p>}
          {context && chatLog.length === 0 && <p className="text-green-400">¡Documento cargado en el contexto! Haz una pregunta.</p>}
          {chatLog.map((chat, idx) => (
            <div key={idx} className="space-y-2">
              <div className="bg-blue-600/20 p-3 rounded-lg border border-blue-500/30 w-fit max-w-[80%] ml-auto">
                <p className="text-blue-200 font-medium">{chat.q}</p>
              </div>
              <div className="bg-slate-700 p-3 rounded-lg border border-slate-600 w-fit max-w-[90%] prose prose-invert">
                <p className="text-slate-300 whitespace-pre-wrap">{chat.a}</p>
              </div>
            </div>
          ))}
          {loading && context && <p className="text-slate-400 italic animate-pulse">Gemini está pensando...</p>}
        </div>

        <div className="flex gap-2">
          <input 
            type="text" 
            className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
            placeholder={context ? "Pregunta sobre el documento..." : "Selecciona un documento primero"}
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAsk()}
            disabled={!context || loading}
          />
          <button 
            onClick={handleAsk}
            disabled={!context || loading || !question}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors font-medium"
          >
            Preguntar
          </button>
        </div>
      </div>
    </div>
  );
}
