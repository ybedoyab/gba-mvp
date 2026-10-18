"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageIntro, Panel } from "@/components/shared/page";
import { EmptyState } from "@/components/shared/status";
import { resolveSessionUser } from "@/data/users";
import { standingLabel } from "@/lib/workspace";
import { useWorkspace } from "@/hooks/use-workspace";
import { useDemoStore } from "@/stores/demo-store";
import type { ViewAs } from "@/types";

export default function ReporteriaPage() {
  const workspace = useWorkspace();
  const viewAs = useDemoStore((state) => state.viewAs);
  const setViewAs = useDemoStore((state) => state.setViewAs);
  const sessionUser = resolveSessionUser(useDemoStore((state) => state.email));
  const [axis, setAxis] = useState("todos");
  const [status, setStatus] = useState("todos");

  const initiatives = useMemo(
    () =>
      workspace.initiatives.filter((item) => status === "todos" || item.status === status),
    [workspace.initiatives, status],
  );

  const team = workspace.tenant.team.filter((person) =>
    axis === "todos" ? true : person.route.toLowerCase().includes(axis),
  );

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        crumbs={[{ href: "/app", label: "Inicio" }, { label: "Reportería" }]}
        eyebrow="Ejecución"
        title={
          viewAs === "participante"
            ? "Mi avance"
            : viewAs === "gerencia"
              ? "Lectura de la cooperativa"
              : "Lectura de la red"
        }
        description="El selector «Ver como» es una herramienta de la demostración. En producción la vista depende de permisos, no de este control."
        actions={
          <label className="text-xs font-semibold text-muted">
            Ver como
            <select
              aria-label="Ver como"
              value={viewAs}
              onChange={(event) => setViewAs(event.target.value as ViewAs)}
              className="ml-2 h-10 rounded-xl border border-line bg-white px-3 text-sm font-semibold text-ink"
            >
              <option value="participante">Participante</option>
              <option value="gerencia">Jefatura / gerencia</option>
              <option value="gba">Administración GBA</option>
            </select>
          </label>
        }
      />

      {viewAs === "gerencia" && (
        <div className="mb-4 flex flex-wrap gap-2">
          <Filter label="Eje" value={axis} onChange={setAxis} options={[["todos", "Todos"], ["sarlaft", "SARLAFT"], ["gobierno", "Gobierno"], ["experiencia", "Experiencia"]]} />
          <Filter label="Iniciativas" value={status} onChange={setStatus} options={[["todos", "Todos"], ["ejecucion", "En ejecución"], ["retrasada", "Retrasadas"], ["completada", "Completadas"], ["planificacion", "Planificación"]]} />
        </div>
      )}
      {viewAs === "gba" && (
        <p className="mb-4 text-sm text-muted">Comparativo de la red. Cada fila usa solo los datos de esa entidad.</p>
      )}

      {viewAs === "participante" && (
        <Participant
          person={sessionUser.tenantId === workspace.tenant.id ? sessionUser.name : workspace.tenant.team[0]?.name ?? sessionUser.name}
          tenantName={workspace.tenant.name}
          workspaceProgress={workspace.routeProgress}
          lesson={workspace.activeLesson.title}
          competencies={workspace.competencies}
          pending={workspace.pending.slice(0, 3)}
        />
      )}
      {viewAs === "gerencia" && (
        <Gerencia
          tenantName={workspace.tenant.name}
          index={workspace.transformationIndex}
          formation={workspace.formationRate}
          series={workspace.tenant.formationSeries}
          team={team}
          initiatives={initiatives}
          alerts={workspace.pending}
        />
      )}
      {viewAs === "gba" && <GbaView rows={workspace.network} current={workspace.tenant.name} />}
    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[][];
}) {
  return (
    <label className="text-xs font-semibold text-muted">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="ml-2 h-9 rounded-lg border border-line bg-white px-2 text-sm text-ink">
        {options.map(([id, name]) => (
          <option key={id} value={id}>{name}</option>
        ))}
      </select>
    </label>
  );
}

function Participant({
  person,
  tenantName,
  workspaceProgress,
  lesson,
  competencies,
  pending,
}: {
  person: string;
  tenantName: string;
  workspaceProgress: number;
  lesson: string;
  competencies: { id: string; name: string; baseProgress: number; standing?: string }[];
  pending: { id: string; title: string }[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Panel title={`Avance de formación · ${person}`}>
        <p className="text-4xl font-semibold text-navy">{workspaceProgress}%</p>
        <p className="mt-1 text-sm text-muted">Siguiente actividad en {tenantName}: {lesson}.</p>
        <p className="mt-2 text-xs text-muted">Este porcentaje es formación. No acredita competencias.</p>
      </Panel>
      <Panel title="Próximos pasos">
        <ul className="space-y-2 text-sm">{pending.map((item) => <li key={item.id}>{item.title}</li>)}</ul>
      </Panel>
      <Panel title="Competencias" className="md:col-span-2">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={competencies.map((item) => ({ name: item.name.split(" ")[0], value: item.baseProgress, estado: standingLabel[(item.standing ?? "sin_iniciar") as keyof typeof standingLabel] }))}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} width={28} />
              <Tooltip />
              <Bar dataKey="value" fill="#5C3D86" radius={[6, 6, 0, 0]} name="Formación %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}

function Gerencia({
  tenantName,
  index,
  formation,
  series,
  team,
  initiatives,
  alerts,
}: {
  tenantName: string;
  index: number;
  formation: number;
  series: { month: string; value: number }[];
  team: { id: string; name: string; role: string; route: string; progress: number; next: string }[];
  initiatives: { id: string; name: string; status: string; progress: number; owner: string }[];
  alerts: { id: string; title: string; detail: string }[];
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Programa TD" value={`${index}%`} />
        <Metric label="Formación del equipo" value={`${formation}%`} />
        <Metric label="Alertas" value={`${alerts.length}`} />
      </div>
      <Panel title={`Participación formativa · ${tenantName}`}>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} width={28} />
              <Tooltip />
              <Bar dataKey="value" fill="#07B4AE" radius={[6, 6, 0, 0]} name="Participación %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <Panel title="Equipos">
        {team.length === 0 ? <EmptyState title="Sin equipo en esta vista" body="La red no lista personas de una cooperativa." /> : (
          <div className="space-y-2 md:hidden">
            {team.map((person) => (
              <article key={person.id} className="rounded-xl border border-line p-3 text-sm">
                <p className="font-semibold">{person.name}</p>
                <p className="text-xs text-muted">{person.role} · {person.route} · {person.progress}%</p>
              </article>
            ))}
          </div>
        )}
        {team.length > 0 && (
          <table className="hidden w-full text-left text-sm md:table">
            <thead className="text-xs uppercase text-muted"><tr><th className="py-2">Persona</th><th>Ruta</th><th>Avance</th><th>Siguiente</th></tr></thead>
            <tbody>
              {team.map((person) => (
                <tr key={person.id} className="border-t border-line">
                  <td className="py-2 font-medium">{person.name}<span className="block text-xs text-muted">{person.role}</span></td>
                  <td>{person.route}</td>
                  <td>{person.progress}%</td>
                  <td>{person.next}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
      <Panel title="Iniciativas filtradas">
        {initiatives.length === 0 ? <EmptyState title="Sin iniciativas para este filtro" body="Prueba otro estado o cambia de entidad." /> : (
          <ul className="space-y-2 text-sm">
            {initiatives.map((item) => (
              <li key={item.id} className="flex justify-between gap-3 rounded-xl bg-paper px-3 py-2">
                <span>{item.name}<span className="block text-xs text-muted">{item.owner}</span></span>
                <span>{item.progress}%</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function GbaView({
  rows,
  current,
}: {
  rows: { id: string; name: string; program: number; maturity: number; participants: number; activeRoutes: number; delayedInitiatives: number; compliance: number }[];
  current: string;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">Comparas entidades de la red. La fila de {current} usa el estado actual de la demo si esa entidad está activa.</p>
      <Panel title="Cooperativas">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} width={28} />
              <Tooltip />
              <Bar dataKey="program" fill="#1C3052" radius={[6, 6, 0, 0]} name="Programa %" />
              <Bar dataKey="compliance" fill="#00C389" radius={[6, 6, 0, 0]} name="Preoperativo %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2 md:hidden">
          {rows.map((row) => (
            <article key={row.id} className="rounded-xl border border-line p-3 text-sm">
              <p className="font-semibold">{row.name}</p>
              <p className="text-xs text-muted">Programa {row.program}% · IMD {row.maturity} · rutas {row.activeRoutes}/{row.participants}</p>
            </article>
          ))}
        </div>
        <table className="mt-4 hidden w-full text-left text-sm md:table">
          <thead className="text-xs uppercase text-muted">
            <tr><th className="py-2">Entidad</th><th>Programa</th><th>IMD</th><th>Rutas</th><th>Retrasos</th><th>Preoperativo</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-line">
                <td className="py-2 font-medium">{row.name}</td>
                <td>{row.program}%</td>
                <td>{row.maturity}</td>
                <td>{row.activeRoutes}/{row.participants}</td>
                <td>{row.delayedInitiatives}</td>
                <td>{row.compliance}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-card">
      <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-navy">{value}</p>
    </div>
  );
}
