// eslint-disable-next-line no-unused-vars
// prettier-ignore
import React from "react";

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import CardComponent from "../src/components/Card";

jest.mock("../src/components/UserStatus", () => {
  const React = require("react");
  return { UserStatus: () => <div>UserStatus</div> };
});
jest.mock("../src/components/ThemeSwitcher", () => {
  const React = require("react");
  return { ThemeSwitcher: () => <div>ThemeSwitcher</div> };
});
jest.mock("../src/components/LanguageSwitcher", () => {
  const React = require("react");
  return { LanguageSwitcher: () => <div>LanguageSwitcher</div> };
});

describe("CardComponent", () => {
  it("renders title and description", () => {
    render(<CardComponent title="Test Title" description="Test Desc" />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Desc")).toBeInTheDocument();
  });

  it("shows UserStatus if showUserStatus is true", () => {
    render(<CardComponent title="t" description="d" showUserStatus={true} />);
    expect(screen.getByText("UserStatus")).toBeInTheDocument();
  });

  it("shows ThemeSwitcher if showThemeSwitcher is true", () => {
    render(
      <CardComponent title="t" description="d" showThemeSwitcher={true} />
    );
    expect(screen.getByText("ThemeSwitcher")).toBeInTheDocument();
  });

  it("shows LanguageSwitcher if showLanguageSwitcher is true", () => {
    render(
      <CardComponent title="t" description="d" showLanguageSwitcher={true} />
    );
    expect(screen.getByText("LanguageSwitcher")).toBeInTheDocument();
  });

  it("renders image with alt text", () => {
    render(<CardComponent title="t" description="d" imageAlt="AltText" />);
    expect(screen.getByAltText("AltText")).toBeInTheDocument();
  });
});
