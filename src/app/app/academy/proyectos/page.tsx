"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageIntro, Panel } from "@/components/shared/page";
import { ProjectBadge } from "@/components/shared/status";
import { useWorkspace } from "@/hooks/use-workspace";
import { useDemoStore } from "@/stores/demo-store";

const phases = ["Formación", "Aplicación", "Validación", "Acreditación"];

export default function ProyectosPage() {
  const workspace = useWorkspace();
  const submit = useDemoStore((state) => state.submitProject);
  const toggleEvidence = useDemoStore((state) => state.toggleEvidence);
  const [activeId, setActiveId] = useState(workspace.projects[0]?.id ?? "");
  const project = workspace.projects.find((item) => item.id === activeId) ?? workspace.projects[0];
  const ready = project.evidences.filter((item) => item.required).every((item) => item.provided);

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        crumbs={[{ href: "/app/academy", label: "Academy" }, { label: "Proyectos" }]}
        eyebrow="Acreditación"
        title="Demuestra lo que sabes aplicar"
        description="Completar el curso cierra la formación. La competencia se acredita solo cuando un experto autorizado valida la evidencia."
      />
      <ol className="mb-5 grid gap-2 sm:grid-cols-4">
        {phases.map((phase, index) => {
          const current =
            project.status === "acreditado" ? 3 :
            project.status === "en_validacion" ? 2 :
            project.status === "en_desarrollo" ? 1 : 0;
          return (
            <li key={phase} className={`rounded-2xl border p-3 ${index === current ? "border-plum bg-plum-soft" : "border-line bg-white"}`}>
              <p className="text-[11px] font-bold text-plum">0{index + 1}</p>
              <p className="font-semibold">{phase}</p>
            </li>
          );
        })}
      </ol>
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="space-y-2">
          {workspace.projects.map((item) => (
            <button key={item.id} onClick={() => setActiveId(item.id)} className={`w-full rounded-2xl border p-3 text-left ${item.id === project.id ? "border-plum bg-plum-soft" : "border-line bg-white"}`}>
              <ProjectBadge status={item.status} />
              <p className="mt-2 text-sm font-semibold">{item.name}</p>
            </button>
          ))}
        </div>
        <div className="space-y-4">
          <Panel title={project.name}>
            <ProjectBadge status={project.status} />
            <p className="mt-3 text-sm text-muted">{project.summary}</p>
            {project.credentialCode && (
              <p className="mt-3 rounded-xl bg-mint-soft px-3 py-2 text-sm text-mint-dark">
                Credencial ilustrativa {project.credentialCode}. Validó {project.expert}.
              </p>
            )}
          </Panel>
          <Panel title="Requisitos y evidencias">
            <ul className="mb-3 list-disc space-y-1 pl-5 text-sm text-muted">
              {project.requirements.map((item) => <li key={item}>{item}</li>)}
            </ul>
            {project.evidences.map((evidence) => (
              <label key={evidence.id} className="mt-2 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={evidence.provided}
                  disabled={project.status === "acreditado" || project.status === "en_validacion"}
                  onChange={(event) => toggleEvidence(workspace.tenant.id, evidence.id, event.target.checked)}
                />
                {evidence.name} {evidence.required ? "" : "(opcional)"}
              </label>
            ))}
          </Panel>
          <Panel title="Rúbrica">
            <ul className="space-y-2">
              {project.rubric.map((criterion) => (
                <li key={criterion.id} className="rounded-xl bg-paper p-3 text-sm">
                  <div className="flex justify-between font-semibold"><span>{criterion.name}</span><span>{criterion.weight}</span></div>
                  <p className="text-xs text-muted">{criterion.description}</p>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Línea de tiempo">
            <ol className="space-y-3 border-l border-line pl-4">
              {project.timeline.map((event) => (
                <li key={event.id}>
                  <p className="text-xs font-bold text-teal">{event.date}</p>
                  <p className="text-sm font-semibold">{event.title}</p>
                  <p className="text-xs text-muted">{event.detail}</p>
                </li>
              ))}
            </ol>
            {project.status === "en_desarrollo" && (
              <Button
                className="mt-4"
                disabled={!ready}
                onClick={() => {
                  submit(workspace.tenant.id, project.id);
                  toast("Enviado a validación experta. GIO no toma esta decisión.");
                }}
              >
                Enviar a validación experta
              </Button>
            )}
            {project.status === "en_desarrollo" && !ready && (
              <p className="mt-2 text-xs text-muted">Marca las evidencias requeridas para simular la entrega.</p>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
