import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Clock, Flag, ListChecks, Wallet, Wrench } from "lucide-react";
import { AppShell, SignInPrompt } from "@/components/app-shell";
import { CategoryIcon } from "@/components/category-icon";
import { StatusBadge } from "@/components/status-badge";
import { useStore } from "@/lib/store";
import { categoryLabel, formatBudget, formatDate, TASK_STATUS_LABELS } from "@/lib/types";

export const Route = createFileRoute("/tasks/$taskId")({
  head: () => ({
    meta: [
      { title: "Task details · OpsPilot" },
      { name: "description", content: "Task details: description, budget, deadline, deliverables and required skills." },
      { property: "og:title", content: "Task details · OpsPilot" },
      { property: "og:description", content: "Review the brief, budget and deliverables, then apply." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TaskDetail,
});

function TaskDetail() {
  const { taskId } = Route.useParams();
  const { tasks, applications, user, updateTaskStatus } = useStore();
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md py-16 text-center">
          <h1 className="font-display text-xl font-semibold">Task not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">It may have been removed.</p>
          <Link to="/tasks" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
            Back to browse
          </Link>
        </div>
      </AppShell>
    );
  }

  const isOwner = user?.role === "client" && user.id === task.clientId;
  const myApplication = user ? applications.find((a) => a.taskId === task.id && a.freelancerId === user.id) : undefined;
  const applicationCount = applications.filter((a) => a.taskId === task.id).length;

  return (
    <AppShell>
      <Link
        to={isOwner ? "/client" : "/tasks"}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> Back
      </Link>

      <article className="surface-raised mt-4 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <CategoryIcon slug={task.category} className="size-5" />
          </span>
          <span className="text-sm text-muted-foreground">{categoryLabel(task.category)}</span>
          <span className="ml-auto flex items-center gap-2">
            <StatusBadge status={task.status} />
          </span>
        </div>

        <h1 className="mt-4 font-display text-2xl font-bold leading-tight sm:text-3xl">{task.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Posted by {task.clientName} · {formatDate(task.postedAt)}
        </p>

        <dl className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Wallet className="size-3.5" aria-hidden /> Budget
            </dt>
            <dd className="mt-1 font-display text-lg font-semibold">{formatBudget(task)}</dd>
          </div>
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <CalendarDays className="size-3.5" aria-hidden /> Deadline
            </dt>
            <dd className="mt-1 font-display text-lg font-semibold">{formatDate(task.deadline)}</dd>
          </div>
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Clock className="size-3.5" aria-hidden /> Task type
            </dt>
            <dd className="mt-1 font-display text-lg font-semibold capitalize">
              {task.taskType.replace("-", " ")}
            </dd>
          </div>
        </dl>

        <h2 className="mt-8 font-display text-lg font-semibold">Description</h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
          {task.description}
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-1.5 font-display text-lg font-semibold">
              <ListChecks className="size-5 text-primary" aria-hidden /> Deliverables
            </h2>
            <ul className="mt-3 space-y-2">
              {task.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-foreground/90">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="flex items-center gap-1.5 font-display text-lg font-semibold">
              <Wrench className="size-5 text-primary" aria-hidden /> Required skills
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {task.skills.map((s) => (
                <span key={s} className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border/60 pt-6">
          {isOwner ? (
            <>
              <Link
                to="/tasks/$taskId/applicants"
                params={{ taskId: task.id }}
                className="gradient-primary rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Review applicants {applicationCount ? `(${applicationCount})` : ""}
              </Link>
              {task.status === "assigned" ? (
                <button
                  onClick={() => updateTaskStatus(task.id, "in_progress")}
                  className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  Mark in progress
                </button>
              ) : null}
              {task.status === "in_progress" ? (
                <button
                  onClick={() => updateTaskStatus(task.id, "completed")}
                  className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  Mark completed
                </button>
              ) : null}
            </>
          ) : user?.role === "freelancer" ? (
            myApplication ? (
              <span className="rounded-xl border border-success/30 bg-success/10 px-4 py-2.5 text-sm font-medium text-success">
                You applied · {TASK_STATUS_LABELS[task.status] === "Open" ? "awaiting the client's decision" : "decision made"}
              </span>
            ) : task.status === "open" ? (
              <Link
                to="/tasks/$taskId/apply"
                params={{ taskId: task.id }}
                className="gradient-primary rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Apply for this task
              </Link>
            ) : (
              <span className="text-sm text-muted-foreground">This task is no longer accepting applications.</span>
            )
          ) : null}

          <Link
            to="/report"
            search={{ task: task.id }}
            className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-destructive"
          >
            <Flag className="size-3.5" aria-hidden /> Report this task
          </Link>
        </div>
      </article>

      {!user ? (
        <div className="mt-6">
          <SignInPrompt message="Sign in to apply for this task or to manage it as its client." />
        </div>
      ) : null}
    </AppShell>
  );

}
