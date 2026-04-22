import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderOpen, ExternalLink, Upload, Plus, FileText, Image, File } from 'lucide-react';

const DRIVE_FOLDER_ID = '1HmB4SVm7WraN-4ELBxaEm3RcTjZ9t8Vq';
const DRIVE_URL = `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`;
const DRIVE_EMBED_URL = `https://drive.google.com/embeddedfolderview?id=${DRIVE_FOLDER_ID}#list`;

export const Materials = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
            <FolderOpen className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Google Drive</h1>
            <p className="text-xs text-slate-500">Repositorio de materiales de estudio</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={() => window.open(DRIVE_URL, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Abrir en Drive
          </Button>
          <Button
            size="sm"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            onClick={() => window.open(DRIVE_URL, '_blank')}
          >
            <Upload className="w-4 h-4 mr-1" />
            Subir Archivo
          </Button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { icon: FileText, label: 'Documentos', desc: 'PDFs, Word, presentaciones', color: '#3b82f6' },
          { icon: Image, label: 'Imágenes', desc: 'Diagramas y gráficos', color: '#f59e0b' },
          { icon: File, label: 'Otros', desc: 'Hojas de cálculo, etc.', color: '#8b5cf6' },
        ].map((item) => (
          <Card key={item.label} className="p-4 border-0" style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${item.color}20` }}>
                <item.icon className="w-4 h-4" style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Embedded Google Drive */}
      <Card className="border-0 overflow-hidden" style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
        <div className="p-4 border-b border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-white">DRIVE-APP-ESTUD-IA</span>
          </div>
          <span className="text-xs text-slate-500">Carpeta compartida</span>
        </div>
        <div className="relative" style={{ height: '500px' }}>
          <iframe
            src={DRIVE_EMBED_URL}
            className="w-full h-full border-0"
            title="Google Drive - Materiales de Estudio"
            allow="autoplay"
            style={{ background: '#1e293b' }}
          />
        </div>
      </Card>

      {/* Quick Tips */}
      <Card className="p-4 border-0" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
        <div className="flex items-start gap-3">
          <Plus className="w-5 h-5 text-blue-400 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-300 font-medium">Consejo:</p>
            <p className="text-blue-400/70">
              Sube tus documentos, guías de clase y presentaciones a la carpeta de Drive. 
              Luego podrás usar el Chat IA para hacer preguntas sobre el contenido de tus materiales.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
