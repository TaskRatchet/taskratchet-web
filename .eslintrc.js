module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:testing-library/react',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: './tsconfig.json',
		tsconfigRootDir: __dirname,
	},
	plugins: ['react', '@typescript-eslint'],
	rules: {},
	settings: {
		react: {
			version: 'detect',
		},
	},
	overrides: [
		{
			files: [
				'*.test.ts',
				'*.test.tsx',
				'**/__mocks__/**/*',
				'**/__tests__/**/*',
			],
			rules: {
				'@typescript-eslint/no-explicit-any': 'off',
			},
		},
	],
};
