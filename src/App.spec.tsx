import { loadNowDate, loadTasksApiData, makeTask } from './lib/test/helpers';
import browser from './lib/Browser';
import { render } from '@testing-library/react';
import React from 'react';
import { App } from './App';
import userEvent from '@testing-library/user-event';
import { useSession } from './lib/api/useSession';
import { MemoryRouter } from 'react-router-dom';
import { __listRef } from 'react-list';
import { waitFor, screen } from '@testing-library/dom';
import { addTask } from './lib/api';
import { vi, Mock } from 'vitest';
import getQueryClient from './lib/getQueryClient';
import { QueryClient } from 'react-query';
import loadControlledPromise from './lib/test/loadControlledPromise';

vi.mock('./lib/api/getTasks');
vi.mock('./lib/api/getMe');
vi.mock('./lib/api/updateTask');
vi.mock('./lib/api/addTask');
vi.mock('./lib/api/useSession');
vi.mock('./components/molecules/LoadingIndicator');
vi.mock('react-ga');
vi.mock('react-list');
vi.mock('./lib/getQueryClient');

const mockUseSession = useSession as Mock;

const openForm = () => userEvent.click(screen.getByLabelText('add'));

const getDueInput = () =>
	screen.getByLabelText('Due Date *') as HTMLInputElement;

function renderPage() {
	mockUseSession.mockReturnValue({
		email: 'the_email',
	});

	return render(
		<MemoryRouter initialEntries={['/']}>
			<App />
		</MemoryRouter>
	);
}

describe('App', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		loadNowDate(new Date('10/29/2020'));
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
		loadNowDate(new Date('1/1/2020'));

		loadTasksApiData({
			tasks: [makeTask({ due: '1/1/2020, 11:59 PM', task: 'task 1' })],
		});

		renderPage();

		await new Promise(process.nextTick);

		userEvent.click(screen.getByLabelText('today'));

		await waitFor(() => {
			expect(__listRef.scrollTo).toHaveBeenCalledWith(0);
		});
	});

	it('has filter entries', async () => {
		renderPage();

		userEvent.click(screen.getByLabelText('filters'));

		expect(await screen.findByLabelText('toggle filter pending')).toBeInTheDocument();
		expect(screen.getByLabelText('toggle filter complete')).toBeInTheDocument();
		expect(screen.getByLabelText('toggle filter expired')).toBeInTheDocument();
	});

	it('checks items by default', async () => {
		renderPage();

		userEvent.click(screen.getByLabelText('filters'));

		await waitFor(() => {
			expect(screen.getByLabelText('pending')).toBeChecked();
		})
	});

	it('toggles checkmark when entry clicked', async () => {
		renderPage();

		userEvent.click(await screen.findByLabelText('filters'));
		userEvent.click(await screen.findByText('pending'));

		await waitFor(() => {
			expect( screen.getByLabelText('pending')).not.toBeChecked();
		})
	});

	it('persists checked state when reopening menu', async () => {
		const { baseElement } = renderPage();

		userEvent.click(await screen.findByLabelText('filters'));
		userEvent.click(await screen.findByText('pending'));

		const backdrop = baseElement.querySelector('.MuiBackdrop-root');

		if (backdrop === null) throw new Error('No backdrop');

		userEvent.click(backdrop);
		userEvent.click(await screen.findByLabelText('filters'));

		const checkbox = (await screen.findByLabelText(
			'pending'
		)) as HTMLInputElement;

		expect(checkbox).not.toBeChecked();
	});

	it('persists checked state on reload', async () => {
		const { unmount } = renderPage();

		userEvent.click(await screen.findByLabelText('filters'));
		userEvent.click(await screen.findByText('pending'));

		unmount();

		const { getByLabelText: getByLabelTextTwo } = renderPage();

		userEvent.click(getByLabelTextTwo('filters'));

		await waitFor(() => {
			expect(getByLabelTextTwo('pending')).not.toBeChecked();
		});
	});

	it('filters tasks', async () => {
		loadNowDate(new Date('1/1/2020'));

		loadTasksApiData({
			tasks: [makeTask({ due: '1/1/2020, 11:59 PM', task: 'task 1' })],
		});

		renderPage();

		await waitFor(() => {
			expect(screen.getByText('task 1')).toBeInTheDocument();
		});

		userEvent.click(await screen.findByLabelText('filters'));
		userEvent.click(await screen.findByLabelText('toggle filter pending'));

		await waitFor(() => {
			expect(screen.queryByText('task 1')).not.toBeInTheDocument();
		});
	});

	it('scrolls to new task', async () => {
		loadNowDate(new Date('1/1/2020'));

		renderPage();

		openForm();

		const {reject} = loadControlledPromise(addTask);

		userEvent.type(await screen.findByLabelText('Task *'), 'task 1');
		userEvent.click(screen.getByText('Add'));

		await waitFor(() => {
			expect(__listRef.scrollTo).toHaveBeenCalledWith(1);
		});

		reject();
	});

	it('scrolls to today', async () => {
		loadNowDate(new Date('1/7/2020'));

		loadTasksApiData({
			tasks: [
				makeTask({ due: '1/1/2020, 11:59 PM', task: 'task 1' }),
				makeTask({ due: '1/7/2020, 11:59 PM', task: 'task 1' }),
			],
		});

		renderPage();

		userEvent.click(screen.getByLabelText('today'));

		await waitFor(() => {
			expect(__listRef.scrollTo).toHaveBeenCalledWith(2);
		});
	});

	it('prevents adding task with due date in the past', async () => {
		loadNowDate('1/1/2023');

		renderPage();

		openForm();

		userEvent.type(
			await screen.findByLabelText('Task *'),
			'new_task'
		);

		userEvent.type(getDueInput(), '{backspace}0');

		userEvent.click(screen.getByText('Add'));

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

		userEvent.click(screen.getByLabelText('Menu'));
		userEvent.click(screen.getByText('Copy'));

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

		userEvent.click(screen.getByLabelText('Menu'));
		userEvent.click(screen.getByText('Copy'));

		expect(await screen.findByLabelText('Task *')).toHaveValue('the_task');
	});

	it('copies task due date into form when copying task', async () => {
		loadNowDate('2/1/2000');

		loadTasksApiData({
			tasks: [makeTask({ due: '1/1/2020, 11:59 PM' })],
		});

		renderPage();

		await waitFor(() => {
			expect(screen.getByText('the_task')).toBeInTheDocument();
		});

		userEvent.click(screen.getByLabelText('Menu'));
		userEvent.click(screen.getByText('Copy'));

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

		userEvent.click(screen.getByLabelText('Menu'));
		userEvent.click(screen.getByText('Copy'));

		expect(await screen.findByLabelText('Stakes *')).toHaveValue(1);
	});

	it('sets date input to one week in future when copying task with due date in past', async () => {
		loadNowDate('2/1/2020');

		loadTasksApiData({
			tasks: [makeTask({ due: '1/1/2020, 11:59 PM' })],
		});

		renderPage();

		await screen.findByText('the_task');

		userEvent.click(screen.getByLabelText('Menu'));
		userEvent.click(screen.getByText('Copy'));

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

		userEvent.click(screen.getByLabelText('Menu'));
		userEvent.click(screen.getByText('Copy'));

		await waitFor(() => {
			expect(screen.getByText('Copy')).not.toBeVisible();
		});
	});

	it('indicates when filters are enabled', async () => {
		renderPage();

		userEvent.click(await screen.findByLabelText('filters'));
		userEvent.click(await screen.findByLabelText('toggle filter pending'));

		await waitFor(() => {
			expect(screen.getByText('1')).toBeInTheDocument();
		});
	});

	it('counts number of enabled filters', async () => {
		renderPage();

		userEvent.click(screen.getByLabelText('filters'));

		userEvent.click(await screen.findByLabelText('toggle filter pending'));
		await screen.findByText('1'); // TODO Resolve race condition to remove this line
		userEvent.click(await screen.findByLabelText('toggle filter complete'));

		expect(await screen.findByText('2')).toBeInTheDocument();
	});
});
