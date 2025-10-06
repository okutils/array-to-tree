/** @type {import("jest").Config} */
const config = {
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
  coveragePathIgnorePatterns: ["<rootDir>/dist/"],
  moduleFileExtensions: ["ts", "js"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/__tests__/**/*.test.ts"],
  testPathIgnorePatterns: ["<rootDir>/dist/"],
};

export default config;
