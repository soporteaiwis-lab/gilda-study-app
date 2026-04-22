import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, Send, Upload, FileText, Trash2, Loader2, Sparkles, BookOpen } from 'lucide-react';

interface Source {
  id: string;
  name: string;
  content: string;
  addedAt: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const NotebookPage = () => {
  const [sources, setSources] = useState<Source[]>(() => {
    const saved = localStorage.getItem('estudia_sources');
    return saved ? JSON.parse(saved) : [];
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const saveSources = (s: Source[]) => { setSources(s); localStorage.setItem('estudia_sources', JSON.stringify(s)); };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      const text = await file.text();
      const source: Source = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        content: text.slice(0, 50000), // Limit to ~50k chars
        addedAt: new Date().toISOString(),
      };
      saveSources([...sources, source]);
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeSource = (id: string) => saveSources(sources.filter(s => s.id !== id));

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Build context from all sources
      const context = sources.map(s => `--- Fuente: ${s.name} ---\n${s.content.slice(0, 10000)}`).join('\n\n');

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          context: context || 'No hay fuentes cargadas. Responde basándote en tu conocimiento general.',
          systemPrompt: `Eres un asistente de estudio inteligente tipo NotebookLM. 
Tienes acceso a las fuentes de estudio del usuario. Responde SIEMPRE basándote en las fuentes proporcionadas.
Si la información no está en las fuentes, indícalo claramente.
Puedes: generar resúmenes, crear guías de estudio, hacer flashcards, explicar conceptos, crear preguntas de práctica.
Responde en español de forma clara y educativa.`
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text || data.error || 'Sin respuesta' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error de conexión con el servidor.' }]);
    } finally {
      setLoading(false);
      setTimeout(() => chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' }), 100);
    }
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.2)' }}>
            <Brain className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Base de Conocimiento</h1>
            <p className="text-xs text-slate-500">Chat IA con tus fuentes · Tipo NotebookLM</p>
          </div>
        </div>
        <div className="flex gap-2">
          <input ref={fileRef} type="file" accept=".txt,.md,.csv,.json" multiple onChange={handleFileUpload} className="hidden" />
          <Button size="sm" variant="outline" className="border-slate-700 text-slate-300" onClick={() => fileRef.current?.click()}>
            <Upload className="w-4 h-4 mr-1" /> Agregar Fuentes
          </Button>
        </div>
      </div>

      {/* Sources bar */}
      {sources.length > 0 && (
        <div className="flex gap-2 flex-wrap flex-shrink-0">
          <span className="text-xs text-slate-500 flex items-center gap-1"><BookOpen className="w-3 h-3" /> Fuentes:</span>
          {sources.map(s => (
            <Badge key={s.id} variant="outline" className="text-[11px] border-amber-500/30 text-amber-300 bg-amber-500/10 pr-1 flex items-center gap-1">
              <FileText className="w-3 h-3" /> {s.name}
              <button onClick={() => removeSource(s.id)} className="ml-1 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
            </Badge>
          ))}
        </div>
      )}

      {/* Chat Area */}
      <Card className="flex-1 border-0 flex flex-col overflow-hidden min-h-0" style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(148,163,184,0.1)' }}>
        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Brain className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-slate-400 mb-2">Base de Conocimiento IA</h2>
                <p className="text-sm text-slate-500 max-w-md">
                  {sources.length === 0
                    ? 'Agrega fuentes (.txt, .md, .csv) y luego haz preguntas sobre ellas'
                    : `${sources.length} fuente(s) cargada(s). Pregunta lo que necesites sobre tu material.`}
                </p>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {['Haz un resumen', 'Crea flashcards', 'Preguntas de práctica', 'Explica los conceptos clave'].map(s => (
                    <Button key={s} size="sm" variant="outline" className="text-xs border-slate-700 text-slate-400"
                      onClick={() => { setInput(s); }}>
                      <Sparkles className="w-3 h-3 mr-1" /> {s}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : 'bg-slate-800/80 text-slate-200 rounded-bl-md'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800/80 rounded-2xl rounded-bl-md px-4 py-3">
                <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-800/50 flex gap-2">
          <Input
            placeholder={sources.length > 0 ? 'Pregunta sobre tus fuentes...' : 'Agrega fuentes primero o pregunta directamente...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            className="bg-slate-800/60 border-slate-700/40 text-white placeholder:text-slate-500"
          />
          <Button onClick={sendMessage} disabled={loading || !input.trim()} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
