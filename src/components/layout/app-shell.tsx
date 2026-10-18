"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  LogOut,
  Menu,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { GioPanel } from "@/components/gio/gio-panel";
import { Menu as DropMenu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/dropdown";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { activeItem, groupForPath, navigation, presentationSteps } from "@/lib/navigation";
import { tenants } from "@/data/tenants";
import { resolveSessionUser } from "@/data/users";
import { initials } from "@/lib/utils";
import { useWorkspace } from "@/hooks/use-workspace";
import { useDemoStore } from "@/stores/demo-store";
import type { TenantId } from "@/types";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const workspace = useWorkspace();
  const authenticated = useDemoStore((state) => state.authenticated);
  const collapsed = useDemoStore((state) => state.sidebarCollapsed);
  const secondaryOpen = useDemoStore((state) => state.secondaryOpen);
  const toggleSidebar = useDemoStore((state) => state.toggleSidebar);
  const toggleSecondary = useDemoStore((state) => state.toggleSecondary);
  const setSecondary = useDemoStore((state) => state.setSecondary);
  const setGio = useDemoStore((state) => state.setGio);
  const setNotifications = useDemoStore((state) => state.setNotifications);
  const notificationsOpen = useDemoStore((state) => state.notificationsOpen);
  const helpOpen = useDemoStore((state) => state.helpOpen);
  const setHelp = useDemoStore((state) => state.setHelp);
  const setTenant = useDemoStore((state) => state.setTenant);
  const tenantId = useDemoStore((state) => state.tenantId);
  const sessionUser = resolveSessionUser(useDemoStore((state) => state.email));
  const logout = useDemoStore((state) => state.logout);
  const resetDemo = useDemoStore((state) => state.resetDemo);
  const presentation = useDemoStore((state) => state.presentation);
  const setPresentation = useDemoStore((state) => state.setPresentation);
  const readNotifications = useDemoStore((state) => state.readNotifications);
  const markNotification = useDemoStore((state) => state.markNotification);
  const [mobileOpen, setMobileOpen] = useState(false);

  const group = groupForPath(pathname);
  const current = activeItem(pathname);
  const unread = workspace.tenant.notifications.filter((item) => !readNotifications.includes(item.id)).length;

  useEffect(() => {
    if (!authenticated) router.replace("/");
  }, [authenticated, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!authenticated) {
    return (
      <div className="grid min-h-screen place-items-center bg-navy text-white">
        <div className="text-center">
          <img src="/assets/brands/redcoop/redcoop_wordmark_white.png" alt="RedCoop" className="mx-auto h-8" />
          <p className="mt-3 text-sm text-white/70">Abriendo el entorno de demostración…</p>
        </div>
      </div>
    );
  }

  const sidebarWidth = collapsed ? 76 : 248;
  const secondaryWidth = secondaryOpen ? 232 : 0;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <aside
        className="fixed inset-y-0 left-0 z-40 hidden flex-col bg-navy text-white lg:flex"
        style={{ width: sidebarWidth }}
      >
        <div className="flex items-center justify-between gap-2 px-3 py-4">
          {!collapsed && (
            <img src={workspace.tenant.wordmarkOnDark} alt="" className="h-7 max-w-[140px] object-contain" />
          )}
          <button onClick={toggleSidebar} className="rounded-lg p-2 text-white/80 hover:bg-white/10" aria-label={collapsed ? "Expandir menú" : "Contraer menú"}>
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        <div className="mx-3 mb-3 flex items-center gap-2 rounded-xl bg-white/10 p-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-xs font-bold text-navy">
            {workspace.tenant.initials}
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{workspace.tenant.shortName}</span>
              <span className="block truncate text-[11px] text-white/60">{workspace.tenant.zone}</span>
            </span>
          )}
        </div>
        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2" aria-label="Principal">
          {!collapsed && <p className="px-2 pb-1 pt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">Mi espacio</p>}
          {navigation.map((section, index) => (
            <div key={section.id}>
              {!collapsed && index === 1 && (
                <p className="px-2 pb-1 pt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">Ejes del programa</p>
              )}
              <button
                onClick={() => {
                  setSecondary(true);
                  router.push(section.items[0].href);
                }}
                title={section.label}
                className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold ${
                  group.id === section.id ? "bg-white/10 text-white" : "text-white/75 hover:bg-white/10"
                }`}
              >
                <section.icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span className="truncate">{section.id === "espacio" ? "Inicio · Dashboard" : section.label}</span>}
              </button>
            </div>
          ))}
        </nav>
        <div className="space-y-1 border-t border-white/10 p-2">
          <button onClick={() => setHelp(true)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-white/80 hover:bg-white/10">
            <CircleHelp className="h-4 w-4" />
            {!collapsed && <span>Ayuda</span>}
          </button>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
          {!collapsed && (
            <p className="px-2 pt-1 text-[10px] leading-relaxed text-white/40">
              Identidad RedCoop referencial. Pendiente de validación de marca.
            </p>
          )}
        </div>
      </aside>

      {secondaryOpen && (
      <aside
        className="fixed inset-y-0 z-30 hidden border-r border-line bg-[#f8fafc] lg:flex lg:flex-col"
        style={{ left: sidebarWidth, width: 232 }}
      >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{group.label}</p>
              <button onClick={toggleSecondary} className="rounded-lg p-1 text-muted hover:bg-white" aria-label="Ocultar secciones">
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
            <nav className="space-y-1 px-2" aria-label="Secciones">
              {group.items.map((item) => {
                const active = current?.href === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold ${
                      active ? "bg-teal-soft text-navy" : "text-ink/80 hover:bg-white"
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
      </aside>
      )}

      {!secondaryOpen && (
        <button
          onClick={toggleSecondary}
          className="fixed top-24 z-30 hidden items-center gap-1 rounded-r-xl border border-line bg-white px-2 py-3 text-xs font-semibold text-ink shadow-card lg:flex"
          style={{ left: sidebarWidth }}
        >
          <ChevronRight className="h-3.5 w-3.5" />
          Secciones
        </button>
      )}

      <div style={{ paddingLeft: undefined }} className="lg:pl-[var(--shell)]" >
        <style>{`:root { --shell: ${sidebarWidth + secondaryWidth}px; }`}</style>
        <header className="sticky top-0 z-20 border-b border-line bg-white/90 backdrop-blur">
          <div className="flex items-center gap-2 px-3 py-2.5 sm:px-5">
            <button className="rounded-lg border border-line p-2 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Abrir menú">
              <Menu className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{current?.label ?? "Inicio"}</p>
              <p className="truncate text-xs text-muted">Smart Center · {workspace.tenant.name}</p>
            </div>
            <label className="hidden items-center gap-2 rounded-xl border border-line bg-paper px-2 py-1.5 text-xs md:flex">
              <span className="font-semibold text-muted">Entidad</span>
              <select
                aria-label="Cambiar entidad de demostración"
                value={tenantId}
                onChange={(event) => {
                  setTenant(event.target.value as TenantId);
                  toast(`Ahora ves ${tenants[event.target.value as TenantId].name}`);
                }}
                className="bg-transparent font-semibold text-ink outline-none"
              >
                <option value="ejemplo">Cooperativa Ejemplo</option>
                <option value="aurora">Cooperativa Aurora</option>
                <option value="red">Red Coop Central</option>
              </select>
            </label>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#2E6BE6] via-[#7A2FE0] to-[#C21FD0]" onClick={() => setGio(true)} aria-label="Abrir GIO">
                  <img src="/assets/ia/Logo_ia_v2.png" alt="" className="h-6 w-6 object-contain" />
                </button>
              </TooltipTrigger>
              <TooltipContent>GIO · simulación</TooltipContent>
            </Tooltip>
            <button className="relative grid h-10 w-10 place-items-center rounded-xl border border-line" onClick={() => setNotifications(true)} aria-label="Notificaciones">
              <Bell className="h-4 w-4" />
              {unread > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-mint" />}
            </button>
            <DropMenu>
              <MenuTrigger className="overflow-hidden rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal" aria-label="Cuenta">
                {sessionUser.avatar ? (
                  <img src={sessionUser.avatar} alt="" className="h-10 w-10 object-cover" />
                ) : (
                  <span className="grid h-10 w-10 place-items-center bg-plum text-xs font-bold text-white">{initials(sessionUser.name)}</span>
                )}
              </MenuTrigger>
              <MenuContent>
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold">{sessionUser.name}</p>
                  <p className="text-xs text-muted">{sessionUser.roleTitle}</p>
                </div>
                <MenuItem onSelect={() => router.push("/app/academy/perfil")}>Mi perfil de desarrollo</MenuItem>
                <MenuItem onSelect={() => setPresentation(!presentation)}>
                  {presentation ? "Ocultar modo presentación" : "Modo presentación"}
                </MenuItem>
                <MenuItem
                  onSelect={() => {
                    resetDemo();
                    toast("Demostración reiniciada");
                    router.push("/");
                  }}
                >
                  <span className="inline-flex items-center gap-2"><RotateCcw className="h-3.5 w-3.5" /> Reiniciar demo</span>
                </MenuItem>
                <MenuItem
                  onSelect={() => {
                    logout();
                    router.push("/");
                  }}
                >
                  Cerrar sesión
                </MenuItem>
              </MenuContent>
            </DropMenu>
          </div>
        </header>
        <main id="contenido" className="px-3 py-5 pb-24 sm:px-5 lg:pb-10">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-white lg:hidden" aria-label="Móvil">
        {navigation.map((section) => (
          <button
            key={section.id}
            onClick={() => router.push(section.items[0].href)}
            className={`flex flex-col items-center gap-1 py-2 text-[11px] font-semibold ${group.id === section.id ? "text-teal" : "text-muted"}`}
          >
            <section.icon className="h-4 w-4" />
            {section.id === "espacio" ? "Inicio" : section.label}
          </button>
        ))}
      </nav>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent title="Navegación" side="left">
          <div className="space-y-4 p-4">
            <label htmlFor="entidad-movil" className="block text-xs font-semibold text-muted">
              Entidad de demostración
              <select
                id="entidad-movil"
                aria-label="Entidad de demostración"
                value={tenantId}
                onChange={(event) => setTenant(event.target.value as TenantId)}
                className="mt-1 h-11 w-full rounded-xl border border-line px-3 text-sm font-semibold text-ink"
              >
                <option value="ejemplo">Cooperativa Ejemplo</option>
                <option value="aurora">Cooperativa Aurora</option>
                <option value="red">Red Coop Central</option>
              </select>
            </label>
            {navigation.map((section) => (
              <div key={section.id}>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-muted">{section.label}</p>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Link key={item.href} href={item.href} className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold hover:bg-paper">
                      <item.icon className="h-4 w-4 text-teal" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={notificationsOpen} onOpenChange={setNotifications}>
        <SheetContent title="Notificaciones">
          <ul className="divide-y divide-line">
            {workspace.tenant.notifications.map((item) => (
              <li key={item.id}>
                <button
                  className="w-full px-4 py-3 text-left hover:bg-paper"
                  onClick={() => {
                    markNotification(item.id);
                    setNotifications(false);
                    router.push(item.href);
                  }}
                >
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  <p className="text-xs text-muted">{item.detail}</p>
                  <p className="mt-1 text-[11px] text-muted">{item.time}</p>
                </button>
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>

      <Sheet open={helpOpen} onOpenChange={setHelp}>
        <SheetContent title="Ayuda">
          <div className="space-y-3 p-4 text-sm text-muted">
            <p>Este entorno muestra cómo se recorrería RedCoop. Los datos son ilustrativos y viven en el navegador.</p>
            <p>El chat con una persona de soporte está disponible en una etapa posterior.</p>
            <button
              className="inline-flex items-center gap-2 rounded-xl bg-paper px-3 py-2 font-semibold text-ink"
              onClick={() => {
                setHelp(false);
                setGio(true);
              }}
            >
              <Sparkles className="h-4 w-4 text-plum" /> Preguntar a GIO
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <GioPanel />

      {presentation && (
        <div className="fixed bottom-16 left-1/2 z-40 w-[min(720px,calc(100%-1rem))] -translate-x-1/2 rounded-2xl border border-line bg-white/95 p-2 shadow-card backdrop-blur lg:bottom-4">
          <div className="mb-1 flex items-center justify-between px-2">
            <p className="text-xs font-bold uppercase tracking-wider text-plum">Modo presentación · 90 s</p>
            <button className="text-xs font-semibold text-muted" onClick={() => setPresentation(false)}>Cerrar</button>
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {presentationSteps.map((step) => (
              <Link key={step.id + step.href} href={step.href} className="min-w-[8.5rem] rounded-xl px-2 py-1.5 hover:bg-paper">
                <p className="text-[10px] font-bold text-teal">{step.time}</p>
                <p className="text-xs font-semibold text-ink">{step.title}</p>
                <p className="text-[10px] text-muted">{step.cue}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

