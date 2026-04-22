import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, GraduationCap, Clock, CheckCircle2, Upload, FileText, Plus, Trash2, Edit3, Save, X } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  semester: number;
  credits: number;
  status: 'completed' | 'in-progress' | 'pending';
  area: string;
}

const defaultSubjects: Subject[] = [
  { id: '1', name: 'Introducción a la Administración', semester: 1, credits: 4, status: 'completed', area: 'Administración' },
  { id: '2', name: 'Contabilidad I', semester: 1, credits: 4, status: 'completed', area: 'Contabilidad' },
  { id: '3', name: 'Matemáticas I', semester: 1, credits: 3, status: 'completed', area: 'Matemáticas' },
  { id: '4', name: 'Economía I', semester: 1, credits: 4, status: 'completed', area: 'Economía' },
  { id: '5', name: 'Marketing I', semester: 2, credits: 4, status: 'in-progress', area: 'Marketing' },
  { id: '6', name: 'Finanzas I', semester: 2, credits: 4, status: 'in-progress', area: 'Finanzas' },
  { id: '7', name: 'Recursos Humanos', semester: 2, credits: 3, status: 'in-progress', area: 'RRHH' },
  { id: '8', name: 'Estadística I', semester: 2, credits: 3, status: 'in-progress', area: 'Matemáticas' },
];

const statusConfig = {
  'completed': { label: 'Aprobada', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  'in-progress': { label: 'En Curso', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  'pending': { label: 'Pendiente', color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
};

export const Curriculum = () => {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('estudia_curriculum');
    return saved ? JSON.parse(saved) : defaultSubjects;
  });
  const [pdfUrl, setPdfUrl] = useState<string | null>(() => localStorage.getItem('estudia_curriculum_pdf'));
  const [pdfName, setPdfName] = useState<string>(() => localStorage.getItem('estudia_curriculum_pdf_name') || '');
  const [showPdf, setShowPdf] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Subject | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', semester: 1, credits: 3, area: '', status: 'pending' as const });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const save = (newSubjects: Subject[]) => {
    setSubjects(newSubjects);
    localStorage.setItem('estudia_curriculum', JSON.stringify(newSubjects));
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPdfUrl(url);
    setPdfName(file.name);
    // Save as base64 for persistence
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem('estudia_curriculum_pdf', reader.result as string);
      localStorage.setItem('estudia_curriculum_pdf_name', file.name);
    };
    reader.readAsDataURL(file);
  };

  const removePdf = () => {
    setPdfUrl(null);
    setPdfName('');
    localStorage.removeItem('estudia_curriculum_pdf');
    localStorage.removeItem('estudia_curriculum_pdf_name');
    setShowPdf(false);
  };

  const addSubject = () => {
    if (!newSubject.name.trim()) return;
    const subject: Subject = {
      id: Date.now().toString(),
      ...newSubject,
    };
    save([...subjects, subject]);
    setNewSubject({ name: '', semester: 1, credits: 3, area: '', status: 'pending' });
    setShowAddForm(false);
  };

  const deleteSubject = (id: string) => {
    save(subjects.filter(s => s.id !== id));
  };

  const startEdit = (s: Subject) => {
    setEditingId(s.id);
    setEditData({ ...s });
  };

  const saveEdit = () => {
    if (!editData) return;
    save(subjects.map(s => s.id === editData.id ? editData : s));
    setEditingId(null);
    setEditData(null);
  };

  const cycleStatus = (id: string) => {
    const order: Subject['status'][] = ['pending', 'in-progress', 'completed'];
    save(subjects.map(s => {
      if (s.id !== id) return s;
      const idx = order.indexOf(s.status);
      return { ...s, status: order[(idx + 1) % 3] };
    }));
  };

  const semesters = [...new Set(subjects.map(s => s.semester))].sort((a, b) => a - b);
  const completed = subjects.filter(s => s.status === 'completed').length;
  const inProgress = subjects.filter(s => s.status === 'in-progress').length;
  const totalCredits = subjects.reduce((a, s) => a + s.credits, 0);
  const completedCredits = subjects.filter(s => s.status === 'completed').reduce((a, s) => a + s.credits, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
            <GraduationCap className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Malla Curricular</h1>
            <p className="text-xs text-slate-500">Administración de Empresas</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input ref={fileInputRef} type="file" accept=".pdf" onChange={handlePdfUpload} className="hidden" />
          <Button size="sm" variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-1" /> Cargar Malla PDF
          </Button>
          {pdfUrl && (
            <Button size="sm" variant="outline" 
              className={showPdf ? "border-purple-500 text-purple-300" : "border-slate-700 text-slate-300"}
              onClick={() => setShowPdf(!showPdf)}>
              <FileText className="w-4 h-4 mr-1" /> {showPdf ? 'Ver Tabla' : 'Ver PDF'}
            </Button>
          )}
          <Button size="sm" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}
            onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-1" /> Agregar Materia
          </Button>
        </div>
      </div>

      {/* PDF Name Badge */}
      {pdfName && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300 bg-purple-500/10 px-3 py-1">
            <FileText className="w-3 h-3 mr-1" /> {pdfName}
          </Badge>
          <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-500 hover:text-red-400" onClick={removePdf}>
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* PDF Viewer */}
      {showPdf && pdfUrl && (
        <Card className="border-0 overflow-hidden" style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
          <div className="p-3 border-b border-slate-800/50 flex items-center justify-between">
            <span className="text-sm font-medium text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" /> Malla Curricular Oficial (PDF)
            </span>
          </div>
          <iframe src={pdfUrl} className="w-full border-0" style={{ height: '700px' }} title="Malla Curricular PDF" />
        </Card>
      )}

      {/* Add Subject Form */}
      {showAddForm && (
        <Card className="p-4 border-0" style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <Input placeholder="Nombre materia" value={newSubject.name} onChange={(e) => setNewSubject(p => ({ ...p, name: e.target.value }))}
              className="col-span-2 bg-slate-800/60 border-slate-700/40 text-white placeholder:text-slate-500" />
            <Input type="number" placeholder="Semestre" value={newSubject.semester} onChange={(e) => setNewSubject(p => ({ ...p, semester: +e.target.value }))}
              className="bg-slate-800/60 border-slate-700/40 text-white" />
            <Input type="number" placeholder="Créditos" value={newSubject.credits} onChange={(e) => setNewSubject(p => ({ ...p, credits: +e.target.value }))}
              className="bg-slate-800/60 border-slate-700/40 text-white" />
            <Input placeholder="Área" value={newSubject.area} onChange={(e) => setNewSubject(p => ({ ...p, area: e.target.value }))}
              className="bg-slate-800/60 border-slate-700/40 text-white placeholder:text-slate-500" />
          </div>
          <div className="flex gap-2 mt-2 justify-end">
            <Button size="sm" variant="ghost" className="text-slate-400" onClick={() => setShowAddForm(false)}>Cancelar</Button>
            <Button size="sm" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }} onClick={addSubject}>Guardar</Button>
          </div>
        </Card>
      )}

      {/* Stats */}
      {!showPdf && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Total', value: subjects.length, icon: BookOpen, color: '#3b82f6' },
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
              <span className="text-sm text-blue-400 font-medium">{subjects.length > 0 ? Math.round((completed / subjects.length) * 100) : 0}%</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${subjects.length > 0 ? (completed / subjects.length) * 100 : 0}%`, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }} />
            </div>
          </Card>

          {/* Semesters */}
          {semesters.map(sem => (
            <div key={sem}>
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                  {sem}
                </span>
                Semestre {sem}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {subjects.filter(s => s.semester === sem).map((subject) => {
                  const config = statusConfig[subject.status];
                  const isEditing = editingId === subject.id;

                  if (isEditing && editData) {
                    return (
                      <Card key={subject.id} className="p-3 border-0" style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(139,92,246,0.3)' }}>
                        <div className="space-y-2">
                          <Input value={editData.name} onChange={e => setEditData(p => p ? { ...p, name: e.target.value } : null)}
                            className="text-xs h-8 bg-slate-800 border-slate-600 text-white" placeholder="Nombre" />
                          <div className="grid grid-cols-3 gap-1">
                            <Input type="number" value={editData.semester} onChange={e => setEditData(p => p ? { ...p, semester: +e.target.value } : null)}
                              className="text-xs h-8 bg-slate-800 border-slate-600 text-white" placeholder="Sem" />
                            <Input type="number" value={editData.credits} onChange={e => setEditData(p => p ? { ...p, credits: +e.target.value } : null)}
                              className="text-xs h-8 bg-slate-800 border-slate-600 text-white" placeholder="Cred" />
                            <Input value={editData.area} onChange={e => setEditData(p => p ? { ...p, area: e.target.value } : null)}
                              className="text-xs h-8 bg-slate-800 border-slate-600 text-white" placeholder="Área" />
                          </div>
                          <div className="flex gap-1 justify-end">
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-emerald-400" onClick={saveEdit}><Save className="w-3 h-3" /></Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400" onClick={() => { setEditingId(null); setEditData(null); }}><X className="w-3 h-3" /></Button>
                          </div>
                        </div>
                      </Card>
                    );
                  }

                  return (
                    <Card key={subject.id} className="p-4 border-0 transition-all hover:scale-[1.01] group"
                      style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-medium text-white flex-1">{subject.name}</p>
                        <div className="flex items-center gap-1 ml-2">
                          <Badge variant="outline" className="text-[10px] border-0 font-medium cursor-pointer"
                            style={{ background: config.bg, color: config.color }}
                            onClick={() => cycleStatus(subject.id)}>
                            {config.label}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>{subject.credits} créditos</span>
                          <span>•</span>
                          <span>{subject.area}</span>
                        </div>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="ghost" className="h-6 w-6 text-blue-400" onClick={() => startEdit(subject)}><Edit3 className="w-3 h-3" /></Button>
                          <Button size="icon" variant="ghost" className="h-6 w-6 text-red-400" onClick={() => deleteSubject(subject.id)}><Trash2 className="w-3 h-3" /></Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
