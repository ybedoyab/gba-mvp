"use client";

import { useMemo } from "react";
import { buildWorkspace } from "@/lib/workspace";
import { useDemoStore } from "@/stores/demo-store";

export function useWorkspace() {
  const tenantId = useDemoStore((state) => state.tenantId);
  const docStatus = useDemoStore((state) => state.docStatus);
  const docEvents = useDemoStore((state) => state.docEvents);
  const lessonProgress = useDemoStore((state) => state.lessonProgress);
  const extraInitiatives = useDemoStore((state) => state.extraInitiatives);
  const projectStatus = useDemoStore((state) => state.projectStatus);
  const evidenceProvided = useDemoStore((state) => state.evidenceProvided);
  const projectEvents = useDemoStore((state) => state.projectEvents);

  return useMemo(
    () =>
      buildWorkspace(tenantId, {
        docStatus,
        docEvents,
        lessonProgress,
        extraInitiatives,
        projectStatus,
        evidenceProvided,
        projectEvents,
      }),
    [
      tenantId,
      docStatus,
      docEvents,
      lessonProgress,
      extraInitiatives,
      projectStatus,
      evidenceProvided,
      projectEvents,
    ],
  );
}
