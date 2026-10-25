export const CATEGORIES = [
  {
    slug: "video",
    label: "Video & Content",
    description: "Video editing, reels, YouTube and content creation",
    icon: "video",
  },
  {
    slug: "design",
    label: "Graphic Design",
    description: "Posters, branding, packaging and visual identity",
    icon: "palette",
  },
  {
    slug: "web",
    label: "Web & Software",
    description: "Websites, apps and software fixes",
    icon: "code",
  },
  {
    slug: "data",
    label: "Data & Documents",
    description: "Excel, data entry and document formatting",
    icon: "table",
  },
  {
    slug: "marketing",
    label: "Digital Marketing",
    description: "Ads, social media and business support",
    icon: "megaphone",
  },
  {
    slug: "local",
    label: "Local Services",
    description: "Errands, parcel delivery and permitted local tasks",
    icon: "package",
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export type Role = "client" | "freelancer";

export type TaskType = "one-time" | "ongoing" | "urgent";

export type TaskStatus = "open" | "assigned" | "in_progress" | "completed";

export type ApplicationStatus = "pending" | "accepted" | "declined";

export interface Task {
  id: string;
  title: string;
  description: string;
  category: CategorySlug;
  taskType: TaskType;
  budgetType: "fixed" | "hourly";
  budgetMin: number;
  budgetMax: number;
  deadline: string; // ISO date
  deliverables: string[];
  skills: string[];
  clientId: string;
  clientName: string;
  postedAt: string; // ISO date
  status: TaskStatus;
  selectedApplicationId?: string;
}

export interface Application {
  id: string;
  taskId: string;
  freelancerId: string;
  freelancerName: string;
  coverLetter: string;
  proposedPrice: number;
  deliveryDays: number;
  skills: string[];
  status: ApplicationStatus;
  createdAt: string; // ISO date
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  link: string;
}

export interface Profile {
  headline: string;
  bio: string;
  skills: string[];
  portfolio: PortfolioItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  open: "Open",
  assigned: "Assigned",
  in_progress: "In progress",
  completed: "Completed",
};

export function formatBudget(task: Pick<Task, "budgetType" | "budgetMin" | "budgetMax">): string {
  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  return task.budgetType === "hourly"
    ? `${fmt(task.budgetMin)}–${fmt(task.budgetMax)} / hr`
    : `${fmt(task.budgetMin)}–${fmt(task.budgetMax)}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
