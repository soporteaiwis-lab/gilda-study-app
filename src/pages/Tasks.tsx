import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Plus, Trash2, Calendar, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

const initialTasks: Task[] = [
  { id: '1', title: 'Informe de Marketing - Análisis de Mercado', subject: 'Marketing I', dueDate: '2026-04-28', completed: false, priority: 'high' },
  { id: '2', title: 'Ejercicios de Estadística - Capítulo 5', subject: 'Estadística II', dueDate: '2026-04-25', completed: false, priority: 'medium' },
  { id: '3', title: 'Caso de estudio - Recursos Humanos', subject: 'Recursos Humanos', dueDate: '2026-04-30', completed: false, priority: 'medium' },
  { id: '4', title: 'Balance General - Empresa ficticia', subject: 'Finanzas I', dueDate: '2026-04-22', completed: true, priority: 'high' },
  { id: '5', title: 'Lectura Ética Empresarial - Cap 3 y 4', subject: 'Ética Empresarial', dueDate: '2026-04-23', completed: true, priority: 'low' },
];

const priorityConfig = {
  high: { label: 'Alta', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  medium: { label: 'Media', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  low: { label: 'Baja', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
};

export const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState('');
  const [newSubject, setNewSubject] = useState('');

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      subject: newSubject || 'General',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false,
      priority: 'medium',
    };
    setTasks(prev => [task, ...prev]);
    setNewTask('');
    setNewSubject('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const pending = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(236, 72, 153, 0.2)' }}>
          <CheckSquare className="w-5 h-5 text-pink-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Tareas</h1>
          <p className="text-xs text-slate-500">{pending.length} pendientes · {completed.length} completadas</p>
        </div>
      </div>

      {/* Add Task */}
      <Card className="p-4 border-0" style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
        <div className="flex gap-2">
          <Input
            placeholder="Nueva tarea..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="bg-slate-800/60 border-slate-700/40 text-white placeholder:text-slate-500"
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <Input
            placeholder="Materia"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="w-40 bg-slate-800/60 border-slate-700/40 text-white placeholder:text-slate-500"
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <Button onClick={addTask} style={{ background: 'linear-gradient(135deg, #ec4899, #be185d)' }}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Pending Tasks */}
      {pending.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> Pendientes ({pending.length})
          </h2>
          <div className="space-y-2">
            {pending.map(task => {
              const config = priorityConfig[task.priority];
              return (
                <Card key={task.id} className="p-4 border-0 transition-all hover:scale-[1.005]"
                  style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">{task.subject}</span>
                        <span className="text-xs text-slate-600">•</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {task.dueDate}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] border-0 font-medium"
                      style={{ background: config.bg, color: config.color }}>
                      {config.label}
                    </Badge>
                    <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}
                      className="text-slate-600 hover:text-red-400 h-8 w-8">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-2">
            <CheckSquare className="w-4 h-4" /> Completadas ({completed.length})
          </h2>
          <div className="space-y-2 opacity-60">
            {completed.map(task => (
              <Card key={task.id} className="p-4 border-0"
                style={{ background: 'rgba(30, 41, 59, 0.3)', border: '1px solid rgba(148, 163, 184, 0.05)' }}>
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 line-through">{task.title}</p>
                    <span className="text-xs text-slate-600">{task.subject}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}
                    className="text-slate-700 hover:text-red-400 h-8 w-8">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
