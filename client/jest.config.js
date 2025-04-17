module.exports = {
  moduleFileExtensions: [
    "web.js",
    "js",
    "web.ts",
    "ts",
    "web.tsx",
    "tsx",
    "json",
    "web.jsx",
    "jsx",
  ],
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest", // Ensure Babel transforms JS and JSX files
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios)/", // This ensures that axios is transformed by Babel
  ],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"], // Correct import path here
};
