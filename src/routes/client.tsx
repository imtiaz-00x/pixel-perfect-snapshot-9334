import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, PlusCircle, Users } from "lucide-react";
import { AppShell, SignInPrompt } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { TaskCard } from "@/components/task-card";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/client")({
  head: () => ({
    meta: [
      { title: "My tasks · OpsPilot" },
      { name: "description", content: "Track the tasks you posted and review the freelancers who applied." },
      { property: "og:title", content: "My tasks · OpsPilot" },
      { property: "og:description", content: "Track your posted tasks and review applications." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClientDashboard,
});

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-display text-2xl font-bold">{value}</dd>
    </div>
  );
}

function ClientDashboard() {
  const { tasks, applications, user } = useStore();

  if (!user) {
    return (
      <AppShell>
        <h1 className="font-display text-2xl font-bold">My tasks</h1>
        <SignInPrompt message="Sign in as a client to post tasks and manage applications." />
      </AppShell>
    );
  }

  if (user.role === "freelancer") {
    return (
      <AppShell>
        <div className="mx-auto max-w-md py-16 text-center">
          <h1 className="font-display text-xl font-semibold">This dashboard is for clients</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your freelancer account is set up to browse open tasks and apply.
          </p>
          <Link
            to="/tasks"
            className="gradient-primary mt-6 inline-block rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Browse open tasks
          </Link>
        </div>
      </AppShell>
    );
  }

  const myTasks = tasks.filter((t) => t.clientId === user.id);
  const open = myTasks.filter((t) => t.status === "open").length;
  const active = myTasks.filter((t) => t.status === "assigned" || t.status === "in_progress").length;
  const completed = myTasks.filter((t) => t.status === "completed").length;
  const applicantCount = applications.filter((a) => myTasks.some((t) => t.id === a.taskId)).length;

  return (
    <AppShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">My tasks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track what you've posted and review the freelancers who applied.
          </p>
        </div>
        <Link
          to="/tasks/new"
          className="gradient-primary glow-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <PlusCircle className="size-4" aria-hidden /> Post a task
        </Link>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Open" value={open} />
        <StatCard label="In progress" value={active} />
        <StatCard label="Completed" value={completed} />
        <StatCard label="Applications" value={applicantCount} />
      </dl>

      <h2 className="mt-10 font-display text-lg font-semibold">Posted tasks</h2>
      <div className="mt-4">
        {myTasks.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {myTasks.map((t) => (
              <TaskCard key={t.id} task={t} footer={t.status === "open" ? "applications" : "status"} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<ClipboardList className="size-6" />}
            title="You haven't posted a task yet"
            description="Describe the work you need and freelancers will come to you."
            action={
              <Link
                to="/tasks/new"
                className="gradient-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <PlusCircle className="size-4" aria-hidden /> Post your first task
              </Link>
            }
          />
        )}
      </div>
    </AppShell>
  );
}
