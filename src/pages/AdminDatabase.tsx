import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Database, Shield, Table2, Edit3, Trash2, Save, X, Loader2, RefreshCw } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

interface TableData {
  name: string;
  rows: any[];
  columns: string[];
}

export const AdminDatabase = () => {
  const { user, isAdmin } = useAuth();
  const [activeTable, setActiveTable] = useState('tasks');
  const [tables, setTables] = useState<Record<string, any[]>>({
    tasks: [],
    sources: [],
    curriculum: []
  });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);

  // Protected Route
  if (!isAdmin) return <Navigate to="/" />;

  useEffect(() => {
    setLoading(true);
    const collections = ['tasks', 'sources', 'curriculum'];
    const unsubscribes = collections.map(colName => {
      return onSnapshot(collection(db, colName), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTables(prev => ({ ...prev, [colName]: data }));
      });
    });

    setLoading(false);
    return () => unsubscribes.forEach(unsub => unsub());
  }, []);

  const getColumns = (tableName: string) => {
    const rows = tables[tableName] || [];
    if (rows.length === 0) return ['id'];
    const cols = new Set<string>();
    rows.forEach(row => Object.keys(row).forEach(key => cols.add(key)));
    return Array.from(cols);
  };

  const startEdit = (row: any) => {
    setEditingId(row.id);
    setEditData({ ...row });
  };

  const saveEdit = async () => {
    if (!editData || !editingId) return;
    try {
      const { id, ...data } = editData;
      await updateDoc(doc(db, activeTable, editingId), data);
      toast.success('Registro actualizado');
      setEditingId(null);
    } catch (err) {
      toast.error('Error al actualizar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este registro?')) return;
    try {
      await deleteDoc(doc(db, activeTable, id));
      toast.success('Registro eliminado');
    } catch (err) {
      toast.error('Error al eliminar');
    }
  };

  const currentRows = tables[activeTable] || [];
  const columns = getColumns(activeTable);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
            <Database className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Consola Master (Firestore)
              <Shield className="w-5 h-5 text-purple-400" />
            </h1>
            <p className="text-sm text-slate-500">Gestión de datos en tiempo real para {user.displayName}</p>
          </div>
        </div>
        {loading && <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-900/50 rounded-xl border border-slate-800 w-fit">
        {Object.keys(tables).map(col => (
          <Button
            key={col}
            variant="ghost"
            onClick={() => { setActiveTable(col); setEditingId(null); }}
            className={`px-4 h-9 rounded-lg transition-all ${activeTable === col ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Table2 className="w-4 h-4 mr-2" />
            {col.charAt(0).toUpperCase() + col.slice(1)}
            <Badge className="ml-2 bg-slate-800 text-[10px]">{tables[col].length}</Badge>
          </Button>
        ))}
      </div>

      {/* Data Table */}
      <Card className="border-0 bg-slate-900/40 border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900/60 border-b border-slate-800">
              <tr>
                {columns.map(col => (
                  <th key={col} className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{col}</th>
                ))}
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {currentRows.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="p-20 text-center">
                    <Database className="w-10 h-10 text-slate-800 mx-auto mb-4" />
                    <p className="text-slate-500">No hay datos en la colección "{activeTable}"</p>
                  </td>
                </tr>
              )}
              {currentRows.map(row => (
                <tr key={row.id} className="hover:bg-slate-800/20 transition-colors">
                  {columns.map(col => (
                    <td key={col} className="p-4">
                      {editingId === row.id && col !== 'id' ? (
                        <Input
                          value={editData?.[col] || ''}
                          onChange={e => setEditData({ ...editData, [col]: e.target.value })}
                          className="h-8 bg-slate-950 border-slate-700 text-xs text-white"
                        />
                      ) : (
                        <div className="max-w-[200px] truncate text-xs text-slate-300">
                          {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col])}
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {editingId === row.id ? (
                        <>
                          <Button size="icon" variant="ghost" onClick={saveEdit} className="h-8 w-8 text-emerald-500"><Save className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="h-8 w-8 text-slate-500"><X className="w-4 h-4" /></Button>
                        </>
                      ) : (
                        <>
                          <Button size="icon" variant="ghost" onClick={() => startEdit(row)} className="h-8 w-8 text-blue-400 hover:text-white hover:bg-blue-500/10"><Edit3 className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDelete(row.id)} className="h-8 w-8 text-red-400 hover:text-white hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
