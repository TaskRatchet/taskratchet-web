import React from 'react';
import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecurringTasks from './RecurringTasks';
import getRecurringTasks from '../../lib/api/getRecurringTasks';
import updateRecurringTask from '../../lib/api/updateRecurringTask';
import { loadMe, renderWithQueryProvider } from '../../lib/test/helpers';

jest.mock('../../lib/api/getRecurringTasks');
jest.mock('../../lib/api/getMe');
jest.mock('../../lib/api/updateMe');
jest.mock('../../lib/api/updateRecurringTask');

const mockGetRecurringTasks = getRecurringTasks as jest.Mock;

describe('recurring tasks', () => {
	beforeEach(() => {
		loadMe();
		mockGetRecurringTasks.mockResolvedValue([
			{ task: 'recurring_task', id: 'the_id', cents: 100, due: '' },
		]);
	});
	it('lists recurring tasks', async () => {
		renderWithQueryProvider(<RecurringTasks />);

		await waitFor(() => {
			expect(getRecurringTasks).toHaveBeenCalled();
		});

		expect(screen.getByText('recurring_task')).toBeInTheDocument();
	});

	it('it allows editing', async () => {
		renderWithQueryProvider(<RecurringTasks />);

		await waitFor(() => {
			expect(getRecurringTasks).toHaveBeenCalled();
		});

		userEvent.click(screen.getByLabelText('Menu'));
	});

	it('it edits recurring task', async () => {
		renderWithQueryProvider(<RecurringTasks />);

		await waitFor(() => {
			expect(getRecurringTasks).toHaveBeenCalled();
		});

		userEvent.click(screen.getByLabelText('Menu'));

		userEvent.click(screen.getByText('Edit'));

		const taskInput = screen.getByLabelText(/^Task/);
		userEvent.clear(taskInput);
		userEvent.type(taskInput, 'm_recurring_task');

		userEvent.click(screen.getByText('Save'));
		await waitFor(() => {
			expect(updateRecurringTask).toBeCalled();
		});

		expect(updateRecurringTask).toBeCalledWith(
			expect.objectContaining({ task: 'm_recurring_task' })
		);
	});

	it('it does not include due', async () => {
		renderWithQueryProvider(<RecurringTasks />);

		await waitFor(() => {
			expect(getRecurringTasks).toHaveBeenCalled();
		});

		userEvent.click(screen.getByLabelText('Menu'));

		userEvent.click(screen.getByText('Edit'));

		userEvent.click(screen.getByText('Save'));
		await waitFor(() => {
			expect(updateRecurringTask).toBeCalled();
		});

		expect(updateRecurringTask).toBeCalledWith(
			expect.not.objectContaining({ due: expect.anything() })
		);

	});
});
