export interface Subject {
  id: string;
  name: string;
  bimestre: number;
  year: number;
  status: 'pending' | 'in-progress' | 'completed';
  examOnline?: boolean;
  diplomado?: number;
}

export const diplomados = [
  { id: 1, name: 'Administración y Procesos Operativos' },
  { id: 2, name: 'Contabilidad y Finanzas' },
  { id: 3, name: 'Operaciones Logísticas' },
  { id: 4, name: 'Ventas y Marketing' },
];

export const defaultSubjects: Subject[] = [
  // AÑO 1 - BIMESTRE 1
  { id: '1-1-1', name: 'Administración', bimestre: 1, year: 1, status: 'pending', diplomado: 1 },
  { id: '1-1-2', name: 'Tecnología de la Información', bimestre: 1, year: 1, status: 'pending', diplomado: 1 },
  
  // AÑO 1 - BIMESTRE 2
  { id: '1-2-1', name: 'Economía', bimestre: 2, year: 1, status: 'pending', diplomado: 1 },
  { id: '1-2-2', name: 'Derecho Laboral y Tributario', bimestre: 2, year: 1, status: 'pending', diplomado: 1 },
  
  // AÑO 1 - BIMESTRE 3
  { id: '1-3-1', name: 'Recursos Humanos', bimestre: 3, year: 1, status: 'pending', diplomado: 1, examOnline: true },
  { id: '1-3-2', name: 'Nivelación de Matemática', bimestre: 3, year: 1, status: 'pending' },
  
  // AÑO 1 - BIMESTRE 4
  { id: '1-4-1', name: 'Contabilidad', bimestre: 4, year: 1, status: 'pending', diplomado: 2 },
  { id: '1-4-2', name: 'Herramientas Tecnológicas para los Negocios', bimestre: 4, year: 1, status: 'pending' },
  { id: '1-4-3', name: 'Comunicación y Redacción', bimestre: 4, year: 1, status: 'pending' },
  
  // AÑO 1 - BIMESTRE 5
  { id: '1-5-1', name: 'Costos y Presupuestos', bimestre: 5, year: 1, status: 'pending', diplomado: 2 },
  { id: '1-5-2', name: 'Finanzas', bimestre: 5, year: 1, status: 'pending', diplomado: 2, examOnline: true },

  // AÑO 2 - BIMESTRE 6
  { id: '2-6-1', name: 'Análisis Financiero', bimestre: 6, year: 2, status: 'pending', diplomado: 2 },
  { id: '2-6-2', name: 'Logística y Operaciones', bimestre: 6, year: 2, status: 'pending', diplomado: 3 },
  { id: '2-6-3', name: 'Ética y Responsabilidad', bimestre: 6, year: 2, status: 'pending' },
  
  // AÑO 2 - BIMESTRE 7
  { id: '2-7-1', name: 'Tesorería', bimestre: 7, year: 2, status: 'pending', diplomado: 2 },
  { id: '2-7-2', name: 'Control de Inventarios', bimestre: 7, year: 2, status: 'pending', diplomado: 3, examOnline: true },
  
  // AÑO 2 - BIMESTRE 8
  { id: '2-8-1', name: 'Análisis Empresarial', bimestre: 8, year: 2, status: 'pending', diplomado: 4 },
  { id: '2-8-2', name: 'Venta y Servicio a Clientes', bimestre: 8, year: 2, status: 'pending', diplomado: 4, examOnline: true },
  { id: '2-8-3', name: 'Emprendimiento', bimestre: 8, year: 2, status: 'pending' },
  
  // AÑO 2 - BIMESTRE 9
  { id: '2-9-1', name: 'Marketing Digital', bimestre: 9, year: 2, status: 'pending', diplomado: 4 },
  { id: '2-9-2', name: 'Software de Administración', bimestre: 9, year: 2, status: 'pending' },
  
  // AÑO 2 - BIMESTRE 10
  { id: '2-10-1', name: 'Proyecto de Titulación', bimestre: 10, year: 2, status: 'pending' },
];
