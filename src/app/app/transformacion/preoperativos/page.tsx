"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { PageIntro, Panel } from "@/components/shared/page";
import { DocBadge, EmptyState } from "@/components/shared/status";
import { useWorkspace } from "@/hooks/use-workspace";
import { useDemoStore } from "@/stores/demo-store";
import type { DocumentItem } from "@/types";

export default function PreoperativosPage() {
  const workspace = useWorkspace();
  const upload = useDemoStore((state) => state.uploadDocument);
  const [selected, setSelected] = useState<DocumentItem | null>(null);
  const [fileName, setFileName] = useState("documento-ilustrativo.pdf");
  const percent = Math.round(workspace.preopRatio * 100);

  function confirmUpload() {
    if (!selected) return;
    upload(workspace.tenant.id, selected.id);
    toast("Documento cargado en la demo. No salió de este navegador.");
    setSelected(null);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        crumbs={[
          { href: "/app", label: "Inicio" },
          { href: "/app/transformacion", label: "Mi Transformación" },
          { label: "Preoperativos" },
        ]}
        eyebrow="Preoperativos"
        title="Documentos base"
        description="La cooperativa carga, GBA revisa y, cuando el expediente está listo, el cronograma del programa queda habilitado."
      />
      {workspace.documents.length === 0 ? (
        <EmptyState title="Sin expediente en esta vista" body="La red no administra documentos de una cooperativa. Cambia a Ejemplo o Aurora para ver el preoperativo." />
      ) : (
        <>
          <Panel className="mb-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm text-muted">Documentos con carga</p>
                <p className="text-2xl font-semibold">{workspace.loaded} / {workspace.documents.length}</p>
              </div>
              <p className="text-sm text-muted">{percent}% del preoperativo</p>
            </div>
            <Progress value={percent} className="mt-3" />
            <ol className="mt-4 grid gap-2 text-sm sm:grid-cols-4">
              {["Carga", "Revisión", "Ajustes", "Habilitación"].map((step, index) => (
                <li key={step} className="rounded-xl bg-paper px-3 py-2">
                  <span className="text-xs font-bold text-teal">0{index + 1}</span>
                  <p className="font-semibold">{step}</p>
                </li>
              ))}
            </ol>
          </Panel>
          <div className="hidden overflow-hidden rounded-2xl border border-line bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-paper text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Documento</th>
                  <th className="px-4 py-3 font-semibold">Responsable</th>
                  <th className="px-4 py-3 font-semibold">Vence</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold"> </th>
                </tr>
              </thead>
              <tbody>
                {workspace.documents.map((item) => (
                  <tr key={item.id} className="border-t border-line">
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-muted">{item.owner}</td>
                    <td className="px-4 py-3 text-muted">{item.due}</td>
                    <td className="px-4 py-3"><DocBadge status={item.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="outline" onClick={() => setSelected(item)}>Ver</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-3 md:hidden">
            {workspace.documents.map((item) => (
              <button key={item.id} onClick={() => setSelected(item)} className="w-full rounded-2xl border border-line bg-white p-4 text-left">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold">{item.name}</p>
                  <DocBadge status={item.status} />
                </div>
                <p className="mt-1 text-xs text-muted">{item.owner} · {item.due}</p>
              </button>
            ))}
          </div>
        </>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        {selected && (
          <DialogContent title={selected.name}>
            <p className="text-sm text-muted">{selected.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <DocBadge status={selected.status} />
              <span className="text-xs text-muted">Pedido por {selected.requestedBy}</span>
            </div>
            {selected.observation && <p className="mt-3 rounded-xl bg-amber-soft px-3 py-2 text-sm text-amber">{selected.observation}</p>}
            {selected.recommendation && <p className="mt-2 text-sm text-muted">{selected.recommendation}</p>}
            <div className="mt-4 rounded-xl border border-dashed border-line p-4 text-sm">
              <p className="font-semibold">Vista previa ilustrativa</p>
              <p className="mt-1 text-muted">No hay un archivo real asociado. La carga solo cambia el estado de la demostración.</p>
            </div>
            <ol className="mt-4 space-y-3 border-l border-line pl-4">
              {selected.timeline.map((event) => (
                <li key={event.id}>
                  <p className="text-xs font-bold text-teal">{event.date}</p>
                  <p className="text-sm font-semibold">{event.title}</p>
                  <p className="text-xs text-muted">{event.detail}</p>
                </li>
              ))}
            </ol>
            {(selected.status === "pendiente" || selected.status === "requiere_ajustes") && (
              <div className="mt-4 space-y-2">
                <label className="block text-xs font-semibold">
                  Nombre ilustrativo del archivo
                  <input value={fileName} onChange={(event) => setFileName(event.target.value)} className="mt-1 h-10 w-full rounded-xl border border-line px-3 text-sm" />
                </label>
                <Button onClick={confirmUpload} disabled={!fileName.trim()}>Simular carga</Button>
              </div>
            )}
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
