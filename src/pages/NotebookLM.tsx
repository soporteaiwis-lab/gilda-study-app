import { useState, useRef, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Brain, Send, Upload, FileText, Trash2, Loader2,
  BookOpen, Download, Eye, FileAudio, FileVideo,
  Image as ImageIcon, RefreshCw, X
} from 'lucide-react';
import { toast } from 'sonner';

interface Source {
  id: string;
  name: string;
  content: string;
  type: string;
  status: 'pending' | 'processing' | 'ready' | 'error';
  selected: boolean;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const NotebookPage = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewSource, setPreviewSource] = useState<Source | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Firestore Sync
  useEffect(() => {
    const q = query(collection(db, 'sources'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Source));
      setSources(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const newSource = {
        name: file.name,
        type: file.type,
        content: '',
        status: 'pending' as const,
        selected: true,
        createdAt: new Date().toISOString(),
      };

      try {
        const docRef = await addDoc(collection(db, 'sources'), newSource);
        processFile(file, docRef.id);
      } catch (err) {
        toast.error(`Error al subir ${file.name}`);
      }
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const processFile = async (file: File, docId: string) => {
    await updateDoc(doc(db, 'sources', docId), { status: 'processing' });

    try {
      // For text files, read directly
      if (file.type === 'text/plain' || file.type === 'application/json') {
        const text = await file.text();
        await updateDoc(doc(db, 'sources', docId), {
          content: text,
          status: 'ready'
        });
        return;
      }

      // For others, use Gemini Transcription
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
            })
          });

          if (!res.ok) throw new Error('Transcription failed');
          const data = await res.json();

          await updateDoc(doc(db, 'sources', docId), {
            content: data.text,
            status: 'ready'
          });
          toast.success(`${file.name} procesado con éxito`);
        } catch (err) {
          await updateDoc(doc(db, 'sources', docId), { status: 'error' });
          toast.error(`Error procesando ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      await updateDoc(doc(db, 'sources', docId), { status: 'error' });
    }
  };

  const removeSource = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'sources', id));
    } catch (err) {
      toast.error('Error al eliminar');
    }
  };

  const toggleSelect = async (id: string, current: boolean) => {
    await updateDoc(doc(db, 'sources', id), { selected: !current });
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const context = sources
        .filter(s => s.selected && s.status === 'ready')
        .map(s => `--- FUENTE: ${s.name} ---\n${s.content}`)
        .join('\n\n');

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          context: context || undefined,
        }),
      });

      if (!res.ok) throw new Error('Error en el servidor');
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const downloadTxt = (source: Source) => {
    const blob = new Blob([source.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${source.name}_transcripcion.txt`;
    a.click();
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-emerald-400" />;
    if (type.startsWith('audio/')) return <FileAudio className="w-5 h-5 text-blue-400" />;
    if (type.startsWith('video/')) return <FileVideo className="w-5 h-5 text-purple-400" />;
    return <FileText className="w-5 h-5 text-amber-400" />;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-6xl mx-auto gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">

        {/* Sidebar: Fuentes */}
        <div className="lg:col-span-1 flex flex-col gap-3 min-h-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" /> Fuentes
            </h2>
            <Button size="sm" variant="outline" className="border-slate-700 h-8" onClick={() => fileRef.current?.click()}>
              <Upload className="w-3 h-3 mr-2" /> Subir
            </Button>
            <input ref={fileRef} type="file" multiple onChange={handleFileUpload} className="hidden" />
          </div>

          <Card className="flex-1 bg-slate-900/40 border-slate-800 overflow-y-auto p-2 space-y-2">
            {sources.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 opacity-40">
                <Upload className="w-8 h-8 mb-2" />
                <p className="text-xs">Sube archivos para comenzar el análisis RAG</p>
              </div>
            )}
            {sources.map(s => (
              <div key={s.id} className={`group relative p-3 rounded-xl border transition-all ${s.selected ? 'bg-amber-500/5 border-amber-500/20' : 'bg-slate-800/40 border-slate-700/50'}`}>
                <div className="flex items-start gap-3">
                  <Checkbox checked={s.selected} onCheckedChange={() => toggleSelect(s.id, s.selected)} className="mt-1 border-slate-600" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getFileIcon(s.type)}
                      <p className="text-xs font-medium text-slate-200 truncate">{s.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.status === 'processing' ? (
                        <span className="flex items-center gap-1 text-[10px] text-amber-400"><RefreshCw className="w-3 h-3 animate-spin" /> Procesando...</span>
                      ) : s.status === 'ready' ? (
                        <span className="text-[10px] text-emerald-400 font-medium">Digitalizado</span>
                      ) : s.status === 'error' ? (
                        <span className="text-[10px] text-red-400">Error</span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-white" onClick={() => setPreviewSource(s)}>
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-red-400" onClick={() => removeSource(s.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Main: Chat & Preview */}
        <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
          <Card className="flex-1 bg-slate-900/60 border-slate-800 flex flex-col overflow-hidden">
            {/* Chat Messages */}
            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                  <Brain className="w-12 h-12 text-amber-400/20 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Asistente de Conocimiento</h3>
                  <p className="text-sm text-slate-500">Selecciona tus fuentes y pregunta cualquier cosa. La IA responderá basada en el contenido digitalizado.</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                    msg.role === 'user' ? 'bg-amber-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/50'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 rounded-2xl rounded-bl-none px-4 py-2.5 border border-slate-700/50">
                    <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-800 bg-slate-900/40">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Pregunta sobre las fuentes seleccionadas..."
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
                <Button onClick={sendMessage} disabled={loading || !input.trim()} className="bg-amber-600 hover:bg-amber-700">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      {previewSource && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-3xl max-h-[80vh] flex flex-col bg-slate-900 border-slate-800">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getFileIcon(previewSource.type)}
                <div>
                  <h3 className="text-white font-semibold text-sm">{previewSource.name}</h3>
                  <p className="text-[10px] text-slate-500">Vista previa del contenido digitalizado</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 border-slate-700 text-slate-300" onClick={() => downloadTxt(previewSource)}>
                  <Download className="w-3.5 h-3.5 mr-2" /> Bajar .txt
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400" onClick={() => setPreviewSource(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-slate-950/50">
              <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                {previewSource.status === 'ready' ? previewSource.content : 'Procesando contenido...'}
                {previewSource.status === 'error' && 'Hubo un error al procesar este archivo.'}
              </pre>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
