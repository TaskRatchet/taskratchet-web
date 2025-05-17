export default {
	compilers: {
		css: (text: string) => {
			const imports = [...text.matchAll(/(?<=@)import[^;]+/g)].map((match) => match[0].trim());
			const plugins = [...text.matchAll(/@plugin\s+['"]([^'"]+)['"]/g)].map((match) =>
				match[1].trim()
			);
			const pluginsAsImports = plugins.map((plugin) => `import '${plugin}'`);
			return [...imports, ...pluginsAsImports].join('\n');
		}
	}
};
