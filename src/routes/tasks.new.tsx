import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, SignInPrompt } from "@/components/app-shell";
import { useStore } from "@/lib/store";
import { CATEGORIES, type CategorySlug, type TaskType } from "@/lib/types";

export const Route = createFileRoute("/tasks/new")({
  head: () => ({
    meta: [
      { title: "Post a task · OpsPilot" },
      {
        name: "description",
        content:
          "Describe your task, set a budget and deadline, and receive applications from freelancers across six categories.",
      },
      { property: "og:title", content: "Post a task · OpsPilot" },
      { property: "og:description", content: "Post a task, set a budget and deadline, and compare applications." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CreateTask,
});

const inputClass =
  "w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary";

const pill = (active: boolean) =>
  `rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
    active
      ? "border-primary bg-accent text-accent-foreground"
      : "border-border bg-card text-muted-foreground hover:border-primary/40"
  }`;

const TASK_TYPES: { value: TaskType; label: string }[] = [
  { value: "one-time", label: "One-time" },
  { value: "ongoing", label: "Ongoing" },
  { value: "urgent", label: "Urgent" },
];

function CreateTask() {
  const { user, createTask } = useStore();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CategorySlug>("video");
  const [taskType, setTaskType] = useState<TaskType>("one-time");
  const [budgetType, setBudgetType] = useState<"fixed" | "hourly">("fixed");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [deadline, setDeadline] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [skills, setSkills] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) {
    return (
      <AppShell>
        <h1 className="font-display text-2xl font-bold">Post a task</h1>
        <SignInPrompt message="Sign in as a client to post tasks and hire freelancers." />
      </AppShell>
    );
  }

  if (user.role === "freelancer") {
    return (
      <AppShell>
        <div className="mx-auto max-w-md py-16 text-center">
          <h1 className="font-display text-xl font-semibold">Posting is for clients</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your freelancer account is set up to find and apply for work instead.
          </p>
          <LinkToBrowse />
        </div>
      </AppShell>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = "Give your task a short title";
    if (description.trim().length < 30)
      next.description = "Describe the work in at least 30 characters";
    const min = Number(budgetMin);
    const max = Number(budgetMax);
    if (!budgetMin || Number.isNaN(min) || min <= 0) next.budgetMin = "Enter a minimum budget";
    if (!budgetMax || Number.isNaN(max) || max <= 0) next.budgetMax = "Enter a maximum budget";
    if (!next.budgetMin && !next.budgetMax && max < min)
      next.budgetMax = "Maximum must be at least the minimum";
    if (!deadline) next.deadline = "Pick a deadline";
    else if (new Date(deadline) <= new Date()) next.deadline = "Deadline must be in the future";
    const deliverableList = deliverables
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);
    if (!deliverableList.length)
      next.deliverables = "List at least one deliverable (one per line)";
    const skillList = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!skillList.length) next.skills = "Add at least one required skill";
    setErrors(next);
    if (Object.keys(next).length) return;

    const task = createTask({
      title: title.trim(),
      description: description.trim(),
      category,
      taskType,
      budgetType,
      budgetMin: min,
      budgetMax: max,
      deadline: new Date(deadline).toISOString(),
      deliverables: deliverableList,
      skills: skillList,
    });
    toast.success("Task posted — freelancers can now apply");
    navigate({ to: "/tasks/$taskId", params: { taskId: task.id } });
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-bold">Post a task</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Give freelancers what they need to send you a strong application.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium">
              Task title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="e.g. Edit a 60-second product teaser video"
            />
            {errors.title ? <p className="mt-1 text-xs text-destructive">{errors.title}</p> : null}
          </div>

          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
              placeholder="What needs doing, what you'll provide, and how you'll judge the result."
            />
            {errors.description ? (
              <p className="mt-1 text-xs text-destructive">{errors.description}</p>
            ) : null}
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium">Category</span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setCategory(c.slug)}
                  aria-pressed={category === c.slug}
                  className={pill(category === c.slug)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="mb-2 block text-sm font-medium">Task type</span>
              <div className="flex flex-wrap gap-2">
                {TASK_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTaskType(t.value)}
                    aria-pressed={taskType === t.value}
                    className={pill(taskType === t.value)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="mb-2 block text-sm font-medium">Budget type</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setBudgetType("fixed")}
                  aria-pressed={budgetType === "fixed"}
                  className={pill(budgetType === "fixed")}
                >
                  Fixed price
                </button>
                <button
                  type="button"
                  onClick={() => setBudgetType("hourly")}
                  aria-pressed={budgetType === "hourly"}
                  className={pill(budgetType === "hourly")}
                >
                  Hourly
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="budgetMin" className="mb-1.5 block text-sm font-medium">
                Minimum budget (₹{budgetType === "hourly" ? " / hr" : ""})
              </label>
              <input
                id="budgetMin"
                type="number"
                min={1}
                inputMode="numeric"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
                className={inputClass}
                placeholder="4000"
              />
              {errors.budgetMin ? (
                <p className="mt-1 text-xs text-destructive">{errors.budgetMin}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="budgetMax" className="mb-1.5 block text-sm font-medium">
                Maximum budget (₹{budgetType === "hourly" ? " / hr" : ""})
              </label>
              <input
                id="budgetMax"
                type="number"
                min={1}
                inputMode="numeric"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                className={inputClass}
                placeholder="8000"
              />
              {errors.budgetMax ? (
                <p className="mt-1 text-xs text-destructive">{errors.budgetMax}</p>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="deadline" className="mb-1.5 block text-sm font-medium">
              Deadline
            </label>
            <input
              id="deadline"
              type="date"
              min={today}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className={inputClass}
            />
            {errors.deadline ? (
              <p className="mt-1 text-xs text-destructive">{errors.deadline}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="deliverables" className="mb-1.5 block text-sm font-medium">
              Deliverables <span className="font-normal text-muted-foreground">(one per line)</span>
            </label>
            <textarea
              id="deliverables"
              rows={4}
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
              className={inputClass}
              placeholder={"60-second teaser (16:9)\n9:16 cut for reels\nSRT caption file"}
            />
            {errors.deliverables ? (
              <p className="mt-1 text-xs text-destructive">{errors.deliverables}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="skills" className="mb-1.5 block text-sm font-medium">
              Required skills <span className="font-normal text-muted-foreground">(comma separated)</span>
            </label>
            <input
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className={inputClass}
              placeholder="Premiere Pro, Colour grading, Sound mixing"
            />
            {errors.skills ? <p className="mt-1 text-xs text-destructive">{errors.skills}</p> : null}
          </div>

          <button
            type="submit"
            className="gradient-primary w-full rounded-lg py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Post task
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Phase 1 preview: your task is stored on this device only.
          </p>
        </form>
      </div>
    </AppShell>
  );
}

function LinkToBrowse() {
  return (
    <a
      href="/tasks"
      className="mt-6 inline-block rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
    >
      Browse open tasks
    </a>
  );
}
