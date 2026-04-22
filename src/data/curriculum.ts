// Malla Curricular Oficial - Ingeniero en Administración de Empresas
// Salida Intermedia: Técnico en Administración de Empresas
// Nivel: Profesional | Modalidad: Online | Duración: 4 años

export interface Subject {
  id: string;
  name: string;
  bimestre: number;
  year: number;
  diplomado: number | null; // null = materia general
  status: 'completed' | 'in-progress' | 'pending';
  examOnline?: boolean; // Examen supervisado online (verde)
}

export interface Diplomado {
  id: number;
  name: string;
}

export const diplomados: Diplomado[] = [
  { id: 1, name: 'Diplomado en Administración y Procesos Operativos' },
  { id: 2, name: 'Diplomado en Contabilidad y Finanzas' },
  { id: 3, name: 'Diplomado en Operaciones Logísticas' },
  { id: 4, name: 'Diplomado en Ventas y Marketing' },
  { id: 5, name: 'Diplomado en Gestión Financiera' },
  { id: 6, name: 'Diplomado en Marketing Estratégico' },
  { id: 7, name: 'Diplomado en Gestión de Personas y Desarrollo Organizacional' },
  { id: 8, name: 'Diplomado en Gestión de Negocios' },
  { id: 9, name: 'Diplomado en Estrategia y Sostenibilidad de Negocios' },
];

export const defaultSubjects: Subject[] = [
  // === AÑO 1 ===
  // BIMESTRE 1
  { id: 'b1-1', name: 'Administración', bimestre: 1, year: 1, diplomado: 1, status: 'pending' },
  { id: 'b1-2', name: 'Tecnología de la Información', bimestre: 1, year: 1, diplomado: null, status: 'pending' },
  // BIMESTRE 2
  { id: 'b2-1', name: 'Economía', bimestre: 2, year: 1, diplomado: 1, status: 'pending' },
  { id: 'b2-2', name: 'Derecho Laboral y Tributario', bimestre: 2, year: 1, diplomado: null, status: 'pending' },
  // BIMESTRE 3
  { id: 'b3-1', name: 'Recursos Humanos', bimestre: 3, year: 1, diplomado: 1, status: 'pending' },
  { id: 'b3-2', name: 'Nivelación de Matemática', bimestre: 3, year: 1, diplomado: null, status: 'pending' },
  { id: 'b3-3', name: 'Comunicación y Redacción', bimestre: 3, year: 1, diplomado: null, status: 'pending' },
  // BIMESTRE 4
  { id: 'b4-1', name: 'Contabilidad', bimestre: 4, year: 1, diplomado: 2, status: 'pending' },
  { id: 'b4-2', name: 'Herramientas Tecnológicas para los Negocios', bimestre: 4, year: 1, diplomado: null, status: 'pending' },
  // BIMESTRE 5
  { id: 'b5-1', name: 'Costos y Presupuestos', bimestre: 5, year: 1, diplomado: 2, status: 'pending' },
  { id: 'b5-2', name: 'Finanzas', bimestre: 5, year: 1, diplomado: 2, status: 'pending' },

  // === AÑO 2 ===
  // BIMESTRE 6
  { id: 'b6-1', name: 'Análisis Financiero', bimestre: 6, year: 2, diplomado: 2, status: 'pending' },
  { id: 'b6-2', name: 'Logística y Operaciones', bimestre: 6, year: 2, diplomado: 3, status: 'pending' },
  { id: 'b6-3', name: 'Ética y Responsabilidad', bimestre: 6, year: 2, diplomado: null, status: 'pending' },
  // BIMESTRE 7
  { id: 'b7-1', name: 'Tesorería', bimestre: 7, year: 2, diplomado: 2, status: 'pending' },
  { id: 'b7-2', name: 'Control de Inventarios', bimestre: 7, year: 2, diplomado: 3, status: 'pending' },
  // BIMESTRE 8
  { id: 'b8-1', name: 'Análisis Empresarial', bimestre: 8, year: 2, diplomado: 4, status: 'pending' },
  { id: 'b8-2', name: 'Venta y Servicio a Clientes', bimestre: 8, year: 2, diplomado: 3, status: 'pending' },
  { id: 'b8-3', name: 'Emprendimiento', bimestre: 8, year: 2, diplomado: null, status: 'pending' },
  // BIMESTRE 9
  { id: 'b9-1', name: 'Marketing Digital', bimestre: 9, year: 2, diplomado: 4, status: 'pending' },
  { id: 'b9-2', name: 'Software de Administración', bimestre: 9, year: 2, diplomado: null, status: 'pending' },
  // BIMESTRE 10
  { id: 'b10-1', name: 'Proyecto de Titulación', bimestre: 10, year: 2, diplomado: null, status: 'pending', examOnline: true },

  // === AÑO 3 ===
  // BIMESTRE 11
  { id: 'b11-1', name: 'Estrategias Financieras', bimestre: 11, year: 3, diplomado: 5, status: 'pending' },
  { id: 'b11-2', name: 'Gestión Estratégica de Personas', bimestre: 11, year: 3, diplomado: 6, status: 'pending' },
  // BIMESTRE 12
  { id: 'b12-1', name: 'Gestión de Financiamiento', bimestre: 12, year: 3, diplomado: 5, status: 'pending' },
  { id: 'b12-2', name: 'Gestión por Competencias', bimestre: 12, year: 3, diplomado: 7, status: 'pending' },
  // BIMESTRE 13
  { id: 'b13-1', name: 'Gestión de Inversiones', bimestre: 13, year: 3, diplomado: 5, status: 'pending' },
  { id: 'b13-2', name: 'Desarrollo Organizacional', bimestre: 13, year: 3, diplomado: 7, status: 'pending' },
  // BIMESTRE 14
  { id: 'b14-1', name: 'Investigación de Mercados', bimestre: 14, year: 3, diplomado: 6, status: 'pending' },
  { id: 'b14-2', name: 'Negociación y Liderazgo', bimestre: 14, year: 3, diplomado: 7, status: 'pending' },
  // BIMESTRE 15
  { id: 'b15-1', name: 'Marketing Estratégico', bimestre: 15, year: 3, diplomado: 6, status: 'pending', examOnline: true },
  { id: 'b15-2', name: 'Gestión de Clientes y Fidelización', bimestre: 15, year: 3, diplomado: 6, status: 'pending' },

  // === AÑO 4 ===
  // BIMESTRE 16
  { id: 'b16-1', name: 'Sostenibilidad en los Negocios', bimestre: 16, year: 4, diplomado: 9, status: 'pending' },
  { id: 'b16-2', name: 'Gestión de Operaciones', bimestre: 16, year: 4, diplomado: 8, status: 'pending' },
  // BIMESTRE 17
  { id: 'b17-1', name: 'Macroeconomía', bimestre: 17, year: 4, diplomado: 9, status: 'pending' },
  { id: 'b17-2', name: 'Inteligencia de Negocios', bimestre: 17, year: 4, diplomado: 8, status: 'pending' },
  // BIMESTRE 18
  { id: 'b18-1', name: 'Formulación y Evaluación de Proyectos', bimestre: 18, year: 4, diplomado: null, status: 'pending' },
  { id: 'b18-2', name: 'Control de Gestión', bimestre: 18, year: 4, diplomado: 8, status: 'pending' },
  // BIMESTRE 19
  { id: 'b19-1', name: 'Planificación y Dirección Estratégica', bimestre: 19, year: 4, diplomado: 9, status: 'pending' },
  { id: 'b19-2', name: 'Gestión del Cambio', bimestre: 19, year: 4, diplomado: 8, status: 'pending' },
  { id: 'b19-3', name: 'Innovación y Emprendimiento', bimestre: 19, year: 4, diplomado: null, status: 'pending' },
  // BIMESTRE 20
  { id: 'b20-1', name: 'Proyecto de Titulación', bimestre: 20, year: 4, diplomado: null, status: 'pending', examOnline: true },
];
