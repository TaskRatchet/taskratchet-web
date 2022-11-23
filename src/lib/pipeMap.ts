const pipe = (
	input: Record<string, unknown>,
	inputKey: string,
	output: Record<string, unknown>,
	outputPath: string
) => {
	const value: unknown = input[inputKey];

	if (value) {
		const nodes = outputPath.split('.');
		const lastNode = nodes.pop();

		if (lastNode) {
			let current = output;

			for (const node of nodes) {
				if (!current[node]) {
					current[node] = {};
				}

				current = current[node] as Record<string, unknown>;
			}

			current[lastNode] = value;
		}
	}

	return output;
};

const pipeMap = (
	input: Record<string, unknown>,
	pathPairs: [string, string][]
) => {
	return pathPairs.reduce((prev: Record<string, unknown>, pair: string[]) => {
		return pipe(input, pair[0], prev, pair[1]);
	}, {});
};

export default pipeMap;
