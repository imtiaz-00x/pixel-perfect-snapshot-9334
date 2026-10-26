import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell, SignInPrompt } from "@/components/app-shell";
import { useStore } from "@/lib/store";
import { formatBudget, formatDate } from "@/lib/types";

export const Route = createFileRoute("/tasks/$taskId_/apply")({
  head: () => ({
    meta: [
      { title: "Apply for task · OpsPilot" },
      { name: "description", content: "Send your application with a cover letter, proposed price and delivery time." },
      { property: "og:title", content: "Apply for task · OpsPilot" },
      { property: "og:description", content: "Send your application with a cover letter, price and delivery time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApplyToTask,
});

const inputClass =
  "w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary";

type FieldErrors = Partial<Record<"coverLetter" | "proposedPrice" | "deliveryDays" | "skills", string>>;

function ApplyToTask() {
  const { taskId } = Route.useParams();
  const { tasks, applications, user, profile, applyToTask } = useStore();
  const navigate = useNavigate();
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");
  const [skills, setSkills] = useState("");
  const [skillsTouched, setSkillsTouched] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  // Pre-fill skills from the saved profile once the store hydrates.
  useEffect(() => {
    if (!skillsTouched && profile?.skills.length) setSkills(profile.skills.join(", "));
  }, [profile, skillsTouched]);

  if (!user) {
    return (
      <AppShell>
        <h1 className="font-display text-2xl font-bold">Apply</h1>
        <SignInPrompt message="Sign in as a freelancer to apply for this task." />
      </AppShell>
    );
  }

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

  if (user.role !== "freelancer") {
    return (
      <AppShell>
        <div className="mx-auto max-w-md py-16 text-center">
          <h1 className="font-display text-xl font-semibold">Applying is for freelancers</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Client accounts post tasks and review applications instead.
          </p>
          <Link
            to="/tasks/$taskId"
            params={{ taskId: task.id }}
            className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
          >
            Back to the task
          </Link>
        </div>
      </AppShell>
    );
  }

  const existing = applications.find((a) => a.taskId === task.id && a.freelancerId === user.id);

  if (existing) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md py-16 text-center">
          <h1 className="font-display text-xl font-semibold">You've already applied</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The client will see your application when they review this task.
          </p>
          <Link
            to="/tasks/$taskId"
            params={{ taskId: task.id }}
            className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
          >
            Back to the task
          </Link>
        </div>
      </AppShell>
    );
  }

  if (task.status !== "open") {
    return (
      <AppShell>
        <div className="mx-auto max-w-md py-16 text-center">
          <h1 className="font-display text-xl font-semibold">This task is no longer open</h1>
          <p className="mt-2 text-sm text-muted-foreground">It isn't accepting new applications.</p>
          <Link
            to="/tasks/$taskId"
            params={{ taskId: task.id }}
            className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
          >
            Back to the task
          </Link>
        </div>
      </AppShell>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: FieldErrors = {};
    if (coverLetter.trim().length < 40)
      next.coverLetter = "Tell the client how you'd approach the work (at least 40 characters)";
    const price = Number(proposedPrice);
    if (!proposedPrice || Number.isNaN(price) || price <= 0)
      next.proposedPrice = "Enter your proposed price in ₹";
    const days = Number(deliveryDays);
    if (!deliveryDays || Number.isNaN(days) || days < 1)
      next.deliveryDays = "Enter whole days (1 or more)";
    const skillList = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!skillList.length) next.skills = "Add at least one skill";
    setErrors(next);
    if (Object.keys(next).length) return;

    const application = applyToTask({
      taskId: task.id,
      coverLetter: coverLetter.trim(),
      proposedPrice: price,
      deliveryDays: Math.floor(days),
      skills: skillList,
    });
    if (!application) {
      toast.error("You've already applied to this task.");
      return;
    }
    toast.success("Application sent — the client will review it.");
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

      <div className="mx-auto mt-4 max-w-2xl">
        <div className="surface-raised rounded-2xl border border-border bg-card p-5">
          <h1 className="font-display text-xl font-bold leading-snug">{task.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatBudget(task)} · due {formatDate(task.deadline)} · posted by {task.clientName}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          <div>
            <label htmlFor="coverLetter" className="mb-1.5 block text-sm font-medium">
              Cover letter
            </label>
            <textarea
              id="coverLetter"
              rows={6}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className={inputClass}
              placeholder="How will you approach this task? Mention relevant experience and anything the client should know."
            />
            {errors.coverLetter ? (
              <p className="mt-1 text-xs text-destructive">{errors.coverLetter}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="proposedPrice" className="mb-1.5 block text-sm font-medium">
                Your price (₹{task.budgetType === "hourly" ? " / hr" : ""})
              </label>
              <input
                id="proposedPrice"
                type="number"
                min={1}
                inputMode="numeric"
                value={proposedPrice}
                onChange={(e) => setProposedPrice(e.target.value)}
                className={inputClass}
                placeholder={String(task.budgetMin)}
              />
              {errors.proposedPrice ? (
                <p className="mt-1 text-xs text-destructive">{errors.proposedPrice}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="deliveryDays" className="mb-1.5 block text-sm font-medium">
                Delivery time (days)
              </label>
              <input
                id="deliveryDays"
                type="number"
                min={1}
                inputMode="numeric"
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(e.target.value)}
                className={inputClass}
                placeholder="5"
              />
              {errors.deliveryDays ? (
                <p className="mt-1 text-xs text-destructive">{errors.deliveryDays}</p>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="skills" className="mb-1.5 block text-sm font-medium">
              Your relevant skills <span className="font-normal text-muted-foreground">(comma separated)</span>
            </label>
            <input
              id="skills"
              value={skills}
              onChange={(e) => {
                setSkillsTouched(true);
                setSkills(e.target.value);
              }}
              className={inputClass}
              placeholder="Figma, Typography, Brand layout systems"
            />
            {errors.skills ? <p className="mt-1 text-xs text-destructive">{errors.skills}</p> : null}
          </div>

          <button
            type="submit"
            className="gradient-primary inline-flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Send className="size-4" aria-hidden /> Send application
          </button>
          <p className="text-center text-xs text-muted-foreground">
            You can apply to each task once. The client compares applications side by side.
          </p>
        </form>
      </div>
    </AppShell>
  );
}
