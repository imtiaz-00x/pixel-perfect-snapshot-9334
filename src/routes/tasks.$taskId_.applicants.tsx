import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Users, Wallet } from "lucide-react";
import { toast } from "sonner";
import { AppShell, SignInPrompt } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { useStore } from "@/lib/store";
import { formatBudget, formatDate, type Application, type TaskStatus } from "@/lib/types";

export const Route = createFileRoute("/tasks/$taskId_/applicants")({
  head: () => ({
    meta: [
      { title: "Review applicants · OpsPilot" },
      { name: "description", content: "Compare freelancer applications side by side and select who to hire." },
      { property: "og:title", content: "Review applicants · OpsPilot" },
      { property: "og:description", content: "Compare applications side by side and select who to hire." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Applicants,
});

const DECISION_LABELS: Record<Exclude<TaskStatus, "open">, never> = {} as never;

function ApplicantBadge({ status }: { status: "accepted" | "declined" }) {
  const styles =
    status === "accepted"
      ? "border-success/30 bg-success/15 text-success"
      : "border-border bg-secondary text-muted-foreground";
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles}`}>
      {status === "accepted" ? "Selected" : "Declined"}
    </span>
  );
}

function Applicants() {
  const { taskId } = Route.useParams();
  const { tasks, applications, user, selectApplication } = useStore();
  const navigate = useNavigate();
  const task = tasks.find((t) => t.id === taskId);

  if (!user) {
    return (
      <AppShell>
        <h1 className="font-display text-2xl font-bold">Applicants</h1>
        <SignInPrompt message="Sign in as the client who posted this task to review applicants." />
      </AppShell>
    );
  }

  if (!task) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md py-16 text-center">
          <h1 className="font-display text-xl font-semibold">Task not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">It may have been removed.</p>
          <Link to="/client" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
            Back to my tasks
          </Link>
        </div>
      </AppShell>
    );
  }

  if (user.role !== "client" || user.id !== task.clientId) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md py-16 text-center">
          <h1 className="font-display text-xl font-semibold">Clients only</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Only the client who posted this task can review its applicants.
          </p>
          <Link to="/tasks" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
            Browse open tasks
          </Link>
        </div>
      </AppShell>
    );
  }

  const apps = applications
    .filter((a) => a.taskId === task.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  function choose(application: Application) {
    selectApplication(application.id);
    toast.success(`You selected ${application.freelancerName}. Other applicants were declined.`);
    navigate({ to: "/tasks/$taskId", params: { taskId: task.id } });
  }

  return (
    <AppShell>
      <Link
        to="/tasks/$taskId"
        params={{ taskId: task.id }}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> Back to the task
      </Link>

      <div className="mt-4">
        <h1 className="font-display text-2xl font-bold">Review applicants</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {apps.length} {apps.length === 1 ? "application" : "applications"} for{" "}
          <span className="font-medium text-foreground">{task.title}</span>
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:max-w-md">
          <div className="rounded-xl border border-border bg-card p-4">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Wallet className="size-3.5" aria-hidden /> Budget
            </dt>
            <dd className="mt-1 font-display text-base font-semibold">{formatBudget(task)}</dd>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <CalendarDays className="size-3.5" aria-hidden /> Deadline
            </dt>
            <dd className="mt-1 font-display text-base font-semibold">{formatDate(task.deadline)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6">
        {apps.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {apps.map((app) => {
              const initials = app.freelancerName
                .split(" ")
                .map((part) => part[0] ?? "")
                .join("")
                .slice(0, 2)
                .toUpperCase();
              const firstName = app.freelancerName.split(" ")[0] ?? app.freelancerName;
              return (
                <article
                  key={app.id}
                  className="surface-raised flex flex-col rounded-2xl border border-border bg-card p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-accent-foreground">
                        {initials || "?"}
                      </span>
                      <div>
                        <h2 className="font-display text-sm font-semibold">{app.freelancerName}</h2>
                        <p className="text-xs text-muted-foreground">
                          Applied {formatDate(app.createdAt)}
                        </p>
                      </div>
                    </div>
                    {app.status !== "pending" ? <ApplicantBadge status={app.status} /> : null}
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <dt className="text-muted-foreground">Proposed price</dt>
                      <dd className="mt-0.5 font-display text-sm font-semibold text-foreground">
                        ₹{app.proposedPrice.toLocaleString("en-IN")}
                        {task.budgetType === "hourly" ? " / hr" : ""}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Delivery</dt>
                      <dd className="mt-0.5 font-display text-sm font-semibold text-foreground">
                        {app.deliveryDays} {app.deliveryDays === 1 ? "day" : "days"}
                      </dd>
                    </div>
                  </dl>

                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                    {app.coverLetter}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {app.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {task.status === "open" && app.status === "pending" ? (
                    <button
                      onClick={() => choose(app)}
                      className="gradient-primary mt-4 w-full rounded-lg py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Select {firstName}
                    </button>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<Users className="size-6" />}
            title="No applications yet"
            description="Freelancers who apply will appear here. Share the task to get more eyes on it."
          />
        )}
      </div>
    </AppShell>
  );
}
