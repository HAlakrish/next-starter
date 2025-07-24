import { UserRole } from "@/lib/zod";

// Define role-based dashboard routes
export const ROLE_DASHBOARDS = {
  admin: "/dashboard/admin",
  manager: "/dashboard/manager",
  user: "/", // Regular users go to homepage
} as const;

// Define role-based protected routes
export const ROLE_ROUTES = {
  admin: ["/dashboard"], // Admin can access all dashboard routes
  manager: ["/dashboard"], // Manager can access dashboard routes
  user: ["/"], // User only has access to homepage
} as const;

export function getDashboardByRole(role: UserRole): string {
  return ROLE_DASHBOARDS[role] || ROLE_DASHBOARDS.user;
}

export function canAccessRoute(userRole: UserRole, route: string): boolean {
  // Admin can access all dashboard routes
  if (userRole === "admin" && route.startsWith("/dashboard")) {
    return true;
  }

  // Manager can access manager dashboard and below
  if (
    userRole === "manager" &&
    (route === "/dashboard" || route.startsWith("/dashboard/manager"))
  ) {
    return true;
  }

  // Regular users can't access dashboard routes
  if (userRole === "user" && route.startsWith("/dashboard")) {
    return false;
  }

  return true; // Allow access to non-dashboard routes
}

export function getHighestAccessibleRoute(userRole: UserRole): string {
  return getDashboardByRole(userRole);
}
