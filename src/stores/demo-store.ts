"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  DocStatus,
  Initiative,
  ProjectStatus,
  TenantId,
  TimelineEvent,
  ViewAs,
} from "@/types";

interface DemoState {
  authenticated: boolean;
  email: string;
  tenantId: TenantId;
  viewAs: ViewAs;
  sidebarCollapsed: boolean;
  secondaryOpen: boolean;
  gioOpen: boolean;
  notificationsOpen: boolean;
  helpOpen: boolean;
  presentation: boolean;
  docStatus: Record<string, DocStatus>;
  docEvents: Record<string, TimelineEvent[]>;
  lessonProgress: Record<string, number>;
  extraInitiatives: Record<TenantId, Initiative[]>;
  projectStatus: Record<string, ProjectStatus>;
  evidenceProvided: Record<string, boolean>;
  projectEvents: Record<string, TimelineEvent[]>;
  readNotifications: string[];
  login: (email: string) => void;
  logout: () => void;
  setTenant: (tenantId: TenantId) => void;
  setViewAs: (viewAs: ViewAs) => void;
  toggleSidebar: () => void;
  toggleSecondary: () => void;
  setSecondary: (open: boolean) => void;
  setGio: (open: boolean) => void;
  setNotifications: (open: boolean) => void;
  setHelp: (open: boolean) => void;
  setPresentation: (open: boolean) => void;
  markNotification: (id: string) => void;
  uploadDocument: (tenantId: TenantId, documentId: string) => void;
  setLessonProgress: (tenantId: TenantId, lessonId: string, progress: number) => void;
  addInitiative: (tenantId: TenantId, initiative: Initiative) => void;
  submitProject: (tenantId: TenantId, projectId: string) => void;
  toggleEvidence: (tenantId: TenantId, evidenceId: string, provided: boolean) => void;
  resetDemo: () => void;
}

const emptyExtras = (): Record<TenantId, Initiative[]> => ({
  ejemplo: [],
  aurora: [],
  red: [],
});

const initial = {
  authenticated: false,
  email: "laura.gomez@cooperativa.ejemplo",
  tenantId: "ejemplo" as TenantId,
  viewAs: "participante" as ViewAs,
  sidebarCollapsed: false,
  secondaryOpen: true,
  gioOpen: false,
  notificationsOpen: false,
  helpOpen: false,
  presentation: false,
  docStatus: {} as Record<string, DocStatus>,
  docEvents: {} as Record<string, TimelineEvent[]>,
  lessonProgress: {} as Record<string, number>,
  extraInitiatives: emptyExtras(),
  projectStatus: {} as Record<string, ProjectStatus>,
  evidenceProvided: {} as Record<string, boolean>,
  projectEvents: {} as Record<string, TimelineEvent[]>,
  readNotifications: [] as string[],
};

export const useDemoStore = create<DemoState>()(
  persist(
    (set) => ({
      ...initial,
      login: (email) => {
        const value = email.trim().toLowerCase();
        let tenantId: TenantId = "ejemplo";
        let viewAs: ViewAs = "participante";
        if (value.includes("aurora")) tenantId = "aurora";
        if (value.includes("gba") || value.includes("red")) {
          tenantId = "red";
          viewAs = "gba";
        }
        if (value.includes("gerente") || value.includes("german")) viewAs = "gerencia";
        set({ authenticated: true, email: value || initial.email, tenantId, viewAs });
      },
      logout: () => set({ authenticated: false, gioOpen: false }),
      setTenant: (tenantId) => set({ tenantId, viewAs: tenantId === "red" ? "gba" : "participante" }),
      setViewAs: (viewAs) => set({ viewAs }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      toggleSecondary: () => set((state) => ({ secondaryOpen: !state.secondaryOpen })),
      setSecondary: (secondaryOpen) => set({ secondaryOpen }),
      setGio: (gioOpen) => set({ gioOpen, notificationsOpen: false, helpOpen: false }),
      setNotifications: (notificationsOpen) =>
        set({ notificationsOpen, gioOpen: false, helpOpen: false }),
      setHelp: (helpOpen) => set({ helpOpen, gioOpen: false, notificationsOpen: false }),
      setPresentation: (presentation) => set({ presentation }),
      markNotification: (id) =>
        set((state) => ({
          readNotifications: state.readNotifications.includes(id)
            ? state.readNotifications
            : [...state.readNotifications, id],
        })),
      uploadDocument: (tenantId, documentId) =>
        set((state) => {
          const key = `${tenantId}:${documentId}`;
          const event: TimelineEvent = {
            id: `${key}-demo`,
            date: "Hoy · simulación",
            title: "Cargado en la demo",
            detail: "El archivo no se envió a ningún servidor. El estado local pasó a cargado.",
          };
          return {
            docStatus: { ...state.docStatus, [key]: "cargado" },
            docEvents: {
              ...state.docEvents,
              [key]: [...(state.docEvents[key] ?? []), event],
            },
          };
        }),
      setLessonProgress: (tenantId, lessonId, progress) =>
        set((state) => ({
          lessonProgress: {
            ...state.lessonProgress,
            [`${tenantId}:${lessonId}`]: progress,
          },
        })),
      addInitiative: (tenantId, initiative) =>
        set((state) => ({
          extraInitiatives: {
            ...state.extraInitiatives,
            [tenantId]: [initiative, ...(state.extraInitiatives[tenantId] ?? [])],
          },
        })),
      submitProject: (tenantId, projectId) =>
        set((state) => {
          const key = `${tenantId}:${projectId}`;
          return {
            projectStatus: { ...state.projectStatus, [key]: "en_validacion" },
            projectEvents: {
              ...state.projectEvents,
              [key]: [
                ...(state.projectEvents[key] ?? []),
                {
                  id: `${key}-envio`,
                  date: "Hoy · simulación",
                  title: "Enviado a validación experta",
                  detail: "Queda en espera de un experto autorizado. GIO no acredita esta entrega.",
                },
              ],
            },
          };
        }),
      toggleEvidence: (tenantId, evidenceId, provided) =>
        set((state) => ({
          evidenceProvided: { ...state.evidenceProvided, [`${tenantId}:${evidenceId}`]: provided },
        })),
      resetDemo: () =>
        set({
          ...initial,
          extraInitiatives: emptyExtras(),
          authenticated: false,
        }),
    }),
    {
      name: "gba-redcoop-demo",
      version: 1,
      skipHydration: true,
      partialize: (state) => ({
        authenticated: state.authenticated,
        email: state.email,
        tenantId: state.tenantId,
        viewAs: state.viewAs,
        sidebarCollapsed: state.sidebarCollapsed,
        secondaryOpen: state.secondaryOpen,
        presentation: state.presentation,
        docStatus: state.docStatus,
        docEvents: state.docEvents,
        lessonProgress: state.lessonProgress,
        extraInitiatives: state.extraInitiatives,
        projectStatus: state.projectStatus,
        evidenceProvided: state.evidenceProvided,
        projectEvents: state.projectEvents,
        readNotifications: state.readNotifications,
      }),
    },
  ),
);
