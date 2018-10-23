module.exports = {
  roots: [
    '<rootDir>/src'
  ],
  transform: {
    '\\.tsx?$': 'ts-jest',
    "\\.(css|less)$": "<rootDir>/src/__test__/styleMock.ts" 
  },
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'css',
  ],
  testRegex: '\\.test\\.tsx?$',
  setupTestFrameworkScriptFile: '<rootDir>/src/test/setupTests.ts',
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/{examples,test}/**',
  ],
  testURL: 'http://localhost/'
};
