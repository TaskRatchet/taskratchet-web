import { updateTask } from '@taskratchet/sdk';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { describe, expect, it } from 'vitest';

import { useUpdateTask } from './api/useUpdateTask';
import { getUnloadMessage } from './getUnloadMessage';
import loadControlledPromise from './test/loadControlledPromise';

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
