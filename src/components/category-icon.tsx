import {
  Code2,
  HelpCircle,
  Megaphone,
  Package,
  Palette,
  Table2,
  Video,
} from "lucide-react";
import { CATEGORIES } from "@/lib/types";

const ICONS = {
  video: Video,
  palette: Palette,
  code: Code2,
  table: Table2,
  megaphone: Megaphone,
  package: Package,
} as const;

export function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  const key = CATEGORIES.find((c) => c.slug === slug)?.icon as keyof typeof ICONS | undefined;
  const Icon = key ? ICONS[key] : HelpCircle;
  return <Icon className={className} aria-hidden />;
}
