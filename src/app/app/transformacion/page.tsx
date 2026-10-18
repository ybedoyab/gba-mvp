"use client";

import Link from "next/link";
import { ArrowRight, FileStack, Gauge, Map } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PageIntro, Panel } from "@/components/shared/page";
import { useWorkspace } from "@/hooks/use-workspace";

const stages = [
  {
    href: "/app/transformacion/preoperativos",
    icon: FileStack,
    step: "01",
    title: "Preoperativos",
    text: "Documentos base para habilitar el acompañamiento.",
  },
  {
    href: "/app/transformacion/programa",
    icon: Map,
    step: "02",
    title: "Programa TD",
    text: "Seis módulos del trabajo estratégico con GBA.",
  },
  {
    href: "/app/transformacion/madurez",
    icon: Gauge,
    step: "03",
    title: "Índice de Madurez",
    text: "Línea base importada. No es un test dentro del portal.",
  },
];

export default function TransformacionPage() {
  const workspace = useWorkspace();
  const preop = Math.round(workspace.preopRatio * 100);
  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        crumbs={[{ href: "/app", label: "Inicio" }, { label: "Mi Transformación" }]}
        eyebrow="Planeación"
        title="Mi Transformación"
        description="El acompañamiento de GBA, visible de principio a fin: preparar, avanzar y consultar el punto de partida."
      />
      <section className="mb-5 rounded-3xl bg-gradient-to-r from-navy via-navy-mid to-[#24527a] p-6 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-mint">Avance del acompañamiento</p>
        <p className="mt-2 text-4xl font-semibold">{workspace.transformationIndex}%</p>
        <p className="mt-2 max-w-xl text-sm text-white/75">
          Combina preoperativos ({preop}%) y el promedio simple de los módulos ({workspace.moduleAverage}%). Es un dato de demostración, no un resultado institucional.
        </p>
        <Progress value={workspace.transformationIndex} className="mt-4 bg-white/20" />
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        {stages.map((stage) => (
          <Link key={stage.href} href={stage.href} className="group rounded-2xl border border-line bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal-soft text-navy">
                <stage.icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-bold text-muted">{stage.step}</span>
            </div>
            <h2 className="mt-4 text-lg font-semibold">{stage.title}</h2>
            <p className="mt-1 text-sm text-muted">{stage.text}</p>
            <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal">
              Abrir <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </p>
          </Link>
        ))}
      </div>
      <Panel title="Módulos en este momento" className="mt-5">
        <ol className="grid gap-3 md:grid-cols-2">
          {workspace.tenant.modules.map((module) => (
            <li key={module.id} className="rounded-xl border border-line p-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold">M{module.order}. {module.name}</span>
                <span>{module.progress}%</span>
              </div>
              <Progress value={module.progress} className="mt-2" />
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}
