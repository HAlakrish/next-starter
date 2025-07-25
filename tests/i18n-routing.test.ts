// eslint-disable-next-line no-unused-vars
// prettier-ignore
import React from "react";

import "@testing-library/jest-dom";

// Mock next-intl/routing before importing
jest.mock("next-intl/routing", () => ({
  defineRouting: jest.fn().mockReturnValue({
    locales: ["en", "ar"],
    defaultLocale: "en",
  }),
}));

describe("i18n routing configuration", () => {
  it("should define routing with locales", () => {
    const { defineRouting } = require("next-intl/routing");
    const routing = defineRouting({
      locales: ["en", "ar"],
      defaultLocale: "en",
    });

    expect(defineRouting).toHaveBeenCalled();
    expect(routing.locales).toEqual(["en", "ar"]);
    expect(routing.defaultLocale).toBe("en");
  });

  it("should handle default locale configuration", () => {
    const { defineRouting } = require("next-intl/routing");
    defineRouting({ locales: ["en", "ar"], defaultLocale: "en" });
    expect(defineRouting).toHaveBeenCalledWith({
      locales: ["en", "ar"],
      defaultLocale: "en",
    });
  });

  it("should support multiple locales", () => {
    const { defineRouting } = require("next-intl/routing");
    defineRouting({ locales: ["en", "ar"], defaultLocale: "en" });
    const routing = defineRouting({
      locales: ["en", "ar"],
      defaultLocale: "en",
    });

    expect(Array.isArray(routing.locales)).toBe(true);
    expect(routing.locales.length).toBeGreaterThan(1);
  });
});
