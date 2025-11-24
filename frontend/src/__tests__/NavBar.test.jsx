import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import App from "../App.jsx";
import { UserRoleProvider } from "../UserRoleContext";

test("renders site title from App.jsx", () => {
  render(
    <UserRoleProvider>
      <App />
    </UserRoleProvider>
  );

  const matches = screen.getAllByText(/Archive/i);
  expect(matches.length).toBeGreaterThan(0);
});
