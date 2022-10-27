import { loadTasksApiData, renderWithQueryProvider } from './lib/test/helpers';
import { makeTask } from './lib/test/makeTask';
import browser from './lib/Browser';
import React from 'react';
import { App } from './App';
import userEvent from '@testing-library/user-event';
import { useSession } from './lib/api/useSession';
import { MemoryRouter } from 'react-router-dom';
import { __listRef } from 'react-list';
import { waitFor, screen } from '@testing-library/react';
import { addTask } from './lib/api/addTask';
import getQueryClient from './lib/getQueryClient';
import { QueryClient } from 'react-query';
import loadControlledPromise from './lib/test/loadControlledPromise';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';

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
		</MemoryRouter>
	);
}

describe('App', () => {
	beforeEach(() => {
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
			})
		);
	});

	it('re-scrolls tasks list when today icon clicked', async () => {
		vi.setSystemTime(new Date('1/1/2020'));

		loadTasksApiData({
			tasks: [makeTask({ due: '1/1/2020, 11:59 PM', task: 'task 1' })],
		});

		renderPage();

		await userEvent.click(await screen.findByLabelText('today'));

		await waitFor(() => {
			expect(__listRef.scrollTo).toHaveBeenCalledWith(0);
		});
	});

	it('has filter entries', async () => {
		renderPage();

		await userEvent.click(await screen.findByLabelText('filters'));

		expect(
			await screen.findByLabelText('toggle filter pending')
		).toBeInTheDocument();
		expect(
			await screen.findByLabelText('toggle filter complete')
		).toBeInTheDocument();
		expect(
			await screen.findByLabelText('toggle filter expired')
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

		const backdrop = await screen.findByTestId('mui-backdrop');

		await userEvent.click(backdrop);
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
			tasks: [makeTask({ due: '1/1/2020, 11:59 PM', task: 'task 1' })],
		});

		renderPage();

		await waitFor(() => {
			expect(screen.getByText('task 1')).toBeInTheDocument();
		});

		await userEvent.click(await screen.findByLabelText('filters'));
		await userEvent.click(
			await screen.findByLabelText('toggle filter pending')
		);

		await waitFor(() => {
			expect(screen.queryByText('task 1')).not.toBeInTheDocument();
		});
	});

	it('scrolls to new task', async () => {
		vi.setSystemTime(new Date('1/1/2020'));

		renderPage();

		await openForm();

		const { reject } = loadControlledPromise(addTask);

		await userEvent.type(await screen.findByLabelText('Task *'), 'task 1');
		await userEvent.click(screen.getByText('Add'));

		await waitFor(() => {
			expect(__listRef.scrollTo).toHaveBeenCalledWith(1);
		});

		reject();
	});

	it('scrolls to today', async () => {
		vi.setSystemTime(new Date('1/7/2020'));

		loadTasksApiData({
			tasks: [
				makeTask({ due: '1/1/2020, 11:59 PM', task: 'task 1' }),
				makeTask({ due: '1/7/2020, 11:59 PM', task: 'task 1' }),
			],
		});

		renderPage();

		await userEvent.click(await screen.findByLabelText('today'));

		await waitFor(() => {
			expect(__listRef.scrollTo).toHaveBeenCalledWith(2);
		});
	});

	it('prevents adding task with due date in the past', async () => {
		vi.setSystemTime(new Date('1/1/2023'));

		renderPage();

		await openForm();

		await userEvent.type(await screen.findByLabelText('Task *'), 'new_task');

		await userEvent.type(
			await screen.findByLabelText('Due Date *'),
			'{backspace}0'
		);

		expect(await screen.findByLabelText('Due Date *')).toHaveValue(
			'01/08/2020'
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
			tasks: [makeTask({ due: '1/1/2020, 11:59 PM' })],
		});

		renderPage();

		await waitFor(() => {
			expect(screen.getByText('the_task')).toBeInTheDocument();
		});

		await userEvent.click(await screen.findByLabelText('Menu'));
		await userEvent.click(screen.getByText('Copy'));

		expect(await screen.findByLabelText('Due Date *')).toHaveValue(
			'01/01/2020'
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
			tasks: [makeTask({ due: '1/1/2020, 11:59 PM' })],
		});

		renderPage();

		await screen.findByText('the_task');

		await userEvent.click(await screen.findByLabelText('Menu'));
		await userEvent.click(screen.getByText('Copy'));

		expect(await screen.findByLabelText('Due Date *')).toHaveValue(
			'02/08/2020'
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
			await screen.findByLabelText('toggle filter pending')
		);

		await waitFor(() => {
			expect(screen.getByText('1')).toBeInTheDocument();
		});
	});

	it('counts number of enabled filters', async () => {
		renderPage();

		await userEvent.click(await screen.findByLabelText('filters'));

		await userEvent.click(
			await screen.findByLabelText('toggle filter pending')
		);
		await screen.findByText('1'); // TODO Resolve race condition to remove this line
		await userEvent.click(
			await screen.findByLabelText('toggle filter complete')
		);

		expect(await screen.findByText('2')).toBeInTheDocument();
	});
});
