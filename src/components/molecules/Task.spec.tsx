import Task from './Task';
import React from 'react';
import {
	renderWithQueryProvider,
	withMutedReactQueryLogger,
} from '../../lib/test/helpers';
import userEvent from '@testing-library/user-event';
import { updateTask } from '../../lib/api';
import { waitFor } from '@testing-library/dom';
import browser from '../../lib/Browser';
import { editTask } from '../../lib/api/editTask';
import { screen } from '@testing-library/react';

jest.mock('../../lib/api/updateTask');
jest.mock('date-fns');
jest.mock('../../lib/api/getMe');
jest.mock('../../lib/api/addTask');
jest.mock('../../lib/api/editTask');

const mockEditTask = editTask as jest.Mock;

function renderTask(task: Partial<TaskType> = {}) {
	const t: TaskType = {
		due: '2/1/2022, 11:59 PM',
		cents: 100,
		task: 'the_task',
		id: 'the_id',
		status: 'pending',
		complete: false,
		timezone: 'Est/GMT',
		...task,
	};
	return renderWithQueryProvider(<Task task={t} />);
}

async function openEditDialog() {
	userEvent.click(screen.getByLabelText('Menu'));
	userEvent.click(screen.getByText('Edit'));

	await waitFor(() => {
		expect(screen.getByLabelText('Due Date *')).toHaveValue('02/01/2022');
	});
}

describe('Task component', () => {
	beforeEach(() => {
		jest.spyOn(browser, 'scrollIntoView').mockImplementation(() => undefined);
	});

	it('disables checkbox for tasks without id', async () => {
		renderTask({ id: undefined });

		const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

		userEvent.click(checkbox);

		expect(checkbox.checked).toBeFalsy();
	});

	it('has task menu', async () => {
		renderTask();

		expect(screen.getByLabelText('Menu')).toBeInTheDocument();
	});

	it('has uncle menu item', async () => {
		renderTask();

		const menuButton = screen.getByLabelText('Menu');

		userEvent.click(menuButton);

		expect(screen.getByText('Charge immediately')).toBeInTheDocument();
	});

	it('uncles', async () => {
		renderTask();

		userEvent.click(screen.getByLabelText('Menu'));
		userEvent.click(screen.getByText('Charge immediately'));

		await waitFor(() => {
			userEvent.click(screen.getByText('Charge'));
		});

		await waitFor(() =>
			expect(updateTask).toBeCalledWith('the_id', {
				uncle: true,
			})
		);
	});

	it('disables entry for expired tasks', async () => {
		renderTask({ status: 'expired' });

		const desc = screen.getByText('the_task') as HTMLElement;
		const item = desc.closest('.MuiListItem-root') as HTMLElement;

		expect(item.querySelector('input')).not.toBeInTheDocument();
	});

	it('replaces checkbox with icon for expired tasks', async () => {
		renderTask({ status: 'expired' });

		expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
	});

	it('disables uncle button if task not pending', async () => {
		renderTask({ status: 'expired' });

		const menuButton = screen.getByLabelText('Menu');

		userEvent.click(menuButton);

		expect(screen.getByText('Charge immediately')).toHaveAttribute(
			'aria-disabled'
		);
	});

	it('allows cents edit', async () => {
		renderTask({ cents: 100 });

		await openEditDialog();

		userEvent.type(screen.getByLabelText('Stakes *'), '5');
		userEvent.click(screen.getByText('Save'));

		await waitFor(() => {
			expect(editTask).toBeCalledWith('the_id', '2/1/2022, 11:59 PM', 1500);
		});
	});

	it('closes task menu on edit click', async () => {
		renderTask();

		userEvent.click(screen.getByLabelText('Menu'));
		userEvent.click(screen.getByText('Edit'));

		expect(screen.queryByAltText('Edit')).not.toBeInTheDocument();
	});

	it('allows date edit', async () => {
		renderTask({ due: '2/1/2022, 11:59 PM' });

		await openEditDialog();

		await userEvent.type(
			screen.getByLabelText('Due Date *'),
			'{backspace}5{enter}'
		);

		userEvent.click(screen.getByText('Save'));

		await waitFor(() => {
			expect(editTask).toBeCalledWith('the_id', '2/1/2025, 11:59 PM', 100);
		});
	});

	it('disables edit if task is not pending', async () => {
		renderTask({ status: 'expired' });

		userEvent.click(screen.getByLabelText('Menu'));

		expect(screen.getByText('Edit')).toHaveAttribute('aria-disabled');
	});

	it('asks for confirmation before uncling', async () => {
		/*
		When user clicks "Charge Immediately" link in task context menu, user 
		should be shown confirmation step before the task is charged. 
		 */

		renderTask();

		userEvent.click(screen.getByLabelText('Menu'));
		userEvent.click(screen.getByText('Charge immediately'));

		// displays confirmation dialog
		await waitFor(() => {
			expect(screen.getByText('Charge')).toBeInTheDocument();
		});

		expect(updateTask).not.toBeCalled();
	});

	it("tells you know how much you'll be charged if you uncle", async () => {
		renderTask({ cents: 100 });

		userEvent.click(screen.getByLabelText('Menu'));
		userEvent.click(screen.getByText('Charge immediately'));

		await waitFor(() => {
			expect(
				screen.getByText(
					'If you confirm, you will immediately be charged $1.',
					{
						exact: false,
					}
				)
			).toBeInTheDocument();
		});
	});

	it('displays edit errors from API', async () => {
		await withMutedReactQueryLogger(async () => {
			mockEditTask.mockRejectedValue({ message: 'the_error' });

			renderTask();

			await openEditDialog();

			await userEvent.type(
				screen.getByLabelText('Due Date *'),
				'{backspace}5{enter}'
			);

			userEvent.click(screen.getByText('Save'));

			await waitFor(() => {
				expect(editTask).toBeCalledWith('the_id', '2/1/2025, 11:59 PM', 100);
			});

			expect(screen.getByText('the_error')).toBeInTheDocument();
		});
	});

	// TODO: triggers task list reload
	// TODO: allow reducing pledge, extending deadline in first n minutes
});
