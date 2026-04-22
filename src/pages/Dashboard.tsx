import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { 
  BookOpen, MessageSquare, FolderOpen, CheckSquare, 
  TrendingUp, Clock, Notebook, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useAuth();
  
  const quickActions = [
    { icon: MessageSquare, label: 'Chat IA', desc: 'Pregunta sobre tus materias', path: '/chat', color: '#3b82f6' },
    { icon: FolderOpen, label: 'Google Drive', desc: 'Accede a tus documentos', path: '/materials', color: '#10b981' },
    { icon: Notebook, label: 'NotebookLM', desc: 'Cuaderno de estudio IA', path: '/notebook', color: '#f59e0b' },
    { icon: BookOpen, label: 'Currículo', desc: 'Malla curricular', path: '/curriculum', color: '#8b5cf6' },
    { icon: CheckSquare, label: 'Tareas', desc: 'Gestión de tareas', path: '/tasks', color: '#ec4899' },
  ];

  const stats = [
    { label: 'Materias Activas', value: '6', icon: BookOpen, color: '#3b82f6' },
    { label: 'Tareas Pendientes', value: '3', icon: CheckSquare, color: '#f59e0b' },
    { label: 'Documentos', value: '12', icon: FolderOpen, color: '#10b981' },
    { label: 'Sesiones IA', value: '24', icon: Sparkles, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome */}
      <div className="rounded-2xl p-6 lg:p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))',
          border: '1px solid rgba(59,130,246,0.2)',
        }}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <span className="text-blue-400 text-sm font-medium">Bienvenida de vuelta</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
          Hola, {user?.displayName?.split(' ')[0] || 'Estudiante'} 👋
        </h1>
        <p className="text-slate-400">
          ¿En qué te puedo ayudar hoy? Tienes acceso a tu asistente IA, documentos de Drive y más.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4 border-0"
            style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}20` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Acceso Rápido
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Link key={action.path} to={action.path}>
              <Card className="p-5 border-0 cursor-pointer transition-all duration-200 hover:scale-[1.02] group"
                style={{ 
                  background: 'rgba(30, 41, 59, 0.6)', 
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" 
                    style={{ background: `${action.color}20` }}>
                    <action.icon className="w-6 h-6" style={{ color: action.color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{action.label}</p>
                    <p className="text-sm text-slate-500">{action.desc}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Actividad Reciente
        </h2>
        <Card className="p-5 border-0" style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
          <div className="space-y-4">
            {[
              { text: 'Sistema listo para usar', time: 'Ahora', color: '#10b981' },
              { text: 'Conecta tu Google Drive para empezar', time: 'Pendiente', color: '#f59e0b' },
              { text: 'Explora el Chat IA con Gemini', time: 'Disponible', color: '#3b82f6' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                <p className="text-sm text-slate-300 flex-1">{item.text}</p>
                <span className="text-xs text-slate-500">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
