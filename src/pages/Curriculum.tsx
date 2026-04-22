import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, GraduationCap, Clock, CheckCircle2 } from 'lucide-react';

interface Subject {
  name: string;
  semester: number;
  credits: number;
  status: 'completed' | 'in-progress' | 'pending';
  area: string;
}

const subjects: Subject[] = [
  // Semestre 1
  { name: 'Introducción a la Administración', semester: 1, credits: 4, status: 'completed', area: 'Administración' },
  { name: 'Contabilidad I', semester: 1, credits: 4, status: 'completed', area: 'Contabilidad' },
  { name: 'Matemáticas I', semester: 1, credits: 3, status: 'completed', area: 'Matemáticas' },
  { name: 'Economía I', semester: 1, credits: 4, status: 'completed', area: 'Economía' },
  { name: 'Comunicación Efectiva', semester: 1, credits: 3, status: 'completed', area: 'Humanidades' },
  // Semestre 2
  { name: 'Administración de Operaciones', semester: 2, credits: 4, status: 'completed', area: 'Administración' },
  { name: 'Contabilidad II', semester: 2, credits: 4, status: 'completed', area: 'Contabilidad' },
  { name: 'Estadística I', semester: 2, credits: 3, status: 'completed', area: 'Matemáticas' },
  { name: 'Economía II', semester: 2, credits: 4, status: 'completed', area: 'Economía' },
  { name: 'Derecho Empresarial', semester: 2, credits: 3, status: 'completed', area: 'Legal' },
  // Semestre 3
  { name: 'Marketing I', semester: 3, credits: 4, status: 'in-progress', area: 'Marketing' },
  { name: 'Finanzas I', semester: 3, credits: 4, status: 'in-progress', area: 'Finanzas' },
  { name: 'Recursos Humanos', semester: 3, credits: 3, status: 'in-progress', area: 'RRHH' },
  { name: 'Estadística II', semester: 3, credits: 3, status: 'in-progress', area: 'Matemáticas' },
  { name: 'Ética Empresarial', semester: 3, credits: 2, status: 'in-progress', area: 'Humanidades' },
  // Semestre 4
  { name: 'Marketing II', semester: 4, credits: 4, status: 'pending', area: 'Marketing' },
  { name: 'Finanzas II', semester: 4, credits: 4, status: 'pending', area: 'Finanzas' },
  { name: 'Gestión de Proyectos', semester: 4, credits: 3, status: 'pending', area: 'Administración' },
  { name: 'Investigación de Mercados', semester: 4, credits: 3, status: 'pending', area: 'Marketing' },
  { name: 'Sistemas de Información', semester: 4, credits: 3, status: 'pending', area: 'Tecnología' },
];

const statusConfig = {
  'completed': { label: 'Aprobada', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  'in-progress': { label: 'En Curso', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  'pending': { label: 'Pendiente', color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
};

export const Curriculum = () => {
  const semesters = [1, 2, 3, 4];
  const completed = subjects.filter(s => s.status === 'completed').length;
  const inProgress = subjects.filter(s => s.status === 'in-progress').length;
  const totalCredits = subjects.reduce((a, s) => a + s.credits, 0);
  const completedCredits = subjects.filter(s => s.status === 'completed').reduce((a, s) => a + s.credits, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
          <GraduationCap className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Malla Curricular</h1>
          <p className="text-xs text-slate-500">Administración de Empresas</p>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Asignaturas', value: subjects.length, icon: BookOpen, color: '#3b82f6' },
          { label: 'Aprobadas', value: completed, icon: CheckCircle2, color: '#10b981' },
          { label: 'En Curso', value: inProgress, icon: Clock, color: '#f59e0b' },
          { label: 'Créditos', value: `${completedCredits}/${totalCredits}`, icon: GraduationCap, color: '#8b5cf6' },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 border-0" style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}20` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Progress Bar */}
      <Card className="p-4 border-0" style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-slate-300">Progreso General</span>
          <span className="text-sm text-blue-400 font-medium">{Math.round((completed / subjects.length) * 100)}%</span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ 
              width: `${(completed / subjects.length) * 100}%`,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            }} />
        </div>
      </Card>

      {/* Semesters */}
      {semesters.map(sem => (
        <div key={sem}>
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: 'white' }}>
              {sem}
            </span>
            Semestre {sem}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {subjects.filter(s => s.semester === sem).map((subject) => {
              const config = statusConfig[subject.status];
              return (
                <Card key={subject.name} className="p-4 border-0 transition-all hover:scale-[1.01]"
                  style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-medium text-white flex-1">{subject.name}</p>
                    <Badge variant="outline" className="ml-2 text-[10px] border-0 font-medium"
                      style={{ background: config.bg, color: config.color }}>
                      {config.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>{subject.credits} créditos</span>
                    <span>•</span>
                    <span>{subject.area}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
