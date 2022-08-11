import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import RecurringTasks from './RecurringTasks';
import { getTasks } from '../../lib/api/getTasks';
// import { makeTask } from '../../lib/test/helpers';

jest.mock('../../lib/api/getTasks');

// const mockGetTasks = getTasks as jest.Mock;

describe('recurring tasks', () => {
	it('lists recurring tasks', async () => {
		// TODO: Mock API call to get recurring task patterns

		render(<RecurringTasks />);

		await waitFor(() => {
			expect(getTasks).toHaveBeenCalled();
		});

		expect(screen.getByText('recurring_task')).toBeInTheDocument();
	});
});
