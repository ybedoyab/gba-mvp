"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageIntro, Panel } from "@/components/shared/page";
import { standingLabel } from "@/lib/workspace";
import { useWorkspace } from "@/hooks/use-workspace";

export default function RutaPage() {
  const workspace = useWorkspace();
  const router = useRouter();
  const [active, setActive] = useState(workspace.stages.find((stage) => stage.state === "actual")?.id ?? "formacion");
  const stage = workspace.stages.find((item) => item.id === active) ?? workspace.stages[0];

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        crumbs={[{ href: "/app/academy", label: "Academy" }, { label: "Mi ruta" }]}
        eyebrow="Ruta SARLAFT para líderes de transformación"
        title="Del perfil al reconocimiento"
        description="Completar una lección avanza la formación. La competencia se reconoce solo después de la evidencia y la validación experta."
      />
      <ol className="mb-5 flex gap-2 overflow-x-auto pb-2">
        {workspace.stages.map((item, index) => (
          <li key={item.id}>
            <button
              onClick={() => setActive(item.id)}
              className={`min-w-[7.5rem] rounded-2xl border px-3 py-3 text-left ${
                active === item.id ? "border-plum bg-plum text-white" : "border-line bg-white"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wide opacity-70">{index + 1}</span>
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-[11px] capitalize opacity-80">{item.state}</p>
            </button>
          </li>
        ))}
      </ol>
      <Panel title={stage.label}>
        <p className="text-sm text-muted">{stage.description}</p>
        <p className="mt-3 text-sm">
          Estado: <b className="capitalize">{stage.state}</b>
        </p>
        {stage.state !== "bloqueada" && stage.id === "formacion" && (
          <Button className="mt-4" onClick={() => router.push(`/app/academy/leccion/${workspace.activeLesson.id}`)}>
            Ir a la lección
          </Button>
        )}
        {stage.state !== "bloqueada" && (stage.id === "aplicacion" || stage.id === "proyecto" || stage.id === "validacion") ? (
          <Button className="mt-4" variant="outline" onClick={() => router.push("/app/academy/proyectos")}>
            Ver proyecto de acreditación
          </Button>
        ) : null}
        {stage.state === "bloqueada" && (
          <p className="mt-3 text-sm text-muted">Esta etapa sigue bloqueada. Completar lecciones no la abre ni acredita la competencia.</p>
        )}
      </Panel>
      <Panel title="Capacidades de la ruta" className="mt-4">
        <ul className="grid gap-3 md:grid-cols-2">
          {workspace.competencies.map((item) => (
            <li key={item.id} className="rounded-xl border border-line p-3">
              <p className="text-sm font-semibold">{item.name}</p>
              <p className="text-xs text-muted">{item.family} · formación {item.baseProgress}% · {standingLabel[item.standing ?? "sin_iniciar"]}</p>
              <p className="mt-1 text-sm text-muted">{item.description}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
