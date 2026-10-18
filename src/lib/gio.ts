import type { Workspace } from "@/lib/workspace";

export interface GioAnswer {
  id: string;
  prompt: string;
  title: string;
  paragraphs: string[];
  links: { href: string; label: string }[];
}

export function gioSuggestions(pathname: string) {
  if (pathname.includes("/madurez")) {
    return ["imd", "progress", "now"];
  }
  if (pathname.includes("/preoperativos")) {
    return ["documents", "now", "progress"];
  }
  if (pathname.includes("/academy") || pathname.includes("/leccion")) {
    return ["route", "competencies", "now"];
  }
  if (pathname.includes("/transformacion") || pathname.includes("/programa")) {
    return ["progress", "now", "imd"];
  }
  return ["now", "progress", "documents", "competencies"];
}

export function answerGio(id: string, workspace: Workspace, pathname: string): GioAnswer {
  const { tenant, transformationIndex, pending, activeCompetency, routeProgress, activeLesson } = workspace;
  const place = pathname.includes("academy")
    ? "Academy"
    : pathname.includes("reporteria")
      ? "Reportería"
      : pathname.includes("madurez")
        ? "el Índice de Madurez"
        : pathname.includes("preoperativos")
          ? "Preoperativos"
          : "el Smart Center";

  const catalog: Record<string, GioAnswer> = {
    now: {
      id: "now",
      prompt: "¿Qué debo hacer ahora?",
      title: "Tu siguiente paso",
      paragraphs: [
        `Estás en ${place}, dentro de ${tenant.name}.`,
        pending[0]
          ? `La acción más cercana es: ${pending[0].title}. ${pending[0].detail}`
          : "No hay pendientes de gestión en esta entidad. Puedes revisar el avance del programa o continuar la ruta.",
        `En formación, la lección activa es «${activeLesson.title}» (${activeLesson.baseProgress}%). Completarla registra avance de aprendizaje; no acredita la competencia.`,
      ],
      links: [
        { href: pending[0]?.href ?? "/app", label: "Ir a la acción" },
        { href: `/app/academy/leccion/${activeLesson.id}`, label: "Abrir la lección" },
      ],
    },
    progress: {
      id: "progress",
      prompt: "Explícame mi avance",
      title: "Dónde está la entidad",
      paragraphs: [
        `${tenant.name} tiene un índice de transformación de ${transformationIndex}%. Ese número combina los preoperativos (${workspace.loaded}/${workspace.documents.length || 0} documentos con carga) y el promedio de los seis módulos (${workspace.moduleAverage}%).`,
        `La ruta de Laura va en ${routeProgress}%. La competencia en desarrollo es «${activeCompetency.name}», al ${activeCompetency.baseProgress}%.`,
        "Planeación muestra el acompañamiento de GBA. Ejecución muestra las iniciativas propias de la cooperativa. Son tableros distintos.",
      ],
      links: [
        { href: "/app/transformacion", label: "Ver Mi Transformación" },
        { href: "/app/reporteria", label: "Abrir reportería" },
      ],
    },
    imd: {
      id: "imd",
      prompt: "¿Qué significa mi índice de madurez?",
      title: "Lectura del índice",
      paragraphs: [
        `${tenant.name} tiene ${tenant.maturity.score.toLocaleString("es-CO")} de ${tenant.maturity.scale}: ${tenant.maturity.level}.`,
        tenant.maturity.narrative,
        `Este resultado llegó por importación controlada el ${tenant.maturity.importedAt}. Esta demo no calcula un test nuevo ni modifica el índice.`,
        `Fortaleza visible: ${tenant.maturity.strengths[0] ?? "Sin dato"}`,
        `Oportunidad visible: ${tenant.maturity.opportunities[0] ?? "Sin dato"}`,
      ],
      links: [{ href: "/app/transformacion/madurez", label: "Ver el índice" }],
    },
    competencies: {
      id: "competencies",
      prompt: "¿Qué competencias debería fortalecer?",
      title: "Competencias priorizadas",
      paragraphs: [
        "Para el perfil Responsable de Transformación Digital, la ruta prioriza gestión del riesgo SARLAFT, controles y aplicación en la cooperativa.",
        `Ahora conviene sostener «${activeCompetency.name}». El nivel esperado de referencia es jefatura o coordinación; el nivel actual de esa competencia es «${activeCompetency.currentLevel}».`,
        "La prioridad sale del cargo, de los intereses declarados y del desafío de alinear tecnología y negocio. No es un catálogo genérico.",
      ],
      links: [
        { href: "/app/academy/perfil", label: "Ver mi perfil" },
        { href: "/app/academy/ruta", label: "Ver la ruta" },
      ],
    },
    route: {
      id: "route",
      prompt: "¿Cómo puedo continuar mi ruta?",
      title: "Continuar la ruta",
      paragraphs: [
        "La ruta demostrativa es SARLAFT para líderes de transformación.",
        `Siguiente actividad: «${activeLesson.title}». Lleva ${activeLesson.baseProgress}% y dura ${activeLesson.minutes} minutos.`,
        "Después de la formación viene la aplicación: un proyecto con evidencia. Un experto autorizado valida. GIO puede orientarte, no puede acreditar.",
      ],
      links: [
        { href: `/app/academy/leccion/${activeLesson.id}`, label: "Continuar lección" },
        { href: "/app/academy/proyectos", label: "Ver el proyecto" },
      ],
    },
    documents: {
      id: "documents",
      prompt: "¿Qué documentos tengo pendientes?",
      title: "Documentos que requieren acción",
      paragraphs: [
        workspace.documents.length === 0
          ? "Esta vista de red no administra el expediente de una cooperativa. Entra a Ejemplo o Aurora para ver documentos."
          : `Hay ${workspace.documents.filter((item) => item.status === "pendiente").length} sin cargar y ${workspace.documents.filter((item) => item.status === "requiere_ajustes").length} con ajustes pedidos.`,
        workspace.documents
          .filter((item) => item.status === "pendiente" || item.status === "requiere_ajustes")
          .map((item) => `${item.name}: ${item.status === "pendiente" ? "pendiente" : "requiere ajustes"}.`)
          .join(" ") || "Ningún documento espera acción de la cooperativa.",
        "Cargar un archivo en esta demo solo cambia el estado local.",
      ],
      links: [{ href: "/app/transformacion/preoperativos", label: "Abrir preoperativos" }],
    },
  };

  return (
    catalog[id] ?? {
      id: "fallback",
      prompt: id,
      title: "Puedo orientar, dentro de esta simulación",
      paragraphs: [
        "Esta versión de GIO no consulta un modelo externo. Responde con el estado demostrativo de la entidad activa.",
        "Prueba con una de las preguntas sugeridas: siguiente paso, avance, índice, competencias, ruta o documentos.",
        "No cambio resultados oficiales, no acredito competencias y no apruebo documentos.",
      ],
      links: [],
    }
  );
}
