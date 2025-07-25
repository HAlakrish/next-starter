// eslint-disable-next-line no-unused-vars
// prettier-ignore
import React from "react";

import "@testing-library/jest-dom";
import { renderHook } from "@testing-library/react";
import { useTheme } from "next-themes";

import useSystemTheme from "../src/hooks/useSystemTheme";

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

describe("useSystemTheme", () => {
  it("returns theme when not system", () => {
    mockUseTheme.mockReturnValue({
      theme: "dark",
      setTheme: jest.fn(),
      systemTheme: "light",
      themes: ["light", "dark"],
      forcedTheme: undefined,
      resolvedTheme: "dark",
    } as any);

    const { result } = renderHook(() => useSystemTheme());
    expect(result.current.theme).toBe("dark");
  });

  it("returns systemTheme when theme is system", () => {
    mockUseTheme.mockReturnValue({
      theme: "system",
      setTheme: jest.fn(),
      systemTheme: "dark",
      themes: ["light", "dark"],
      forcedTheme: undefined,
      resolvedTheme: "dark",
    } as any);

    const { result } = renderHook(() => useSystemTheme());
    expect(result.current.theme).toBe("dark");
  });

  it("returns setTheme function", () => {
    const mockSetTheme = jest.fn();
    mockUseTheme.mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
      systemTheme: "dark",
      themes: ["light", "dark"],
      forcedTheme: undefined,
      resolvedTheme: "light",
    } as any);

    const { result } = renderHook(() => useSystemTheme());
    expect(result.current.setTheme).toBe(mockSetTheme);
  });

  it("handles undefined systemTheme", () => {
    mockUseTheme.mockReturnValue({
      theme: "system",
      setTheme: jest.fn(),
      systemTheme: undefined,
      themes: ["light", "dark"],
      forcedTheme: undefined,
      resolvedTheme: undefined,
    } as any);

    const { result } = renderHook(() => useSystemTheme());
    expect(result.current.theme).toBeUndefined();
  });
});
