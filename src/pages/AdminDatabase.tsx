import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Database, Shield, Table2, Edit3, Trash2, Save, X, Plus } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface TableRow {
  id: string;
  [key: string]: string;
}

interface TableData {
  name: string;
  columns: string[];
  rows: TableRow[];
}

const initialTables: TableData[] = [
  {
    name: 'usuarios',
    columns: ['id', 'nombre', 'email', 'rol', 'estado'],
    rows: [
      { id: '1', nombre: 'Gilda Cuvertino', email: 'gilda@estudia.app', rol: 'user', estado: 'activo' },
      { id: '2', nombre: 'AIWIS Admin', email: 'soporte.aiwis@gmail.com', rol: 'admin', estado: 'activo' },
    ],
  },
  {
    name: 'materias',
    columns: ['id', 'nombre', 'semestre', 'creditos', 'estado'],
    rows: [
      { id: '1', nombre: 'Marketing I', semestre: '3', creditos: '4', estado: 'en-curso' },
      { id: '2', nombre: 'Finanzas I', semestre: '3', creditos: '4', estado: 'en-curso' },
      { id: '3', nombre: 'Recursos Humanos', semestre: '3', creditos: '3', estado: 'en-curso' },
      { id: '4', nombre: 'Estadística II', semestre: '3', creditos: '3', estado: 'en-curso' },
      { id: '5', nombre: 'Ética Empresarial', semestre: '3', creditos: '2', estado: 'en-curso' },
    ],
  },
  {
    name: 'configuracion',
    columns: ['id', 'clave', 'valor', 'descripcion'],
    rows: [
      { id: '1', clave: 'app_version', valor: '1.0', descripcion: 'Versión de la app' },
      { id: '2', clave: 'gemini_model', valor: 'gemini-1.5-flash', descripcion: 'Modelo de IA' },
      { id: '3', clave: 'drive_folder', valor: '1HmB4SVm7WraN-4ELBxaEm3RcTjZ9t8Vq', descripcion: 'ID carpeta Drive' },
      { id: '4', clave: 'notebook_id', valor: '536ab9bb-432f-4a27-9565-cf9b1baabe48', descripcion: 'ID NotebookLM' },
    ],
  },
];

export const AdminDatabase = () => {
  const { user } = useAuth();
  const [tables, setTables] = useState<TableData[]>(initialTables);
  const [activeTable, setActiveTable] = useState(0);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editData, setEditData] = useState<TableRow | null>(null);

  // Only admin can access
  if (user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const currentTable = tables[activeTable];

  const startEdit = (row: TableRow) => {
    setEditingRow(row.id);
    setEditData({ ...row });
  };

  const cancelEdit = () => {
    setEditingRow(null);
    setEditData(null);
  };

  const saveEdit = () => {
    if (!editData) return;
    setTables(prev => prev.map((table, i) => {
      if (i !== activeTable) return table;
      return {
        ...table,
        rows: table.rows.map(row => row.id === editData.id ? editData : row),
      };
    }));
    setEditingRow(null);
    setEditData(null);
  };

  const deleteRow = (id: string) => {
    setTables(prev => prev.map((table, i) => {
      if (i !== activeTable) return table;
      return { ...table, rows: table.rows.filter(row => row.id !== id) };
    }));
  };

  const addRow = () => {
    const newRow: TableRow = { id: Date.now().toString() };
    currentTable.columns.forEach(col => {
      if (col !== 'id') newRow[col] = '';
    });
    setTables(prev => prev.map((table, i) => {
      if (i !== activeTable) return table;
      return { ...table, rows: [...table.rows, newRow] };
    }));
    startEdit(newRow);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
          <Database className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Base de Datos
            <Shield className="w-4 h-4 text-purple-400" />
          </h1>
          <p className="text-xs text-slate-500">Gestión administrativa de datos</p>
        </div>
      </div>

      {/* Table Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tables.map((table, i) => (
          <Button
            key={table.name}
            variant={activeTable === i ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setActiveTable(i); cancelEdit(); }}
            className={activeTable === i 
              ? 'border-0' 
              : 'border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
            }
            style={activeTable === i ? { background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' } : {}}
          >
            <Table2 className="w-4 h-4 mr-1" />
            {table.name}
            <Badge variant="outline" className="ml-1 text-[10px] border-slate-600 text-slate-400">
              {table.rows.length}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Table */}
      <Card className="border-0 overflow-hidden" style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
        <div className="p-4 border-b border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table2 className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-white">{currentTable.name}</span>
            <Badge variant="outline" className="text-[10px] border-slate-600 text-slate-400">
              {currentTable.rows.length} registros
            </Badge>
          </div>
          <Button size="sm" onClick={addRow} style={{ background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' }}>
            <Plus className="w-4 h-4 mr-1" /> Agregar
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/50">
                {currentTable.columns.map(col => (
                  <th key={col} className="text-left text-xs text-slate-400 font-medium p-3 uppercase tracking-wider">
                    {col}
                  </th>
                ))}
                <th className="text-right text-xs text-slate-400 font-medium p-3 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {currentTable.rows.map(row => (
                <tr key={row.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                  {currentTable.columns.map(col => (
                    <td key={col} className="p-3">
                      {editingRow === row.id && col !== 'id' ? (
                        <Input
                          value={editData?.[col] || ''}
                          onChange={(e) => setEditData(prev => prev ? { ...prev, [col]: e.target.value } : null)}
                          className="h-8 text-xs bg-slate-800 border-slate-600 text-white"
                        />
                      ) : (
                        <span className="text-sm text-slate-200">{row[col]}</span>
                      )}
                    </td>
                  ))}
                  <td className="p-3 text-right">
                    {editingRow === row.id ? (
                      <div className="flex gap-1 justify-end">
                        <Button size="icon" variant="ghost" onClick={saveEdit} className="h-7 w-7 text-emerald-400 hover:text-emerald-300">
                          <Save className="w-3 h-3" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={cancelEdit} className="h-7 w-7 text-slate-400 hover:text-slate-300">
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-1 justify-end">
                        <Button size="icon" variant="ghost" onClick={() => startEdit(row)} className="h-7 w-7 text-blue-400 hover:text-blue-300">
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteRow(row.id)} className="h-7 w-7 text-red-400 hover:text-red-300">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
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
