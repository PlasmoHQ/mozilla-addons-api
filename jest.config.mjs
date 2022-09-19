/**
 * @type {import('@jest/types').Config.InitialOptions}
 */

const config = {
  testTimeout: 60000 * 5, // Test can run for 5 minutes

  clearMocks: true,
  moduleFileExtensions: ["js", "ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", {
      useESM: true
    }]
  },
  testMatch: ["**/*.test.ts"],
  verbose: true,
  moduleNameMapper: {
    "^~(.*)$": "<rootDir>/dist/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1"
  }
}
export default config
