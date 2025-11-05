import React from "react";
import "whatwg-fetch";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import CollectionsPage from "../pages/MyCollectionsPage.jsx";

test("renders collections page", () => {
  const { container } = render(<CollectionsPage />);
  expect(container).toBeInTheDocument();
});
