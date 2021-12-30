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
		taskInput: getByLabelText('Task *') as HTMLInputElement,
		dueInput: getByLabelText('Due Date *') as HTMLInputElement,
		addButton: getByText('Add') as HTMLButtonElement,
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

		userEvent.click(getByLabelText('today'));

		await waitFor(() => {
			expect(mockReactListRef.scrollTo).toHaveBeenCalledWith(0);
		});
	});
});

// TODO: only highlights task on creation, not on re-load from server
// do this by using a new: bool prop on newly-created tasks for highlight filtering
