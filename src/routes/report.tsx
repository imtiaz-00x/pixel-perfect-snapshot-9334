import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Flag, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/report")({
  validateSearch: (search: Record<string, unknown>): { task?: string } => {
    const raw = search["task"];
    return typeof raw === "string" ? { task: raw } : {};
  },
  head: () => ({
    meta: [
      { title: "Report a task · OpsPilot" },
      { name: "description", content: "Report a task that looks misleading, inappropriate or unsafe." },
      { property: "og:title", content: "Report a task · OpsPilot" },
      { property: "og:description", content: "Report a task that looks misleading, inappropriate or unsafe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportPage,
});

const REASONS = [
  "Misleading or scam",
  "Inappropriate content",
  "Payment issue",
  "Spam or duplicate",
  "Other",
] as const;

const inputClass =
  "w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary";

type FieldErrors = Partial<Record<"details" | "email", string>>;

function ReportPage() {
  const { task: taskId } = Route.useSearch();
  const { tasks } = useStore();
  const navigate = useNavigate();
  const task = taskId ? tasks.find((t) => t.id === taskId) : undefined;
  const [reason, setReason] = useState<string>(REASONS[0]);
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: FieldErrors = {};
    if (details.trim().length < 20) next.details = "Tell us what's wrong (at least 20 characters)";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "Enter a valid email address or leave it empty";
    setErrors(next);
    if (Object.keys(next).length) return;

    toast.success("Report sent — our team will review it.");
    setDetails("");
    setEmail("");
    if (task) navigate({ to: "/tasks/$taskId", params: { taskId: task.id } });
    else navigate({ to: "/" });
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-xl">
        <h1 className="font-display text-2xl font-bold">Report a task</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reports are reviewed by the OpsPilot team before any action is taken.
        </p>

        {task ? (
          <div className="surface-raised mt-6 flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
            <Flag className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                You're reporting
              </p>
              <p className="mt-0.5 text-sm font-medium">{task.title}</p>
              <Link
                to="/tasks/$taskId"
                params={{ taskId: task.id }}
                className="mt-1 inline-block text-xs text-muted-foreground hover:text-foreground"
              >
                View the task instead
              </Link>
            </div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          <div>
            <span className="mb-2 block text-sm font-medium">What's wrong?</span>
            <div className="flex flex-wrap gap-2">
              {REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  aria-pressed={reason === r}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    reason === r
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="details" className="mb-1.5 block text-sm font-medium">
              Details
            </label>
            <textarea
              id="details"
              rows={5}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className={inputClass}
              placeholder="What did you see, and why is it a problem?"
            />
            {errors.details ? (
              <p className="mt-1 text-xs text-destructive">{errors.details}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Your email <span className="font-normal text-muted-foreground">(optional, so we can follow up)</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@example.com"
            />
            {errors.email ? <p className="mt-1 text-xs text-destructive">{errors.email}</p> : null}
          </div>

          <button
            type="submit"
            className="gradient-primary inline-flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Send className="size-4" aria-hidden /> Send report
          </button>
        </form>
      </div>
    </AppShell>
  );
}
