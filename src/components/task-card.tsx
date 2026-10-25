import { Link } from "@tanstack/react-router";
import { CalendarDays, ChevronRight, Clock, Wallet } from "lucide-react";
import { categoryLabel, formatBudget, formatDate, type Task } from "@/lib/types";
import { CategoryIcon } from "./category-icon";
import { StatusBadge } from "./status-badge";

export function TaskCard({ task, footer }: { task: Task; footer?: "status" | "applications" | "applied" }) {
  return (
    <Link
      to="/tasks/$taskId"
      params={{ taskId: task.id }}
      className="surface-raised group block rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <CategoryIcon slug={task.category} className="size-4" />
          </span>
          {categoryLabel(task.category)}
        </div>
        {footer === "status" ? <StatusBadge status={task.status} /> : null}
        {footer === "applied" ? (
          <span className="rounded-full border border-success/30 bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">
            Applied
          </span>
        ) : null}
      </div>

      <h3 className="mt-3 font-display text-base font-semibold leading-snug group-hover:text-primary">
        {task.title}
      </h3>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Wallet className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate font-medium text-foreground">{formatBudget(task)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5 shrink-0" aria-hidden />
          <span>Due {formatDate(task.deadline)}</span>
        </div>
      </dl>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {task.skills.slice(0, 3).map((skill) => (
          <span key={skill} className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">
            {skill}
          </span>
        ))}
        {task.skills.length > 3 ? (
          <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">
            +{task.skills.length - 3}
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
        <span>{task.clientName}</span>
        <span className="inline-flex items-center gap-1 font-medium text-primary">
          {footer === "applications"
            ? "Review applicants"
            : footer === "applied"
              ? "View task"
              : "View & apply"}
          <ChevronRight className="size-3.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
