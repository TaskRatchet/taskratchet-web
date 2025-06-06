import { loadTasksApiData } from './lib/test/loadTasksApiData';
import { renderWithQueryProvider } from './lib/test/renderWithQueryProvider';
import { makeTask } from './lib/test/makeTask';
import * as browser from './lib/browser';
import React from 'react';
import { App } from './App';
import userEvent from '@testing-library/user-event';
import { useSession } from './lib/api/useSession';
import { MemoryRouter } from 'react-router-dom';
import { waitFor, screen } from '@testing-library/react';
import getQueryClient from './lib/getQueryClient';
import { QueryClient } from 'react-query';
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { addTask, getTasks } from '@taskratchet/sdk';

vi.mock('./lib/api/getTasks');
vi.mock('./lib/api/getMe');
vi.mock('./lib/api/updateTask');
vi.mock('./lib/api/addTask');
vi.mock('./lib/api/useSession');
vi.mock('./components/molecules/LoadingIndicator');
vi.mock('react-ga');
vi.mock('react-list');
vi.mock('./lib/getQueryClient');
vi.mock('@mui/x-date-pickers');

const mockUseSession = useSession as Mock;

const openForm = () => userEvent.click(screen.getByLabelText('add'));

function renderPage() {
	mockUseSession.mockReturnValue({
		email: 'the_email',
	});

	return renderWithQueryProvider(
		<MemoryRouter initialEntries={['/']}>
			<App />
		</MemoryRouter>,
	);
}

describe('App', () => {
	beforeEach(() => {
		vi.mocked(getTasks).mockResolvedValue([]);
		vi.setSystemTime(new Date('10/29/2020'));
		vi.spyOn(browser, 'scrollIntoView').mockImplementation(() => undefined);
		window.localStorage.clear();
		vi.mocked(getQueryClient).mockReturnValue(
			new QueryClient({
				defaultOptions: {
					queries: {
						retry: false,
					},
				},
			}),
		);
	});

	it('has filter entries', async () => {
		renderPage();

		await userEvent.click(await screen.findByLabelText('filters'));

		expect(
			await screen.findByLabelText('toggle filter pending'),
		).toBeInTheDocument();
		expect(
			await screen.findByLabelText('toggle filter complete'),
		).toBeInTheDocument();
		expect(
			await screen.findByLabelText('toggle filter expired'),
		).toBeInTheDocument();
	});

	it('checks items by default', async () => {
		renderPage();

		await userEvent.click(await screen.findByLabelText('filters'));

		await waitFor(() => {
			expect(screen.getByLabelText('pending')).toBeChecked();
		});
	});

	it('toggles checkmark when entry clicked', async () => {
		renderPage();

		await userEvent.click(await screen.findByLabelText('filters'));
		await userEvent.click(await screen.findByText('pending'));

		await waitFor(() => {
			expect(screen.getByLabelText('pending')).not.toBeChecked();
		});
	});

	it('persists checked state when reopening menu', async () => {
		renderPage();

		await userEvent.click(await screen.findByLabelText('filters'));
		await userEvent.click(await screen.findByText('pending'));
		await userEvent.click(await screen.findByLabelText('filters'));

		const checkbox = await screen.findByLabelText('pending');

		expect(checkbox).not.toBeChecked();
	});

	it('persists checked state on reload', async () => {
		const { unmount } = renderPage();

		await userEvent.click(await screen.findByLabelText('filters'));
		await userEvent.click(await screen.findByText('pending'));

		unmount();

		const { getByLabelText: getByLabelTextTwo } = renderPage();

		await userEvent.click(getByLabelTextTwo('filters'));

		await waitFor(() => {
			expect(getByLabelTextTwo('pending')).not.toBeChecked();
		});
	});

	it('filters tasks', async () => {
		vi.setSystemTime(new Date('1/1/2020'));

		loadTasksApiData({
			tasks: [
				makeTask({
					due: new Date('1/1/2020, 11:59 PM').getTime() / 1000,
					task: 'task 1',
				}),
			],
		});

		renderPage();

		await waitFor(() => {
			expect(screen.getByText('task 1')).toBeInTheDocument();
		});

		await userEvent.click(await screen.findByLabelText('filters'));
		await userEvent.click(
			await screen.findByLabelText('toggle filter pending'),
		);

		await waitFor(() => {
			expect(screen.queryByText('task 1')).not.toBeInTheDocument();
		});
	});

	it('prevents adding task with due date in the past', async () => {
		vi.setSystemTime(new Date('1/1/2023'));

		renderPage();

		await openForm();

		await userEvent.type(await screen.findByLabelText('Task *'), 'new_task');

		await userEvent.type(
			await screen.findByLabelText('Due Date *'),
			'{backspace}0',
		);

		expect(await screen.findByLabelText('Due Date *')).toHaveValue(
			'01/08/2020',
		);

		await userEvent.click(screen.getByText('Add'));

		await screen.findByText('Due date must be in the future');

		expect(addTask).not.toBeCalled();
	});

	it('allows user to create new task based on existing task', async () => {
		// User should be able to select "Copy" from a task's context menu. This
		// should open the "New Task" form, prefilling the form with the existing
		// task's title, due date, and stakes.

		loadTasksApiData({
			tasks: [makeTask({ task: 'the_task' })],
		});

		renderPage();

		await waitFor(() => {
			expect(screen.getByText('the_task')).toBeInTheDocument();
		});

		await userEvent.click(await screen.findByLabelText('Menu'));
		await userEvent.click(screen.getByText('Copy'));

		expect(await screen.findByLabelText('Task *')).toBeInTheDocument();
	});

	it('copies task name into form when copying task', async () => {
		loadTasksApiData({
			tasks: [makeTask({ task: 'the_task' })],
		});

		renderPage();

		await waitFor(() => {
			expect(screen.getByText('the_task')).toBeInTheDocument();
		});

		await userEvent.click(await screen.findByLabelText('Menu'));
		await userEvent.click(screen.getByText('Copy'));

		expect(await screen.findByLabelText('Task *')).toHaveValue('the_task');
	});

	it('copies task due date into form when copying task', async () => {
		vi.setSystemTime('2/1/2000');

		loadTasksApiData({
			tasks: [
				makeTask({ due: new Date('1/1/2020, 11:59 PM').getTime() / 1000 }),
			],
		});

		renderPage();

		await waitFor(() => {
			expect(screen.getByText('the_task')).toBeInTheDocument();
		});

		await userEvent.click(await screen.findByLabelText('Menu'));
		await userEvent.click(screen.getByText('Copy'));

		expect(await screen.findByLabelText('Due Date *')).toHaveValue(
			'01/01/2020',
		);
	});

	it('copies task stakes into form when copying task', async () => {
		loadTasksApiData({
			tasks: [makeTask({ cents: 100 })],
		});

		renderPage();

		await waitFor(() => {
			expect(screen.getByText('the_task')).toBeInTheDocument();
		});

		await userEvent.click(await screen.findByLabelText('Menu'));
		await userEvent.click(screen.getByText('Copy'));

		expect(await screen.findByLabelText('Stakes *')).toHaveValue(1);
	});

	it('sets date input to one week in future when copying task with due date in past', async () => {
		vi.setSystemTime('2/1/2020');

		loadTasksApiData({
			tasks: [
				makeTask({ due: new Date('1/1/2020, 11:59 PM').getTime() / 1000 }),
			],
		});

		renderPage();

		await screen.findByText('the_task');

		await userEvent.click(await screen.findByLabelText('Menu'));
		await userEvent.click(screen.getByText('Copy'));

		expect(await screen.findByLabelText('Due Date *')).toHaveValue(
			'02/08/2020',
		);
	});

	it('closes menu when clicking copy', async () => {
		loadTasksApiData({
			tasks: [makeTask({ task: 'the_task' })],
		});

		renderPage();

		await waitFor(() => {
			expect(screen.getByText('the_task')).toBeInTheDocument();
		});

		await userEvent.click(await screen.findByLabelText('Menu'));
		await userEvent.click(screen.getByText('Copy'));

		await waitFor(() => {
			expect(screen.getByText('Copy')).not.toBeVisible();
		});
	});

	it('indicates when filters are enabled', async () => {
		renderPage();

		await userEvent.click(await screen.findByLabelText('filters'));
		await userEvent.click(
			await screen.findByLabelText('toggle filter pending'),
		);

		await waitFor(() => {
			expect(screen.getByText('1')).toBeInTheDocument();
		});
	});

	it('counts number of enabled filters', async () => {
		renderPage();

		await userEvent.click(await screen.findByLabelText('filters'));

		await userEvent.click(
			await screen.findByLabelText('toggle filter pending'),
		);
		await screen.findByText('1'); // TODO Resolve race condition to remove this line
		await userEvent.click(
			await screen.findByLabelText('toggle filter complete'),
		);

		expect(await screen.findByText('2')).toBeInTheDocument();
	});
});
