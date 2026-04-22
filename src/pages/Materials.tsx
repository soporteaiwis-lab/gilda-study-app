import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, File, FileText, Image, Music, Video, ExternalLink, RefreshCw, Upload, ArrowLeft, Loader2, Brain } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'sonner';

const DRIVE_FOLDER_ID = import.meta.env.VITE_DRIVE_FOLDER_ID || '1HmB4SVm7WraN-4ELBxaEm3RcTjZ9t8Vq';
const DRIVE_URL = `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`;

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
  webViewLink?: string;
  webContentLink?: string;
}

const getIcon = (mimeType: string) => {
  if (mimeType.includes('folder')) return FolderOpen;
  if (mimeType.includes('image')) return Image;
  if (mimeType.includes('audio')) return Music;
  if (mimeType.includes('video')) return Video;
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return FileText;
  return File;
};

const getColor = (mimeType: string) => {
  if (mimeType.includes('folder')) return '#f59e0b';
  if (mimeType.includes('image')) return '#ec4899';
  if (mimeType.includes('audio')) return '#8b5cf6';
  if (mimeType.includes('video')) return '#ef4444';
  if (mimeType.includes('pdf')) return '#ef4444';
  if (mimeType.includes('document') || mimeType.includes('word')) return '#3b82f6';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '#10b981';
  if (mimeType.includes('presentation')) return '#f97316';
  return '#64748b';
};

const formatSize = (bytes: string | undefined) => {
  if (!bytes) return '';
  const n = parseInt(bytes);
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1048576).toFixed(1)} MB`;
};

export const Materials = () => {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [folderStack, setFolderStack] = useState<{ id: string; name: string }[]>([{ id: DRIVE_FOLDER_ID, name: 'DRIVE-APP-ESTUD-IA' }]);

  const currentFolder = folderStack[folderStack.length - 1];

  const fetchFiles = async (folderId: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/drive?folderId=${folderId}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setFiles([]);
      } else {
        const sorted = (data.files || []).sort((a: DriveFile, b: DriveFile) => {
          const aFolder = a.mimeType.includes('folder') ? 0 : 1;
          const bFolder = b.mimeType.includes('folder') ? 0 : 1;
          if (aFolder !== bFolder) return aFolder - bFolder;
          return a.name.localeCompare(b.name);
        });
        setFiles(sorted);
      }
    } catch {
      setError('Error de conexión. Verifica que la API de Drive esté habilitada.');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFiles(currentFolder.id); }, [currentFolder.id]);

  const openFolder = (file: DriveFile) => {
    setFolderStack(prev => [...prev, { id: file.id, name: file.name }]);
  };

  const goBack = () => {
    if (folderStack.length > 1) setFolderStack(prev => prev.slice(0, -1));
  };

  const openFile = (file: DriveFile) => {
    if (file.mimeType.includes('folder')) {
      openFolder(file);
    } else if (file.webViewLink) {
      window.open(file.webViewLink, '_blank');
    }
  };

  const importToKnowledge = async (file: DriveFile) => {
    if (file.mimeType.includes('folder')) return;
    const toastId = toast.loading(`Importando ${file.name}...`);
    
    try {
      const sourceRef = await addDoc(collection(db, 'sources'), {
        name: file.name,
        type: file.mimeType,
        content: '',
        status: 'processing',
        selected: true,
        createdAt: new Date().toISOString(),
      });

      toast.info('Archivo enlazado. Iniciando digitalización...', { id: toastId });
      
      const fetchRes = await fetch(`/api/transcribe-drive?fileId=${file.id}`);
      if (!fetchRes.ok) throw new Error('Error al obtener contenido del archivo');
      const data = await fetchRes.json();
      
      await updateDoc(doc(db, 'sources', sourceRef.id), {
        content: data.text,
        status: 'ready'
      });

      toast.success(`${file.name} digitalizado en Conocimiento`, { id: toastId });
    } catch (err: any) {
      toast.error(`Error al importar: ${err.message}`, { id: toastId });
    }
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.2)' }}>
            <FolderOpen className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Google Drive</h1>
            <p className="text-xs text-slate-500">Repositorio de materiales de estudio</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="border-slate-700 text-slate-300" onClick={() => fetchFiles(currentFolder.id)}>
            <RefreshCw className="w-4 h-4 mr-1" /> Actualizar
          </Button>
          <Button size="sm" variant="outline" className="border-slate-700 text-slate-300" onClick={() => window.open(DRIVE_URL, '_blank')}>
            <ExternalLink className="w-4 h-4 mr-1" /> Abrir en Drive
          </Button>
          <Button size="sm" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }} onClick={() => window.open(DRIVE_URL, '_blank')}>
            <Upload className="w-4 h-4 mr-1" /> Subir Archivo
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1 text-sm flex-wrap">
        {folderStack.length > 1 && (
          <Button size="sm" variant="ghost" className="text-slate-400 h-7 px-2" onClick={goBack}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Atrás
          </Button>
        )}
        {folderStack.map((f, i) => (
          <span key={f.id} className="flex items-center">
            {i > 0 && <span className="text-slate-600 mx-1">/</span>}
            <button className={`hover:text-white transition-colors ${i === folderStack.length - 1 ? 'text-white font-medium' : 'text-slate-400'}`}
              onClick={() => setFolderStack(prev => prev.slice(0, i + 1))}>
              {f.name}
            </button>
          </span>
        ))}
      </div>

      <Card className="border-0 overflow-hidden" style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(148,163,184,0.1)' }}>
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Cargando archivos...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-400 text-sm mb-2">{error}</p>
            <Button size="sm" variant="outline" className="border-slate-700 text-slate-300" onClick={() => fetchFiles(currentFolder.id)}>
              Reintentar
            </Button>
          </div>
        ) : files.length === 0 ? (
          <div className="p-12 text-center">
            <FolderOpen className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400">Carpeta vacía</p>
            <p className="text-xs text-slate-600 mt-1">Sube archivos desde Google Drive</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {files.map(file => {
              const Icon = getIcon(file.mimeType);
              const color = getColor(file.mimeType);
              const isFolder = file.mimeType.includes('folder');
              return (
                <div key={file.id} className="flex items-center gap-3 p-3 hover:bg-slate-800/30 cursor-pointer transition-colors"
                  onClick={() => openFile(file)}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}20` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{file.name}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      {file.modifiedTime && <span>{new Date(file.modifiedTime).toLocaleDateString('es-CL')}</span>}
                      {file.size && <span>· {formatSize(file.size)}</span>}
                    </div>
                  </div>
                  {isFolder ? (
                    <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400 bg-amber-500/10">Carpeta</Badge>
                  ) : (
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" title="Importar a Conocimiento" className="h-8 w-8 text-amber-400 hover:text-white" onClick={(e) => { e.stopPropagation(); importToKnowledge(file); }}>
                        <Brain className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-white" onClick={(e) => { e.stopPropagation(); window.open(file.webViewLink, '_blank'); }}>
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
