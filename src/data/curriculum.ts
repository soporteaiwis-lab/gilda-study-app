// Malla Curricular Oficial - Ingeniero en Administración de Empresas
// Duración: 2 años (10 Bimestres)

export interface Subject {
  id: string;
  name: string;
  bimestre: number;
  year: number;
  diplomado: number | null;
  status: 'completed' | 'in-progress' | 'pending';
  examOnline?: boolean;
}

export interface Diplomado {
  id: number;
  name: string;
}

export const diplomados: Diplomado[] = [
  { id: 5, name: 'Diplomado en Gestión Financiera' },
  { id: 6, name: 'Diplomado en Marketing Estratégico' },
  { id: 7, name: 'Diplomado en Gestión de Personas y Desarrollo Organizacional' },
  { id: 8, name: 'Diplomado en Gestión de Negocios' },
  { id: 9, name: 'Diplomado en Estrategia y Sostenibilidad de Negocios' },
];

export const defaultSubjects: Subject[] = [
  // === AÑO 1 ===
  // BIMESTRE 1
  { id: 'b1-1', name: 'Estrategias Financieras', bimestre: 1, year: 1, diplomado: 5, status: 'pending' },
  { id: 'b1-2', name: 'Gestión Estratégica de Personas', bimestre: 1, year: 1, diplomado: 7, status: 'pending' },
  // BIMESTRE 2
  { id: 'b2-1', name: 'Gestión de Financiamiento', bimestre: 2, year: 1, diplomado: 5, status: 'pending' },
  { id: 'b2-2', name: 'Gestión por Competencias', bimestre: 2, year: 1, diplomado: 7, status: 'pending' },
  // BIMESTRE 3
  { id: 'b3-1', name: 'Gestión de Inversiones', bimestre: 3, year: 1, diplomado: 5, status: 'pending' },
  { id: 'b3-2', name: 'Desarrollo Organizacional', bimestre: 3, year: 1, diplomado: 7, status: 'pending' },
  // BIMESTRE 4
  { id: 'b4-1', name: 'Investigación de Mercados', bimestre: 4, year: 1, diplomado: 6, status: 'pending' },
  { id: 'b4-2', name: 'Negociación y Liderazgo', bimestre: 4, year: 1, diplomado: 6, status: 'pending' },
  // BIMESTRE 5
  { id: 'b5-1', name: 'Marketing Estratégico', bimestre: 5, year: 1, diplomado: 6, status: 'pending', examOnline: true },
  { id: 'b5-2', name: 'Gestión de Clientes y Fidelización', bimestre: 5, year: 1, diplomado: 6, status: 'pending' },

  // === AÑO 2 ===
  // BIMESTRE 6
  { id: 'b6-1', name: 'Sostenibilidad en los Negocios', bimestre: 6, year: 2, diplomado: 9, status: 'pending' },
  { id: 'b6-2', name: 'Gestión de Operaciones', bimestre: 6, year: 2, diplomado: 8, status: 'pending' },
  // BIMESTRE 7
  { id: 'b7-1', name: 'Macroeconomía', bimestre: 7, year: 2, diplomado: 9, status: 'pending' },
  { id: 'b7-2', name: 'Inteligencia de Negocios', bimestre: 7, year: 2, diplomado: 8, status: 'pending' },
  // BIMESTRE 8
  { id: 'b8-1', name: 'Formulación y Evaluación de Proyectos', bimestre: 8, year: 2, diplomado: 9, status: 'pending' },
  { id: 'b8-2', name: 'Control de Gestión', bimestre: 8, year: 2, diplomado: 8, status: 'pending', examOnline: true },
  // BIMESTRE 9
  { id: 'b9-1', name: 'Planificación y Dirección Estratégica', bimestre: 9, year: 2, diplomado: 9, status: 'pending' },
  { id: 'b9-2', name: 'Gestión del Cambio', bimestre: 9, year: 2, diplomado: 8, status: 'pending' },
  { id: 'b9-3', name: 'Innovación y Emprendimiento', bimestre: 9, year: 2, diplomado: null, status: 'pending' },
  // BIMESTRE 10
  { id: 'b10-1', name: 'Proyecto de Titulación', bimestre: 10, year: 2, diplomado: null, status: 'pending' },
  { id: 'b10-2', name: 'Práctica Profesional', bimestre: 10, year: 2, diplomado: null, status: 'pending' },
];
