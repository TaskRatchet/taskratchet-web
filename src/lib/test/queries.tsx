import { screen, waitFor } from '@testing-library/react';

export async function findTaskCheckbox(
	task = 'the_task',
): Promise<HTMLInputElement> {
	const desc = await screen.findByText(task);
	let checkbox;
	await waitFor(() => {
		/* eslint-disable testing-library/no-node-access */
		const c = desc
			.closest('.molecule-task')
			?.querySelector('[type="checkbox"]');
		/* eslint-enable testing-library/no-node-access */
		if (!c) {
			throw new Error();
		}
		checkbox = c;
	});
	return checkbox as unknown as HTMLInputElement;
}

export function queryTaskCheckbox(task = 'the_task'): HTMLInputElement | null {
	const desc = screen.getByText(task);

	// eslint-disable-next-line testing-library/no-node-access
	const c = desc.closest('.molecule-task')?.querySelector('[type="checkbox"]');

	return c ? (c as unknown as HTMLInputElement) : null;
}
