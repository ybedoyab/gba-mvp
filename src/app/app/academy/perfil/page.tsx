"use client";

import { masteryScale } from "@/data/catalog";
import { resolveSessionUser } from "@/data/users";
import { PageIntro, Panel } from "@/components/shared/page";
import { Progress } from "@/components/ui/progress";
import { useWorkspace } from "@/hooks/use-workspace";
import { initials } from "@/lib/utils";
import { standingLabel } from "@/lib/workspace";
import { useDemoStore } from "@/stores/demo-store";

export default function PerfilPage() {
  const workspace = useWorkspace();
  const sessionUser = resolveSessionUser(useDemoStore((state) => state.email));
  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        crumbs={[{ href: "/app/academy", label: "Academy" }, { label: "Perfil" }]}
        eyebrow="Perfil de desarrollo"
        title={sessionUser.name}
        description={`${sessionUser.roleTitle} · recorriendo ${workspace.tenant.name}. El perfil orienta la ruta. No se modifica solo desde esta pantalla.`}
      />
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Panel>
          {sessionUser.avatar ? (
            <img src={sessionUser.avatar} alt="" className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <span className="grid h-20 w-20 place-items-center rounded-full bg-plum text-lg font-bold text-white">{initials(sessionUser.name)}</span>
          )}
          <p className="mt-3 font-semibold">{sessionUser.roleTitle}</p>
          <p className="text-sm text-muted">{sessionUser.audience}</p>
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted">Intereses</p>
          <p className="text-sm">{workspace.tenant.interests.join(" · ") || "Sin intereses en esta entidad."}</p>
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted">Desafíos</p>
          <ul className="mt-1 space-y-1 text-sm text-muted">{workspace.tenant.challenges.map((item) => <li key={item}>{item}</li>)}</ul>
        </Panel>
        <div className="space-y-4">
          <Panel title="Competencias del perfil">
            <ul className="space-y-4">
              {workspace.competencies.map((item) => (
                <li key={item.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-muted">Esperado: {item.expectedLevel}</p>
                  </div>
                  <p className="text-xs text-muted">{item.family} · {standingLabel[item.standing ?? "sin_iniciar"]}</p>
                  <p className="text-xs text-muted">Nivel de referencia: {item.currentLevel}</p>
                  <Progress value={item.baseProgress} className="mt-2" barClassName="bg-plum" />
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Escala preliminar de dominio">
            <p className="mb-3 text-sm text-muted">Referencia metodológica todavía en construcción con GBA. No es el diccionario definitivo.</p>
            <ol className="grid gap-2 sm:grid-cols-2">
              {masteryScale.map((level) => (
                <li key={level.level} className="rounded-xl bg-paper p-3 text-sm">
                  <p className="font-semibold">{level.level}. {level.name}</p>
                  <p className="text-xs text-muted">{level.detail}</p>
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </div>
    </div>
  );
}
