"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Bell, Sparkles } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageIntro, Panel } from "@/components/shared/page";
import { resolveSessionUser } from "@/data/users";
import { useWorkspace } from "@/hooks/use-workspace";
import { useDemoStore } from "@/stores/demo-store";

const pieColors = ["#07B4AE", "#1C3052", "#C4840A", "#00C389"];

export default function DashboardPage() {
  const workspace = useWorkspace();
  const router = useRouter();
  const setGio = useDemoStore((state) => state.setGio);
  const sessionUser = resolveSessionUser(useDemoStore((state) => state.email));
  const { tenant, byStatus, transformationIndex, formationRate, pending, routeProgress } = workspace;
  const execution = [
    { name: "Planificación", value: byStatus.planificacion },
    { name: "Ejecución", value: byStatus.ejecucion },
    { name: "Retrasadas", value: byStatus.retrasada },
    { name: "Completadas", value: byStatus.completada },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <PageIntro
        crumbs={[{ href: "/app", label: "Inicio" }, { label: sessionUser.roleTitle }]}
        eyebrow={tenant.portalLabel}
        title={`Hola, ${sessionUser.firstName}`}
        description={tenant.welcome}
        actions={
          <Button variant="plum" onClick={() => setGio(true)}>
            <Sparkles className="h-4 w-4" /> Preguntar a GIO
          </Button>
        }
      />

      <section className="mb-5 overflow-hidden rounded-3xl bg-navy text-white shadow-card">
        <div className="grid gap-6 p-5 md:grid-cols-[1.4fr_.8fr] md:p-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-mint">Dónde estamos</p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{tenant.name}</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
              El índice de transformación está en {transformationIndex}%. La ruta personal va en {routeProgress}% y hay {pending.length} pendientes de gestión.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={() => router.push("/app/transformacion")}>Ver planeación</Button>
              <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={() => router.push("/app/academy")}>
                Continuar Academy
              </Button>
            </div>
          </div>
          <div className="rounded-2xl bg-white/8 p-4">
            <p className="text-xs text-white/60">Qué sigue</p>
            <p className="mt-1 font-semibold">{pending[0]?.title ?? "Sin pendientes"}</p>
            <p className="mt-1 text-sm text-white/70">{pending[0]?.detail}</p>
            {pending[0] && (
              <Link href={pending[0].href} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-mint">
                Abrir <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
        <img src="/assets/brands/redcoop/aliados_color.png" alt="Aliados referenciales del ecosistema" className="max-h-12 bg-white object-contain px-4 py-2" />
      </section>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi title="Formación" value={`${formationRate}%`} hint={`${tenant.participantsOnRoute} de ${tenant.participantsTotal} en ruta`} href="/app/academy" />
        <Kpi title="Planeación" value={`${transformationIndex}%`} hint="Preoperativos y módulos" href="/app/transformacion" />
        <Kpi title="Ejecución" value={`${workspace.initiatives.length}`} hint="Iniciativas de la cooperativa" href="/app/iniciativas" />
        <Kpi title="Pendientes" value={`${pending.length}`} hint="Acciones de gestión" href="/app/transformacion/preoperativos" />
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-2">
        <Panel title="Formación · participantes en ruta" action={<Link href="/app/reporteria" className="text-xs font-semibold text-teal">Ver reportería</Link>}>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tenant.formationSeries}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#07B4AE" fill="#07B4AE" fillOpacity={0.18} name="Participación %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Planeación · módulos del programa" action={<Link href="/app/transformacion/programa" className="text-xs font-semibold text-teal">Abrir programa</Link>}>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tenant.modules.map((item) => ({ name: `M${item.order}`, value: item.progress }))}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip />
                <Bar dataKey="value" fill="#1C3052" radius={[6, 6, 0, 0]} name="Avance %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
        <Panel title="Ejecución · iniciativas por estado">
          {workspace.initiatives.length === 0 ? (
            <p className="text-sm text-muted">Esta vista de red no tiene iniciativas propias. El detalle vive en cada cooperativa.</p>
          ) : (
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <div className="h-40 w-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={execution} dataKey="value" innerRadius={42} outerRadius={62} paddingAngle={3}>
                      {execution.map((entry, index) => (
                        <Cell key={entry.name} fill={pieColors[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="space-y-1 text-sm">
                {execution.map((item, index) => (
                  <li key={item.name} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: pieColors[index] }} />
                    {item.name} <b>{item.value}</b>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Panel>
        <Panel title="Qué estamos haciendo" action={<Link href="/app/iniciativas" className="text-xs font-semibold text-teal">Tablero</Link>}>
          <ul className="space-y-3">
            {workspace.initiatives.slice(0, 4).map((item) => (
              <li key={item.id}>
                <div className="mb-1 flex justify-between gap-3 text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted">{item.progress}%</span>
                </div>
                <Progress value={item.progress} />
              </li>
            ))}
            {workspace.initiatives.length === 0 && <p className="text-sm text-muted">Sin iniciativas en esta entidad.</p>}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_.8fr]">
        <Panel title="Productos contratados">
          <div className="grid gap-3 sm:grid-cols-3">
            {tenant.products.map((product) => (
              <Link key={product.id} href={product.href} className="rounded-2xl border border-line p-3 hover:border-teal">
                <p className="text-sm font-semibold">{product.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{product.description}</p>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-wide text-mint-dark">{product.contracted ? "Contratado" : "No contratado"}</p>
              </Link>
            ))}
          </div>
        </Panel>
        <Panel title="Pendientes de gestión" action={<Bell className="h-4 w-4 text-muted" />}>
          <ul className="space-y-3">
            {pending.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className="block rounded-xl bg-paper px-3 py-2 hover:bg-teal-soft">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted">{item.detail}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Oferta disponible" className="mt-4">
        <div className="grid gap-3 md:grid-cols-3">
          {tenant.offers.map((offer) => (
            <Link key={offer.id} href={offer.href} className="overflow-hidden rounded-2xl border border-line">
              <img src={offer.image} alt="" className="h-28 w-full object-cover" />
              <div className="p-3">
                <p className="text-sm font-semibold">{offer.title}</p>
                <p className="mt-1 text-xs text-muted">{offer.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Kpi({ title, value, hint, href }: { title: string; value: string; hint: string; href: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-line bg-white p-4 shadow-card transition hover:-translate-y-0.5">
      <p className="text-xs font-bold uppercase tracking-wide text-muted">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-navy">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </Link>
  );
}
