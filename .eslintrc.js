module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'prettier',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: './tsconfig.json',
	},
	plugins: ['react', '@typescript-eslint', 'regex', 'lodash'],
	rules: {
		'lodash/import-scope': 'error',
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
	settings: {
		react: {
			version: 'detect',
		},
	},
	overrides: [
		{
			files: [
				'*.spec.ts',
				'*.spec.tsx',
				'**/__mocks__/**/*',
				'**/__tests__/**/*',
				'global-setup.ts',
				'src/lib/test/**/*',
			],
			extends: ['plugin:testing-library/react'],
			rules: {
				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/no-unsafe-return': 'off',
				'@typescript-eslint/no-unsafe-member-access': 'off',
				'@typescript-eslint/no-unsafe-assignment': 'off',
				'@typescript-eslint/no-unsafe-argument': 'off',
				'@typescript-eslint/no-unsafe-call': 'off',
			},
		},
	],
};
