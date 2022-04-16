import { loadNowDate, loadTasksApiData, makeTask } from './lib/test/helpers';
import browser from './lib/Browser';
import { render } from '@testing-library/react';
import React from 'react';
import { App } from './App';
import userEvent from '@testing-library/user-event';
import { useSession } from './lib/api/useSession';
import { MemoryRouter } from 'react-router-dom';
import { mockReactListRef } from './__mocks__/react-list';
import { waitFor } from '@testing-library/dom';
import { addTask } from './lib/api';

jest.mock('./lib/api/getTasks');
jest.mock('./lib/api/getMe');
jest.mock('./lib/api/updateTask');
jest.mock('./lib/api/addTask');
jest.mock('./lib/api/useSession');
jest.mock('./components/molecules/LoadingIndicator');
jest.mock('react-ga');

const mockUseSession = useSession as jest.Mock;

function renderPage() {
	mockUseSession.mockReturnValue({
		email: 'the_email',
	});

	const getters = render(
		<MemoryRouter initialEntries={['/']}>
			<App />
		</MemoryRouter>
	);
	const { getByText, getByLabelText } = getters;

	return {
		openForm: () => waitFor(() => userEvent.click(getByLabelText('add'))),
		getTaskInput: () => getByLabelText('Task *') as HTMLInputElement,
		getDueInput: () => getByLabelText('Due Date *') as HTMLInputElement,
		getStakesInput: () => getByLabelText('Stakes *') as HTMLInputElement,
		getAddButton: () => getByText('Add') as HTMLButtonElement,
		clickCheckbox: (task = 'the_task') => {
			const desc = getByText(task);
			const checkbox = desc.previousElementSibling;

			if (!checkbox) {
				throw Error('Missing task checkbox');
			}

			userEvent.click(checkbox);
		},
		...getters,
	};
}

describe('App', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		loadNowDate(new Date('10/29/2020'));
		jest.spyOn(browser, 'scrollIntoView').mockImplementation(() => undefined);
	});

	it('re-scrolls tasks list when today icon clicked', async () => {
		loadNowDate(new Date('1/1/2020'));

		loadTasksApiData({
			tasks: [makeTask({ due: '1/1/2020, 11:59 PM', task: 'task 1' })],
		});

		const { getByLabelText } = renderPage();

		await new Promise(process.nextTick);

		userEvent.click(getByLabelText('today'));

		await waitFor(() => {
			expect(mockReactListRef.scrollTo).toHaveBeenCalledWith(0);
		});
	});

	it('has filter entries', async () => {
		const { getByLabelText } = renderPage();

		userEvent.click(getByLabelText('filters'));

		expect(getByLabelText('toggle filter pending')).toBeInTheDocument();
		expect(getByLabelText('toggle filter complete')).toBeInTheDocument();
		expect(getByLabelText('toggle filter expired')).toBeInTheDocument();
	});

	it('checks items by default', async () => {
		const { getByLabelText } = renderPage();

		userEvent.click(getByLabelText('filters'));

		expect(getByLabelText('pending')).toBeChecked();
	});

	it('toggles checkmark when entry clicked', async () => {
		const { getByLabelText, getByText } = renderPage();

		userEvent.click(getByLabelText('filters'));
		userEvent.click(getByText('pending'));

		expect(getByLabelText('pending')).not.toBeChecked();
	});

	it('persists checked state when reopening menu', async () => {
		const { getByLabelText, getByText, baseElement } = renderPage();

		userEvent.click(getByLabelText('filters'));
		userEvent.click(getByText('pending'));

		const backdrop = baseElement.querySelector('.MuiBackdrop-root');

		if (backdrop === null) throw new Error('No backdrop');

		userEvent.click(backdrop);
		userEvent.click(getByLabelText('filters'));

		expect(getByLabelText('pending')).not.toBeChecked();
	});

	it('persists checked state on reload', async () => {
		const { getByLabelText, getByText, unmount } = renderPage();

		userEvent.click(getByLabelText('filters'));
		userEvent.click(getByText('pending'));

		unmount();

		const { getByLabelText: getByLabelTextTwo } = renderPage();

		userEvent.click(getByLabelTextTwo('filters'));

		expect(getByLabelTextTwo('pending')).not.toBeChecked();
	});

	it('filters tasks', async () => {
		loadNowDate(new Date('1/1/2020'));

		loadTasksApiData({
			tasks: [makeTask({ due: '1/1/2020, 11:59 PM', task: 'task 1' })],
		});

		const { getByLabelText, getByText, queryByText } = renderPage();

		await waitFor(() => {
			expect(getByText('task 1')).toBeInTheDocument();
		});

		userEvent.click(getByLabelText('filters'));
		userEvent.click(getByLabelText('toggle filter pending'));

		expect(queryByText('task 1')).not.toBeInTheDocument();
	});

	it('scrolls to new task', async () => {
		loadNowDate(new Date('1/1/2020'));

		const { getTaskInput, getAddButton, openForm } = renderPage();

		await openForm();

		userEvent.type(getTaskInput(), 'task 1');
		userEvent.click(getAddButton());

		await waitFor(() => {
			expect(mockReactListRef.scrollTo).toHaveBeenCalledWith(1);
		});
	});

	it('scrolls to today', async () => {
		loadNowDate(new Date('1/7/2020'));

		loadTasksApiData({
			tasks: [
				makeTask({ due: '1/1/2020, 11:59 PM', task: 'task 1' }),
				makeTask({ due: '1/7/2020, 11:59 PM', task: 'task 1' }),
			],
		});

		const { getByLabelText } = renderPage();

		userEvent.click(getByLabelText('today'));

		await waitFor(() => {
			expect(mockReactListRef.scrollTo).toHaveBeenCalledWith(2);
		});
	});

	it('prevents adding task with due date in the past', async () => {
		loadNowDate('1/1/2023');

		const { getByText, openForm, getDueInput } = renderPage();

		await openForm();

		await userEvent.type(getDueInput(), '{backspace}0');

		userEvent.click(getByText('Add'));

		await waitFor(() => {
			expect(getByText('Due date must be in the future')).toBeInTheDocument();
		});

		expect(addTask).not.toBeCalled();
	});

	it('allows user to create new task based on existing task', async () => {
		// User should be able to select "Copy" from a task's context menu. This
		// should open the "New Task" form, prefilling the form with the existing
		// task's title, due date, and stakes.

		loadTasksApiData({
			tasks: [makeTask({ task: 'the_task' })],
		});

		const { getByLabelText, getByText, getTaskInput } = renderPage();

		await waitFor(() => {
			expect(getByText('the_task')).toBeInTheDocument();
		});

		userEvent.click(getByLabelText('Menu'));
		userEvent.click(getByText('Copy'));

		expect(getTaskInput()).toBeInTheDocument();
	});

	it('copies task name into form when copying task', async () => {
		loadTasksApiData({
			tasks: [makeTask({ task: 'the_task' })],
		});

		const { getByLabelText, getByText, getTaskInput } = renderPage();

		await waitFor(() => {
			expect(getByText('the_task')).toBeInTheDocument();
		});

		userEvent.click(getByLabelText('Menu'));
		userEvent.click(getByText('Copy'));

		expect(getTaskInput()).toHaveValue('the_task');
	});

	it('copies task due date into form when copying task', async () => {
		loadNowDate('2/1/2000');

		loadTasksApiData({
			tasks: [makeTask({ due: '1/1/2020, 11:59 PM' })],
		});

		const { getByLabelText, getByText, getDueInput } = renderPage();

		await waitFor(() => {
			expect(getByText('the_task')).toBeInTheDocument();
		});

		userEvent.click(getByLabelText('Menu'));
		userEvent.click(getByText('Copy'));

		expect(getDueInput()).toHaveValue('01/01/2020');
	});

	it('copies task stakes into form when copying task', async () => {
		loadTasksApiData({
			tasks: [makeTask({ cents: 100 })],
		});

		const { getByLabelText, getByText, getStakesInput } = renderPage();

		await waitFor(() => {
			expect(getByText('the_task')).toBeInTheDocument();
		});

		userEvent.click(getByLabelText('Menu'));
		userEvent.click(getByText('Copy'));

		expect(getStakesInput()).toHaveValue(1);
	});

	it('sets date input to one week in future when copying task with due date in past', async () => {
		loadNowDate('2/1/2020');

		loadTasksApiData({
			tasks: [makeTask({ due: '1/1/2020, 11:59 PM' })],
		});

		const { getByLabelText, getByText, getDueInput } = renderPage();

		await waitFor(() => {
			expect(getByText('the_task')).toBeInTheDocument();
		});

		userEvent.click(getByLabelText('Menu'));
		userEvent.click(getByText('Copy'));

		expect(getDueInput()).toHaveValue('02/08/2020');
	});

	it('closes menu when clicking copy', async () => {
		loadTasksApiData({
			tasks: [makeTask({ task: 'the_task' })],
		});

		const { getByLabelText, getByText } = renderPage();

		await waitFor(() => {
			expect(getByText('the_task')).toBeInTheDocument();
		});

		userEvent.click(getByLabelText('Menu'));
		userEvent.click(getByText('Copy'));

		await waitFor(() => {
			expect(getByText('Copy')).not.toBeVisible();
		});
	});
});

// TODO: only highlights task on creation, not on re-load from server
// do this by using a new: bool prop on newly-created tasks for highlight filtering
