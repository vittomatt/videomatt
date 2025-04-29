module.exports = {
    preset: 'ts-jest',
    roots: ['<rootDir>/src'],
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@videomatt/(.*)$': '<rootDir>/src/videomatt/$1',
        '^@tests/(.*)$': '<rootDir>/src/tests/$1',
    },
    modulePaths: ['<rootDir>/src'],
    setupFiles: ['reflect-metadata'],
    testMatch: ['**/?(*.)+(test).+(ts|js)'],
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
};
