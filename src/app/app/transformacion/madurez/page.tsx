"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { PageIntro, Panel } from "@/components/shared/page";
import { useWorkspace } from "@/hooks/use-workspace";
import { useDemoStore } from "@/stores/demo-store";

export default function MadurezPage() {
  const { tenant } = useWorkspace();
  const setGio = useDemoStore((state) => state.setGio);
  const maturity = tenant.maturity;

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        crumbs={[
          { href: "/app", label: "Inicio" },
          { href: "/app/transformacion", label: "Mi Transformación" },
          { label: "Índice de Madurez" },
        ]}
        eyebrow="Índice de Madurez Digital"
        title="Línea base importada"
        description={maturity.source}
        actions={<Button variant="plum" onClick={() => setGio(true)}>Consultar interpretación con GIO</Button>}
      />
      <section className="mb-5 grid gap-4 rounded-3xl bg-plum p-6 text-white md:grid-cols-[.7fr_1.3fr]">
        <div>
          <p className="text-5xl font-semibold">{maturity.score.toLocaleString("es-CO")}<span className="text-2xl text-white/70">/{maturity.scale}</span></p>
          <p className="mt-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">{maturity.level}</p>
          <p className="mt-3 text-sm leading-relaxed text-white/80">{maturity.narrative}</p>
          <p className="mt-3 text-xs text-white/60">Importado el {maturity.importedAt}. Dato demostrativo.</p>
        </div>
        <div className="h-72 rounded-2xl bg-white/10 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={maturity.dimensions}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" tick={{ fill: "#ffffff", fontSize: 11 }} />
              <Radar dataKey="score" stroke="#00C389" fill="#00C389" fillOpacity={0.45} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        <Panel title="Fortalezas">
          <ul className="space-y-2 text-sm text-muted">{maturity.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
        </Panel>
        <Panel title="Oportunidades">
          <ul className="space-y-2 text-sm text-muted">{maturity.opportunities.map((item) => <li key={item}>{item}</li>)}</ul>
        </Panel>
        <Panel title="Recomendaciones">
          <ul className="space-y-2 text-sm text-muted">{maturity.recommendations.map((item) => <li key={item}>{item}</li>)}</ul>
        </Panel>
      </div>
      <Panel title="Cómo leer el índice" className="mt-4">
        <p className="text-sm leading-relaxed text-muted">
          El instrumento se aplica fuera de RedCoop. El portal recibe el resultado por una importación controlada y lo explica en el contexto del programa. Esta demostración no simula una integración automática ni ofrece un nuevo test de madurez.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {maturity.dimensions.map((dimension) => (
            <div key={dimension.id} className="rounded-xl bg-paper px-3 py-2 text-sm">
              <div className="flex justify-between font-semibold"><span>{dimension.name}</span><span>{dimension.score.toLocaleString("es-CO")}</span></div>
              <p className="text-xs text-muted">{dimension.reading}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
