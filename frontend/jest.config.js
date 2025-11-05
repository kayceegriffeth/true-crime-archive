export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@testing-library)/)"
  ],
  moduleFileExtensions: ["js", "jsx"],
};
