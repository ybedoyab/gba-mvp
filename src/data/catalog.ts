import type {
  Competency,
  Course,
  Lesson,
  ProjectItem,
  RouteStage,
} from "@/types";

export const courses: Course[] = [
  {
    id: "sarlaft-lideres",
    title: "Ruta SARLAFT para líderes de transformación",
    summary:
      "Secuencia guiada para interpretar el marco, gestionar el riesgo y preparar una evidencia aplicable en la cooperativa.",
    image: "/assets/catalogo/sarlaft_lideres.png",
    line: "Riesgos y cumplimiento",
    minutes: 180,
    contracted: true,
    competencyId: "riesgo-sarlaft",
  },
  {
    id: "finanzas-abiertas",
    title: "Fundamentos de finanzas abiertas",
    summary:
      "Comprende el ecosistema de finanzas abiertas y su implicación para el sector solidario.",
    image: "/assets/catalogo/finanzas_abiertas.png",
    line: "Finanzas abiertas",
    minutes: 90,
    contracted: true,
  },
  {
    id: "gobierno-digital",
    title: "Gobierno corporativo digital",
    summary:
      "Decisiones, roles y seguimiento para una junta que gobierna la transformación.",
    image: "/assets/catalogo/gobierno_corporativo_digital.png",
    line: "Gobierno",
    minutes: 75,
    contracted: true,
  },
  {
    id: "datos-analitica",
    title: "Datos y analítica para la decisión",
    summary:
      "Cómo leer indicadores y convertirlos en decisiones de la cooperativa.",
    image: "/assets/catalogo/datos_analitica.png",
    line: "Datos",
    minutes: 80,
    contracted: false,
  },
  {
    id: "automatizacion",
    title: "Automatización de procesos críticos",
    summary:
      "Identifica trámites repetitivos y prioriza automatizaciones con impacto.",
    image: "/assets/catalogo/automatizacion.png",
    line: "Operación",
    minutes: 70,
    contracted: false,
  },
  {
    id: "ciberseguridad",
    title: "Ciberseguridad para equipos de negocio",
    summary:
      "Riesgos digitales explicados para quienes deciden, no solo para el área técnica.",
    image: "/assets/catalogo/ciberseguridad.png",
    line: "Riesgos y cumplimiento",
    minutes: 65,
    contracted: false,
  },
  {
    id: "liderazgo",
    title: "Liderazgo de la transformación",
    summary:
      "Cómo sostener el cambio con la junta, los equipos y los asociados.",
    image: "/assets/catalogo/liderazgo_transformacion.png",
    line: "Transformación digital",
    minutes: 85,
    contracted: true,
  },
  {
    id: "cultura",
    title: "Cultura digital en la cooperativa",
    summary:
      "Hábitos, adopción y conversaciones que hacen usable la estrategia.",
    image: "/assets/catalogo/cultura_digital.png",
    line: "Transformación digital",
    minutes: 60,
    contracted: false,
  },
  {
    id: "fraude",
    title: "Prevención del fraude",
    summary: "Señales, controles y respuesta ante eventos de fraude.",
    image: "/assets/catalogo/prevencion_fraude.png",
    line: "Riesgos y cumplimiento",
    minutes: 55,
    contracted: false,
  },
  {
    id: "experiencia",
    title: "Experiencia del asociado",
    summary:
      "Diseña recorridos simples para vincular, atender y fidelizar asociados.",
    image: "/assets/catalogo/experiencia_asociado.png",
    line: "Experiencia",
    minutes: 70,
    contracted: false,
  },
  {
    id: "cambio",
    title: "Gestión del cambio",
    summary: "Acompaña la adopción de nuevas prácticas en los equipos.",
    image: "/assets/catalogo/gestion_cambio.png",
    line: "Transformación digital",
    minutes: 60,
    contracted: false,
  },
  {
    id: "innovacion",
    title: "Innovación en el sector solidario",
    summary:
      "Explora oportunidades sin perder la identidad cooperativa.",
    image: "/assets/catalogo/innovacion_sector_solidario.png",
    line: "Transformación digital",
    minutes: 50,
    contracted: false,
  },
];

export const lessons: Lesson[] = [
  {
    id: "marco-sarlaft",
    courseId: "sarlaft-lideres",
    order: 1,
    title: "Fundamentos y contexto regulatorio",
    minutes: 18,
    summary:
      "Propósito del SARLAFT, actores y responsabilidades de la cooperativa.",
    outcome: "Explicas el marco a un miembro de junta sin jerga innecesaria.",
    resources: [
      { id: "r1", name: "Guía breve del marco", kind: "Lectura" },
      { id: "r2", name: "Mapa de responsabilidades", kind: "Plantilla" },
    ],
    baseProgress: 100,
  },
  {
    id: "senales",
    courseId: "sarlaft-lideres",
    order: 2,
    title: "Señales y criterios de alerta",
    minutes: 16,
    summary: "Cómo reconocer situaciones que merecen análisis, no solo reporte.",
    outcome: "Distingues una alerta operativa de un hallazgo que escala.",
    resources: [{ id: "r3", name: "Lista de señales ilustrativas", kind: "Lista" }],
    baseProgress: 100,
  },
  {
    id: "gestion-del-riesgo",
    courseId: "sarlaft-lideres",
    order: 3,
    title: "Gestión del riesgo en decisiones reales",
    minutes: 15,
    summary:
      "Aplicas criterios de riesgo a una decisión cotidiana de la cooperativa, con foco en el asociado y en el control.",
    outcome:
      "Documentas una decisión con riesgo, control y siguiente paso.",
    resources: [
      { id: "r4", name: "Caso ilustrativo de vinculación", kind: "Caso" },
      { id: "r5", name: "Bitácora de decisión", kind: "Plantilla" },
    ],
    baseProgress: 40,
  },
  {
    id: "controles",
    courseId: "sarlaft-lideres",
    order: 4,
    title: "Diseño de controles y respuestas",
    minutes: 20,
    summary:
      "Traduce el análisis en controles proporcionales al tamaño de la cooperativa.",
    outcome: "Propones controles que un equipo puede operar.",
    resources: [{ id: "r6", name: "Matriz de controles", kind: "Plantilla" }],
    baseProgress: 0,
  },
  {
    id: "aplicacion-coop",
    courseId: "sarlaft-lideres",
    order: 5,
    title: "Aplicación en la cooperativa",
    minutes: 22,
    summary:
      "Preparas la evidencia que después podrá revisarse en el proyecto de acreditación.",
    outcome: "Reúnes piezas útiles para el plan aplicado, sin acreditar todavía la competencia.",
    resources: [{ id: "r7", name: "Lista de evidencias esperadas", kind: "Lista" }],
    baseProgress: 0,
  },
];

export const competencies: Competency[] = [
  {
    id: "marco",
    name: "Interpretación del marco SARLAFT",
    family: "Nucleares del sector",
    description:
      "Comprende el propósito, el alcance y las responsabilidades del marco en una cooperativa.",
    expectedLevel: "Aplica con autonomía",
    currentLevel: "Aplica con autonomía",
    baseProgress: 100,
    lessonIds: ["marco-sarlaft"],
  },
  {
    id: "riesgo-sarlaft",
    name: "Gestión del riesgo SARLAFT aplicada",
    family: "Funcionales del perfil",
    description:
      "Identifica, analiza y gestiona situaciones de riesgo en decisiones reales del sector solidario.",
    expectedLevel: "Aplica con autonomía",
    currentLevel: "Aplica con acompañamiento",
    baseProgress: 40,
    lessonIds: ["senales", "gestion-del-riesgo"],
  },
  {
    id: "controles",
    name: "Diseño de controles y respuestas",
    family: "Funcionales del perfil",
    description:
      "Define controles proporcionales y una respuesta que el equipo pueda sostener.",
    expectedLevel: "Aplica con autonomía",
    currentLevel: "Comprende",
    baseProgress: 0,
    lessonIds: ["controles"],
  },
  {
    id: "aplicacion",
    name: "Aplicación del plan en la cooperativa",
    family: "Nucleares del sector",
    description:
      "Lleva el criterio al contexto de su entidad y prepara una evidencia revisable.",
    expectedLevel: "Demuestra en contexto",
    currentLevel: "Aún no iniciada",
    baseProgress: 0,
    lessonIds: ["aplicacion-coop"],
  },
];

export const routeStages: RouteStage[] = [
  {
    id: "perfil",
    label: "Perfil",
    description: "Cargo, responsabilidades y contexto de la cooperativa.",
    state: "completa",
  },
  {
    id: "competencias",
    label: "Competencias",
    description: "Capacidades esperadas para el perfil de referencia.",
    state: "completa",
  },
  {
    id: "brechas",
    label: "Brechas",
    description: "Diferencia entre el nivel esperado y el punto de partida.",
    state: "completa",
  },
  {
    id: "ruta",
    label: "Ruta",
    description: "Secuencia recomendada: SARLAFT para líderes de transformación.",
    state: "completa",
  },
  {
    id: "formacion",
    label: "Formación",
    description: "Actividades y lecciones de la ruta en curso.",
    state: "actual",
  },
  {
    id: "aplicacion",
    label: "Aplicación",
    description: "Proyecto relevante para la cooperativa.",
    state: "bloqueada",
  },
  {
    id: "proyecto",
    label: "Proyecto",
    description: "Evidencia estructurada contra una rúbrica.",
    state: "bloqueada",
  },
  {
    id: "validacion",
    label: "Validación",
    description: "Revisión de un experto autorizado. GIO no decide.",
    state: "bloqueada",
  },
  {
    id: "reconocimiento",
    label: "Reconocimiento",
    description: "Acreditación trazable de la competencia demostrada.",
    state: "bloqueada",
  },
];

export const projects: ProjectItem[] = [
  {
    id: "plan-sarlaft",
    name: "Plan SARLAFT aplicado a una decisión de vinculación",
    competencyId: "riesgo-sarlaft",
    summary:
      "Documento de aplicación: una decisión real o verosímil de la cooperativa, con riesgo, control y seguimiento. Completar el curso no acredita esta competencia.",
    status: "en_desarrollo",
    requirements: [
      "Describe el contexto de la cooperativa sin datos sensibles de asociados.",
      "Identifica el riesgo y el criterio usado para analizarlo.",
      "Propone un control que el equipo pueda operar.",
      "Define cómo se sabrá si el control funciona.",
    ],
    evidences: [
      { id: "e1", name: "Contexto y decisión", required: true, provided: true },
      { id: "e2", name: "Análisis de riesgo", required: true, provided: false },
      { id: "e3", name: "Control propuesto", required: true, provided: false },
      { id: "e4", name: "Indicador de seguimiento", required: true, provided: false },
    ],
    rubric: [
      {
        id: "c1",
        name: "Pertinencia",
        description: "La situación pertenece al quehacer real de una cooperativa.",
        weight: "25%",
      },
      {
        id: "c2",
        name: "Criterio",
        description: "El análisis usa el marco y no solo una opinión.",
        weight: "25%",
      },
      {
        id: "c3",
        name: "Aplicabilidad",
        description: "El control es proporcional y operable.",
        weight: "30%",
      },
      {
        id: "c4",
        name: "Trazabilidad",
        description: "Queda claro qué se revisará después.",
        weight: "20%",
      },
    ],
    timeline: [
      {
        id: "t1",
        date: "2 oct 2026",
        title: "Proyecto habilitado",
        detail: "La ruta recomendó esta evidencia para la competencia en desarrollo.",
      },
      {
        id: "t2",
        date: "9 oct 2026",
        title: "Borrador iniciado",
        detail: "Contexto de la decisión cargado como pieza ilustrativa.",
      },
    ],
  },
  {
    id: "cultura-cumplimiento",
    name: "Ritual de cumplimiento en el comité de riesgos",
    competencyId: "marco",
    summary:
      "Competencia ya reconocida. Un experto autorizado revisó la evidencia en un ciclo anterior. Sirve como referencia del reconocimiento, no como resultado de este curso.",
    status: "acreditado",
    requirements: ["Evidencia de una sesión de comité.", "Criterio aplicado.", "Acta de validación."],
    evidences: [
      { id: "e5", name: "Guion de la sesión", required: true, provided: true },
      { id: "e6", name: "Acta de validación experta", required: true, provided: true },
    ],
    rubric: [
      {
        id: "c5",
        name: "Claridad",
        description: "La junta entiende el propósito del ritual.",
        weight: "50%",
      },
      {
        id: "c6",
        name: "Sostenibilidad",
        description: "El comité puede repetirlo sin el consultor.",
        weight: "50%",
      },
    ],
    timeline: [
      {
        id: "t3",
        date: "12 sep 2026",
        title: "Validación experta",
        detail: "Revisó: Helena Duarte, especialista GBA. Resultado: reconocido.",
      },
    ],
    expert: "Helena Duarte · especialista GBA",
    credentialCode: "GBA-DEM-2026-0142",
  },
];

export const masteryScale = [
  { level: "1", name: "Reconoce", detail: "Identifica el concepto en ejemplos guiados." },
  { level: "2", name: "Comprende", detail: "Explica el criterio con sus propias palabras." },
  { level: "3", name: "Aplica con acompañamiento", detail: "Lo usa en un caso con revisión." },
  { level: "4", name: "Aplica con autonomía", detail: "Lo sostiene en su función habitual." },
  { level: "5", name: "Demuestra en contexto", detail: "Produce una evidencia que otro puede validar." },
];
