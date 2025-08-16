import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import react from 'eslint-plugin-react';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import testingLibrary from 'eslint-plugin-testing-library';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	{
		ignores: ['public', '**/eslint.config.mjs', 'dist'],
	},
	...fixupConfigRules(
		compat.extends(
			'eslint:recommended',
			'plugin:react/recommended',
			'plugin:@typescript-eslint/recommended',
			'plugin:@typescript-eslint/recommended-requiring-type-checking',
		),
	),
	reactHooks.configs['recommended-latest'],
	eslintConfigPrettier,
	{
		plugins: {
			react: fixupPluginRules(react),
			'@typescript-eslint': fixupPluginRules(typescriptEslint),
			'testing-library': fixupPluginRules({
				rules: testingLibrary.rules,
			}),
			'simple-import-sort': simpleImportSort,
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
			'react/react-in-jsx-scope': 'off',
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
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
