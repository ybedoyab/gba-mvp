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

const auroraLead: DemoUser = {
  id: "valentina",
  name: "Valentina Ruiz",
  firstName: "Valentina",
  roleTitle: "Responsable de Transformación Digital",
  email: "valentina.ruiz@cooperativa.aurora",
  audience: "Colaboradores",
  avatar: "",
  tenantId: "aurora",
};

export const demoUser = users[0];

export function resolveSessionUser(email: string): DemoUser {
  const value = email.trim().toLowerCase();
  if (value.includes("camila") || value.includes("gba") || value.includes("red")) return users[2];
  if (value.includes("german") || value.includes("gerente")) return users[1];
  if (value.includes("aurora")) return auroraLead;
  return users[0];
}
