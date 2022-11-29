import React from 'react';
import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecurringTasks from './RecurringTasks';
import getRecurringTasks from '../../lib/api/getRecurringTasks';
import updateRecurringTask from '../../lib/api/updateRecurringTask';
import { renderWithQueryProvider } from '../../lib/test/renderWithQueryProvider';
import { loadMe } from '../../lib/test/loadMe';
import { vi, Mock, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../../lib/api/getRecurringTasks');
vi.mock('../../lib/api/getMe');
vi.mock('../../lib/api/updateMe');
vi.mock('../../lib/api/updateRecurringTask');

const mockGetRecurringTasks = getRecurringTasks as Mock;

describe('recurring tasks', () => {
	beforeEach(() => {
		loadMe();
		mockGetRecurringTasks.mockResolvedValue([
			{ task: 'recurring_task', id: 'the_id', cents: 100 },
		]);
	});

	it('lists recurring tasks', async () => {
		renderWithQueryProvider(<RecurringTasks />);

		await waitFor(() => {
			expect(getRecurringTasks).toHaveBeenCalled();
		});

		expect(await screen.findByText('recurring_task')).toBeInTheDocument();
	});

	it('it allows editing', async () => {
		renderWithQueryProvider(<RecurringTasks />);

		await waitFor(() => {
			expect(getRecurringTasks).toHaveBeenCalled();
		});

		await userEvent.click(await screen.findByLabelText('Menu'));
	});

	it('it edits recurring task', async () => {
		renderWithQueryProvider(<RecurringTasks />);

		await waitFor(() => {
			expect(getRecurringTasks).toHaveBeenCalled();
		});

		await userEvent.click(await screen.findByLabelText('Menu'));

		await userEvent.click(await screen.findByText('Edit'));

		const taskInput = await screen.findByLabelText(/^Task/);

		await userEvent.clear(taskInput);
		await userEvent.type(taskInput, 'm_recurring_task');
		await userEvent.click(await screen.findByText('Save'));

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

		await userEvent.click(await screen.findByLabelText('Menu'));
		await userEvent.click(await screen.findByText('Edit'));
		await userEvent.click(await screen.findByText('Save'));

		await waitFor(() => {
			expect(updateRecurringTask).toBeCalled();
		});

		expect(updateRecurringTask).toBeCalledWith(
			expect.not.objectContaining({ due: expect.anything() })
		);
	});
});
