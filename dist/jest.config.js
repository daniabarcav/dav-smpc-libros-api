"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    moduleFileExtensions: ['ts', 'js', 'json'],
    moduleNameMapper: {
        '^src/common/logger$': '<rootDir>/__mocks__/src/common/logger.ts',
        '^src/(.*)$': '<rootDir>/src/$1',
    },
    collectCoverageFrom: [
        'src/**/*.service.ts',
        'src/**/*.controller.ts',
        'src/common/**/*.ts',
        '!src/**/dto/*.ts',
        '!src/**/entities/*.ts',
        '!src/main.ts',
        '!src/app.module.ts',
        '!src/common/logger.ts',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'json-summary'],
    coverageThreshold: { global: { branches: 80, functions: 80, lines: 80, statements: 80 } },
};
exports.default = config;
//# sourceMappingURL=jest.config.js.map