import { Mock } from 'vitest';
export default function loadControlledPromise(mock: unknown) {
	let resolve: (value?: unknown) => void = () => {
		throw new Error('called resolve before definition');
	};
	let reject: (value?: unknown) => void = () => {
		throw new Error('called reject before definition');
	};
	const response = new Promise((res, rej) => {
		resolve = res;
		reject = rej;
	});
	(mock as Mock).mockReturnValue(response);

	return { resolve, reject };
}
