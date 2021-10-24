module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'prettier'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
		'plugin:react/recommended',
	],
	env: {
		jest: true,
		browser: true,
		node: true,
	},
	rules: { 'prettier/prettier': 'error' },
};
