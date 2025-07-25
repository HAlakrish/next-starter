import type { UserRole } from "../src/lib/zod";
import {
  canAccessRoute,
  getDashboardByRole,
  getHighestAccessibleRoute,
} from "../src/utils/role-utils";

describe("role-utils", () => {
  describe("getDashboardByRole", () => {
    it("returns correct dashboard for admin", () => {
      expect(getDashboardByRole("admin")).toBe("/dashboard/admin");
    });
    it("returns correct dashboard for manager", () => {
      expect(getDashboardByRole("manager")).toBe("/dashboard/manager");
    });
    it("returns correct dashboard for user", () => {
      expect(getDashboardByRole("user")).toBe("/");
    });
    it("returns user dashboard for unknown role", () => {
      // @ts-expect-error: testing fallback
      expect(getDashboardByRole("unknown")).toBe("/");
    });
  });

  describe("canAccessRoute", () => {
    it("admin can access admin dashboard", () => {
      expect(canAccessRoute("admin", "/dashboard/admin")).toBe(true);
    });
    it("manager can access manager dashboard", () => {
      expect(canAccessRoute("manager", "/dashboard/manager")).toBe(true);
    });
    it("user cannot access dashboard", () => {
      expect(canAccessRoute("user", "/dashboard")).toBe(false);
      expect(canAccessRoute("user", "/dashboard/manager")).toBe(false);
    });
    it("user can access home", () => {
      expect(canAccessRoute("user", "/")).toBe(true);
    });
    it("admin can access non-dashboard route", () => {
      expect(canAccessRoute("admin", "/about")).toBe(true);
    });
  });

  describe("getHighestAccessibleRoute", () => {
    it("returns correct dashboard for each role", () => {
      const roles: UserRole[] = ["admin", "manager", "user"];
      expect(roles.map(getHighestAccessibleRoute)).toEqual([
        "/dashboard/admin",
        "/dashboard/manager",
        "/",
      ]);
    });
  });
});
