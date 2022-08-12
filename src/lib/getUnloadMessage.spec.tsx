import { getUnloadMessage } from './getUnloadMessage';
import React from 'react';
import { useUpdateTask } from './api/useUpdateTask';
import { renderWithQueryProvider, resolveWithDelay } from './test/helpers';
import { vi } from 'vitest';
import { updateTask } from './api';

vi.mock('./api/updateTask');

describe('getUnloadMessage', () => {
	it('does not return message if no pending mutations', async () => {
		const { queryClient } = await renderWithQueryProvider(
			<div>Hello World</div>
		);

		expect(getUnloadMessage(queryClient)).toBeFalsy();
	});

	it('returns message if pending task toggle', async () => {
		resolveWithDelay(vi.mocked(updateTask), 200);

		const Component = () => {
			const updateTask = useUpdateTask();

			updateTask(-1, { complete: true });

			return <div>Component</div>;
		};

		const { queryClient } = await renderWithQueryProvider(<Component />);

		const expected =
			'There are changes that may be lost if you continue exiting.';

		expect(getUnloadMessage(queryClient)).toEqual(expected);
	});
});
