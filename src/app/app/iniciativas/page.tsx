"use client";

import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { PageIntro } from "@/components/shared/page";
import { EmptyState, InitiativeBadge } from "@/components/shared/status";
import { useWorkspace } from "@/hooks/use-workspace";
import { useDemoStore } from "@/stores/demo-store";
import type { Initiative, InitiativeStatus, Priority } from "@/types";

const filters: { id: "todas" | InitiativeStatus; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "planificacion", label: "Planificación" },
  { id: "ejecucion", label: "En ejecución" },
  { id: "retrasada", label: "Retrasadas" },
  { id: "completada", label: "Completadas" },
];

export default function IniciativasPage() {
  const workspace = useWorkspace();
  const addInitiative = useDemoStore((state) => state.addInitiative);
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("todas");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Initiative | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ name: "", objective: "", owner: "Laura Gómez", priority: "media" as Priority, end: "30 dic 2026" });

  const items = useMemo(
    () =>
      workspace.initiatives.filter((item) => {
        const matchesStatus = filter === "todas" || item.status === filter;
        const matchesQuery = `${item.name} ${item.owner}`.toLowerCase().includes(query.toLowerCase());
        return matchesStatus && matchesQuery;
      }),
    [workspace.initiatives, filter, query],
  );

  function create(event: FormEvent) {
    event.preventDefault();
    if (!draft.name.trim()) return;
    addInitiative(workspace.tenant.id, {
      id: `demo-${Date.now()}`,
      name: draft.name.trim(),
      objective: draft.objective.trim() || "Iniciativa ilustrativa creada en la demostración.",
      status: "planificacion",
      priority: draft.priority,
      progress: 0,
      owner: draft.owner,
      start: "18 oct 2026",
      end: draft.end,
      area: "Transformación",
      createdInDemo: true,
      timeline: [{ id: "new", date: "Hoy · simulación", title: "Borrador creado", detail: "Solo existe en este navegador." }],
    });
    toast("Iniciativa creada en el estado local");
    setCreating(false);
    setDraft({ name: "", objective: "", owner: "Laura Gómez", priority: "media", end: "30 dic 2026" });
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        crumbs={[{ href: "/app", label: "Inicio" }, { label: "Mis iniciativas" }]}
        eyebrow="Ejecución"
        title="Iniciativas de la cooperativa"
        description="Este tablero es de la entidad. No mezcla las actividades internas de consultoría de GBA, que viven en el Programa TD."
        actions={<Button onClick={() => setCreating(true)}>Nueva iniciativa</Button>}
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto">
          {filters.map((item) => (
            <button key={item.id} onClick={() => setFilter(item.id)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${filter === item.id ? "bg-navy text-white" : "bg-white text-muted"}`}>
              {item.label}
            </button>
          ))}
        </div>
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre o responsable" className="sm:max-w-xs" aria-label="Buscar iniciativas" />
      </div>
      {items.length === 0 ? (
        <EmptyState title="No hay iniciativas para esta vista" body="Cambia el filtro, la búsqueda o la entidad. También puedes crear una iniciativa ficticia." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <button key={item.id} onClick={() => setSelected(item)} className="rounded-2xl border border-line bg-white p-4 text-left shadow-card">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold">{item.name}</h2>
                <InitiativeBadge status={item.status} />
              </div>
              <p className="mt-1 text-sm text-muted">{item.objective}</p>
              <p className="mt-3 text-xs text-muted">{item.owner} · {item.start} → {item.end} · prioridad {item.priority}</p>
              <Progress value={item.progress} className="mt-3" />
            </button>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        {selected && (
          <DialogContent title={selected.name}>
            <InitiativeBadge status={selected.status} />
            <p className="mt-3 text-sm text-muted">{selected.objective}</p>
            <p className="mt-2 text-sm">Avance {selected.progress}% · {selected.owner}</p>
            <ol className="mt-4 space-y-3 border-l border-line pl-4">
              {selected.timeline.map((event) => (
                <li key={event.id}>
                  <p className="text-xs font-bold text-teal">{event.date}</p>
                  <p className="text-sm font-semibold">{event.title}</p>
                  <p className="text-xs text-muted">{event.detail}</p>
                </li>
              ))}
            </ol>
          </DialogContent>
        )}
      </Dialog>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent title="Nueva iniciativa">
          <form onSubmit={create} className="space-y-3">
            <label className="block text-xs font-semibold">Nombre<Input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required /></label>
            <label className="block text-xs font-semibold">Objetivo<textarea value={draft.objective} onChange={(event) => setDraft({ ...draft, objective: event.target.value })} className="mt-1 min-h-20 w-full rounded-xl border border-line px-3 py-2 text-sm" /></label>
            <label className="block text-xs font-semibold">Responsable<Input value={draft.owner} onChange={(event) => setDraft({ ...draft, owner: event.target.value })} /></label>
            <label className="block text-xs font-semibold">Prioridad
              <select value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value as Priority })} className="mt-1 h-11 w-full rounded-xl border border-line px-3 text-sm">
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </label>
            <Button type="submit">Guardar en la demo</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
