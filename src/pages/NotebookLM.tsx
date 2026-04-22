import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, Send, Upload, FileText, Trash2, Loader2, Sparkles, BookOpen } from 'lucide-react';

interface Source {
  id: string;
  name: string;
  content: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const NotebookPage = () => {
  const [sources, setSources] = useState<Source[]>(() => {
    try { const s = localStorage.getItem('estudia_sources'); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const saveSources = (s: Source[]) => {
    setSources(s);
    try { localStorage.setItem('estudia_sources', JSON.stringify(s)); } catch { /* storage full */ }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newSources: Source[] = [...sources];

    for (const file of Array.from(files)) {
      try {
        const text = await file.text();
        newSources.push({
          id: Date.now().toString() + Math.random().toString(36),
          name: file.name,
          content: text.slice(0, 30000),
        });
      } catch {
        // Binary files - just store name
        newSources.push({
          id: Date.now().toString() + Math.random().toString(36),
          name: file.name,
          content: `[Archivo binario: ${file.name}, tamaño: ${(file.size / 1024).toFixed(1)} KB]`,
        });
      }
    }
    saveSources(newSources);
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeSource = (id: string) => saveSources(sources.filter(s => s.id !== id));
  const clearSources = () => saveSources([]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const context = sources.length > 0
        ? sources.map(s => `--- ${s.name} ---\n${s.content.slice(0, 8000)}`).join('\n\n')
        : '';

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          context: context || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text || 'Sin respuesta' }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.2)' }}>
            <Brain className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Base de Conocimiento</h1>
            <p className="text-xs text-slate-500">Chat IA con tus fuentes de estudio</p>
          </div>
        </div>
        <div className="flex gap-2">
          <input ref={fileRef} type="file" multiple onChange={handleFileUpload} className="hidden" />
          <Button size="sm" variant="outline" className="border-slate-700 text-slate-300" onClick={() => fileRef.current?.click()}>
            <Upload className="w-4 h-4 mr-1" /> Agregar Fuentes
          </Button>
          {sources.length > 0 && (
            <Button size="sm" variant="outline" className="border-red-800/50 text-red-400 hover:text-red-300" onClick={clearSources}>
              <Trash2 className="w-4 h-4 mr-1" /> Limpiar
            </Button>
          )}
        </div>
      </div>

      {/* Sources bar */}
      {sources.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mb-3 flex-shrink-0">
          <span className="text-[11px] text-slate-500 flex items-center gap-1 mr-1"><BookOpen className="w-3 h-3" /> Fuentes ({sources.length}):</span>
          {sources.map(s => (
            <Badge key={s.id} variant="outline" className="text-[10px] border-amber-500/30 text-amber-300 bg-amber-500/10 pr-1 gap-1">
              <FileText className="w-3 h-3" /> {s.name}
              <button onClick={() => removeSource(s.id)} className="ml-0.5 hover:text-red-400"><Trash2 className="w-2.5 h-2.5" /></button>
            </Badge>
          ))}
        </div>
      )}

      {/* Chat */}
      <Card className="flex-1 border-0 flex flex-col overflow-hidden min-h-0" style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(148,163,184,0.1)' }}>
        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <Brain className="w-14 h-14 text-amber-400/20 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-slate-300 mb-2">Base de Conocimiento IA</h2>
                <p className="text-sm text-slate-500 mb-4">
                  {sources.length === 0
                    ? 'Sube tus documentos y pregunta sobre ellos. Acepta cualquier tipo de archivo.'
                    : `${sources.length} fuente(s) cargada(s). ¡Pregunta lo que necesites!`}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Haz un resumen', 'Crea flashcards', 'Preguntas de práctica', 'Conceptos clave'].map(s => (
                    <Button key={s} size="sm" variant="outline" className="text-xs border-slate-700 text-slate-400"
                      onClick={() => setInput(s)}>
                      <Sparkles className="w-3 h-3 mr-1" /> {s}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === 'user' ? 'bg-amber-600 text-white rounded-br-md' : 'bg-slate-800/80 text-slate-200 rounded-bl-md'
              }`}>{msg.content}</div>
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

        <div className="p-3 border-t border-slate-800/50 flex gap-2">
          <Input placeholder="Pregunta sobre tus fuentes..." value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            className="bg-slate-800/60 border-slate-700/40 text-white placeholder:text-slate-500" />
          <Button onClick={sendMessage} disabled={loading || !input.trim()} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
