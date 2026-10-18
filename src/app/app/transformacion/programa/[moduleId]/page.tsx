"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageIntro, Panel } from "@/components/shared/page";
import { ModuleBadge } from "@/components/shared/status";
import { useWorkspace } from "@/hooks/use-workspace";
import { useDemoStore } from "@/stores/demo-store";

export default function ModuleDetailPage() {
  const params = useParams<{ moduleId: string }>();
  const workspace = useWorkspace();
  const setGio = useDemoStore((state) => state.setGio);
  const module = workspace.tenant.modules.find((item) => item.id === params.moduleId);

  if (!module) {
    return (
      <div className="mx-auto max-w-3xl">
        <PageIntro title="Módulo no encontrado" description="Vuelve al programa para elegir un módulo de esta entidad." />
        <Button asChild><Link href="/app/transformacion/programa">Volver</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        crumbs={[
          { href: "/app", label: "Inicio" },
          { href: "/app/transformacion", label: "Mi Transformación" },
          { href: "/app/transformacion/programa", label: "Programa TD" },
          { label: `Módulo ${module.order}` },
        ]}
        eyebrow={`Módulo ${module.order}`}
        title={module.name}
        description={module.objective}
        actions={<Button variant="outline" onClick={() => setGio(true)}>Preguntar a GIO</Button>}
      />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <ModuleBadge status={module.status} />
        <span className="text-sm text-muted">Responsable: {module.owner}</span>
        <span className="text-sm font-semibold">{module.progress}%</span>
      </div>
      <Progress value={module.progress} className="mb-5" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Actividades">
          <ul className="space-y-2">
            {module.activities.length === 0 && <p className="text-sm text-muted">Este módulo todavía no tiene actividades en la entidad.</p>}
            {module.activities.map((activity) => (
              <li key={activity.id} className="flex items-start justify-between gap-3 rounded-xl bg-paper px-3 py-2 text-sm">
                <span>
                  <span className="block font-medium">{activity.name}</span>
                  <span className="text-xs text-muted">{activity.owner}</span>
                </span>
                <span className="text-xs font-semibold">{activity.done ? "Lista" : "Pendiente"}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Entregables, documentos y actas">
          <ul className="space-y-2">
            {module.deliverables.map((item) => (
              <li key={item.id} className="flex items-center justify-between rounded-xl border border-line px-3 py-2 text-sm">
                <span>
                  <span className="block font-medium">{item.name}</span>
                  <span className="text-xs capitalize text-muted">{item.kind}</span>
                </span>
                <span className="text-xs font-semibold">{item.status === "listo" ? "Listo" : item.status === "en_revision" ? "En revisión" : "Pendiente"}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <Panel title="Próximo paso" className="mt-4">
        <p className="text-sm text-muted">{module.nextStep}</p>
        <p className="mt-2 text-xs text-muted">El detalle operativo del consultor vive en Monday en una etapa posterior. Aquí solo se muestra el relato para la cooperativa.</p>
      </Panel>
    </div>
  );
}
