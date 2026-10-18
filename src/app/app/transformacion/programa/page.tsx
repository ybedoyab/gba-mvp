"use client";

import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { PageIntro } from "@/components/shared/page";
import { ModuleBadge } from "@/components/shared/status";
import { useWorkspace } from "@/hooks/use-workspace";

export default function ProgramaPage() {
  const workspace = useWorkspace();
  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        crumbs={[
          { href: "/app", label: "Inicio" },
          { href: "/app/transformacion", label: "Mi Transformación" },
          { label: "Programa TD" },
        ]}
        eyebrow="Programa de Transformación Digital"
        title="Seis módulos del acompañamiento"
        description={`Avance global de demostración: ${workspace.transformationIndex}%. Los porcentajes de cada módulo son ejemplos, no resultados institucionales.`}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {workspace.tenant.modules.map((module) => (
          <Link key={module.id} href={`/app/transformacion/programa/${module.id}`} className="flex flex-col rounded-2xl border border-line bg-white p-4 shadow-card hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal">Módulo {module.order}</span>
              <ModuleBadge status={module.status} />
            </div>
            <h2 className="mt-3 text-base font-semibold leading-snug">{module.name}</h2>
            <p className="mt-2 flex-1 text-sm text-muted">{module.summary}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-muted">
              <span>{module.owner}</span>
              <span className="font-semibold text-ink">{module.progress}%</span>
            </div>
            <Progress value={module.progress} className="mt-2" />
          </Link>
        ))}
      </div>
    </div>
  );
}
