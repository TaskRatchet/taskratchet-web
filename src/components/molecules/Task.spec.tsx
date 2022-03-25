import Task from './Task';
import React from 'react';
import { renderWithQueryProvider } from '../../lib/test/helpers';
import userEvent from '@testing-library/user-event';
import { updateTask } from '../../lib/api';
import { waitFor } from '@testing-library/dom';
import browser from '../../lib/Browser';
import { editTask } from '../../lib/api/editTask';

jest.mock('../../lib/api/updateTask');
jest.mock('date-fns');
jest.mock('../../lib/api/getMe');
jest.mock('../../lib/api/addTask');
jest.mock('../../lib/api/editTask');

describe('Task component', () => {
	beforeEach(() => {
		jest.spyOn(browser, 'scrollIntoView').mockImplementation(() => undefined);
	});

	it('disables checkbox for tasks without id', async () => {
		const { container } = await renderWithQueryProvider(
			<Task
				task={{
					due: 'the_due',
					cents: 100,
					task: 'the_task',
					status: 'pending',
					timezone: 'Etc/GMT',
					complete: false,
				}}
			/>
		);

		const checkbox = container.querySelector('input') as HTMLInputElement;

		userEvent.click(checkbox);

		expect(checkbox.checked).toBeFalsy();
	});

	it('has task menu', async () => {
		const { getByLabelText } = await renderWithQueryProvider(
			<Task
				task={{
					due: 'the_due',
					cents: 100,
					task: 'the_task',
					id: 'the_id',
					status: 'pending',
					timezone: 'Etc/GMT',
					complete: false,
				}}
			/>
		);

		expect(getByLabelText('Menu')).toBeInTheDocument();
	});

	it('has uncle menu item', async () => {
		const { getByLabelText, getByText } = await renderWithQueryProvider(
			<Task
				task={{
					due: 'the_due',
					cents: 100,
					task: 'the_task',
					id: 'the_id',
					status: 'pending',
					timezone: 'Etc/GMT',
					complete: false,
				}}
			/>
		);

		const menuButton = getByLabelText('Menu');

		userEvent.click(menuButton);

		expect(getByText('Charge immediately')).toBeInTheDocument();
	});

	it('uncles', async () => {
		const { getByLabelText, getByText } = await renderWithQueryProvider(
			<Task
				task={{
					due: 'the_due',
					cents: 100,
					task: 'the_task',
					id: 'the_id',
					status: 'pending',
					timezone: 'Etc/GMT',
					complete: false,
				}}
			/>
		);

		userEvent.click(getByLabelText('Menu'));
		userEvent.click(getByText('Charge immediately'));

		await waitFor(() =>
			expect(updateTask).toBeCalledWith('the_id', {
				uncle: true,
			})
		);
	});

	it('disables entry for expired tasks', async () => {
		const { getByText } = await renderWithQueryProvider(
			<Task
				task={{
					due: 'the_due',
					cents: 100,
					task: 'the_task',
					id: 'the_id',
					status: 'expired',
					timezone: 'Etc/GMT',
					complete: false,
				}}
			/>
		);

		const desc = getByText('the_task') as HTMLElement;
		const item = desc.closest('.MuiListItem-root') as HTMLElement;

		expect(item.querySelector('input')).not.toBeInTheDocument();
	});

	it('replaces checkbox with icon for expired tasks', async () => {
		const { container } = await renderWithQueryProvider(
			<Task
				task={{
					due: 'the_due',
					cents: 100,
					task: 'the_task',
					id: 'the_id',
					status: 'expired',
					timezone: 'Etc/GMT',
					complete: false,
				}}
			/>
		);

		expect(container.querySelector('input')).not.toBeInTheDocument();
	});

	it('disables uncle button if task not pending', async () => {
		const { getByLabelText, getByText } = await renderWithQueryProvider(
			<Task
				task={{
					due: 'the_due',
					cents: 100,
					task: 'the_task',
					id: 'the_id',
					status: 'expired',
					timezone: 'Etc/GMT',
					complete: false,
				}}
			/>
		);

		const menuButton = getByLabelText('Menu');

		userEvent.click(menuButton);

		expect(getByText('Charge immediately')).toHaveAttribute('aria-disabled');
	});

	it('allows cents edit', async () => {
		const { getByLabelText, getByText } = await renderWithQueryProvider(
			<Task
				task={{
					complete: false,
					due: '2/1/2022, 11:59 PM',
					cents: 100,
					task: 'the_task',
					id: 'the_id',
					status: 'pending',
					timezone: 'Etc/GMT',
				}}
			/>
		);

		userEvent.click(getByLabelText('Menu'));
		userEvent.click(getByText('Edit'));

		await waitFor(() => {
			getByLabelText('Stakes *');
		});

		userEvent.type(getByLabelText('Stakes *'), '5');
		userEvent.click(getByText('Save'));

		await waitFor(() => {
			expect(editTask).toBeCalledWith('the_id', '2/1/2022, 11:59 PM', 1500);
		});
	});

	it('closes task menu on edit click', async () => {
		const { getByLabelText, getByText, queryByAltText } =
			await renderWithQueryProvider(
				<Task
					task={{
						due: '2/1/2022, 11:59 PM',
						cents: 100,
						task: 'the_task',
						id: 'the_id',
						status: 'pending',
						complete: false,
						timezone: 'Est/GMT',
					}}
				/>
			);

		userEvent.click(getByLabelText('Menu'));
		userEvent.click(getByText('Edit'));

		expect(queryByAltText('Edit')).not.toBeInTheDocument();
	});

	it('allows date edit', async () => {
		const { getByLabelText, getByText } = await renderWithQueryProvider(
			<Task
				task={{
					due: '2/1/2022, 11:59 PM',
					cents: 100,
					task: 'the_task',
					id: 'the_id',
					status: 'pending',
					complete: false,
					timezone: 'Est/GMT',
				}}
			/>
		);

		userEvent.click(getByLabelText('Menu'));
		userEvent.click(getByText('Edit'));

		await waitFor(() => {
			expect(getByLabelText('Due Date *')).toHaveValue('02/01/2022');
		});

		userEvent.type(getByLabelText('Due Date *'), '{backspace}5{enter}');

		await waitFor(() => {
			expect(getByLabelText('Due Date *')).toHaveValue('02/01/2025');
		});

		userEvent.click(getByText('Save'));

		await waitFor(() => {
			expect(editTask).toBeCalledWith('the_id', '2/1/2025, 11:59 PM', 100);
		});
	});

	it('disables edit if task is not pending', async () => {
		const { getByLabelText, getByText } = await renderWithQueryProvider(
			<Task
				task={{
					due: '2/1/2022, 11:59 PM',
					cents: 100,
					task: 'the_task',
					id: 'the_id',
					status: 'complete',
					complete: true,
					timezone: 'Est/GMT',
				}}
			/>
		);

		userEvent.click(getByLabelText('Menu'));

		expect(getByText('Edit')).toHaveAttribute('aria-disabled');
	});

	// TODO: test uncle button confirms action
	// TODO: only allows editing pending tasks; disables button otherwise
	// TODO: triggers task list reload
	// TODO: only allow editing task in first n minutes
	// TODO: allow reducing pledge, extending deadline in first n minutes
});
