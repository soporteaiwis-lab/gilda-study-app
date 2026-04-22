import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { MessageSquare, CheckSquare, Sparkles, BookOpen, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    { icon: MessageSquare, label: 'Chat IA', desc: 'Pregunta sobre tus materias', path: '/chat', color: '#3b82f6' },
    { icon: Brain, label: 'Conocimiento', desc: 'Base de conocimiento con IA', path: '/notebook', color: '#f59e0b' },
    { icon: BookOpen, label: 'Currículo', desc: 'Malla curricular oficial', path: '/curriculum', color: '#8b5cf6' },
    { icon: CheckSquare, label: 'Tareas', desc: 'Gestión de actividades', path: '/tasks', color: '#ec4899' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="rounded-2xl p-6 lg:p-8" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))', border: '1px solid rgba(59,130,246,0.2)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <span className="text-blue-400 text-sm font-medium">Bienvenida</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">Hola, {user.displayName.split(' ')[0]} 👋</h1>
        <p className="text-slate-400">Tu plataforma de estudio inteligente para Administración de Empresas.</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Acceso Rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map(a => (
            <Link key={a.path} to={a.path}>
              <Card className="p-5 border-0 cursor-pointer transition-all duration-200 hover:scale-[1.02] group" style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(148,163,184,0.1)' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `${a.color}20` }}>
                    <a.icon className="w-6 h-6" style={{ color: a.color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{a.label}</p>
                    <p className="text-sm text-slate-500">{a.desc}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
