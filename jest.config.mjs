/**
 * @type {import('@jest/types').Config.InitialOptions}
 */

const config = {
  testTimeout: 60000 * 5, // Test can run for 5 minutes

  clearMocks: true,
  moduleFileExtensions: ["js", "ts"],
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true
      }
    ]
  },
  testMatch: ["**/*.test.ts"],
  verbose: true,
  moduleNameMapper: {
    "^~(.*)$": "<rootDir>/src/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  modulePaths: ["<rootDir>"]
}
export default config
