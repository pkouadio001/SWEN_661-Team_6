import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AppLayout from "../app/layouts/AppLayout";

describe("layouts smoke test", () => {
  test("AppLayout renders without crashing and shows nested content", () => {
    render(
      <MemoryRouter
        initialEntries={["/"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<div>Smoke Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Smoke Content")).toBeInTheDocument();
  });
});