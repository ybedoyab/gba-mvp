"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageIntro, Panel } from "@/components/shared/page";
import { courses } from "@/data/catalog";
import { demoUser } from "@/data/users";
import { useWorkspace } from "@/hooks/use-workspace";
import { useDemoStore } from "@/stores/demo-store";

export default function AcademyPage() {
  const workspace = useWorkspace();
  const router = useRouter();
  const setGio = useDemoStore((state) => state.setGio);
  const lesson = workspace.activeLesson;
  const recommended = courses.filter((course) => course.contracted).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        crumbs={[{ href: "/app", label: "Inicio" }, { label: "Academy" }]}
        eyebrow="GBA Academy"
        title={`Hola, ${demoUser.firstName}. Tu aprendizaje tiene una dirección.`}
        description="La ruta responde a tu rol, a tus intereses y al desafío de aplicar el criterio en la cooperativa. No es un catálogo suelto."
        actions={<Button variant="plum" onClick={() => setGio(true)}>Preguntar a GIO</Button>}
      />
      <section className="mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-plum via-[#3a2460] to-navy text-white">
        <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_.8fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-mint">Ruta principal</p>
            <h2 className="mt-2 text-2xl font-semibold">
              {workspace.tenant.id === "ejemplo"
                ? "Ruta SARLAFT para líderes de transformación"
                : "Orientación inicial del perfil"}
            </h2>
            <p className="mt-2 text-sm text-white/75">
              {workspace.tenant.id === "ejemplo"
                ? `Competencia en desarrollo: ${workspace.activeCompetency.name} · ${workspace.activeCompetency.baseProgress}%`
                : "Esta entidad todavía no tiene la ruta SARLAFT en curso. El avance de Ejemplo no se mezcla aquí."}
            </p>
            <Progress value={workspace.routeProgress} className="mt-4 bg-white/20" barClassName="bg-mint" />
            <p className="mt-2 text-xs text-white/70">Avance de la ruta: {workspace.routeProgress}%</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => router.push("/app/academy/ruta")}>Ver mi ruta</Button>
              <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => router.push(`/app/academy/leccion/${lesson.id}`)}>
                Continuar lección
              </Button>
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-wide text-white/60">Siguiente actividad</p>
            <p className="mt-2 font-semibold">{lesson.title}</p>
            <p className="mt-1 text-sm text-white/75">{lesson.minutes} minutos · {lesson.baseProgress}% de la lección</p>
            <img src="/assets/cursos/sarlaft_leccion_3.png" alt="" className="mt-3 h-28 w-full rounded-xl object-cover" />
          </div>
        </div>
      </section>
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Resumen" className="lg:col-span-1">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Rol</dt><dd className="font-semibold">{demoUser.roleTitle}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Intereses</dt><dd className="max-w-[12rem] text-right font-semibold">{workspace.tenant.interests.join(" · ") || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Ruta</dt><dd className="font-semibold">{workspace.routeProgress}%</dd></div>
          </dl>
          <div className="mt-4 flex gap-2">
            <Button size="sm" variant="outline" asChild><Link href="/app/academy/perfil">Perfil</Link></Button>
            <Button size="sm" variant="outline" asChild><Link href="/app/academy/proyectos">Acreditaciones</Link></Button>
          </div>
        </Panel>
        <Panel title="Competencias en desarrollo" className="lg:col-span-2">
          <ul className="space-y-3">
            {workspace.competencies.map((item) => (
              <li key={item.id}>
                <div className="mb-1 flex justify-between text-sm"><span className="font-medium">{item.name}</span><span>{item.baseProgress}%</span></div>
                <Progress value={item.baseProgress} barClassName="bg-plum" />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <Panel title="También contratado para la entidad" className="mt-4">
        <div className="grid gap-3 md:grid-cols-3">
          {recommended.map((course) => (
            <Link key={course.id} href="/app/academy/explorar" className="overflow-hidden rounded-2xl border border-line">
              <img src={course.image} alt="" className="h-28 w-full object-cover" />
              <div className="p-3">
                <p className="text-sm font-semibold">{course.title}</p>
                <p className="mt-1 text-xs text-muted">{course.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </Panel>
    </div>
  );
}
