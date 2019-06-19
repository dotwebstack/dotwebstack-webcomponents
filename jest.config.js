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
    'css',
  ],
  testRegex: '\\.test\\.tsx?$',
  setupFilesAfterEnv: [
    '<rootDir>/src/test/setupTests.ts',
  ],
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/{examples,test}/**',
  ],
  testURL: 'http://localhost/',
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/src/__test__/styleMock.ts'
  }
};
