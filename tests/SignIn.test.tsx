// eslint-disable-next-line no-unused-vars
// prettier-ignore
import { useParams } from 'next/navigation';
import React from "react";
import { useActionState } from "react";

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useTranslations } from "next-intl";

import { SignIn } from "../src/components/sign-in";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}));

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: jest.fn(),
}));

// Mock auth actions
jest.mock("@/lib/actions/auth", () => ({
  authenticate: jest.fn(),
}));

// Mock useActionState
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useActionState: jest.fn(),
}));

const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockUseTranslations = useTranslations as jest.MockedFunction<
  typeof useTranslations
>;
const mockUseActionState = useActionState as jest.MockedFunction<
  typeof useActionState
>;

describe("SignIn", () => {
  const mockDispatch = jest.fn();
  const mockT = jest.fn((key: string) => key) as any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ locale: "en" });
    mockUseTranslations.mockReturnValue(mockT);
    mockUseActionState.mockReturnValue([undefined, mockDispatch, false] as any);
  });

  it("renders sign in form", () => {
    render(<SignIn />);
    expect(screen.getByText("email")).toBeInTheDocument();
    expect(screen.getByText("password")).toBeInTheDocument();
  });

  it("renders form inputs with required attributes", () => {
    render(<SignIn />);

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("name", "email");
    expect(emailInput).toBeRequired();

    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toHaveAttribute("name", "password");
  });

  it("shows error message when present", () => {
    mockUseActionState.mockReturnValue([
      "Invalid credentials",
      mockDispatch,
      false,
    ] as any);

    render(<SignIn />);
    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("calls translation function with correct keys", () => {
    render(<SignIn />);

    expect(mockT).toHaveBeenCalledWith("signIn");
    expect(mockT).toHaveBeenCalledWith("email");
    expect(mockT).toHaveBeenCalledWith("password");
    expect(mockT).toHaveBeenCalledWith("enterEmail");
  });
});
