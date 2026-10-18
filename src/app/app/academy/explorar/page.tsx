"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PageIntro } from "@/components/shared/page";
import { EmptyState } from "@/components/shared/status";
import { courses } from "@/data/catalog";
import type { Course } from "@/types";

export default function ExplorarPage() {
  const [query, setQuery] = useState("");
  const [line, setLine] = useState("Todas");
  const [selected, setSelected] = useState<Course | null>(null);
  const lines = ["Todas", ...Array.from(new Set(courses.map((course) => course.line)))];
  const visible = useMemo(
    () =>
      courses.filter((course) => {
        const matchesLine = line === "Todas" || course.line === line;
        const matchesQuery = `${course.title} ${course.summary}`.toLowerCase().includes(query.toLowerCase());
        return matchesLine && matchesQuery;
      }),
    [line, query],
  );

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        crumbs={[{ href: "/app/academy", label: "Academy" }, { label: "Explorar" }]}
        eyebrow="Catálogo"
        title="Explorar Academy"
        description="La oferta se muestra en relación con lo contratado. Pedir un curso no envía una solicitud real."
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar tema, curso o desafío" aria-label="Buscar en Academy" />
        <select value={line} onChange={(event) => setLine(event.target.value)} className="h-11 rounded-xl border border-line bg-white px-3 text-sm" aria-label="Filtrar línea">
          {lines.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      {visible.length === 0 ? (
        <EmptyState title="Sin resultados" body="Prueba otra palabra o quita el filtro de línea." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((course) => (
            <button key={course.id} onClick={() => setSelected(course)} className="overflow-hidden rounded-2xl border border-line bg-white text-left shadow-card">
              <img src={course.image} alt="" className="h-32 w-full object-cover" />
              <div className="p-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-teal">{course.line}</p>
                <h2 className="mt-1 font-semibold">{course.title}</h2>
                <p className="mt-1 text-sm text-muted">{course.summary}</p>
                <p className="mt-2 text-xs font-semibold">{course.contracted ? "Disponible para la entidad" : "No contratado"}</p>
              </div>
            </button>
          ))}
        </div>
      )}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        {selected && (
          <DialogContent title={selected.title}>
            <img src={selected.image} alt="" className="h-36 w-full rounded-xl object-cover" />
            <p className="mt-3 text-sm text-muted">{selected.summary}</p>
            <p className="mt-2 text-xs text-muted">{selected.minutes} minutos · {selected.line}</p>
            {selected.contracted ? (
              <p className="mt-3 text-sm">Este contenido ya forma parte de la oferta contratada. La ruta activa sigue siendo SARLAFT para líderes.</p>
            ) : (
              <Button className="mt-4" variant="outline" onClick={() => toast("Disponible en una etapa posterior. No se envió ninguna solicitud.")}>
                Manifestar interés
              </Button>
            )}
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
