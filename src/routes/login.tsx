import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { RolePicker } from "@/components/role-picker";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in · OpsPilot" },
      { name: "description", content: "Sign in to OpsPilot to post tasks or find work." },
      { property: "og:title", content: "Sign in · OpsPilot" },
      { property: "og:description", content: "Sign in to OpsPilot to post tasks or find work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LogIn,
});

function LogIn() {
  const { signIn } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email address";
    if (!password) next.password = "Enter your password";
    if (!role) next.role = "Choose how you'll use OpsPilot";
    setErrors(next);
    if (Object.keys(next).length) return;

    const user = signIn({ email, role: role! });
    toast.success(`Signed in as ${user.name}`);
    navigate({ to: user.role === "client" ? "/client" : "/tasks" });
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-md py-6">
        <h1 className="font-display text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to continue on OpsPilot.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
              placeholder="you@example.com"
            />
            {errors.email ? <p className="mt-1 text-xs text-destructive">{errors.email}</p> : null}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
            />
            {errors.password ? <p className="mt-1 text-xs text-destructive">{errors.password}</p> : null}
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium">I'm signing in as</span>
            <RolePicker value={role} onChange={setRole} />
            {errors.role ? <p className="mt-1 text-xs text-destructive">{errors.role}</p> : null}
          </div>

          <button
            type="submit"
            className="gradient-primary w-full rounded-lg py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Sign in
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Phase 1 preview: sign-in is local to this device and doesn't verify passwords yet.
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to OpsPilot?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
