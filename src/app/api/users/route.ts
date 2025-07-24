import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { Session } from "@/types/session";

// Mock user store (in-memory)
let users = [
  { id: "1", email: "admin@example.com", role: "admin" },
  { id: "2", email: "manager@example.com", role: "manager" },
  { id: "3", email: "user@example.com", role: "user" },
];

// Helper: get role from session
function getRole(session: Session | null) {
  return session?.user?.role || "user";
}

// Helper: check if email exists
function emailExists(email: string) {
  return users.some((u) => u.email === email);
}

// GET: List all users (admin only)
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || getRole(session) !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json(users);
}

// POST: Create user
export async function POST(request: NextRequest) {
  const session = await auth();
  const role = getRole(session);
  const body = await request.json();
  const { email, role: newRole } = body;

  // Only allow unauthenticated or admin to create users
  if (!session) {
    // Only allow creating 'user' accounts if not logged in
    if (newRole && newRole !== "user") {
      return NextResponse.json(
        { error: "Only user accounts can be created anonymously." },
        { status: 403 }
      );
    }
    if (emailExists(email)) {
      return NextResponse.json(
        { error: "Email already exists." },
        { status: 409 }
      );
    }
    const newUser = { id: String(users.length + 1), email, role: "user" };
    users.push(newUser);
    return NextResponse.json(newUser, { status: 201 });
  }

  // Only admin can create manager or user accounts
  if (role === "admin") {
    if (newRole === "admin") {
      return NextResponse.json(
        { error: "Admins cannot create other admins." },
        { status: 403 }
      );
    }
    if (newRole !== "manager" && newRole !== "user") {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }
    if (emailExists(email)) {
      return NextResponse.json(
        { error: "Email already exists." },
        { status: 409 }
      );
    }
    const newUser = { id: String(users.length + 1), email, role: newRole };
    users.push(newUser);
    return NextResponse.json(newUser, { status: 201 });
  }

  // Managers cannot create users or admins
  if (role === "manager") {
    return NextResponse.json(
      { error: "Managers cannot create users or admins." },
      { status: 403 }
    );
  }

  // Other roles forbidden
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// PATCH: Update user email (admin only)
export async function PATCH(request: NextRequest) {
  const session = await auth();
  const role = getRole(session);
  const body = await request.json();
  const { id, email, password } = body;

  if (!session || role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Admin can only update email, not password
  if (password) {
    return NextResponse.json(
      { error: "Admins cannot change passwords." },
      { status: 403 }
    );
  }

  const user = users.find((u) => u.id === id);
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }
  user.email = email;
  return NextResponse.json(user);
}
