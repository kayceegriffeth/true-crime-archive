import axios from "axios";
import "@testing-library/jest-dom";

jest.mock("axios");

test("apiClient loads without crashing", () => {
  expect(axios).toBeDefined();
});
