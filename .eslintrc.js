module.exports = {
	settings: {
		react: {
			version: 'detect',
		},
	},
	parserOptions: {
		ecmaVersion: 9,
		sourceType: 'module',
	},
	root: true,
	plugins: ['prettier'],
	extends: [
		'eslint:recommended',
		'plugin:react-hooks/recommended',
		'plugin:react/recommended',
	],
	env: {
		jest: true,
		browser: true,
		node: true,
	},
	rules: {
		'prettier/prettier': 'error',
	},
	overrides: [
		{
			files: '**/*.+(ts|tsx)',
			parser: '@typescript-eslint/parser',
			plugins: ['@typescript-eslint', 'prettier'],
			extends: [
				'eslint:recommended',
				'plugin:@typescript-eslint/recommended',
				'plugin:react-hooks/recommended',
				'plugin:react/recommended',
			],
			rules: {
				'prettier/prettier': 'error',
				'@typescript-eslint/explicit-module-boundary-types': 'error',
			},
		},
	],
};
