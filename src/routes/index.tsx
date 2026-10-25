import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  Flag,
  FileText,
  Handshake,
  MessageSquareWarning,
  Search,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import { AppShell } from "@/components/app-shell";
import { CategoryIcon } from "@/components/category-icon";
import { CATEGORIES } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OpsPilot — Every Task. The Right Talent." },
      {
        name: "description",
        content:
          "Post a task or find work across video, design, web, data, marketing and local services. Compare applications and hire the right talent on OpsPilot.",
      },
      { property: "og:title", content: "OpsPilot — Every Task. The Right Talent." },
      {
        property: "og:description",
        content: "Post a task or find work across six categories: video, design, web, data, marketing and local services.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const STEPS = [
  {
    icon: ClipboardList,
    title: "Post a task",
    description: "Describe the work, set a budget range and deadline, and list the deliverables you expect.",
  },
  {
    icon: Search,
    title: "Compare applications",
    description: "Freelancers apply with their skills, proposed price and delivery time. You review them side by side.",
  },
  {
    icon: Handshake,
    title: "Choose and get it done",
    description: "Select the freelancer you prefer, agree on the details and work directly until delivery.",
  },
];

const TRUST_POINTS = [
  {
    icon: ShieldCheck,
    title: "Clear scope from the start",
    description:
      "Every task lists its budget range, deadline, deliverables and required skills, so both sides know what is being agreed before work starts.",
  },
  {
    icon: MessageSquareWarning,
    title: "Report anything concerning",
    description:
      "A report action is available on every task. Reports are reviewed by the OpsPilot team before further action is taken.",
  },
  {
    icon: BadgeCheck,
    title: "You stay in control",
    description:
      "You choose who to hire based on their applications and profile. OpsPilot never selects a freelancer for you or takes that decision away.",
  },
];

function Landing() {
  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-card">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 size-96 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)" }}
        />
        <div className="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              <Flag className="size-3.5" aria-hidden /> Task marketplace · Phase 1 preview
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] sm:text-5xl">
              Every Task. <span className="text-gradient">The Right Talent.</span>
            </h1>
            <p className="mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
              Post a task or apply your skills. OpsPilot brings businesses, freelancers, students and
              local service providers together across six categories — from video editing to parcel
              delivery.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/tasks"
                className="gradient-primary glow-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Find work <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                to="/tasks/new"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/40"
              >
                Post a task
              </Link>
            </div>
          </div>
          <img
            src={heroImage}
            alt="Task cards connected to freelancer profiles"
            width={1280}
            height={800}
            className="w-full rounded-2xl border border-border/40 object-cover"
          />
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="mt-16 scroll-mt-20">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">What can you get done?</h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Six categories cover the work businesses and individuals post most often.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              to="/tasks"
              search={{ category: category.slug }}
              className="surface-raised rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <CategoryIcon slug={category.slug} className="size-5" />
              </span>
              <h3 className="mt-3 font-display text-base font-semibold">{category.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mt-16 scroll-mt-20">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">How it works</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={step.title} className="surface-raised rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <span className="gradient-primary flex size-9 items-center justify-center rounded-lg text-primary-foreground">
                  <step.icon className="size-4.5" aria-hidden />
                </span>
                <span className="font-display text-sm font-semibold text-muted-foreground">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & safety */}
      <section id="trust-safety" className="mt-16 scroll-mt-20">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Trust &amp; safety</h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Marketplace work goes well when expectations are clear. Here is how OpsPilot helps.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {TRUST_POINTS.map((point) => (
            <div key={point.title} className="surface-raised rounded-2xl border border-border bg-card p-6">
              <point.icon className="size-6 text-primary" aria-hidden />
              <h3 className="mt-3 font-display text-base font-semibold">{point.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{point.description}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-xl text-xs text-muted-foreground">
          Payments are agreed directly between client and freelancer. OpsPilot does not hold funds in
          escrow and does not process payments in this phase.
        </p>
      </section>

      {/* CTA */}
      <section className="mt-16">
        <div className="surface-raised relative overflow-hidden rounded-3xl border border-primary/30 bg-card p-8 text-center sm:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              background:
                "radial-gradient(600px circle at 50% 0%, var(--color-primary) 0%, transparent 70%)",
            }}
          />
          <UserRoundCheck className="mx-auto size-8 text-primary" aria-hidden />
          <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
            Ready to get things done?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Create a free account as a client or freelancer and start in minutes.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/signup"
              className="gradient-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Create account <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              to="/support"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/40"
            >
              <FileText className="size-4" aria-hidden /> Talk to us
            </Link>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
