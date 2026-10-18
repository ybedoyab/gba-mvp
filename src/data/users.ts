import type { DemoUser } from "@/types";

export const users: DemoUser[] = [
  {
    id: "laura",
    name: "Laura Gómez",
    firstName: "Laura",
    roleTitle: "Responsable de Transformación Digital",
    email: "laura.gomez@cooperativa.ejemplo",
    audience: "Colaboradores",
    avatar: "/assets/perfiles/laura_gomez.png",
    tenantId: "ejemplo",
  },
  {
    id: "german",
    name: "Germán Rojas",
    firstName: "Germán",
    roleTitle: "Gerente",
    email: "german.rojas@cooperativa.ejemplo",
    audience: "Alta dirección",
    avatar: "",
    tenantId: "ejemplo",
  },
  {
    id: "camila",
    name: "Camila Herrera",
    firstName: "Camila",
    roleTitle: "Administradora del ecosistema",
    email: "camila.herrera@gba.latam",
    audience: "Equipo GBA",
    avatar: "",
    tenantId: "red",
  },
];

export const demoUser = users[0];
