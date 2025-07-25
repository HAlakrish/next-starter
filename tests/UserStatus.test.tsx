// eslint-disable-next-line no-unused-vars
// prettier-ignore
import { useParams, useRouter } from 'next/navigation';
import React from "react";

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";

import { UserStatus } from "../src/components/UserStatus";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

// Mock auth actions
jest.mock("@/lib/actions/auth", () => ({
  signOutAction: jest.fn(),
}));

const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

describe("UserStatus", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush } as any);
    mockUseParams.mockReturnValue({ locale: "en" });
  });

  it("shows loading state", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "loading",
      update: jest.fn(),
    } as any);

    render(<UserStatus />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows signed in user info", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          email: "test@example.com",
        },
      },
      status: "authenticated",
      update: jest.fn(),
    } as any);

    render(<UserStatus />);
    expect(
      screen.getByText("Signed in as: test@example.com")
    ).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Sign Out")).toBeInTheDocument();
  });

  it("shows Sign in Button when not authenticated", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: jest.fn(),
    } as any);

    const { container } = render(<UserStatus />);
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });
});
