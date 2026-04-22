import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Settings as SettingsIcon, Shield } from 'lucide-react';

export const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(100,116,139,0.2)' }}>
          <SettingsIcon className="w-5 h-5 text-slate-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Configuración</h1>
          <p className="text-xs text-slate-500">Ajustes de la aplicación</p>
        </div>
      </div>

      <Card className="p-6 border-0" style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(148,163,184,0.1)' }}>
        <h2 className="text-base font-semibold text-white mb-4">Perfil</h2>
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl ${user.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'}`}>
            {user.displayName.charAt(0)}
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{user.displayName}</p>
            <p className="text-sm text-slate-400">{user.email}</p>
            {user.role === 'admin' && (
              <div className="flex items-center gap-1 mt-1">
                <Shield className="w-3 h-3 text-purple-400" />
                <span className="text-xs text-purple-400 font-medium">Administrador</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6 border-0" style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(148,163,184,0.1)' }}>
        <h2 className="text-base font-semibold text-white mb-4">Información</h2>
        <div className="space-y-3 text-sm">
          {[
            { label: 'Versión', value: 'v1.0' },
            { label: 'Desarrollador', value: 'Armin Salazar - AIWIS IA & TI' },
            { label: 'Estudiante', value: 'Gilda Cuvertino' },
            { label: 'Carrera', value: 'Ing. en Administración de Empresas' },
            { label: 'Motor IA', value: 'Google Gemini 1.5 Flash' },
          ].map(item => (
            <div key={item.label} className="flex justify-between py-2 border-b border-slate-800/50 last:border-0">
              <span className="text-slate-400">{item.label}</span>
              <span className="text-white font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
