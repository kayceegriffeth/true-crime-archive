import React from "react";
import "whatwg-fetch";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import CollectionsPage from "../pages/MyCollectionsPage.jsx";
import { UserRoleProvider } from "../UserRoleContext";

test("renders collections page", () => {
  const { container } = render(
    <UserRoleProvider>
      <CollectionsPage />
    </UserRoleProvider>
  );

  expect(container).toBeInTheDocument();
});
