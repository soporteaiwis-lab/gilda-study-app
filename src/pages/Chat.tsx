import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Loader2, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
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

  const suggestions = [
    '¿Qué es la gestión estratégica?',
    'Explica el marketing digital',
    'Resume la macroeconomía',
    '¿Qué es control de gestión?',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.2)' }}>
          <MessageSquare className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Chat con IA</h1>
          <p className="text-xs text-slate-500">Powered by Gemini · Administración de Empresas</p>
        </div>
      </div>

      {/* Chat */}
      <Card className="flex-1 border-0 flex flex-col overflow-hidden min-h-0" style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(148,163,184,0.1)' }}>
        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <Sparkles className="w-12 h-12 text-blue-400/30 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-slate-300 mb-2">¡Hola Gilda!</h2>
                <p className="text-sm text-slate-500 mb-4">Soy tu asistente de estudio. Puedo ayudarte con tus materias de Administración de Empresas.</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestions.map(s => (
                    <Button key={s} size="sm" variant="outline" className="text-xs border-slate-700 text-slate-400"
                      onClick={() => setInput(s)}>
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
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
                <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-slate-800/50 flex gap-2">
          <Input placeholder="Escribe tu pregunta aquí..." value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            className="bg-slate-800/60 border-slate-700/40 text-white placeholder:text-slate-500" />
          <Button onClick={sendMessage} disabled={loading || !input.trim()} style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
