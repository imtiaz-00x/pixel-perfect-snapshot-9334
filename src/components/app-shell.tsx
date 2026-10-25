import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { useStore } from "@/lib/store";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="gradient-primary glow-primary flex size-8 items-center justify-center rounded-lg text-sm font-bold text-primary-foreground">
        O
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">OpsPilot</span>
    </Link>
  );
}

const NAV = {
  freelancer: [
    { to: "/tasks", label: "Browse tasks" },
    { to: "/profile", label: "Profile" },
    { to: "/support", label: "Support" },
  ],
  client: [
    { to: "/client", label: "My tasks" },
    { to: "/tasks/new", label: "Post a task" },
    { to: "/tasks", label: "Browse" },
    { to: "/support", label: "Support" },
  ],
} as const;

function MobileNav() {
  const { user } = useStore();
  const items = user
    ? user.role === "client"
      ? [
          { to: "/client", label: "Tasks", icon: "clipboard" },
          { to: "/tasks/new", label: "Post", icon: "plus" },
          { to: "/tasks", label: "Browse", icon: "search" },
          { to: "/profile", label: "Profile", icon: "user" },
        ]
      : [
          { to: "/tasks", label: "Browse", icon: "search" },
          { to: "/profile", label: "Profile", icon: "user" },
          { to: "/support", label: "Support", icon: "help" },
        ]
    : [
        { to: "/tasks", label: "Browse", icon: "search" },
        { to: "/login", label: "Sign in", icon: "user" },
        { to: "/signup", label: "Join", icon: "plus" },
      ];
  return null; // replaced below by concrete icons component
}

import { Briefcase, CircleUserRound, HelpCircle, LayoutDashboard, PlusCircle, Search } from "lucide-react";

function BottomTab({ to, label, icon }: { to: string; label: string; icon: ReactNode }) {
  return (
    <Link
      to={to}
      className="flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium text-muted-foreground transition-colors active:text-primary [&.active]:text-primary"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useStore();
  const nav = user ? NAV[user.role] : [{ to: "/tasks", label: "Browse tasks" }];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "text-foreground bg-secondary" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  {user.name} · {user.role === "client" ? "Client" : "Freelancer"}
                </span>
                <button
                  onClick={signOut}
                  className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="gradient-primary rounded-md px-3 py-1.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 md:pb-16">{children}</main>

      <footer className="hidden border-t border-border/60 py-8 text-center text-xs text-muted-foreground md:block">
        OpsPilot — Every Task. The Right Talent. · Phase 1 preview
      </footer>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border/60 bg-card/95 backdrop-blur-md md:hidden">
        {user?.role === "client" ? (
          <>
            <BottomTab to="/client" label="Tasks" icon={<LayoutDashboard className="size-5" />} />
            <BottomTab to="/tasks/new" label="Post" icon={<PlusCircle className="size-5" />} />
            <BottomTab to="/tasks" label="Browse" icon={<Search className="size-5" />} />
            <BottomTab to="/profile" label="Profile" icon={<CircleUserRound className="size-5" />} />
          </>
        ) : user?.role === "freelancer" ? (
          <>
            <BottomTab to="/tasks" label="Browse" icon={<Briefcase className="size-5" />} />
            <BottomTab to="/profile" label="Profile" icon={<CircleUserRound className="size-5" />} />
            <BottomTab to="/support" label="Support" icon={<HelpCircle className="size-5" />} />
          </>
        ) : (
          <>
            <BottomTab to="/tasks" label="Browse" icon={<Briefcase className="size-5" />} />
            <BottomTab to="/login" label="Sign in" icon={<CircleUserRound className="size-5" />} />
            <BottomTab to="/signup" label="Join" icon={<PlusCircle className="size-5" />} />
          </>
        )}
      </nav>
    </div>
  );
}

export { Logo };

export function SignInPrompt({ message }: { message: string }) {
  return (
    <div className="surface-raised mx-auto mt-10 max-w-md rounded-2xl border border-border bg-card p-8 text-center">
      <h2 className="font-display text-xl font-semibold">Sign in to continue</h2>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          to="/login"
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
        >
          Sign in
        </Link>
        <Link
          to="/signup"
          className="gradient-primary inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Create account <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
