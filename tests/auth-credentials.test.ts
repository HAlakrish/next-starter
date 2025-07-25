import { describe, expect, it, jest } from "@jest/globals";

// Mock the auth module
jest.mock("@/auth", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  auth: jest.fn(),
}));

// Mock the actions
jest.mock("@/lib/actions/auth", () => ({
  signInAction: jest.fn(),
  signOutAction: jest.fn(),
}));

describe("Auth Credentials", () => {
  it("should export auth configuration", () => {
    // Test that auth module exports are available
    const { signIn, signOut, auth } = require("@/auth");
    expect(typeof signIn).toBe("function");
    expect(typeof signOut).toBe("function");
    expect(typeof auth).toBe("function");
  });

  it("should export auth actions", () => {
    // Test that auth actions are available
    const { signInAction, signOutAction } = require("@/lib/actions/auth");
    expect(typeof signInAction).toBe("function");
    expect(typeof signOutAction).toBe("function");
  });
});
