export default {
	compilers: {
		/**
		 * Custom CSS compiler for Knip that extracts both \@import and \@plugin statements.
		 *
		 * This compiler processes CSS files to help Knip detect dependencies from:
		 * - Standard CSS \@import statements
		 * - Custom \@plugin directives (which are converted to import statements for Knip)
		 *
		 * @param {string} text - The raw CSS content to be processed
		 * @returns {string} A string of newline-separated import statements that Knip can analyze
		 *
		 * @example
		 * Input CSS:
		 * ```css
		 * \@import 'tailwindcss';
		 * \@plugin '@tailwindcss/forms';
		 * ```
		 *
		 * Output:
		 * ```js
		 * import 'tailwindcss'
		 * import '@tailwindcss/forms'
		 * ```
		 */
		css: (text: string): string => {
			const imports = [...text.matchAll(/(?<=@)import[^;]+/g)].map((match) => match[0].trim());
			const plugins = [...text.matchAll(/@plugin\s+['"]([^'"]+)['"]/g)].map((match) =>
				match[1].trim()
			);
			const pluginsAsImports = plugins.map((plugin) => `import '${plugin}'`);
			return [...imports, ...pluginsAsImports].join('\n');
		}
	}
};
