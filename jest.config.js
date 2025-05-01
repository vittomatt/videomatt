module.exports = {
    preset: 'ts-jest',
    roots: ['<rootDir>/src'],
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@users/(.*)$': '<rootDir>/src/users/$1',
        '^@videos/(.*)$': '<rootDir>/src/videos/$1',
        '^@shared/(.*)$': '<rootDir>/src/shared/$1',
        '^@tests/(.*)$': '<rootDir>/src/tests/$1',
    },
    modulePaths: ['<rootDir>/src'],
    setupFiles: ['reflect-metadata'],
    testMatch: ['**/?(*.)+(test).+(ts|js)'],
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
};
