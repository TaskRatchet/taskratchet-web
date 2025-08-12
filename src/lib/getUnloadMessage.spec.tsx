import { getUnloadMessage } from './getUnloadMessage';
import React from 'react';
import { useUpdateTask } from './api/useUpdateTask';
import { vi, expect, it, describe } from 'vitest';
import loadControlledPromise from './test/loadControlledPromise';
import { updateTask } from '@taskratchet/sdk';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';

vi.mock('./api/updateTask');

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
		},
	},
});

describe('getUnloadMessage', () => {
	it('does not return message if no pending mutations', () => {
		render(
			<QueryClientProvider client={queryClient}>
				hello world
			</QueryClientProvider>,
		);

		expect(getUnloadMessage(queryClient)).toBeFalsy();
	});

	it('returns message if pending task toggle', () => {
		const { resolve } = loadControlledPromise(updateTask);

		const Component = () => {
			const updateTask = useUpdateTask();

			updateTask('-1', { complete: true });

			return <div>Component</div>;
		};

		render(
			<QueryClientProvider client={queryClient}>
				<Component />
			</QueryClientProvider>,
		);

		const expected =
			'There are changes that may be lost if you continue exiting.';

		expect(getUnloadMessage(queryClient)).toEqual(expected);

		resolve();
	});
});
