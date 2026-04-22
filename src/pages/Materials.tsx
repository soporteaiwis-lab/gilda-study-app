import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderOpen, ExternalLink, Upload, Maximize2, Minimize2 } from 'lucide-react';

const DRIVE_FOLDER_ID = '1HmB4SVm7WraN-4ELBxaEm3RcTjZ9t8Vq';
const DRIVE_URL = `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`;

export const Materials = () => {
  const [fullscreen, setFullscreen] = useState(false);

  // Multiple embed approaches - Google Drive supports these embed URLs
  const embedUrl = `https://drive.google.com/embeddedfolderview?id=${DRIVE_FOLDER_ID}#grid`;

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
        <div className="flex items-center justify-between p-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-emerald-400" />
            <span className="text-white font-medium">Google Drive - DRIVE-APP-ESTUD-IA</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="border-slate-700 text-slate-300"
              onClick={() => window.open(DRIVE_URL, '_blank')}>
              <ExternalLink className="w-4 h-4 mr-1" /> Abrir en Drive
            </Button>
            <Button size="sm" variant="outline" className="border-slate-700 text-slate-300"
              onClick={() => setFullscreen(false)}>
              <Minimize2 className="w-4 h-4 mr-1" /> Salir
            </Button>
          </div>
        </div>
        <iframe
          src={embedUrl}
          className="flex-1 w-full border-0"
          title="Google Drive"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>
    );
  }

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
            <p className="text-xs text-slate-500">Repositorio de materiales · DRIVE-APP-ESTUD-IA</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={() => setFullscreen(true)}>
            <Maximize2 className="w-4 h-4 mr-1" /> Pantalla Completa
          </Button>
          <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={() => window.open(DRIVE_URL, '_blank')}>
            <ExternalLink className="w-4 h-4 mr-1" /> Abrir en Drive
          </Button>
          <Button size="sm" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            onClick={() => window.open(DRIVE_URL, '_blank')}>
            <Upload className="w-4 h-4 mr-1" /> Subir Archivo
          </Button>
        </div>
      </div>

      {/* Embedded Google Drive */}
      <Card className="border-0 overflow-hidden" style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
        <div className="p-3 border-b border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-white">DRIVE-APP-ESTUD-IA</span>
          </div>
          <span className="text-xs text-slate-500">Vista embebida</span>
        </div>
        <div style={{ height: '600px' }}>
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            title="Google Drive - Materiales de Estudio"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            style={{ background: 'white' }}
          />
        </div>
      </Card>

      {/* Tip */}
      <Card className="p-4 border-0" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
        <p className="text-sm text-emerald-400/80">
          💡 <strong className="text-emerald-300">Tip:</strong> Haz clic en "Abrir en Drive" para acceder a todas las funciones de Google Drive 
          (crear carpetas, subir archivos, compartir). Los cambios se reflejarán aquí automáticamente.
        </p>
      </Card>
    </div>
  );
};
