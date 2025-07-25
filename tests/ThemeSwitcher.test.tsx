// eslint-disable-next-line no-unused-vars
// prettier-ignore
import React from "react";

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useTheme } from "next-themes";

import { ThemeSwitcher } from "../src/components/ThemeSwitcher";
import useSystemTheme from "../src/hooks/useSystemTheme";

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

// Mock the custom hook
jest.mock("../src/hooks/useSystemTheme", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;
const mockUseSystemTheme = useSystemTheme as jest.MockedFunction<
  typeof useSystemTheme
>;

describe("ThemeSwitcher", () => {
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dark mode switch", () => {
    mockUseSystemTheme.mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    render(<ThemeSwitcher />);
    expect(screen.getByText("Dark mode")).toBeInTheDocument();
  });

  it("shows correct state for light theme", () => {
    mockUseSystemTheme.mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    render(<ThemeSwitcher />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).not.toBeChecked();
  });

  it("shows correct state for dark theme", () => {
    mockUseSystemTheme.mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
    });

    render(<ThemeSwitcher />);
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeChecked();
  });
});
