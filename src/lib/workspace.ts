import { competencies, contractedCourseIds, courses, lessons, projects, routeStages } from "@/data/catalog";
import { network } from "@/data/tenants";
import { tenants } from "@/data/tenants";
import type { useDemoStore } from "@/stores/demo-store";
import type {
  Competency,
  CompetencyStanding,
  DocStatus,
  DocumentItem,
  Initiative,
  Lesson,
  PendingAction,
  ProjectItem,
  ProjectStatus,
  RouteStage,
  TenantId,
} from "@/types";
import { average } from "@/lib/utils";

type StoreSlice = Pick<
  ReturnType<typeof useDemoStore.getState>,
  | "docStatus"
  | "docEvents"
  | "lessonProgress"
  | "extraInitiatives"
  | "projectStatus"
  | "evidenceProvided"
  | "projectEvents"
>;

const statusLabel: Record<DocStatus, string> = {
  pendiente: "Pendiente",
  cargado: "Cargado",
  en_revision: "En revisión",
  requiere_ajustes: "Requiere ajustes",
  aprobado: "Aprobado",
};

export function countsAsLoaded(status: DocStatus) {
  return status === "cargado" || status === "en_revision" || status === "aprobado";
}

export function documentStatusLabel(status: DocStatus) {
  return statusLabel[status];
}

export const standingLabel: Record<CompetencyStanding, string> = {
  sin_iniciar: "Sin iniciar",
  en_formacion: "En formación",
  formacion_completa: "Formación completa · sin acreditar",
  en_aplicacion: "Aplicación en curso",
  en_validacion: "En validación experta",
  acreditada: "Acreditada por experto",
};

function standingFor(progress: number, lessonsComplete: boolean, project?: ProjectItem): CompetencyStanding {
  if (project?.status === "acreditado") return "acreditada";
  if (project?.status === "en_validacion") return "en_validacion";
  if (project?.status === "en_desarrollo") return "en_aplicacion";
  if (lessonsComplete) return "formacion_completa";
  if (progress > 0) return "en_formacion";
  return "sin_iniciar";
}

function levelFor(standing: CompetencyStanding, fallback: string) {
  if (standing === "acreditada") return "Reconocida por un experto";
  if (standing === "sin_iniciar") return "Aún no iniciada";
  if (standing === "formacion_completa") return "Formación completa, sin acreditación";
  return fallback;
}

export function buildWorkspace(tenantId: TenantId, state: StoreSlice) {
  const tenant = tenants[tenantId];
  const documents: DocumentItem[] = tenant.documents.map((item) => {
    const key = `${tenantId}:${item.id}`;
    const status = state.docStatus[key] ?? item.status;
    const extra = state.docEvents[key] ?? [];
    return { ...item, status, timeline: [...item.timeline, ...extra] };
  });

  const loaded = documents.filter((item) => countsAsLoaded(item.status)).length;
  const preopRatio = documents.length ? loaded / documents.length : 0;
  const moduleAverage = average(tenant.modules.map((item) => item.progress));
  const transformationIndex = documents.length
    ? Math.round(0.4 * preopRatio * 100 + 0.6 * moduleAverage)
    : Math.round(moduleAverage);

  const resolvedLessons: Lesson[] = lessons.map((lesson) => ({
    ...lesson,
    baseProgress:
      state.lessonProgress[`${tenantId}:${lesson.id}`] ??
      (tenantId === "ejemplo" ? lesson.baseProgress : 0),
  }));

  const progressOf = (lesson: Lesson) => lesson.baseProgress;

  const catalogProjects = tenantId === "ejemplo" ? projects : projects.filter((project) => project.id === "plan-sarlaft");
  const resolvedProjects: ProjectItem[] = catalogProjects.map((project) => {
    const key = `${tenantId}:${project.id}`;
    const base = tenantId === "ejemplo" ? project : { ...project, status: "disponible" as const, credentialCode: undefined, expert: undefined, timeline: project.timeline.slice(0, 1) };
    return {
      ...base,
      status: state.projectStatus[key] ?? base.status,
      evidences: project.evidences.map((evidence) => ({
        ...evidence,
        provided:
          state.evidenceProvided[`${tenantId}:${evidence.id}`] ??
          (tenantId === "ejemplo" ? evidence.provided : false),
      })),
      timeline: [...base.timeline, ...(state.projectEvents[key] ?? [])],
    };
  });

  const resolvedCompetencies: Competency[] = competencies.map((competency) => {
    const related = resolvedLessons.filter((lesson) => competency.lessonIds.includes(lesson.id));
    const lessonsComplete = related.length > 0 && related.every((lesson) => progressOf(lesson) >= 100);
    const progress =
      related.length === 0
        ? tenantId === "ejemplo" ? competency.baseProgress : 0
        : lessonsComplete
          ? 100
          : progressOf(related.find((lesson) => progressOf(lesson) < 100) ?? related[0]);
    const project = resolvedProjects.find((item) => item.competencyId === competency.id);
    const standing = standingFor(progress, lessonsComplete, project);
    return {
      ...competency,
      baseProgress: progress,
      standing,
      currentLevel: levelFor(standing, competency.currentLevel),
    };
  });

  const routeProgress = Math.round(average(resolvedCompetencies.map((item) => item.baseProgress)));
  const activeCompetency =
    resolvedCompetencies.find((item) => item.standing === "en_formacion" || item.standing === "en_aplicacion") ??
    resolvedCompetencies.find((item) => item.standing !== "acreditada" && item.standing !== "formacion_completa") ??
    resolvedCompetencies[0];

  const riskDone = (resolvedCompetencies.find((item) => item.id === "riesgo-sarlaft")?.baseProgress ?? 0) >= 100;
  const sarlaftStatus = resolvedProjects.find((item) => item.id === "plan-sarlaft")?.status;
  const stages: RouteStage[] = tenantId === "ejemplo"
    ? ejemploStages(riskDone, sarlaftStatus)
    : routeStages.map((stage, index) => ({
        ...stage,
        state: index === 0 ? "actual" : "bloqueada",
      }));

  const initiatives: Initiative[] = [
    ...(state.extraInitiatives[tenantId] ?? []),
    ...tenant.initiatives,
  ];

  const byStatus = {
    planificacion: initiatives.filter((item) => item.status === "planificacion").length,
    ejecucion: initiatives.filter((item) => item.status === "ejecucion").length,
    retrasada: initiatives.filter((item) => item.status === "retrasada").length,
    completada: initiatives.filter((item) => item.status === "completada").length,
  };

  const documentActions: PendingAction[] = documents
    .filter((item) => item.status === "pendiente" || item.status === "requiere_ajustes")
    .map((item) => ({
      id: item.id,
      kind: "documento" as const,
      title: item.status === "pendiente" ? `Cargar ${item.name}` : `Ajustar ${item.name}`,
      detail: item.recommendation ?? item.observation ?? "Requiere acción de la cooperativa.",
      href: "/app/transformacion/preoperativos",
    }));

  const pending = [
    ...documentActions,
    ...tenant.pending.filter((item) => item.kind !== "documento"),
  ];

  const contracted = new Set(contractedCourseIds[tenantId]);
  const resolvedCourses = courses.map((course) => ({ ...course, contracted: contracted.has(course.id) }));

  const formationRate = tenant.participantsTotal
    ? Math.round((tenant.participantsOnRoute / tenant.participantsTotal) * 100)
    : 0;

  return {
    tenant,
    documents,
    loaded,
    preopRatio,
    moduleAverage: Math.round(moduleAverage),
    transformationIndex,
    lessons: resolvedLessons,
    courses: resolvedCourses,
    competencies: resolvedCompetencies,
    stages,
    routeProgress,
    activeCompetency,
    activeLesson:
      resolvedLessons.find((lesson) => lesson.baseProgress < 100) ??
      resolvedLessons[resolvedLessons.length - 1],
    initiatives,
    byStatus,
    pending,
    projects: resolvedProjects,
    formationRate,
    network: network.map((member) => {
      if (member.id === tenantId && (tenantId === "ejemplo" || tenantId === "aurora")) {
        return {
          ...member,
          program: transformationIndex,
          compliance: Math.round(preopRatio * 100),
          delayedInitiatives: byStatus.retrasada,
        };
      }
      if (member.id === "ejemplo" || member.id === "aurora") {
        const other = buildLite(member.id, state);
        return {
          ...member,
          program: other.index,
          compliance: other.compliance,
          delayedInitiatives: other.delayed,
        };
      }
      return member;
    }),
  };
}

function ejemploStages(riskDone: boolean, projectStatus: ProjectStatus | undefined): RouteStage[] {
  return routeStages.map((stage) => {
    if (["perfil", "competencias", "brechas", "ruta"].includes(stage.id)) {
      return { ...stage, state: "completa" as const };
    }
    if (stage.id === "formacion") {
      return { ...stage, state: riskDone ? "completa" as const : "actual" as const };
    }
    if (!riskDone) return { ...stage, state: "bloqueada" as const };
    if (stage.id === "aplicacion") {
      const passed = projectStatus === "en_validacion" || projectStatus === "acreditado";
      return { ...stage, state: passed ? "completa" as const : "actual" as const };
    }
    if (stage.id === "proyecto") {
      if (projectStatus === "en_validacion" || projectStatus === "acreditado") {
        return { ...stage, state: "completa" as const };
      }
      return { ...stage, state: "disponible" as const };
    }
    if (stage.id === "validacion") {
      if (projectStatus === "acreditado") return { ...stage, state: "completa" as const };
      if (projectStatus === "en_validacion") return { ...stage, state: "actual" as const };
      return { ...stage, state: "bloqueada" as const };
    }
    return { ...stage, state: projectStatus === "acreditado" ? "completa" as const : "bloqueada" as const };
  });
}

function buildLite(tenantId: "ejemplo" | "aurora", state: StoreSlice) {
  const tenant = tenants[tenantId];
  const loaded = tenant.documents.filter((item) => countsAsLoaded(state.docStatus[`${tenantId}:${item.id}`] ?? item.status)).length;
  const preop = tenant.documents.length ? loaded / tenant.documents.length : 0;
  const moduleAverage = average(tenant.modules.map((item) => item.progress));
  const initiatives = [...(state.extraInitiatives[tenantId] ?? []), ...tenant.initiatives];
  return {
    index: Math.round(0.4 * preop * 100 + 0.6 * moduleAverage),
    compliance: Math.round(preop * 100),
    delayed: initiatives.filter((item) => item.status === "retrasada").length,
  };
}

export type Workspace = ReturnType<typeof buildWorkspace>;
