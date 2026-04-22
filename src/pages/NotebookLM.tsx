import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Notebook, ExternalLink, Sparkles, BookOpen, Mic, FileText, BarChart3, Brain, ArrowUpRight } from 'lucide-react';

const NOTEBOOK_URL = 'https://notebooklm.google.com/notebook/536ab9bb-432f-4a27-9565-cf9b1baabe48';

export const NotebookPage = () => {
  const openNotebook = () => window.open(NOTEBOOK_URL, 'notebooklm', 'width=1200,height=800,toolbar=no,menubar=no');

  const features = [
    { icon: Sparkles, label: 'Chat con IA', desc: 'Conversa sobre tus documentos con la IA de Google', color: '#f59e0b' },
    { icon: Mic, label: 'Resumen en Audio', desc: 'Genera podcasts de tus materiales de estudio', color: '#ec4899' },
    { icon: FileText, label: 'Guías de Estudio', desc: 'Genera guías automáticas desde tus fuentes', color: '#3b82f6' },
    { icon: BarChart3, label: 'Infografías', desc: 'Visualiza datos e información clave', color: '#10b981' },
    { icon: Brain, label: 'Mapa Mental', desc: 'Organiza conceptos visualmente', color: '#8b5cf6' },
    { icon: BookOpen, label: 'Tarjetas Didácticas', desc: 'Flashcards para memorizar conceptos', color: '#06b6d4' },
  ];

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
            <p className="text-xs text-slate-500">Cuaderno IA de Google · APP-ESTUD-IA</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }} onClick={openNotebook}>
            <ExternalLink className="w-4 h-4 mr-1" /> Abrir NotebookLM
          </Button>
        </div>
      </div>

      {/* Main CTA */}
      <Card className="p-8 border-0 text-center cursor-pointer transition-all hover:scale-[1.01]"
        style={{ 
          background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))',
          border: '1px solid rgba(245,158,11,0.3)',
        }}
        onClick={openNotebook}
      >
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 8px 32px rgba(245,158,11,0.3)' }}>
          <Notebook className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">APP-ESTUD-IA</h2>
        <p className="text-slate-400 mb-4">Tu cuaderno de estudio potenciado con IA de Google</p>
        <Button size="lg" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }} onClick={openNotebook}>
          <ArrowUpRight className="w-5 h-5 mr-2" /> Abrir Cuaderno
        </Button>
        <p className="text-xs text-slate-500 mt-3">Se abrirá en una ventana dedicada para máxima productividad</p>
      </Card>

      {/* Features Grid */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Funcionalidades de NotebookLM</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((feature) => (
            <Card key={feature.label} className="p-5 border-0 cursor-pointer transition-all duration-200 hover:scale-[1.02] group"
              style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)' }}
              onClick={openNotebook}
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" 
                  style={{ background: `${feature.color}20` }}>
                  <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{feature.label}</p>
                  <p className="text-xs text-slate-500">{feature.desc}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* How to use */}
      <Card className="p-5 border-0" style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
        <h3 className="text-base font-semibold text-white mb-3">¿Cómo usar NotebookLM?</h3>
        <ol className="space-y-3 text-sm">
          {[
            'Abre el cuaderno haciendo clic en el botón de arriba',
            'Haz clic en "+ Agregar fuentes" para subir PDFs, Google Docs o sitios web',
            'Una vez subidas las fuentes, usa el chat para hacer preguntas sobre tu material',
            'Genera resúmenes de audio, guías de estudio, mapas mentales y más desde el panel Studio',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                {i + 1}
              </span>
              <span className="text-slate-300">{step}</span>
            </li>
          ))}
        </ol>
      </Card>

      {/* Info */}
      <Card className="p-4 border-0" style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
        <p className="text-sm text-amber-400/80">
          ℹ️ <strong className="text-amber-300">Nota:</strong> NotebookLM de Google se abre en una ventana separada por políticas de seguridad de Google. 
          Esto es normal y permite acceso completo a todas sus funcionalidades sin restricciones.
        </p>
      </Card>
    </div>
  );
};
