// noinspection JSFileReferences
import preset from 'ts-jest/presets/index.js';

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    ...preset.defaultsESM,
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.json',
                useESM: true,
            },
        ],
    },
}