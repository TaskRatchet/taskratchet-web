import Task from './Task';
import React from 'react';
import {
	loadNowDate,
	renderWithQueryProvider,
	resolveWithDelay,
	withMutedReactQueryLogger,
} from '../../lib/test/helpers';
import userEvent from '@testing-library/user-event';
import { updateTask } from '../../lib/api';
import { waitFor } from '@testing-library/dom';
import browser from '../../lib/Browser';
import { editTask } from '../../lib/api/editTask';
import { screen } from '@testing-library/react';
import { vi, Mock, expect, it, describe, beforeEach } from 'vitest';
import { queryTaskCheckbox } from '../../lib/test/queries';

vi.mock('../../lib/api/updateTask');
vi.mock('date-fns');
vi.mock('../../lib/api/getMe');
vi.mock('../../lib/api/addTask');
vi.mock('../../lib/api/editTask');

const mockEditTask = editTask as Mock;

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
		vi.spyOn(browser, 'scrollIntoView').mockImplementation(() => undefined);
	});

	it('disables checkbox for tasks without id', () => {
		renderTask({ id: undefined });

		const checkbox: HTMLInputElement = screen.getByRole('checkbox');

		userEvent.click(checkbox);

		expect(checkbox.checked).toBeFalsy();
	});

	it('has task menu', () => {
		renderTask();

		expect(screen.getByLabelText('Menu')).toBeInTheDocument();
	});

	it('has uncle menu item', () => {
		renderTask();

		const menuButton = screen.getByLabelText('Menu');

		userEvent.click(menuButton);

		expect(screen.getByText('Charge immediately')).toBeInTheDocument();
	});

	it('uncles', async () => {
		renderTask();

		userEvent.click(screen.getByLabelText('Menu'));
		userEvent.click(screen.getByText('Charge immediately'));

		userEvent.click(await screen.findByText('Charge'));

		await waitFor(() =>
			expect(updateTask).toBeCalledWith('the_id', {
				uncle: true,
			})
		);
	});

	it('disables entry for expired tasks', () => {
		renderTask({ status: 'expired' });

		expect(queryTaskCheckbox()).not.toBeInTheDocument();
	});

	it('replaces checkbox with icon for expired tasks', () => {
		renderTask({ status: 'expired' });

		expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
	});

	it('disables uncle button if task not pending', () => {
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

	it('closes task menu on edit click', () => {
		renderTask();

		userEvent.click(screen.getByLabelText('Menu'));
		userEvent.click(screen.getByText('Edit'));

		expect(screen.queryByAltText('Edit')).not.toBeInTheDocument();
	});

	it('allows date edit', async () => {
		renderTask({ due: '2/1/2022, 11:59 PM' });

		await openEditDialog();

		userEvent.type(screen.getByLabelText('Due Date *'), '{backspace}1{enter}');

		userEvent.click(screen.getByText('Save'));

		await waitFor(() => {
			expect(editTask).toBeCalledWith('the_id', '2/1/2021, 11:59 PM', 100);
		});
	});

	it('disables edit if task is not pending', () => {
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

			userEvent.type(
				screen.getByLabelText('Due Date *'),
				'{backspace}1{enter}'
			);

			userEvent.click(screen.getByText('Save'));

			await waitFor(() => {
				expect(editTask).toBeCalledWith('the_id', '2/1/2021, 11:59 PM', 100);
			});

			expect(screen.getByText('the_error')).toBeInTheDocument();
		});
	});

	it('disables task field', async () => {
		renderTask();

		await openEditDialog();

		expect(screen.getByLabelText('Task *')).toBeDisabled();
	});

	it('enforces minimum stakes', async () => {
		vi.mocked(editTask).mockImplementation(() => {
			throw new Error('Should not have been called');
		});

		renderTask({ cents: 500 });

		await openEditDialog();

		userEvent.type(screen.getByLabelText('Stakes *'), '{backspace}1');
		userEvent.click(screen.getByText('Save'));

		expect(editTask).not.toBeCalled();
	});

	it('enforces maximum due', async () => {
		vi.mocked(editTask).mockImplementation(() => {
			throw new Error('Should not have been called');
		});

		renderTask({ due: '2/1/2022, 11:59 PM' });

		await openEditDialog();

		userEvent.type(screen.getByLabelText('Due Date *'), '{backspace}5{enter}');

		userEvent.click(screen.getByText('Save'));

		expect(editTask).not.toBeCalled();
	});

	it('shows loading indicator on edit save', async () => {
		resolveWithDelay(mockEditTask);

		renderTask();

		await openEditDialog();

		userEvent.type(screen.getByLabelText('Due Date *'), '{backspace}1{enter}');

		userEvent.click(screen.getByText('Save'));

		await screen.findByRole('progressbar');
	});

	it('closes edit dialog on save', async () => {
		loadNowDate('2/1/2020, 11:59 PM');

		renderTask();

		await openEditDialog();

		userEvent.type(screen.getByLabelText('Due Date *'), '{backspace}1{enter}');

		userEvent.click(screen.getByText('Save'));

		await waitFor(() => {
			expect(screen.queryByLabelText('Due Date *')).not.toBeInTheDocument();
		});
	});

	// TODO
	// allow reducing pledge, extending deadline in first n minutes
});
