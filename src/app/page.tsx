"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDemoStore } from "@/stores/demo-store";

export default function LoginPage() {
  const router = useRouter();
  const login = useDemoStore((state) => state.login);
  const authenticated = useDemoStore((state) => state.authenticated);
  const [email, setEmail] = useState("laura.gomez@cooperativa.ejemplo");
  const [password, setPassword] = useState("demo");

  useEffect(() => {
    if (authenticated) router.replace("/app");
  }, [authenticated, router]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    login(email);
    router.push("/app");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-navy">
      <img
        src="/assets/brands/redcoop/login_redcoop_v2_oscuro.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/30 via-transparent to-navy/55" />
      <div className="relative z-10 flex min-h-screen flex-col justify-between p-5 sm:p-8 lg:p-10">
        <img src="/assets/brands/redcoop/redcoop_wordmark_white.png" alt="RedCoop" className="h-8 w-auto self-start sm:h-9" />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <div className="hidden max-w-md text-white lg:block">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Smart Center</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight">Tu cooperativa, en un solo lugar.</h1>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Estrategia, formación y seguimiento conectados. Esta es una demostración para recorrer la experiencia, no la plataforma productiva.
            </p>
          </div>
          <form onSubmit={onSubmit} className="ml-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <img src="/assets/brands/redcoop/redcoop_wordmark_color.png" alt="RedCoop" className="h-8" />
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-teal">Entorno de demostración</p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">Iniciar sesión</h2>
            <p className="mt-1 text-sm text-muted">Portal RedCoop · Cooperativa Ejemplo</p>
            <label className="mt-5 block text-xs font-semibold text-ink">
              Correo
              <Input className="mt-1.5" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="username" />
            </label>
            <label className="mt-3 block text-xs font-semibold text-ink">
              Contraseña
              <Input className="mt-1.5" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" />
            </label>
            <Button type="submit" className="mt-5 h-12 w-full">Iniciar sesión</Button>
            <p className="mt-3 flex items-center gap-2 text-xs text-muted">
              <LockKeyhole className="h-3.5 w-3.5" />
              No se validan credenciales reales. Cualquier correo abre la demo.
            </p>
            <div className="mt-6 border-t border-line pt-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Un producto del ecosistema</p>
              <img src="/assets/brands/redcoop/aliados_color.png" alt="Aliados del ecosistema: referencias visuales, no una identidad oficial aprobada." className="mx-auto mt-3 max-h-14 w-full object-contain" />
            </div>
          </form>
        </div>
        <p className="text-[11px] text-white/70">Identidad RedCoop de referencia. Requiere validación de marca para un uso definitivo.</p>
      </div>
    </main>
  );
}
