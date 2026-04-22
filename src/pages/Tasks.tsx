import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Plus, Trash2, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: any;
}

const priorityConfig = {
  high: { label: 'Alta', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  medium: { label: 'Media', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  low: { label: 'Baja', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
};

export const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');

  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      setTasks(data);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      toast.error('Error al conectar con la base de datos de tareas. Revisa los permisos.');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      await addDoc(collection(db, 'tasks'), {
        title: newTask,
        subject: newSubject || 'General',
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        completed: false,
        priority: newPriority,
        createdAt: new Date().toISOString()
      });
      setNewTask(''); setNewSubject('');
      toast.success('Tarea agregada');
    } catch (err) {
      toast.error('Error al guardar tarea');
    }
  };

  const toggleTask = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'tasks', id), { completed: !current });
    } catch (err) {
      toast.error('Error al actualizar');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
      toast.success('Tarea eliminada');
    } catch (err) {
      toast.error('Error al eliminar');
    }
  };

  const pending = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(236,72,153,0.2)' }}>
          <CheckSquare className="w-5 h-5 text-pink-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Tareas</h1>
          <p className="text-xs text-slate-500">{pending.length} pendientes · {completed.length} completadas</p>
        </div>
      </div>

      {/* Add Task */}
      <Card className="p-4 border-0" style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(148,163,184,0.1)' }}>
        <div className="flex gap-2 flex-wrap">
          <Input placeholder="Nueva tarea..." value={newTask} onChange={e => setNewTask(e.target.value)}
            className="flex-1 min-w-[200px] bg-slate-800/60 border-slate-700/40 text-white placeholder:text-slate-500"
            onKeyDown={e => e.key === 'Enter' && addTask()} />
          <Input placeholder="Materia" value={newSubject} onChange={e => setNewSubject(e.target.value)}
            className="w-36 bg-slate-800/60 border-slate-700/40 text-white placeholder:text-slate-500" />
          <select value={newPriority} onChange={e => setNewPriority(e.target.value as any)}
            className="h-9 px-2 rounded-md bg-slate-800/60 border border-slate-700/40 text-white text-sm">
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
          <Button onClick={addTask} style={{ background: 'linear-gradient(135deg, #ec4899, #be185d)' }}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 text-pink-500 animate-spin" /></div>
      ) : (
        <>
          {/* Empty state */}
          {tasks.length === 0 && (
            <Card className="p-8 border-0 text-center" style={{ background: 'rgba(30,41,59,0.4)', border: '1px solid rgba(148,163,184,0.1)' }}>
              <CheckSquare className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400">No tienes tareas aún</p>
              <p className="text-xs text-slate-600 mt-1">Agrega tu primera tarea usando el formulario de arriba</p>
            </Card>
          )}

          {/* Pending */}
          {pending.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h2 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Pendientes ({pending.length})</h2>
              <div className="space-y-2">
                {pending.map(task => {
                  const cfg = priorityConfig[task.priority];
                  return (
                    <Card key={task.id} className="p-4 border-0" style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(148,163,184,0.1)' }}>
                      <div className="flex items-center gap-3">
                        <Checkbox checked={false} onCheckedChange={() => toggleTask(task.id, false)} className="border-slate-600 data-[state=checked]:bg-emerald-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-slate-500">{task.subject}</span>
                            <span className="text-xs text-slate-600">•</span>
                            <span className="text-xs text-slate-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> {task.dueDate}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px] border-0" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</Badge>
                        <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="text-slate-600 hover:text-red-400 h-8 w-8"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div className="animate-in fade-in duration-700">
              <h2 className="text-sm font-medium text-slate-500 mb-3 mt-8"><CheckSquare className="w-4 h-4 inline mr-1" /> Completadas ({completed.length})</h2>
              <div className="space-y-2 opacity-60">
                {completed.map(task => (
                  <Card key={task.id} className="p-4 border-0" style={{ background: 'rgba(30,41,59,0.3)', border: '1px solid rgba(148,163,184,0.05)' }}>
                    <div className="flex items-center gap-3">
                      <Checkbox checked onCheckedChange={() => toggleTask(task.id, true)} className="border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500" />
                      <p className="text-sm text-slate-500 line-through flex-1">{task.title}</p>
                      <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="text-slate-700 hover:text-red-400 h-8 w-8"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
