"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Check, Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageIntro, Panel } from "@/components/shared/page";
import { useWorkspace } from "@/hooks/use-workspace";
import { useDemoStore } from "@/stores/demo-store";

export default function LessonPage() {
  const params = useParams<{ lessonId: string }>();
  const router = useRouter();
  const workspace = useWorkspace();
  const setProgress = useDemoStore((state) => state.setLessonProgress);
  const setGio = useDemoStore((state) => state.setGio);
  const lesson = workspace.lessons.find((item) => item.id === params.lessonId) ?? workspace.lessons[0];
  const [playing, setPlaying] = useState(false);
  const index = workspace.lessons.findIndex((item) => item.id === lesson.id);
  const next = workspace.lessons[index + 1];
  const locked = index > 0 && workspace.lessons[index - 1].baseProgress < 100 && lesson.baseProgress === 0;

  function complete() {
    setProgress(workspace.tenant.id, lesson.id, 100);
    toast("Lección marcada como completada. Esto no acredita la competencia.");
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[1fr_300px]">
      <div>
        <PageIntro
          crumbs={[
            { href: "/app/academy", label: "Academy" },
            { href: "/app/academy/ruta", label: "Mi ruta" },
            { label: lesson.title },
          ]}
          eyebrow={`Lección ${lesson.order} · ${lesson.minutes} min`}
          title={lesson.title}
          description={lesson.summary}
          actions={<Button variant="plum" onClick={() => setGio(true)}>GIO en esta lección</Button>}
        />
        <div className="overflow-hidden rounded-3xl bg-navy text-white">
          <div className="relative grid min-h-64 place-items-center">
            <img src="/assets/cursos/sarlaft_leccion_3.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
            <button
              onClick={() => setPlaying((value) => !value)}
              className="relative grid h-16 w-16 place-items-center rounded-full bg-white text-navy"
              aria-label={playing ? "Pausar recurso" : "Reproducir recurso"}
            >
              <Play className="h-6 w-6" />
            </button>
          </div>
          <div className="space-y-2 p-4">
            <p className="text-sm text-white/80">{playing ? "Reproduciendo un recurso ilustrativo. No hay video externo." : "Recurso multimedia de demostración."}</p>
            <Progress value={playing ? Math.max(lesson.baseProgress, 65) : lesson.baseProgress} />
          </div>
        </div>
        <Panel title="Qué vas a poder hacer" className="mt-4">
          <p className="text-sm text-muted">{lesson.outcome}</p>
          {locked && <p className="mt-2 text-sm text-amber">Completa la lección anterior para seguir la secuencia.</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={complete} disabled={lesson.baseProgress >= 100}>
              <Check className="h-4 w-4" /> {lesson.baseProgress >= 100 ? "Completada" : "Marcar como completada"}
            </Button>
            {next && (
              <Button variant="outline" onClick={() => router.push(`/app/academy/leccion/${next.id}`)}>
                Siguiente lección
              </Button>
            )}
          </div>
        </Panel>
        <Panel title="Recursos complementarios" className="mt-4">
          <ul className="space-y-2">
            {lesson.resources.map((resource) => (
              <li key={resource.id} className="flex items-center justify-between rounded-xl bg-paper px-3 py-2 text-sm">
                <span>{resource.name}</span>
                <span className="text-xs text-muted">{resource.kind}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">La descarga del archivo real está disponible en una etapa posterior.</p>
        </Panel>
      </div>
      <Panel title="Índice del curso">
        <ol className="space-y-2">
          {workspace.lessons.map((item) => (
            <li key={item.id}>
              <Link href={`/app/academy/leccion/${item.id}`} className={`block rounded-xl px-3 py-2 text-sm ${item.id === lesson.id ? "bg-plum-soft" : "hover:bg-paper"}`}>
                <span className="font-semibold">{item.order}. {item.title}</span>
                <span className="mt-1 block text-xs text-muted">{item.baseProgress >= 100 ? "Completada" : `${item.baseProgress}%`}</span>
              </Link>
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  );
}
