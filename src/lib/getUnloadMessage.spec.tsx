import { getUnloadMessage } from './getUnloadMessage';
import React from 'react';
import { useUpdateTask } from './api/useUpdateTask';
import { renderWithQueryProvider } from './test/helpers';
import { vi, expect, it, describe } from 'vitest';
import { updateTask } from './api';
import loadControlledPromise from './test/loadControlledPromise';

vi.mock('./api/updateTask');

describe('getUnloadMessage', () => {
	it('does not return message if no pending mutations', () => {
		const { queryClient } = renderWithQueryProvider(<div>Hello World</div>);

		expect(getUnloadMessage(queryClient)).toBeFalsy();
	});

	it('returns message if pending task toggle', () => {
		const { reject } = loadControlledPromise(updateTask);

		const Component = () => {
			const updateTask = useUpdateTask();

			updateTask('-1', { complete: true });

			return <div>Component</div>;
		};

		const { queryClient } = renderWithQueryProvider(<Component />);

		const expected =
			'There are changes that may be lost if you continue exiting.';

		expect(getUnloadMessage(queryClient)).toEqual(expected);

		reject();
	});
});
