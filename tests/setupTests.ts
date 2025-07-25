import "@testing-library/jest-dom";

// Mock next-intl modules
jest.mock("next-intl/routing", () => ({
  defineRouting: jest.fn().mockReturnValue({
    locales: ["en", "ar"],
    defaultLocale: "en",
  }),
}));

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
  }),
}));
