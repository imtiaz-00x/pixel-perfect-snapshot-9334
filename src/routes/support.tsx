import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support · OpsPilot" },
      { name: "description", content: "Get help with posting tasks, applying for work and using OpsPilot." },
      { property: "og:title", content: "Support · OpsPilot" },
      { property: "og:description", content: "Get help with posting tasks, applying for work and using OpsPilot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SupportPage,
});

const FAQS = [
  {
    q: "Is OpsPilot free to use?",
    a: "Yes. Posting tasks and applying for work is free in this phase. You agree on payment directly with the other side.",
  },
  {
    q: "How do I get paid or pay someone?",
    a: "Clients and freelancers settle payment directly using whatever method they agree on. OpsPilot doesn't hold funds in this phase.",
  },
  {
    q: "Can I be both a client and a freelancer?",
    a: "In this preview each account picks one role at sign-in. Choose the role you'll use most for now.",
  },
  {
    q: "How do reports work?",
    a: "Every task has a report action. Reports go to the OpsPilot team for review before any action is taken.",
  },
] as const;

const TOPICS = [
  "Getting started",
  "Posting a task",
  "Applying for work",
  "Payments",
  "Something else",
] as const;

const inputClass =
  "w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary";

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<string>(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Tell us your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = "Enter a valid email address so we can reply";
    if (message.trim().length < 20) next.message = "Describe what you need (at least 20 characters)";
    setErrors(next);
    if (Object.keys(next).length) return;

    toast.success("Message sent — we'll reply to your email.");
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-bold">Support</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Answers to common questions, and a direct line to the team.
        </p>

        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold">Frequently asked</h2>
          <div className="mt-3 space-y-2">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-border bg-card px-4 py-3 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-medium">
                  {faq.q}
                  <ChevronDown
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold">Still stuck?</h2>
          <form onSubmit={handleSubmit} className="mt-3 space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="Your name"
                />
                {errors.name ? <p className="mt-1 text-xs text-destructive">{errors.name}</p> : null}
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                  Email
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
            </div>

            <div>
              <span className="mb-2 block text-sm font-medium">Topic</span>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    aria-pressed={topic === t}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      topic === t
                        ? "border-primary bg-accent text-accent-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={inputClass}
                placeholder="How can we help?"
              />
              {errors.message ? (
                <p className="mt-1 text-xs text-destructive">{errors.message}</p>
              ) : null}
            </div>

            <button
              type="submit"
              className="gradient-primary inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Send className="size-4" aria-hidden /> Send message
            </button>
          </form>
        </section>
      </div>
    </AppShell>
  );
}
