"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDemoStore } from "@/stores/demo-store";

export function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = useDemoStore.persist.onFinishHydration(() => setReady(true));
    void useDemoStore.persist.rehydrate();
    return unsub;
  }, []);

  return (
    <TooltipProvider delayDuration={250}>
      {ready ? (
        children
      ) : (
        <div className="grid min-h-screen place-items-center bg-navy text-sm text-white">
          Abriendo el entorno de demostración…
        </div>
      )}
      <Toaster position="bottom-right" richColors closeButton />
    </TooltipProvider>
  );
}
