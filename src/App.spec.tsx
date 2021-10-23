import { loadNow, loadTasksApiData, makeTask } from './lib/test/helpers';
import browser from './lib/Browser';
import { render, waitFor } from '@testing-library/react';
import { updateTask } from './lib/api';
import React from 'react';
import { App } from './App';
import userEvent from '@testing-library/user-event';
import { useSession } from './lib/api/useSession';
import { MemoryRouter } from 'react-router-dom';

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
		taskInput: getByLabelText('Task *') as HTMLInputElement,
		dueInput: getByLabelText('Due Date *') as HTMLInputElement,
		addButton: getByText('Add') as HTMLButtonElement,
		clickCheckbox: (task = 'the_task') => {
			const desc = getByText(task),
				checkbox = desc.previousElementSibling;

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
			tasks: [
				makeTask({ due: '1/1/2020, 11:59 PM', task: 'task 1' }),
				makeTask({ due: '1/2/2020, 11:59 PM', task: 'task 2' }),
				makeTask({ due: '1/3/2020, 11:59 PM', task: 'task 3' }),
				makeTask({ due: '1/4/2020, 11:59 PM', task: 'task 4' }),
				makeTask({ due: '1/5/2020, 11:59 PM', task: 'task 5' }),
				makeTask({ due: '1/6/2020, 11:59 PM', task: 'task 6' }),
				makeTask({ due: '1/7/2020, 11:59 PM', task: 'task 7' }),
				makeTask({ due: '1/8/2020, 11:59 PM', task: 'task 8' }),
				makeTask({ due: '1/9/2020, 11:59 PM', task: 'task 9' }),
				makeTask({ due: '1/10/2020, 11:59 PM', task: 'task 10' }),
				makeTask({ due: '1/11/2020, 11:59 PM', task: 'task 11' }),
				makeTask({ due: '1/12/2020, 11:59 PM', task: 'task 12' }),
				makeTask({ due: '1/13/2020, 11:59 PM', task: 'task 13' }),
				makeTask({ due: '1/14/2020, 11:59 PM', task: 'task 14' }),
				makeTask({ due: '1/15/2020, 11:59 PM', task: 'task 15' }),
			],
		});

		const {
			taskInput,
			dueInput,
			addButton,
			getByText,
			getByLabelText,
			findByText,
		} = renderPage();

		await waitFor(() => {
			expect(getByText('task 1')).toBeInTheDocument();
		});

		userEvent.type(taskInput, 'new_task');
		userEvent.type(dueInput, '{backspace}9');

		loadTasksApiData({
			tasks: [
				makeTask({ due: '1/1/2020, 11:59 PM', task: 'task 1' }),
				makeTask({ due: '1/2/2020, 11:59 PM', task: 'task 2' }),
				makeTask({ due: '1/3/2020, 11:59 PM', task: 'task 3' }),
				makeTask({ due: '1/4/2020, 11:59 PM', task: 'task 4' }),
				makeTask({ due: '1/5/2020, 11:59 PM', task: 'task 5' }),
				makeTask({ due: '1/6/2020, 11:59 PM', task: 'task 6' }),
				makeTask({ due: '1/7/2020, 11:59 PM', task: 'task 7' }),
				makeTask({ due: '1/8/2020, 11:59 PM', task: 'task 8' }),
				makeTask({ due: '1/9/2020, 11:59 PM', task: 'task 9' }),
				makeTask({ due: '1/10/2020, 11:59 PM', task: 'task 10' }),
				makeTask({ due: '1/11/2020, 11:59 PM', task: 'task 11' }),
				makeTask({ due: '1/12/2020, 11:59 PM', task: 'task 12' }),
				makeTask({ due: '1/13/2020, 11:59 PM', task: 'task 13' }),
				makeTask({ due: '1/14/2020, 11:59 PM', task: 'task 14' }),
				makeTask({ due: '1/15/2020, 11:59 PM', task: 'task 15' }),
				makeTask({ due: '1/8/2029, 11:59 PM', task: 'new_task', cents: 500 }),
			],
		});

		userEvent.click(addButton);

		await waitFor(() => {
			const el = getByText('January 8, 2029');
			expect(el).toBeInTheDocument();
		});

		userEvent.click(getByLabelText('today'));

		await findByText('January 1, 2020');
	});
});

// TODO: only highlights task on creation, not on re-load from server
// do this by using a new: bool prop on newly-created tasks for highlight filtering
