import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

const PHASE_ONE_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/tasks",
  "/tasks/new",
  "/tasks/task-1",
  "/tasks/task-1/apply",
  "/tasks/task-1/applicants",
  "/client",
  "/profile",
  "/report",
  "/support",
];

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches every Phase 1 page", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    for (const path of PHASE_ONE_ROUTES) {
      const matches = router.matchRoutes(path);
      expect(matches.at(-1)?.routeId, `expected a page at ${path}`).not.toBe(rootRouteId);
    }
  });
});
