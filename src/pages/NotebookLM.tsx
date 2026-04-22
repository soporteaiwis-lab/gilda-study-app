import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Notebook, ExternalLink, Sparkles, BookOpen, Mic, FileText, BarChart3, Brain } from 'lucide-react';

const NOTEBOOK_URL = 'https://notebooklm.google.com/notebook/536ab9bb-432f-4a27-9565-cf9b1baabe48';

export const NotebookPage = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
            <Notebook className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">NotebookLM</h1>
            <p className="text-xs text-slate-500">Cuaderno de estudio potenciado con IA de Google</p>
          </div>
        </div>
        <Button
          size="sm"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
          onClick={() => window.open(NOTEBOOK_URL, '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          Abrir NotebookLM
        </Button>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { icon: Sparkles, label: 'Chat con IA', desc: 'Conversa con tus documentos usando IA de Google', color: '#f59e0b' },
          { icon: Mic, label: 'Resumen en Audio', desc: 'Genera podcasts de tus materiales', color: '#ec4899' },
          { icon: FileText, label: 'Guías de Estudio', desc: 'Crea guías automáticas de tus fuentes', color: '#3b82f6' },
          { icon: BarChart3, label: 'Infografías', desc: 'Visualiza datos e información clave', color: '#10b981' },
          { icon: Brain, label: 'Mapa Mental', desc: 'Organiza conceptos visualmente', color: '#8b5cf6' },
          { icon: BookOpen, label: 'Tarjetas Didácticas', desc: 'Flashcards para memorizar', color: '#06b6d4' },
        ].map((feature) => (
          <Card key={feature.label} className="p-5 border-0 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
            style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)' }}
            onClick={() => window.open(NOTEBOOK_URL, '_blank')}
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${feature.color}20` }}>
                <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{feature.label}</p>
                <p className="text-xs text-slate-500">{feature.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Notebook Embed / Link Card */}
      <Card className="border-0 overflow-hidden" style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
        <div className="p-4 border-b border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Notebook className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-white">APP-ESTUD-IA</span>
          </div>
          <span className="text-xs text-slate-500">NotebookLM</span>
        </div>
        <div className="relative" style={{ height: '500px' }}>
          <iframe
            src={NOTEBOOK_URL}
            className="w-full h-full border-0"
            title="NotebookLM - APP ESTUD-IA"
            allow="autoplay; clipboard-write"
            style={{ background: '#1e293b' }}
          />
        </div>
      </Card>

      {/* Info */}
      <Card className="p-4 border-0" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 mt-0.5" />
          <div className="text-sm">
            <p className="text-amber-300 font-medium">¿Qué es NotebookLM?</p>
            <p className="text-amber-400/70">
              NotebookLM de Google te permite subir documentos (PDFs, Google Docs) y conversar con ellos usando IA. 
              Puede generar resúmenes de audio (podcasts), guías de estudio, tarjetas didácticas, mapas mentales y más.
              Sube tus materiales de clase aquí para maximizar tu aprendizaje.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
