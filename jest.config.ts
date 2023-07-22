/* eslint-disable @typescript-eslint/no-var-requires */
import type { JestConfigWithTsJest } from 'ts-jest'

const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions, paths } = require('./tsconfig.test.json')

const DEPENDENCIES_TO_INCLUDE_LIST = [
  'remark.*',
  'mdast.*',
  'micromark.*',
  'unist.*',
  'trim-lines',
  'unified',
  'bail',
  'decode-named-character-reference',
  'is-plain-obj',
].join('|')
const DEPENDENCIES_TO_INCLUDE = `(${DEPENDENCIES_TO_INCLUDE_LIST})/.+\\.js`
const DEPENDENCIES_TO_SKIP_EXCLUDE = `'node_modules/(?!${DEPENDENCIES_TO_INCLUDE}/)'`

const jestConfig: JestConfigWithTsJest = {
  // preset: 'ts-jest/presets/js-with-ts',
  resolver: 'ts-jest-resolver',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'jsx', 'mjs', 'ts', 'tsx', 'mts', 'cjs'],
  transform: {
    '^.+\\.m?[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: compilerOptions,
      },
    ],
  },
  transformIgnorePatterns: [DEPENDENCIES_TO_SKIP_EXCLUDE],
  // transformIgnorePatterns: ['<rootDir>/node_modules/'],
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: '<rootDir>/' }),
  // verbose: true,
}

export default jestConfig
