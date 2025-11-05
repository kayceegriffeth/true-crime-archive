import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App.jsx";

test("renders site title from App.jsx", () => {
  render(<App />);
  const matches = screen.getAllByText(/Archive/i);
  expect(matches.length).toBeGreaterThan(0);
});
