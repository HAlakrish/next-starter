import { NextRequest } from "next/server";

import { GET, PATCH, POST } from "../src/app/api/users/route";

// Mock Next.js server APIs first
jest.mock("next/server", () => ({
  NextRequest: jest
    .fn()
    .mockImplementation((url: string, options: any = {}) => ({
      url,
      method: options.method || "GET",
      headers: new Map(Object.entries(options.headers || {})),
      json: jest.fn().mockResolvedValue({}),
    })),
  NextResponse: {
    json: jest.fn().mockImplementation((data: any, init?: any) => ({
      json: () => Promise.resolve(data),
      status: init?.status || 200,
    })),
  },
}));

// Mock the auth function to simulate different user roles
jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));
const { auth } = require("@/auth");

function createRequest(method: string, body?: any) {
  return {
    method,
    json: async () => body,
    nextUrl: { pathname: "/" },
  } as unknown as NextRequest;
}

describe("users API", () => {
  beforeEach(() => {
    // Reset users array for each test
    jest.resetModules();
  });

  describe("GET", () => {
    it("returns 403 if not admin", async () => {
      auth.mockResolvedValue({ user: { role: "user" } });
      const res = await GET(createRequest("GET"));
      expect(res.status).toBe(403);
    });
    it("returns users if admin", async () => {
      auth.mockResolvedValue({ user: { role: "admin" } });
      const res = await GET(createRequest("GET"));
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe("POST", () => {
    it("allows unauthenticated user to create user", async () => {
      auth.mockResolvedValue(null);
      const req = createRequest("POST", {
        email: "new@example.com",
        role: "user",
      });
      const res = await POST(req);
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.email).toBe("new@example.com");
      expect(data.role).toBe("user");
    });
    it("prevents unauthenticated user from creating admin", async () => {
      auth.mockResolvedValue(null);
      const req = createRequest("POST", {
        email: "bad@example.com",
        role: "admin",
      });
      const res = await POST(req);
      expect(res.status).toBe(403);
    });
    it("prevents duplicate email", async () => {
      auth.mockResolvedValue(null);
      const req1 = createRequest("POST", {
        email: "dup@example.com",
        role: "user",
      });
      await POST(req1);
      const req2 = createRequest("POST", {
        email: "dup@example.com",
        role: "user",
      });
      const res = await POST(req2);
      expect(res.status).toBe(409);
    });
    it("admin can create manager", async () => {
      auth.mockResolvedValue({ user: { role: "admin" } });
      const req = createRequest("POST", {
        email: "mgr@example.com",
        role: "manager",
      });
      const res = await POST(req);
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.role).toBe("manager");
    });
    it("admin cannot create admin", async () => {
      auth.mockResolvedValue({ user: { role: "admin" } });
      const req = createRequest("POST", {
        email: "admin2@example.com",
        role: "admin",
      });
      const res = await POST(req);
      expect(res.status).toBe(403);
    });
    it("manager cannot create users", async () => {
      auth.mockResolvedValue({ user: { role: "manager" } });
      const req = createRequest("POST", {
        email: "user2@example.com",
        role: "user",
      });
      const res = await POST(req);
      expect(res.status).toBe(403);
    });
  });

  describe("PATCH", () => {
    it("forbids non-admin", async () => {
      auth.mockResolvedValue({ user: { role: "user" } });
      const req = createRequest("PATCH", { id: "1", email: "new@email.com" });
      const res = await PATCH(req);
      expect(res.status).toBe(403);
    });
    it("admin can update email", async () => {
      auth.mockResolvedValue({ user: { role: "admin" } });
      const req = createRequest("PATCH", {
        id: "1",
        email: "updated@email.com",
      });
      const res = await PATCH(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.email).toBe("updated@email.com");
    });
    it("admin cannot change password", async () => {
      auth.mockResolvedValue({ user: { role: "admin" } });
      const req = createRequest("PATCH", {
        id: "1",
        email: "updated@email.com",
        password: "pw",
      });
      const res = await PATCH(req);
      expect(res.status).toBe(403);
    });
    it("returns 404 if user not found", async () => {
      auth.mockResolvedValue({ user: { role: "admin" } });
      const req = createRequest("PATCH", {
        id: "999",
        email: "notfound@email.com",
      });
      const res = await PATCH(req);
      expect(res.status).toBe(404);
    });
  });
});
