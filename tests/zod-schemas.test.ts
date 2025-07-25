// eslint-disable-next-line no-unused-vars
// prettier-ignore
import React from "react";

import "@testing-library/jest-dom";

import { UserRole, signInSchema, userSchema } from "../src/lib/zod";

describe("Zod Schemas", () => {
  describe("UserRole", () => {
    it("accepts valid roles", () => {
      expect(UserRole.parse("admin")).toBe("admin");
      expect(UserRole.parse("manager")).toBe("manager");
      expect(UserRole.parse("user")).toBe("user");
    });

    it("rejects invalid roles", () => {
      expect(() => UserRole.parse("invalid")).toThrow();
      expect(() => UserRole.parse("")).toThrow();
      expect(() => UserRole.parse(null)).toThrow();
    });
  });

  describe("signInSchema", () => {
    it("validates correct email and password", () => {
      const validData = { email: "test@example.com", password: "password123" };
      expect(signInSchema.parse(validData)).toEqual(validData);
    });

    it("rejects invalid email", () => {
      expect(() =>
        signInSchema.parse({ email: "invalid-email", password: "password" })
      ).toThrow();
      expect(() =>
        signInSchema.parse({ email: "", password: "password" })
      ).toThrow();
    });

    it("rejects empty password", () => {
      expect(() =>
        signInSchema.parse({ email: "test@example.com", password: "" })
      ).toThrow();
    });

    it("rejects missing fields", () => {
      expect(() => signInSchema.parse({ email: "test@example.com" })).toThrow();
      expect(() => signInSchema.parse({ password: "password" })).toThrow();
    });
  });

  describe("userSchema", () => {
    it("validates complete user object", () => {
      const validUser = {
        id: "123",
        email: "test@example.com",
        name: "Test User",
        role: "admin" as const,
      };
      expect(userSchema.parse(validUser)).toEqual(validUser);
    });

    it("validates user without optional name", () => {
      const validUser = {
        id: "123",
        email: "test@example.com",
        role: "user" as const,
      };
      expect(userSchema.parse(validUser)).toEqual(validUser);
    });

    it("rejects invalid email in user", () => {
      const invalidUser = {
        id: "123",
        email: "invalid-email",
        role: "user" as const,
      };
      expect(() => userSchema.parse(invalidUser)).toThrow();
    });

    it("rejects invalid role in user", () => {
      const invalidUser = {
        id: "123",
        email: "test@example.com",
        role: "invalid",
      };
      expect(() => userSchema.parse(invalidUser)).toThrow();
    });
  });
});
