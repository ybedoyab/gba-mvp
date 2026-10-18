import { competencies, lessons, projects, routeStages } from "@/data/catalog";
import { network } from "@/data/tenants";
import { tenants } from "@/data/tenants";
import type { useDemoStore } from "@/stores/demo-store";
import type {
  Competency,
  DocStatus,
  DocumentItem,
  Initiative,
  Lesson,
  PendingAction,
  ProjectItem,
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

export function documentStatusLabel(status: DocStatus) {
  return statusLabel[status];
}

export function buildWorkspace(tenantId: TenantId, state: StoreSlice) {
  const tenant = tenants[tenantId];
  const documents: DocumentItem[] = tenant.documents.map((item) => {
    const key = `${tenantId}:${item.id}`;
    const status = state.docStatus[key] ?? item.status;
    const extra = state.docEvents[key] ?? [];
    return { ...item, status, timeline: [...item.timeline, ...extra] };
  });

  const loaded = documents.filter((item) => item.status !== "pendiente").length;
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

  const resolvedCompetencies: Competency[] = competencies.map((competency) => {
    const related = resolvedLessons.filter((lesson) => competency.lessonIds.includes(lesson.id));
    const progress =
      related.length === 0
        ? competency.baseProgress
        : related.every((lesson) => progressOf(lesson) >= 100)
          ? 100
          : progressOf(related.find((lesson) => progressOf(lesson) < 100) ?? related[0]);
    return { ...competency, baseProgress: progress };
  });

  const routeProgress = Math.round(average(resolvedCompetencies.map((item) => item.baseProgress)));
  const activeCompetency =
    resolvedCompetencies.find((item) => item.baseProgress > 0 && item.baseProgress < 100) ??
    resolvedCompetencies.find((item) => item.baseProgress < 100) ??
    resolvedCompetencies[0];

  const riskDone = (resolvedCompetencies.find((item) => item.id === "riesgo-sarlaft")?.baseProgress ?? 0) >= 100;
  const stages: RouteStage[] = tenantId === "ejemplo" ? routeStages.map((stage) => {
    if (["perfil", "competencias", "brechas", "ruta"].includes(stage.id)) {
      return { ...stage, state: "completa" };
    }
    if (stage.id === "formacion") {
      return { ...stage, state: riskDone ? "completa" : "actual" };
    }
    if (stage.id === "aplicacion") {
      return { ...stage, state: riskDone ? "actual" : "bloqueada" };
    }
    return { ...stage, state: riskDone && stage.id === "proyecto" ? "disponible" : "bloqueada" };
  }) : routeStages.map((stage, index) => ({
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
        const other = buildLite(member.id);
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

function buildLite(tenantId: "ejemplo" | "aurora") {
  const tenant = tenants[tenantId];
  const loaded = tenant.documents.filter((item) => item.status !== "pendiente").length;
  const preop = tenant.documents.length ? loaded / tenant.documents.length : 0;
  const moduleAverage = average(tenant.modules.map((item) => item.progress));
  return {
    index: Math.round(0.4 * preop * 100 + 0.6 * moduleAverage),
    compliance: Math.round(preop * 100),
    delayed: tenant.initiatives.filter((item) => item.status === "retrasada").length,
  };
}

export type Workspace = ReturnType<typeof buildWorkspace>;
