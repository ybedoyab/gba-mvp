"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { answerGio, gioSuggestions } from "@/lib/gio";
import { useWorkspace } from "@/hooks/use-workspace";
import { useDemoStore } from "@/stores/demo-store";

const prompts = [
  { id: "now", label: "¿Qué debo hacer ahora?" },
  { id: "progress", label: "Explícame mi avance" },
  { id: "imd", label: "¿Qué significa mi índice de madurez?" },
  { id: "competencies", label: "¿Qué competencias debería fortalecer?" },
  { id: "route", label: "¿Cómo puedo continuar mi ruta?" },
  { id: "documents", label: "¿Qué documentos tengo pendientes?" },
];

export function GioPanel() {
  const open = useDemoStore((state) => state.gioOpen);
  const setGio = useDemoStore((state) => state.setGio);
  const workspace = useWorkspace();
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState("now");
  const suggested = gioSuggestions(pathname);
  const answer = useMemo(() => answerGio(active, workspace, pathname), [active, workspace, pathname]);

  return (
    <Sheet open={open} onOpenChange={setGio}>
      <SheetContent title="GIO">
        <div className="space-y-4 p-4">
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-navy to-plum p-4 text-white">
            <img src="/assets/ia/Logo_ia_v2.png" alt="" className="h-12 w-12 rounded-xl bg-white/10 object-contain p-1" />
            <div>
              <p className="text-sm font-semibold">Orientación para {workspace.tenant.shortName}</p>
              <p className="text-xs text-white/75">Simulación funcional. No consulta un modelo externo.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {prompts
              .filter((item) => suggested.includes(item.id) || item.id === active)
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={`rounded-full px-3 py-1.5 text-left text-xs font-semibold ${
                    active === item.id ? "bg-plum text-white" : "bg-plum-soft text-plum"
                  }`}
                >
                  {item.label}
                </button>
              ))}
          </div>
          <article className="space-y-3 rounded-2xl border border-line p-4">
            <div className="flex items-center gap-2 text-plum">
              <Sparkles className="h-4 w-4" />
              <h3 className="text-sm font-semibold">{answer.title}</h3>
            </div>
            {answer.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
            <div className="flex flex-wrap gap-2 pt-1">
              {answer.links.map((link) => (
                <button
                  key={link.href}
                  className="rounded-lg bg-paper px-3 py-1.5 text-xs font-semibold text-ink"
                  onClick={() => {
                    setGio(false);
                    router.push(link.href);
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </article>
          <p className="text-xs leading-relaxed text-muted">
            GIO puede orientar, explicar y recomendarte un recorrido. No cambia resultados oficiales, no acredita competencias y no aprueba documentos.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
