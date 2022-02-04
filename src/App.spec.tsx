import { loadNow, loadTasksApiData, makeTask } from './lib/test/helpers';
import browser from './lib/Browser';
import { render } from '@testing-library/react';
import React from 'react';
import { App } from './App';
import userEvent from '@testing-library/user-event';
import { useSession } from './lib/api/useSession';
import { MemoryRouter } from 'react-router-dom';
import { mockReactListRef } from './__mocks__/react-list';
import { waitFor } from '@testing-library/dom';

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
		loadNow(new Date('10/29/2020'));
		jest.spyOn(browser, 'scrollIntoView').mockImplementation(() => undefined);
	});

	it('re-scrolls tasks list when today icon clicked', async () => {
		loadNow(new Date('1/1/2020'));

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
		loadNow(new Date('1/1/2020'));

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
		loadNow(new Date('1/1/2020'));

		const { getTaskInput, getAddButton } = renderPage();

		userEvent.type(getTaskInput(), 'task 1');
		userEvent.click(getAddButton());

		await waitFor(() => {
			expect(mockReactListRef.scrollTo).toHaveBeenCalledWith(1);
		});
	});

	it('scrolls to today', async () => {
		loadNow(new Date('1/7/2020'));

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
});

// TODO: only highlights task on creation, not on re-load from server
// do this by using a new: bool prop on newly-created tasks for highlight filtering
