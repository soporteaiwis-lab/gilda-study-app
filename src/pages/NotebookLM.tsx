import { useState, useRef, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Brain, Send, Upload, FileText, Trash2, Loader2,
  BookOpen, Download, Eye, FileAudio, FileVideo,
  Image as ImageIcon, RefreshCw, X, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Source {
  id: string;
  name: string;
  type: string;
  content: string;
  selected: boolean;
  status: 'ready' | 'processing' | 'error';
  createdAt: string;
}

export const NotebookLM = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola, Gilda! Soy tu cerebro digital. Sube tus documentos de estudio (PDF, Word, Audios, etc.) y podré ayudarte a resumirlos o responder dudas sobre ellos.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewSource, setPreviewSource] = useState<Source | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'sources'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Source));
      setSources(data);
    }, (error) => {
      console.error("Firestore Error:", error);
      toast.error('Error al cargar las fuentes.');
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading(`Digitalizando ${file.name}...`);
    
    try {
      const sourceRef = await addDoc(collection(db, 'sources'), {
        name: file.name,
        type: file.type,
        content: '',
        status: 'processing',
        selected: true,
        createdAt: new Date().toISOString(),
      });

      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        try {
          const res = await fetch('/api/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileBase64: base64,
              mimeType: file.type,
              fileName: file.name
            }),
          });

          if (!res.ok) throw new Error('Error en digitalización');
          const data = await res.json();

          await updateDoc(doc(db, 'sources', sourceRef.id), {
            content: data.text,
            status: 'ready'
          });
          toast.success(`${file.name} listo para estudio`, { id: toastId });
        } catch (err: any) {
          await updateDoc(doc(db, 'sources', sourceRef.id), { status: 'error' });
          toast.error(`Error: ${err.message}`, { id: toastId });
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      toast.error('Error al subir archivo');
    }
  };

  const removeSource = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'sources', id));
      toast.success('Fuente eliminada');
    } catch (err) {
      toast.error('Error al eliminar');
    }
  };

  const toggleSelect = async (id: string, current: boolean) => {
    await updateDoc(doc(db, 'sources', id), { selected: !current });
  };

  const summarizeSource = async (source: Source) => {
    if (loading || !source.content) {
      toast.error('Digitaliza el archivo primero para poder resumirlo.');
      return;
    }
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: `Resume el contenido de: ${source.name}` }]);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Haz un resumen exhaustivo y estructurado del siguiente texto de estudio. Usa viñetas y negritas para resaltar conceptos clave: \n\n${source.content}`,
        }),
      });

      if (!res.ok) throw new Error('Error al resumir');
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
      toast.success('Resumen generado');
    } catch (err: any) {
      toast.error('Error al generar resumen');
    } finally {
      setLoading(false);
    }
  };

  const retryDigitalization = (source: Source) => {
    toast.info(`Para re-intentar digitalizar "${source.name}", por favor vuelve a subir el archivo.`);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const selectedSources = sources.filter(s => s.selected && s.content);
    const context = selectedSources.map(s => `[${s.name}]: ${s.content}`).join('\n\n');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          context: context || undefined
        }),
      });

      if (!res.ok) throw new Error('Error en la respuesta de IA');
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch (err) {
      toast.error('Error al conectar con el cerebro digital');
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-400" />;
    if (type.includes('image')) return <ImageIcon className="w-5 h-5 text-pink-400" />;
    if (type.includes('audio')) return <FileAudio className="w-5 h-5 text-purple-400" />;
    if (type.includes('video')) return <FileVideo className="w-5 h-5 text-blue-400" />;
    return <BookOpen className="w-5 h-5 text-emerald-400" />;
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4 overflow-hidden">
      {/* Sidebar - Fuentes */}
      <Card className="w-80 flex flex-col border-0 bg-slate-900/40 border-slate-800" style={{ border: '1px solid rgba(148, 163, 184, 0.1)' }}>
        <div className="p-4 border-b border-slate-800/50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" /> Fuentes
          </h2>
          <Button size="icon" variant="ghost" className="h-7 w-7 text-purple-400 hover:bg-purple-500/10" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4" />
          </Button>
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} />
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sources.length === 0 && (
            <div className="text-center py-10 opacity-40">
              <Upload className="w-8 h-8 mx-auto mb-2" />
              <p className="text-xs">Sin documentos</p>
            </div>
          )}
          {sources.map(s => (
            <div key={s.id} className={`group relative p-3 rounded-xl border transition-all cursor-pointer ${s.selected ? 'bg-purple-500/10 border-purple-500/30' : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'}`} onClick={() => toggleSelect(s.id, s.selected)}>
              <div className="flex items-start gap-3">
                <div className="mt-1">{s.status === 'processing' ? <Loader2 className="w-5 h-5 text-purple-500 animate-spin" /> : getFileIcon(s.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-200 truncate pr-6">{s.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{s.status === 'ready' ? 'Listo para consultar' : s.status === 'error' ? 'Error al digitalizar' : 'Digitalizando...'}</p>
                </div>
              </div>

              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {s.status === 'error' && (
                  <Button size="icon" variant="ghost" title="Reintentar" className="h-7 w-7 text-red-400 hover:text-white" onClick={(e) => { e.stopPropagation(); retryDigitalization(s); }}>
                    <RefreshCw className="w-3.5 h-3.5" />
                  </Button>
                )}
                {s.status === 'ready' && (
                  <>
                    <Button size="icon" variant="ghost" title="Resumir" className="h-7 w-7 text-amber-400 hover:text-white" onClick={(e) => { e.stopPropagation(); summarizeSource(s); }}>
                      <Sparkles className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" title="Ver Contenido" className="h-7 w-7 text-slate-400 hover:text-white" onClick={(e) => { e.stopPropagation(); setPreviewSource(s); }}>
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </>
                )}
                <Button size="icon" variant="ghost" title="Eliminar" className="h-7 w-7 text-slate-400 hover:text-red-400" onClick={(e) => { e.stopPropagation(); removeSource(s.id); }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {previewSource ? (
          <Card className="flex-1 flex flex-col border-0 bg-slate-900/40 border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-3">
                {getFileIcon(previewSource.type)}
                <h3 className="text-sm font-bold text-white truncate max-w-md">{previewSource.name}</h3>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-8 border-slate-700 text-slate-300" onClick={() => {
                  const blob = new Blob([previewSource.content], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${previewSource.name}_transcripcion.txt`;
                  a.click();
                }}>
                  <Download className="w-4 h-4 mr-2" /> Descargar TXT
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-white" onClick={() => setPreviewSource(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto space-y-4">
                <h1 className="text-2xl font-bold text-white">Previsualización de Texto</h1>
                <div className="prose prose-invert max-w-none">
                  <div className="text-slate-300 leading-relaxed whitespace-pre-wrap font-mono text-sm bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                    {previewSource.content || 'Este documento no tiene contenido digitalizado aún.'}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="flex-1 flex flex-col border-0 bg-slate-900/40 border-slate-800 overflow-hidden" style={{ border: '1px solid rgba(148, 163, 184, 0.1)' }}>
            <div className="p-4 border-b border-slate-800/50 bg-slate-900/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Brain className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Chat de Conocimiento</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50'}`}>
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700/50">
                    <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-slate-800/50 bg-slate-900/60">
              <div className="flex gap-2 max-w-4xl mx-auto">
                <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder={sources.some(s => s.selected && s.status === 'ready') ? "Haz una pregunta sobre tus documentos..." : "Selecciona una fuente para chatear..."} className="bg-slate-950 border-slate-700 text-white focus:ring-purple-500" disabled={loading} />
                <Button onClick={sendMessage} disabled={loading || !input.trim()} style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-[10px] text-center text-slate-600 mt-2">La IA puede cometer errores. Verifica la información importante.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
