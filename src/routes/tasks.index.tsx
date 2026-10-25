import { createFileRoute, Link } from "@tanstack/react-router";
import { Briefcase, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell, SignInPrompt } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { TaskCard } from "@/components/task-card";
import { useStore } from "@/lib/store";
import { CATEGORIES, categoryLabel } from "@/lib/types";

export const Route = createFileRoute("/tasks/")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: typeof search.category === "string" ? search.category : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Browse tasks · OpsPilot" },
      { name: "description", content: "Find open tasks across video, design, web, data, marketing and local services." },
      { property: "og:title", content: "Browse tasks · OpsPilot" },
      { property: "og:description", content: "Find open tasks across six categories and apply with your skills." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TaskFeed,
});

function TaskFeed() {
  const { tasks, applications, user } = useStore();
  const { category } = Route.useSearch();
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks
      .filter((t) => t.status === "open")
      .filter((t) => !category || t.category === category)
      .filter(
        (t) =>
          !q ||
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.skills.some((s) => s.toLowerCase().includes(q)),
      );
  }, [tasks, category, query]);

  const appliedTaskIds = new Set(
    user ? applications.filter((a) => a.freelancerId === user.id).map((a) => a.taskId) : [],
  );

  if (!user) {
    return (
      <AppShell>
        <h1 className="font-display text-2xl font-bold">Browse tasks</h1>
        <SignInPrompt message="Sign in as a freelancer to browse open tasks and apply." />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Browse tasks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {visible.length} open {visible.length === 1 ? "task" : "tasks"}
            {category ? ` in ${categoryLabel(category)}` : ""}
          </p>
        </div>
        <label className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks or skills"
            className="w-full rounded-lg border border-input bg-card py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary"
          />
        </label>
      </div>

      <div className="mt-4 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
        <button
          onClick={() => setQuery("")}
          className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            !category ? "border-primary bg-accent text-accent-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40"
          }`}
        >
          All categories
        </button>
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            to="/tasks"
            search={category === c.slug ? {} : { category: c.slug }}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              category === c.slug
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {category ? (
        <Link to="/tasks" className="mt-3 inline-block text-xs text-muted-foreground hover:text-foreground">
          Clear category filter
        </Link>
      ) : null}

      <div className="mt-6">
        {visible.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {visible.map((task) => (
              <TaskCard key={task.id} task={task} footer={appliedTaskIds.has(task.id) ? "applied" : undefined} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Briefcase className="size-6" />}
            title="No tasks match yet"
            description={
              query || category
                ? "Try a different search term or category — new tasks are posted regularly."
                : "There are no open tasks right now. Check back soon or set up your profile."
            }
          />
        )}
      </div>
    </AppShell>
  );
}
