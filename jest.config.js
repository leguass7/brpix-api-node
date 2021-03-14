const { name } = require('./package.json')

module.exports = {
  bail: 1,
  displayName: name,
  testTimeout: 30000,
  name,
  clearMocks: true,
  preset: 'ts-jest',
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  coveragePathIgnorePatterns: ['node_modules', 'setup*.js', '__tests__', 'coverage', 'dist'],
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'js'],
  testPathIgnorePatterns: ['dist', 'node_modules', 'requests'],
  transform: {
    // '.(js|jsx|ts|tsx)': 'babel-jest'
    '.(js|jsx)': '@sucrase/jest-plugin'
  },
  setupFiles: [
    'dotenv/config'
    // '<rootDir>/jest.setup.js'
  ],
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/src/$1'
  },
  testMatch: [
    '<rootDir>/__tests__/**/*.(test).{js,jsx,ts,tsx}',
    '<rootDir>/__tests__/**/?(*.)(spec|test).{js,jsx,ts,tsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 85,
      lines: 75,
      statements: 80
    }
  }
}
