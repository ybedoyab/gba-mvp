import type { LucideIcon } from "lucide-react";
import {
  Award,
  Compass,
  FileStack,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  LineChart,
  Map,
  Route,
  Target,
  UserRound,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

export interface NavGroup {
  id: "espacio" | "formacion" | "planeacion" | "ejecucion";
  label: string;
  icon: LucideIcon;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    id: "espacio",
    label: "Mi espacio",
    icon: LayoutDashboard,
    items: [
      {
        href: "/app",
        label: "Inicio",
        icon: LayoutDashboard,
        description: "Smart Center de la entidad",
      },
    ],
  },
  {
    id: "formacion",
    label: "Formación",
    icon: GraduationCap,
    items: [
      {
        href: "/app/academy",
        label: "Academy",
        icon: GraduationCap,
        description: "Aprendizaje guiado",
      },
      {
        href: "/app/academy/ruta",
        label: "Mi ruta de desarrollo",
        icon: Route,
        description: "Del perfil al reconocimiento",
      },
      {
        href: "/app/academy/explorar",
        label: "Explorar Academy",
        icon: Compass,
        description: "Oferta disponible",
      },
      {
        href: "/app/academy/perfil",
        label: "Mi perfil de desarrollo",
        icon: UserRound,
        description: "Competencias y brechas",
      },
      {
        href: "/app/academy/proyectos",
        label: "Proyectos de acreditación",
        icon: Award,
        description: "Evidencia y validación",
      },
    ],
  },
  {
    id: "planeacion",
    label: "Planeación",
    icon: Target,
    items: [
      {
        href: "/app/transformacion",
        label: "Mi Transformación",
        icon: Target,
        description: "Recorrido del acompañamiento",
      },
      {
        href: "/app/transformacion/preoperativos",
        label: "Preoperativos",
        icon: FileStack,
        description: "Documentos base",
      },
      {
        href: "/app/transformacion/programa",
        label: "Programa TD",
        icon: Map,
        description: "Seis módulos del programa",
      },
      {
        href: "/app/transformacion/madurez",
        label: "Índice de Madurez",
        icon: Gauge,
        description: "Línea base importada",
      },
    ],
  },
  {
    id: "ejecucion",
    label: "Ejecución",
    icon: LineChart,
    items: [
      {
        href: "/app/iniciativas",
        label: "Mis iniciativas",
        icon: Route,
        description: "Tablero de la cooperativa",
      },
      {
        href: "/app/reporteria",
        label: "Reportería",
        icon: LineChart,
        description: "Lecturas por perfil",
      },
    ],
  },
];

export function groupForPath(pathname: string) {
  const match = [...navigation]
    .reverse()
    .find((group) =>
      group.items.some(
        (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
      ),
    );
  return match ?? navigation[0];
}

export function activeItem(pathname: string) {
  const items = navigation.flatMap((group) => group.items);
  return items
    .filter((item) =>
      item.href === "/app"
        ? pathname === "/app"
        : pathname === item.href || pathname.startsWith(`${item.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0];
}

export const presentationSteps = [
  {
    id: "login",
    time: "0:00",
    title: "Login RedCoop",
    href: "/",
    cue: "Identidad, aliados y acceso.",
  },
  {
    id: "dashboard",
    time: "0:08",
    title: "Dashboard",
    href: "/app",
    cue: "Cuatro indicadores de la cooperativa.",
  },
  {
    id: "planeacion",
    time: "0:40",
    title: "Planeación",
    href: "/app/transformacion",
    cue: "Transformación, preoperativos y módulos.",
  },
  {
    id: "academy",
    time: "0:52",
    title: "Academy",
    href: "/app/academy",
    cue: "Ruta SARLAFT y una lección.",
  },
  {
    id: "reporteria",
    time: "1:07",
    title: "Reportería",
    href: "/app/reporteria",
    cue: "Cambia entre participante y gerencia.",
  },
  {
    id: "cierre",
    time: "1:18",
    title: "Cierre",
    href: "/app",
    cue: "Vuelve al Smart Center.",
  },
];
