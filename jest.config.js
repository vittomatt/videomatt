module.exports = {
    preset: 'ts-jest',
    roots: ['<rootDir>/src'],
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@videomatt/(.*)$': '<rootDir>/src/videomatt/$1',
    },
    modulePaths: ['<rootDir>/src'],
    setupFiles: ['reflect-metadata'],
    testMatch: [
        '**/?(*.)+(test).+(ts|js)'
    ]
};
