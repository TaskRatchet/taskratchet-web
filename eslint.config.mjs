import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import react from 'eslint-plugin-react';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import regex from 'eslint-plugin-regex';
import lodash from 'eslint-plugin-lodash';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import testingLibrary from 'eslint-plugin-testing-library';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	{
		ignores: ['public', '**/eslint.config.mjs', 'dist', 'src/env.d.ts'],
	},
	...fixupConfigRules(
		compat.extends(
			'eslint:recommended',
			'plugin:react/recommended',
			'plugin:react-hooks/recommended',
			'plugin:@typescript-eslint/recommended',
			'plugin:@typescript-eslint/recommended-requiring-type-checking',
			'prettier',
		),
	),
	{
		plugins: {
			react: fixupPluginRules(react),
			'@typescript-eslint': fixupPluginRules(typescriptEslint),
			regex,
			lodash,
			'testing-library': fixupPluginRules({
				rules: testingLibrary.rules,
			}),
		},

		languageOptions: {
			globals: {
				...globals.browser,
			},

			parser: tsParser,
			ecmaVersion: 'latest',
			sourceType: 'module',

			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},

				project: './tsconfig.json',
			},
		},

		settings: {
			react: {
				version: 'detect',
			},
		},

		rules: {
			'lodash/import-scope': 'error',
			'react/react-in-jsx-scope': 'off',
			'regex/required': [
				'error',
				[
					{
						regex: 'describe.+from.+vitest',
						message: 'Import `describe` explicitly.',

						files: {
							inspect: '\\.(test|spec)\\.tsx?$',
						},
					},
					{
						regex: 'it.+from.+vitest',
						message: 'Import `it` explicitly.',

						files: {
							inspect: '\\.(test|spec)\\.tsx?$',
						},
					},
					{
						regex: 'expect.+from.+vitest',
						message: 'Import `expect` explicitly.',

						files: {
							inspect: '\\.(test|spec)\\.tsx?$',
						},
					},
				],
			],
		},
	},
	{
		files: [
			'**/*.spec.ts',
			'**/*.spec.tsx',
			'**/__mocks__/**/*',
			'**/__tests__/**/*',
			'**/global-setup.ts',
			'src/lib/test/**/*',
		],

		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unsafe-member-access': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
		},
	},
];
