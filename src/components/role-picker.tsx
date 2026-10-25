import type { Role } from "@/lib/types";
import { Briefcase, UserRound } from "lucide-react";

export function RolePicker({
  value,
  onChange,
}: {
  value: Role | null;
  onChange: (role: Role) => void;
}) {
  const options = [
    {
      role: "client" as Role,
      icon: Briefcase,
      title: "I'm a Client",
      description: "I want to post tasks and hire the right person",
    },
    {
      role: "freelancer" as Role,
      icon: UserRound,
      title: "I'm a Freelancer",
      description: "I want to find tasks and apply my skills",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map(({ role, icon: Icon, title, description }) => (
        <button
          key={role}
          type="button"
          onClick={() => onChange(role)}
          aria-pressed={value === role}
          className={`rounded-xl border p-4 text-left transition-colors ${
            value === role
              ? "border-primary bg-accent"
              : "border-border bg-card hover:border-primary/40"
          }`}
        >
          <Icon className={`size-5 ${value === role ? "text-primary" : "text-muted-foreground"}`} aria-hidden />
          <div className="mt-2 font-display text-sm font-semibold">{title}</div>
          <div className="mt-1 text-xs text-muted-foreground">{description}</div>
        </button>
      ))}
    </div>
  );
}
