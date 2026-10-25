import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { SEED_APPLICATIONS, SEED_TASKS } from "./seed";
import type { Application, Profile, Role, Task, User } from "./types";

/**
 * Phase 1 placeholder store. All data lives in the browser (localStorage) so
 * the full navigation and flows work today; swapping this module for a
 * Supabase-backed API later should not require changes to the pages.
 */
const STORAGE_KEY = "opspilot:store:v1";

interface StoreState {
  user: User | null;
  tasks: Task[];
  applications: Application[];
  profile: Profile | null;
}

interface StoreApi extends StoreState {
  signUp: (input: { name: string; email: string; role: Role }) => User;
  signIn: (input: { email: string; role: Role }) => User;
  signOut: () => void;
  createTask: (input: Omit<Task, "id" | "clientId" | "clientName" | "postedAt" | "status">) => Task;
  applyToTask: (
    input: Pick<Application, "taskId" | "coverLetter" | "proposedPrice" | "deliveryDays" | "skills">,
  ) => Application | null;
  selectApplication: (applicationId: string) => void;
  updateTaskStatus: (taskId: string, status: Task["status"]) => void;
  updateProfile: (profile: Profile) => void;
}

const EMPTY_PROFILE: Profile = { headline: "", bio: "", skills: [], portfolio: [] };

function seedState(): StoreState {
  return { user: null, tasks: SEED_TASKS, applications: SEED_APPLICATIONS, profile: null };
}

function loadState(): StoreState {
  if (typeof window === "undefined") return seedState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw) as Partial<StoreState>;
    // Seed tasks are always present; persisted user-created rows are merged on top.
    const persistedTasks = parsed.tasks ?? [];
    const persistedApps = parsed.applications ?? [];
    const seedTaskIds = new Set(SEED_TASKS.map((t) => t.id));
    return {
      user: parsed.user ?? null,
      tasks: [...SEED_TASKS, ...persistedTasks.filter((t) => !seedTaskIds.has(t.id))],
      applications: persistedApps.length ? persistedApps : SEED_APPLICATIONS,
      profile: parsed.profile ?? null,
    };
  } catch {
    return seedState();
  }
}

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(seedState);

  // Restore persisted data after hydration so SSR and first client render match.
  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage may be unavailable (private mode); the app still works in-memory.
    }
  }, [state]);

  const api = useMemo<StoreApi>(() => {
    const withTask = (taskId: string, fn: (task: Task) => Task) =>
      setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === taskId ? fn(t) : t)) }));

    return {
      ...state,

      signUp({ name, email, role }) {
        const user: User = {
          id: role === "client" ? "demo-client" : `fl-${crypto.randomUUID()}`,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role,
        };
        setState((s) => ({ ...s, user, profile: role === "freelancer" ? s.profile ?? EMPTY_PROFILE : s.profile }));
        return user;
      },

      signIn({ email, role }) {
        const user: User = {
          id: role === "client" ? "demo-client" : `fl-${crypto.randomUUID()}`,
          name: email.split("@")[0].replace(/[._-]+/g, " "),
          email: email.trim().toLowerCase(),
          role,
        };
        setState((s) => ({ ...s, user, profile: role === "freelancer" ? s.profile ?? EMPTY_PROFILE : s.profile }));
        return user;
      },

      signOut() {
        setState((s) => ({ ...s, user: null }));
      },

      createTask(input) {
        const task: Task = {
          ...input,
          id: `task-${crypto.randomUUID()}`,
          clientId: "demo-client",
          clientName: "You",
          postedAt: new Date().toISOString(),
          status: "open",
        };
        setState((s) => ({ ...s, tasks: [task, ...s.tasks] }));
        return task;
      },

      applyToTask(input) {
        const user = state.user;
        if (!user || user.role !== "freelancer") return null;
        if (state.applications.some((a) => a.taskId === input.taskId && a.freelancerId === user.id)) return null;
        const application: Application = {
          ...input,
          id: `app-${crypto.randomUUID()}`,
          freelancerId: user.id,
          freelancerName: user.name || "Freelancer",
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        setState((s) => ({ ...s, applications: [application, ...s.applications] }));
        return application;
      },

      selectApplication(applicationId) {
        setState((s) => {
          const target = s.applications.find((a) => a.id === applicationId);
          if (!target) return s;
          return {
            ...s,
            applications: s.applications.map((a) =>
              a.taskId === target.taskId
                ? { ...a, status: a.id === applicationId ? "accepted" : "declined" }
                : a,
            ),
            tasks: s.tasks.map((t) =>
              t.id === target.taskId
                ? { ...t, status: "assigned", selectedApplicationId: applicationId }
                : t,
            ),
          };
        });
      },

      updateTaskStatus(taskId, status) {
        withTask(taskId, (t) => ({ ...t, status }));
      },

      updateProfile(profile) {
        setState((s) => ({ ...s, profile }));
      },
    };
  }, [state]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
