const path = require('path');

module.exports = {
  rootDir: path.join(__dirname, 'src'),
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupTestFrameworkScriptFile: '<rootDir>/jest/setupTests.js',
  transform: {
    '^.+\\.tsx?$': '<rootDir>/jest/preprocessor.js',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  verbose: true,
};
