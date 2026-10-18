import { Badge } from "@/components/ui/badge";
import type { DocStatus, InitiativeStatus, ModuleStatus, ProjectStatus } from "@/types";

const docTone = {
  pendiente: "neutral",
  cargado: "teal",
  en_revision: "amber",
  requiere_ajustes: "danger",
  aprobado: "mint",
} as const;

const docLabel: Record<DocStatus, string> = {
  pendiente: "Pendiente",
  cargado: "Cargado",
  en_revision: "En revisión",
  requiere_ajustes: "Requiere ajustes",
  aprobado: "Aprobado",
};

const initiativeTone = {
  planificacion: "plum",
  ejecucion: "teal",
  retrasada: "danger",
  completada: "mint",
} as const;

const initiativeLabel: Record<InitiativeStatus, string> = {
  planificacion: "Planificación",
  ejecucion: "En ejecución",
  retrasada: "Retrasada",
  completada: "Completada",
};

const moduleLabel: Record<ModuleStatus, string> = {
  completado: "Completado",
  en_curso: "En curso",
  sin_iniciar: "Sin iniciar",
};

const projectLabel: Record<ProjectStatus, string> = {
  disponible: "Disponible",
  en_desarrollo: "En desarrollo",
  en_validacion: "En validación",
  acreditado: "Acreditado",
};

export function DocBadge({ status }: { status: DocStatus }) {
  return <Badge tone={docTone[status]}>{docLabel[status]}</Badge>;
}

export function InitiativeBadge({ status }: { status: InitiativeStatus }) {
  return <Badge tone={initiativeTone[status]}>{initiativeLabel[status]}</Badge>;
}

export function ModuleBadge({ status }: { status: ModuleStatus }) {
  return (
    <Badge tone={status === "completado" ? "mint" : status === "en_curso" ? "amber" : "neutral"}>
      {moduleLabel[status]}
    </Badge>
  );
}

export function ProjectBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge
      tone={
        status === "acreditado" ? "mint" : status === "en_validacion" ? "amber" : status === "en_desarrollo" ? "plum" : "neutral"
      }
    >
      {projectLabel[status]}
    </Badge>
  );
}

export function EmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-10 text-center">
      <p className="font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted">{body}</p>
    </div>
  );
}
