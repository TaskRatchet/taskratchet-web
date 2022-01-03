export default function flattenObject(
	object: Record<string, unknown[]>
): unknown[] {
	return Object.keys(object).reduce((acc: unknown[], key: string) => {
		return [...acc, key, ...object[key]];
	}, []);
}
