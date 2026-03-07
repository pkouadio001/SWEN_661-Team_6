import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";

jest.mock("../components/TopBar", () => ({
  __esModule: true,
  default: () => <div data-testid="topbar">TopBar</div>,
}));

jest.mock("../components/Sidebar", () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

import AppLayout from "../app/layouts/AppLayout";

function renderWithOutlet(outletText = "Page Content") {
  return render(
    <MemoryRouter
      initialEntries={["/"]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route
            index
            element={<div data-testid="page-content">{outletText}</div>}
          />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("AppLayout interactive test", () => {
  test("renders shared layout elements", () => {
    renderWithOutlet();

    expect(screen.getByTestId("topbar")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("page-content")).toBeInTheDocument();
  });

  test("renders nested route content through Outlet", () => {
    renderWithOutlet("Dashboard Screen");

    expect(screen.getByText("Dashboard Screen")).toBeInTheDocument();
  });

  test("keeps wrapper hierarchy visible to the user", () => {
    renderWithOutlet();

    const sidebar = screen.getByTestId("sidebar");
    const topbar = screen.getByTestId("topbar");
    const content = screen.getByTestId("page-content");

    expect(sidebar).toBeVisible();
    expect(topbar).toBeVisible();
    expect(content).toBeVisible();
  });
});