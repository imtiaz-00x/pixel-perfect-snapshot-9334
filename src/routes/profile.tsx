import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Save, Trash2, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell, SignInPrompt } from "@/components/app-shell";
import { useStore } from "@/lib/store";
import type { PortfolioItem } from "@/lib/types";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile · OpsPilot" },
      { name: "description", content: "Set up your freelancer profile: headline, bio, skills and portfolio." },
      { property: "og:title", content: "Profile · OpsPilot" },
      { property: "og:description", content: "Set up your freelancer profile and portfolio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

const inputClass =
  "w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary";

function ProfilePage() {
  const { user, profile, updateProfile } = useStore();
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  // Load the saved profile once the store hydrates (and on account switch).
  useEffect(() => {
    if (!user) return;
    setHeadline(profile?.headline ?? "");
    setBio(profile?.bio ?? "");
    setSkills(profile?.skills.join(", ") ?? "");
    setPortfolio(profile?.portfolio ?? []);
  }, [user, profile]);

  if (!user) {
    return (
      <AppShell>
        <h1 className="font-display text-2xl font-bold">Profile</h1>
        <SignInPrompt message="Sign in to set up your profile." />
      </AppShell>
    );
  }

  if (user.role === "client") {
    return (
      <AppShell>
        <div className="mx-auto max-w-md">
          <h1 className="font-display text-2xl font-bold">Profile</h1>
          <div className="surface-raised mt-6 rounded-2xl border border-border bg-card p-6 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <UserRound className="size-6" aria-hidden />
            </span>
            <h2 className="mt-3 font-display text-lg font-semibold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <span className="mt-3 inline-block rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold">
              Client
            </span>
            <p className="mt-4 text-xs text-muted-foreground">
              Client accounts don't need a freelancer profile. Your name shows on the tasks you post.
            </p>
            <Link
              to="/client"
              className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
            >
              Go to my tasks
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    const cleaned = portfolio
      .map((item) => ({
        ...item,
        title: item.title.trim(),
        description: item.description.trim(),
        link: item.link.trim(),
      }))
      .filter((item) => item.title || item.link);
    updateProfile({
      headline: headline.trim(),
      bio: bio.trim(),
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      portfolio: cleaned,
    });
    toast.success("Profile saved");
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-bold">Your profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Clients see this alongside your applications — keep it specific.
        </p>

        <form onSubmit={save} className="mt-8 space-y-6" noValidate>
          <div>
            <label htmlFor="headline" className="mb-1.5 block text-sm font-medium">
              Headline
            </label>
            <input
              id="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className={inputClass}
              placeholder="e.g. Video editor for launch-ready teasers"
            />
          </div>

          <div>
            <label htmlFor="bio" className="mb-1.5 block text-sm font-medium">
              About you
            </label>
            <textarea
              id="bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={inputClass}
              placeholder="A short paragraph about your experience and how you work."
            />
          </div>

          <div>
            <label htmlFor="skills" className="mb-1.5 block text-sm font-medium">
              Skills <span className="font-normal text-muted-foreground">(comma separated)</span>
            </label>
            <input
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className={inputClass}
              placeholder="DaVinci Resolve, Motion text, Colour grading"
            />
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium">Portfolio</span>
            <div className="space-y-3">
              {portfolio.map((item, index) => (
                <div key={item.id} className="rounded-xl border border-border bg-background/40 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Item {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPortfolio(portfolio.filter((p) => p.id !== item.id))}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                      aria-label={`Remove item ${index + 1}`}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </div>
                  <input
                    value={item.title}
                    onChange={(e) =>
                      setPortfolio(
                        portfolio.map((p) => (p.id === item.id ? { ...p, title: e.target.value } : p)),
                      )
                    }
                    placeholder="Project title"
                    className={`${inputClass} mt-2`}
                  />
                  <input
                    value={item.link}
                    onChange={(e) =>
                      setPortfolio(
                        portfolio.map((p) => (p.id === item.id ? { ...p, link: e.target.value } : p)),
                      )
                    }
                    placeholder="https://link-to-your-work"
                    className={`${inputClass} mt-2`}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setPortfolio([
                    ...portfolio,
                    { id: `pf-${crypto.randomUUID()}`, title: "", description: "", link: "" },
                  ])
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
              >
                <Plus className="size-4" aria-hidden /> Add portfolio item
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="gradient-primary inline-flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Save className="size-4" aria-hidden /> Save profile
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Phase 1 preview: your profile is stored on this device only.
          </p>
        </form>
      </div>
    </AppShell>
  );
}
