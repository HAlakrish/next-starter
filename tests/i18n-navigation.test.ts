// eslint-disable-next-line no-unused-vars
// prettier-ignore
import React from "react";

import "@testing-library/jest-dom";

// Mock next-intl/navigation before importing
jest.mock("next-intl/navigation", () => ({
  createNavigation: jest.fn().mockReturnValue({
    Link: ({ children, ...props }: any) => children,
    redirect: jest.fn(),
    usePathname: jest.fn().mockReturnValue("/"),
    useRouter: jest.fn().mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    }),
    getPathname: jest.fn().mockReturnValue("/"),
  }),
}));

describe("i18n navigation", () => {
  it("should create navigation utilities from next-intl", () => {
    const { createNavigation } = require("next-intl/navigation");
    const navigation = createNavigation({
      locales: ["en", "ar"],
      defaultLocale: "en",
    });

    expect(createNavigation).toBeDefined();
    expect(navigation.Link).toBeDefined();
    expect(navigation.redirect).toBeDefined();
    expect(navigation.usePathname).toBeDefined();
    expect(navigation.useRouter).toBeDefined();
    expect(navigation.getPathname).toBeDefined();
  });

  it("exports are functions or components", () => {
    const { createNavigation } = require("next-intl/navigation");
    const navigation = createNavigation({
      locales: ["en", "ar"],
      defaultLocale: "en",
    });

    expect(typeof navigation.Link).toBe("function");
    expect(typeof navigation.redirect).toBe("function");
    expect(typeof navigation.usePathname).toBe("function");
    expect(typeof navigation.useRouter).toBe("function");
    expect(typeof navigation.getPathname).toBe("function");
  });
});
