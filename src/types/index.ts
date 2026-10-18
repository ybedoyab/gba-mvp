export type TenantId = "ejemplo" | "aurora" | "red";

export type DocStatus =
  | "pendiente"
  | "cargado"
  | "en_revision"
  | "requiere_ajustes"
  | "aprobado";

export type ModuleStatus = "completado" | "en_curso" | "sin_iniciar";

export type InitiativeStatus =
  | "planificacion"
  | "ejecucion"
  | "retrasada"
  | "completada";

export type Priority = "alta" | "media" | "baja";

export type ProjectStatus =
  | "disponible"
  | "en_desarrollo"
  | "en_validacion"
  | "acreditado";

export type ViewAs = "participante" | "gerencia" | "gba";

export interface Product {
  id: string;
  name: string;
  description: string;
  contracted: boolean;
  href: string;
}

export interface Offer {
  id: string;
  title: string;
  summary: string;
  image: string;
  href: string;
  contracted: boolean;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  detail: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  description: string;
  owner: string;
  requestedBy: string;
  due: string;
  status: DocStatus;
  observation?: string;
  recommendation?: string;
  timeline: TimelineEvent[];
}

export interface Activity {
  id: string;
  name: string;
  done: boolean;
  owner: string;
}

export interface Deliverable {
  id: string;
  name: string;
  kind: "documento" | "acta" | "entregable";
  status: "listo" | "en_revision" | "pendiente";
}

export interface TdModule {
  id: string;
  order: number;
  name: string;
  objective: string;
  summary: string;
  progress: number;
  status: ModuleStatus;
  owner: string;
  nextStep: string;
  activities: Activity[];
  deliverables: Deliverable[];
}

export interface Dimension {
  id: string;
  name: string;
  score: number;
  reading: string;
}

export interface Maturity {
  score: number;
  scale: number;
  level: string;
  narrative: string;
  importedAt: string;
  source: string;
  dimensions: Dimension[];
  strengths: string[];
  opportunities: string[];
  recommendations: string[];
}

export interface Initiative {
  id: string;
  name: string;
  objective: string;
  status: InitiativeStatus;
  priority: Priority;
  progress: number;
  owner: string;
  start: string;
  end: string;
  area: string;
  timeline: TimelineEvent[];
  createdInDemo?: boolean;
}

export interface PendingAction {
  id: string;
  kind: "documento" | "decision" | "sesion";
  title: string;
  detail: string;
  href: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  href: string;
  tone: "mint" | "amber" | "plum" | "teal";
}

export interface Lesson {
  id: string;
  courseId: string;
  order: number;
  title: string;
  minutes: number;
  summary: string;
  outcome: string;
  resources: { id: string; name: string; kind: string }[];
  baseProgress: number;
}

export interface Course {
  id: string;
  title: string;
  summary: string;
  image: string;
  line: string;
  minutes: number;
  contracted: boolean;
  competencyId?: string;
}

export type CompetencyStanding =
  | "sin_iniciar"
  | "en_formacion"
  | "formacion_completa"
  | "en_aplicacion"
  | "en_validacion"
  | "acreditada";

export interface Competency {
  id: string;
  name: string;
  family: string;
  description: string;
  expectedLevel: string;
  currentLevel: string;
  baseProgress: number;
  lessonIds: string[];
  standing?: CompetencyStanding;
}

export interface RouteStage {
  id: string;
  label: string;
  description: string;
  state: "completa" | "actual" | "disponible" | "bloqueada";
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: string;
}

export interface EvidenceItem {
  id: string;
  name: string;
  required: boolean;
  provided: boolean;
}

export interface ProjectItem {
  id: string;
  name: string;
  competencyId: string;
  summary: string;
  status: ProjectStatus;
  requirements: string[];
  evidences: EvidenceItem[];
  rubric: RubricCriterion[];
  timeline: TimelineEvent[];
  expert?: string;
  credentialCode?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  route: string;
  progress: number;
  next: string;
}

export interface FormationPoint {
  month: string;
  value: number;
}

export interface NetworkMember {
  id: TenantId | "horizonte";
  name: string;
  program: number;
  maturity: number;
  participants: number;
  activeRoutes: number;
  delayedInitiatives: number;
  compliance: number;
}

export interface Tenant {
  id: TenantId;
  name: string;
  shortName: string;
  zone: string;
  initials: string;
  kind: "cooperativa" | "red";
  portalLabel: string;
  wordmark: string;
  wordmarkOnDark: string;
  logo: string;
  welcome: string;
  products: Product[];
  offers: Offer[];
  documents: DocumentItem[];
  modules: TdModule[];
  maturity: Maturity;
  initiatives: Initiative[];
  pending: PendingAction[];
  notifications: NotificationItem[];
  formationSeries: FormationPoint[];
  participantsOnRoute: number;
  participantsTotal: number;
  team: TeamMember[];
  interests: string[];
  challenges: string[];
}

export interface DemoUser {
  id: string;
  name: string;
  firstName: string;
  roleTitle: string;
  email: string;
  audience: string;
  avatar: string;
  tenantId: TenantId;
}
