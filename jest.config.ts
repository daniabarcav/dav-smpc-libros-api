import type { Config } from 'jest';
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  moduleFileExtensions: ['ts','js','json'],
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  collectCoverageFrom: [
    'src/**/*.service.ts',
    'src/**/*.controller.ts',
    'src/common/**/*.ts',
    '!src/**/dto/*.ts',
    '!src/**/entities/*.ts',
    '!src/main.ts',
    '!src/app.module.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'json-summary'],
  coverageThreshold: { global: { branches: 80, functions: 80, lines: 80, statements: 80 } }
};
export default config;
