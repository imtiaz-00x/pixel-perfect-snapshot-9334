import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { RolePicker } from "@/components/role-picker";
import { useStore } from "@/lib/store";
import type { Role } from "@/lib/types";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account · OpsPilot" },
      { name: "description", content: "Join OpsPilot as a client or freelancer and get matched with the right tasks." },
      { property: "og:title", content: "Create account · OpsPilot" },
      { property: "og:description", content: "Join OpsPilot as a client or freelancer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignUp,
});

function SignUp() {
  const { signUp } = useStore();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email address";
    if (password.length < 8) next.password = "Password must be at least 8 characters";
    if (!role) next.role = "Choose how you'll use OpsPilot";
    setErrors(next);
    if (Object.keys(next).length) return;

    const user = signUp({ name, email, role: role! });
    toast.success(`Welcome to OpsPilot, ${user.name}!`);
    navigate({ to: user.role === "client" ? "/client" : "/tasks" });
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-md py-6">
        <h1 className="font-display text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Every Task. The Right Talent.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
              Full name
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
              placeholder="Ananya Ghosh"
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
              placeholder="At least 8 characters"
            />
            {errors.password ? <p className="mt-1 text-xs text-destructive">{errors.password}</p> : null}
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium">How will you use OpsPilot?</span>
            <RolePicker value={role} onChange={setRole} />
            {errors.role ? <p className="mt-1 text-xs text-destructive">{errors.role}</p> : null}
          </div>

          <button
            type="submit"
            className="gradient-primary w-full rounded-lg py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Create account
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Phase 1 preview: accounts are stored on this device only. Real accounts arrive with the
            backend integration.
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
