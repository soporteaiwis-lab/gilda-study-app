import { useState, useRef, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GraduationCap, CheckCircle2, Clock, Upload, FileText, Trash2, BookOpen, Award, Loader2 } from 'lucide-react';
import { defaultSubjects, diplomados, type Subject } from '@/data/curriculum';
import { toast } from 'sonner';

const statusConfig = {
  completed: { label: 'Aprobada', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  'in-progress': { label: 'En Curso', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  pending: { label: 'Pendiente', color: '#64748b', bg: 'rgba(100,116,139,0.15)' },
};

const yearColors = ['#3b82f6', '#8b5cf6'];

export const Curriculum = () => {
  const [subjects, setSubjects] = useState<Subject[]>(defaultSubjects);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [showPdf, setShowPdf] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Firestore Sync
  useEffect(() => {
    const docRef = doc(db, 'curriculum', 'gilda-main');
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.subjects) setSubjects(data.subjects);
        if (data.pdfUrl) setPdfUrl(data.pdfUrl);
      } else {
        // Initialize if not exists
        setDoc(docRef, { subjects: defaultSubjects, pdfUrl: null });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const saveToFirestore = async (newSubjects: Subject[], newPdfUrl: string | null = pdfUrl) => {
    try {
      await setDoc(doc(db, 'curriculum', 'gilda-main'), {
        subjects: newSubjects,
        pdfUrl: newPdfUrl
      });
    } catch (err) {
      toast.error('Error al sincronizar con la nube');
    }
  };

  const cycleStatus = (id: string) => {
    const order: Subject['status'][] = ['pending', 'in-progress', 'completed'];
    const updated = subjects.map(s => s.id === id ? { ...s, status: order[(order.indexOf(s.status) + 1) % 3] } : s);
    setSubjects(updated);
    saveToFirestore(updated);
  };

  const handlePdf = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setPdfUrl(url);
      saveToFirestore(subjects, url);
      toast.success('PDF guardado en la nube');
    };
    reader.readAsDataURL(file);
  };

  const removePdf = () => {
    setPdfUrl(null);
    saveToFirestore(subjects, null);
    setShowPdf(false);
  };

  const completed = subjects.filter(s => s.status === 'completed').length;
  const inProgress = subjects.filter(s => s.status === 'in-progress').length;
  const filteredSubjects = selectedYear ? subjects.filter(s => s.year === selectedYear) : subjects;
  const bimestres = [...new Set(filteredSubjects.map(s => s.bimestre))].sort((a, b) => a - b);

  if (loading) {
    return <div className="h-[70vh] flex items-center justify-center"><Loader2 className="w-8 h-8 text-purple-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.2)' }}>
            <GraduationCap className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Malla Curricular</h1>
            <p className="text-xs text-slate-500">Ing. en Administración de Empresas · 2 años · 10 Bimestres</p>
          </div>
        </div>
        <div className="flex gap-2">
          <input ref={fileInputRef} type="file" accept=".pdf" onChange={handlePdf} className="hidden" />
          <Button size="sm" variant="outline" className="border-slate-700 text-slate-300" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-1" /> Cargar PDF
          </Button>
          {pdfUrl && (
            <>
              <Button size="sm" variant="outline" className={showPdf ? 'border-purple-500 text-purple-300' : 'border-slate-700 text-slate-300'} onClick={() => setShowPdf(!showPdf)}>
                <FileText className="w-4 h-4 mr-1" /> {showPdf ? 'Ver Tabla' : 'Ver PDF'}
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-red-400" onClick={removePdf}><Trash2 className="w-4 h-4" /></Button>
            </>
          )}
        </div>
      </div>

      {showPdf && pdfUrl && (
        <Card className="border-0 overflow-hidden" style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(148,163,184,0.1)' }}>
          <iframe src={pdfUrl} className="w-full border-0" style={{ height: '700px' }} title="Malla PDF" />
        </Card>
      )}

      {!showPdf && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Total Materias', value: subjects.length, icon: BookOpen, color: '#3b82f6' },
              { label: 'Aprobadas', value: completed, icon: CheckCircle2, color: '#10b981' },
              { label: 'En Curso', value: inProgress, icon: Clock, color: '#f59e0b' },
              { label: 'Progreso', value: `${subjects.length > 0 ? Math.round((completed / subjects.length) * 100) : 0}%`, icon: GraduationCap, color: '#8b5cf6' },
            ].map(s => (
              <Card key={s.label} className="p-3 border-0" style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(148,163,184,0.1)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.color}20` }}>
                    <s.icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <div><p className="text-lg font-bold text-white">{s.value}</p><p className="text-xs text-slate-500">{s.label}</p></div>
                </div>
              </Card>
            ))}
          </div>

          {/* Progress */}
          <Card className="p-3 border-0" style={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(148,163,184,0.1)' }}>
            <div className="flex justify-between mb-1.5">
              <span className="text-xs text-slate-400">Progreso General</span>
              <span className="text-xs text-blue-400 font-medium">{completed}/{subjects.length}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${subjects.length > 0 ? (completed / subjects.length) * 100 : 0}%`, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }} />
            </div>
          </Card>

          {/* Year Filter */}
          <div className="flex gap-2">
            <Button size="sm" variant={selectedYear === null ? 'default' : 'outline'} className={selectedYear === null ? '' : 'border-slate-700 text-slate-400'} onClick={() => setSelectedYear(null)}>
              Todos
            </Button>
            {[1, 2].map(y => (
              <Button key={y} size="sm" variant={selectedYear === y ? 'default' : 'outline'}
                className={selectedYear === y ? '' : 'border-slate-700 text-slate-400'}
                style={selectedYear === y ? { background: yearColors[y - 1] } : {}}
                onClick={() => setSelectedYear(y)}>
                Año {y}
              </Button>
            ))}
          </div>

          {/* Bimestres */}
          {bimestres.map(bim => {
            const bimSubjects = filteredSubjects.filter(s => s.bimestre === bim);
            const year = bimSubjects[0]?.year || 1;
            return (
              <div key={bim}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white" style={{ background: yearColors[year - 1] }}>Año {year}</span>
                  <h3 className="text-sm font-semibold text-white">Bimestre {bim}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {bimSubjects.map(subject => {
                    const cfg = statusConfig[subject.status];
                    return (
                      <Card key={subject.id} className="p-3 border-0 cursor-pointer transition-all hover:scale-[1.01]"
                        style={{ background: 'rgba(30,41,59,0.6)', border: `1px solid ${subject.examOnline ? 'rgba(16,185,129,0.4)' : 'rgba(148,163,184,0.1)'}` }}
                        onClick={() => cycleStatus(subject.id)}>
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-medium text-white flex-1 leading-tight">{subject.name}</p>
                          <Badge variant="outline" className="ml-2 text-[10px] border-0 font-medium flex-shrink-0" style={{ background: cfg.bg, color: cfg.color }}>
                            {cfg.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          {subject.diplomado && <span>Módulo {subject.diplomado}</span>}
                          {subject.examOnline && <span className="text-emerald-400">● Examen online</span>}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <p className="text-[11px] text-slate-600 text-center py-4">
            Los cambios se guardan automáticamente en tu cuenta.
          </p>
        </>
      )}
    </div>
  );
};
