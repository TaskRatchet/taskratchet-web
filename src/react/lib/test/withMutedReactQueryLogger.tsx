import { setLogger } from 'react-query';

export async function withMutedReactQueryLogger(
	callback: () => Promise<void>,
): Promise<void> {
	setLogger({
		log: () => {
			/* noop */
		},
		warn: () => {
			/* noop */
		},
		error: () => {
			/* noop */
		},
	});

	await callback();

	setLogger(window.console);
}
