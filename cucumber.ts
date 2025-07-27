#!/usr/bin/env ts-node
import { spawn } from 'child_process';

const cucumberArgs = [
    'cucumber-js',
    '--require-module',
    'ts-node/register',
    '--require',
    'src/tests/videomatt/**/steps/**/*.ts',
    'src/tests/videomatt/**/features/**/*.feature',
];

const cucumberProcess = spawn('npx', cucumberArgs, {
    stdio: 'inherit',
    cwd: process.cwd(),
    shell: true,
    env: process.env,
});

cucumberProcess.on('exit', (code) => {
    process.exit(code ?? 1);
});
