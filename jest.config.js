module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@videomatt/(.*)$': '<rootDir>/src/videomatt/$1',
    },
    modulePaths: ['<rootDir>/src'],
    setupFiles: ['reflect-metadata'],
};
