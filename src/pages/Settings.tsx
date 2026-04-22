import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, Shield, ExternalLink, BookOpen } from 'lucide-react';

export const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(100, 116, 139, 0.2)' }}>
          <SettingsIcon className="w-5 h-5 text-slate-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Configuración</h1>
          <p className="text-xs text-slate-500">Ajustes de la aplicación</p>
        </div>
      </div>

      {/* Profile */}
      <Card className="p-6 border-0" style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
        <h2 className="text-base font-semibold text-white mb-4">Perfil de Usuario</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
              style={{ background: user?.role === 'admin' ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' : 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
              {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{user?.displayName}</p>
              <p className="text-sm text-slate-400">{user?.email}</p>
              {user?.role === 'admin' && (
                <div className="flex items-center gap-1 mt-1">
                  <Shield className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-purple-400 font-medium">Administrador</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Info */}
      <Card className="p-6 border-0" style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
        <h2 className="text-base font-semibold text-white mb-4">Información de la App</h2>
        <div className="space-y-3 text-sm">
          {[
            { label: 'Versión', value: 'v1.0' },
            { label: 'Desarrollador', value: 'Armin Salazar - AIWIS IA & TI' },
            { label: 'Estudiante', value: 'Gilda Cuvertino' },
            { label: 'Carrera', value: 'Administración de Empresas' },
            { label: 'Motor IA', value: 'Google Gemini 1.5 Flash' },
          ].map((item) => (
            <div key={item.label} className="flex justify-between py-2 border-b border-slate-800/50 last:border-0">
              <span className="text-slate-400">{item.label}</span>
              <span className="text-white font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Links */}
      <Card className="p-6 border-0" style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
        <h2 className="text-base font-semibold text-white mb-4">Enlaces Externos</h2>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={() => window.open('https://drive.google.com/drive/folders/1HmB4SVm7WraN-4ELBxaEm3RcTjZ9t8Vq', '_blank')}>
            <ExternalLink className="w-4 h-4 mr-2" /> Google Drive - Materiales
          </Button>
          <Button variant="outline" className="w-full justify-start border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={() => window.open('https://notebooklm.google.com/notebook/536ab9bb-432f-4a27-9565-cf9b1baabe48', '_blank')}>
            <BookOpen className="w-4 h-4 mr-2" /> NotebookLM - Cuaderno
          </Button>
          <Button variant="outline" className="w-full justify-start border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={() => window.open('https://github.com/soporteaiwis-lab/gilda-study-app', '_blank')}>
            <ExternalLink className="w-4 h-4 mr-2" /> GitHub - Repositorio
          </Button>
        </div>
      </Card>
    </div>
  );
};
