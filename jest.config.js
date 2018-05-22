module.exports = {
  roots: [
    '<rootDir>/src'
  ],
  transform: {
    '\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
  ],
  testRegex: '\\.test\\.tsx?$',
  setupTestFrameworkScriptFile: '<rootDir>/src/test/setupTests.ts',
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/test/**',
  ],
};
