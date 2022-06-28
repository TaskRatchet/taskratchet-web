import * as new_api from '../../lib/api';
import { addTask, getTasks, updateTask } from '../../lib/api';
import toaster from '../../lib/Toaster';
import {
	act,
	fireEvent,
	render,
	waitFor,
	screen,
} from '@testing-library/react';
import Tasks from './Tasks';
import React from 'react';
import userEvent from '@testing-library/user-event';
import {
	loadNowDate,
	loadTasksApiData,
	makeTask,
	resolveWithDelay,
	withMutedReactQueryLogger,
} from '../../lib/test/helpers';
import { QueryClient, QueryClientProvider } from 'react-query';
import { getUnloadMessage } from '../../lib/getUnloadMessage';
import browser from '../../lib/Browser';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { mockReactListRef } from '../../__mocks__/react-list';
import { editTask } from '../../lib/api/editTask';

jest.mock('../../lib/api/apiFetch');
jest.mock('../../lib/api/getTasks');
jest.mock('../../lib/api/getMe');
jest.mock('../../lib/api/updateTask');
jest.mock('../../lib/api/getTimezones');
jest.mock('../../lib/api/addTask');
jest.mock('../../lib/Toaster');
jest.mock('../../lib/LegacyApi');
jest.mock('../../lib/getUnloadMessage');
jest.mock('../../lib/api/editTask');
jest.mock('react-ga');

const mockEditTask = editTask as jest.Mock;

global.document.createRange = () =>
	({
		setStart: () => {
			/* noop */
		},
		setEnd: () => {
			/* noop */
		},
		commonAncestorContainer: {
			nodeName: 'BODY',
			ownerDocument: document,
		},
	} as unknown as Range);

const expectTaskSave = async ({
	task,
	due,
	cents = 500,
}: {
	task: string;
	due: Date;
	cents?: number;
}) => {
	const dueString = due.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	});

	await waitFor(() => expect(addTask).toBeCalledWith(task, dueString, cents));
};

const expectCheckboxState = (
	task: string,
	expected: boolean,
	getCheckbox: any
) => {
	const checkbox = getCheckbox(task);

	expect(checkbox.checked).toEqual(expected);
};

const renderTasksPage = () => {
	const queryClient = new QueryClient();
	const getters = render(
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<QueryClientProvider client={queryClient}>
				<Tasks lastToday={undefined} />
			</QueryClientProvider>
		</LocalizationProvider>
	);
	const { getByLabelText, getByText, debug } = getters;

	return {
		queryClient,
		openForm: () => waitFor(() => userEvent.click(getByLabelText('add'))),
		getTaskInput: () => getByLabelText('Task *') as HTMLInputElement,
		getDueInput: () => getByLabelText('due date') as HTMLInputElement,
		getAddButton: () => getByText('Add') as HTMLButtonElement,
		getCheckbox: (task = 'the_task'): HTMLInputElement | null | undefined => {
			const desc = getByText(task);
			return desc
				?.closest('.molecule-task')
				?.querySelector('[type="checkbox"]');
		},
		clickCheckbox: (task = 'the_task') => {
			const desc = getByText(task);
			const checkbox = desc
				?.closest('.molecule-task')
				?.querySelector('[type="checkbox"]');

			if (!checkbox) {
				debug();
				throw Error('Missing task checkbox');
			}

			userEvent.click(checkbox);
		},
		...getters,
	};
};

describe('tasks page', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		loadNowDate(new Date('10/29/2020'));
		jest.spyOn(browser, 'scrollIntoView').mockImplementation(() => undefined);
	});

	it('loads tasks', async () => {
		loadTasksApiData({ tasks: [makeTask()] });

		const { getByText } = renderTasksPage();

		await waitFor(() => expect(getByText('the_task')).toBeDefined());
	});

	// it("saves task with free entry", async () => {
	//     loadNow(new Date('10/29/2020'))
	//     loadApiData()
	//
	//     const {taskInput, addButton} = renderTasksPage()
	//
	//     await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled())
	//
	//     await userEvent.type(taskInput, "the_task by friday or pay $5")
	//     userEvent.click(addButton)
	//
	//     await expectTaskSave({
	//         task: "the_task by friday or pay $5",
	//         due: new Date('10/30/2020 11:59 PM'),
	//     })
	// })

	it('saves task', async () => {
		loadNowDate(new Date('10/29/2020'));
		loadTasksApiData();

		const { getTaskInput, getAddButton, getByLabelText } = renderTasksPage();

		await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled());

		/* Open new task form */
		userEvent.click(getByLabelText('add'));

		await userEvent.type(getTaskInput(), 'the_task');
		userEvent.click(getAddButton());

		await expectTaskSave({
			task: 'the_task',
			due: new Date('11/05/2020 11:59 PM'),
			cents: 500,
		});
	});

	it("doesn't accept empty task", async () => {
		await act(async () => {
			loadTasksApiData();

			const { getAddButton, openForm } = renderTasksPage();

			await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled());

			await openForm();

			await waitFor(() => userEvent.click(getAddButton()));

			expect(new_api.addTask).not.toHaveBeenCalled();
		});
	});

	it('displays error on empty task submit', async () => {
		await act(async () => {
			loadTasksApiData();

			const { getAddButton, getByText, openForm } = renderTasksPage();

			await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled());

			await openForm();

			await waitFor(() => userEvent.click(getAddButton()));

			expect(getByText('Task is required')).toBeDefined();
		});
	});

	it('displays timezone', async () => {
		loadTasksApiData({ me: { timezone: 'the_timezone' } });

		const { getByText, openForm } = renderTasksPage();

		await openForm();

		await waitFor(() => expect(getByText('the_timezone')).toBeDefined());
	});

	it('tells api task is complete', async () => {
		loadTasksApiData({
			tasks: [makeTask({ id: '3' })],
		});

		const { clickCheckbox } = renderTasksPage();

		await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled());

		clickCheckbox();

		await waitFor(() =>
			expect(updateTask).toBeCalledWith('3', { complete: true })
		);
	});

	it('reloads tasks', async () => {
		loadTasksApiData({
			tasks: [makeTask({ id: '3' })],
		});

		const { clickCheckbox } = renderTasksPage();

		await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled());

		clickCheckbox();

		await waitFor(() => expect(new_api.getTasks).toBeCalledTimes(2));
	});

	it('toasts task creation failure', async () => {
		await withMutedReactQueryLogger(async () => {
			loadTasksApiData();
			jest.spyOn(new_api, 'addTask').mockImplementation(() => {
				throw new Error('Failed to add task');
			});

			const { getTaskInput, getAddButton, openForm } = renderTasksPage();

			await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled());

			await openForm();

			await userEvent.type(getTaskInput(), 'the_task by Friday or pay $5');
			userEvent.click(getAddButton());

			await waitFor(() =>
				expect(toaster.send).toBeCalledWith('Error: Failed to add task')
			);
		});
	});

	it('toasts task creation exception', async () => {
		await withMutedReactQueryLogger(async () => {
			loadTasksApiData();

			jest.spyOn(new_api, 'addTask').mockImplementation(() => {
				throw Error('Oops!');
			});

			const { getTaskInput, getAddButton, openForm } = renderTasksPage();

			await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled());

			await openForm();

			await userEvent.type(getTaskInput(), 'the_task by Friday or pay $5');
			userEvent.click(getAddButton());

			await waitFor(() => expect(toaster.send).toBeCalledWith('Error: Oops!'));
		});
	});

	it('toasts task toggle exception', async () => {
		await withMutedReactQueryLogger(async () => {
			loadTasksApiData({
				tasks: [makeTask({ id: '3' })],
			});

			jest.spyOn(new_api, 'updateTask').mockImplementation(() => {
				throw Error('Oops!');
			});

			const { clickCheckbox } = renderTasksPage();

			await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled());

			clickCheckbox();

			await waitFor(() => expect(toaster.send).toBeCalledWith('Error: Oops!'));
		});
	});

	it('updates checkboxes optimistically', async () => {
		loadTasksApiData({
			tasks: [makeTask({ id: '3' })],
		});

		const { clickCheckbox, getCheckbox } = renderTasksPage();

		await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled());

		clickCheckbox();

		await waitFor(() => {
			const taskCheckbox = getCheckbox();
			expect(taskCheckbox?.checked).toBeTruthy();
		});
	});

	it('rolls back checkbox optimistic update', async () => {
		await withMutedReactQueryLogger(async () => {
			loadTasksApiData({
				tasks: [makeTask({ id: '3', status: 'pending' })],
			});

			const { clickCheckbox, getCheckbox } = renderTasksPage();

			await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled());

			jest.spyOn(new_api, 'updateTask').mockRejectedValue('Oops!');

			clickCheckbox();

			await waitFor(() => {
				const checkbox = getCheckbox();
				expect(checkbox?.checked).toBeTruthy();
			});

			await waitFor(() => {
				const checkbox = getCheckbox();
				expect(checkbox?.checked).toBeFalsy();
			});
		});
	});

	it('gets unload warning', async () => {
		loadTasksApiData({
			tasks: [makeTask({ id: '3' })],
		});

		const { clickCheckbox } = renderTasksPage();

		await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled());

		const event = new Event('beforeunload');

		clickCheckbox();
		fireEvent(window, event);

		expect(getUnloadMessage).toBeCalled();
	});

	it('checking multiple tasks not clobbered by invalidated queries', async () => {
		// Setup & initial render

		loadTasksApiData({
			tasks: [
				makeTask({ task: 'first', id: '3' }),
				makeTask({ task: 'second', id: '4' }),
			],
		});

		const { clickCheckbox, getCheckbox } = renderTasksPage();

		await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled());

		// Load slow query response to clobber

		resolveWithDelay(jest.spyOn(new_api, 'getTasks'), 100, [
			makeTask({ task: 'first', id: '3', status: 'complete', complete: true }),
			makeTask({ task: 'second', id: '4', status: 'pending' }),
		]);

		// Check first task

		clickCheckbox('first');

		// Wait for slow response to be requested

		await waitFor(() => expect(new_api.getTasks).toBeCalledTimes(2));

		// Load second, fast response

		jest.spyOn(new_api, 'getTasks').mockResolvedValue([
			makeTask({
				task: 'first',
				id: '3',
				status: 'complete',
				complete: true,
			}),
			makeTask({
				task: 'second',
				id: '4',
				status: 'complete',
				complete: true,
			}),
		]);

		// Check second task

		clickCheckbox('second');

		// Sleep 200ms

		await new Promise((resolve) => setTimeout(resolve, 200));

		// Check that first, slow response didn't clobber second, fast response

		expectCheckboxState('second', true, getCheckbox);
	});

	it('has stakes form', async () => {
		loadTasksApiData();

		const { getByText, openForm } = renderTasksPage();

		await openForm();

		expect(getByText('Stakes')).toBeInTheDocument();
	});

	it('adds task optimistically', async () => {
		const { getTaskInput, getAddButton, getByText, openForm } =
			renderTasksPage();

		await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled());

		await openForm();

		await userEvent.type(getTaskInput(), 'the_task');
		userEvent.click(getAddButton());

		await waitFor(() => expect(getByText('the_task')).toBeInTheDocument());
	});

	it('rolls back task add if mutation fails', async () => {
		await withMutedReactQueryLogger(async () => {
			loadTasksApiData();

			jest.spyOn(new_api, 'addTask').mockRejectedValue('Oops!');

			const {
				getTaskInput,
				getAddButton,
				getByText,
				queryByText,
				openForm,
				baseElement,
			} = renderTasksPage();

			await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled());

			await openForm();

			await userEvent.type(getTaskInput(), 'the_task');
			userEvent.click(getAddButton());

			const bg = baseElement.querySelector('.MuiBackdrop-root');

			if (!bg) throw new Error('could not find bg');

			userEvent.click(bg);

			await waitFor(() => {
				expect(getByText('the_task')).toBeInTheDocument();
			});

			await waitFor(() => {
				expect(queryByText('the_task')).toBeNull();
			});
		});
	});

	it('cancels fetches on-mutate', async () => {
		await act(async () => {
			// Setup & initial render

			loadTasksApiData();

			const { getTaskInput, getAddButton, getByText, openForm } =
				renderTasksPage();

			await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled());

			// Load slow query response to clobber

			resolveWithDelay(jest.spyOn(new_api, 'getTasks'), 100, [
				makeTask({ task: 'first', id: '3' }),
			]);

			// Add first task

			await openForm();

			await waitFor(async () => {
				await userEvent.type(getTaskInput(), 'first');
				userEvent.click(getAddButton());
			});

			// Wait for slow response to be requested

			await waitFor(() => expect(new_api.getTasks).toBeCalledTimes(2));

			// Load second, fast response

			jest
				.spyOn(new_api, 'getTasks')
				.mockResolvedValue([
					makeTask({ task: 'first', id: '3' }),
					makeTask({ task: 'second', id: '4' }),
				]);

			// Add second task

			await userEvent.type(
				getTaskInput(),
				'{backspace}{backspace}{backspace}{backspace}{backspace}second'
			);
			userEvent.click(getAddButton());

			// Sleep 200ms

			await new Promise((resolve) => setTimeout(resolve, 200));

			// Check that first, slow response didn't clobber second, fast response

			expect(getByText('second')).toBeInTheDocument();
		});
	});

	it('shows all tasks', async () => {
		loadTasksApiData({
			tasks: [makeTask({ complete: true })],
		});

		const { getByText } = renderTasksPage();

		await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled());

		expect(getByText('the_task')).toBeInTheDocument();
	});

	it('shows date headings', async () => {
		loadTasksApiData({
			tasks: [makeTask({ due: '5/22/2020, 11:59 PM' })],
		});

		const { getByText } = renderTasksPage();

		await waitFor(() => expect(new_api.getTasks).toHaveBeenCalled());

		expect(getByText('May 22, 2020')).toBeInTheDocument();
	});

	it('scrolls next section into view', async () => {
		loadNowDate(new Date('3/22/2020'));

		loadTasksApiData({
			tasks: [
				makeTask({ due: '1/22/2020, 11:59 PM' }),
				makeTask({ due: '1/22/2020, 11:59 PM' }),
				makeTask({ due: '1/22/2020, 11:59 PM' }),
				makeTask({ due: '1/22/2020, 11:59 PM' }),
				makeTask({ due: '1/22/2020, 11:59 PM' }),
				makeTask({ due: '1/22/2020, 11:59 PM' }),
				makeTask({ due: '1/22/2020, 11:59 PM' }),
				makeTask({ due: '1/22/2020, 11:59 PM' }),
				makeTask({ due: '1/22/2020, 11:59 PM' }),
				makeTask({ due: '1/22/2020, 11:59 PM' }),
				makeTask({ due: '1/22/2020, 11:59 PM' }),
				makeTask({ due: '1/22/2020, 11:59 PM' }),
				makeTask({ due: '1/22/2020, 11:59 PM' }),
				makeTask({ due: '1/22/2020, 11:59 PM' }),
				makeTask({ due: '1/22/2020, 11:59 PM' }),
				makeTask({ due: '1/22/2020, 11:59 PM' }),
				makeTask({ due: '1/22/2020, 11:59 PM' }),
				makeTask({ due: '1/22/2020, 11:59 PM' }),
				makeTask({ due: '1/22/2020, 11:59 PM' }),
				makeTask({ due: '1/22/2020, 11:59 PM' }),
				makeTask({ due: '1/22/2020, 11:59 PM' }),
				makeTask({ due: '5/22/2020, 11:59 PM' }),
				makeTask({ due: '7/22/2020, 11:59 PM' }),
			],
		});

		const { getByText } = renderTasksPage();

		await waitFor(() =>
			expect(getByText((s) => s.indexOf('May') !== -1)).toBeInTheDocument()
		);
	});

	it('scrolls new task into view', async () => {
		loadTasksApiData();

		const { getTaskInput, getAddButton, getByText, openForm } =
			renderTasksPage();

		loadTasksApiData({
			tasks: [makeTask({ task: 'new_task' })],
		});

		await openForm();

		userEvent.type(getTaskInput(), 'new_task');
		userEvent.click(getAddButton());

		await waitFor(() => {
			expect(getByText('new_task')).toBeInTheDocument();
		});
	});

	it('immediately renders future new task', async () => {
		loadNowDate(new Date('1/1/2020'));

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

		const { getTaskInput, getDueInput, getAddButton, getByText, openForm } =
			renderTasksPage();

		await waitFor(() => {
			expect(getByText('task 1')).toBeInTheDocument();
		});

		await openForm();

		userEvent.type(getTaskInput(), 'new_task');
		userEvent.type(getDueInput(), '{backspace}9');

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

		userEvent.click(getAddButton());

		await waitFor(() => {
			const el = getByText('January 8, 2029');
			expect(el).toBeInTheDocument();
		});
	});

	it('does not show empty state while loading', async () => {
		loadTasksApiData({
			tasks: [makeTask({ complete: true })],
		});

		const { queryByText } = renderTasksPage();

		expect(queryByText('Nothing here!')).not.toBeInTheDocument();
	});

	it('scrolls list', async () => {
		loadNowDate(new Date('1/1/2020'));

		loadTasksApiData({
			tasks: [makeTask()],
		});

		renderTasksPage();

		await waitFor(() => {
			expect(mockReactListRef.scrollTo).toBeCalled();
		});
	});

	it('does not scroll list on page refocus', async () => {
		loadNowDate(new Date('1/1/2020'));

		loadTasksApiData({
			tasks: [makeTask()],
		});

		const { queryClient } = renderTasksPage();

		await waitFor(() => {
			expect(mockReactListRef.scrollTo).toBeCalled();
		});

		loadTasksApiData({
			tasks: [makeTask()],
		});

		await queryClient.invalidateQueries('tasks');

		await waitFor(() => {
			expect(getTasks).toBeCalledTimes(2);
		});

		expect(mockReactListRef.scrollTo).toBeCalledTimes(1);
	});

	it('reloads tasks on task edit save', async () => {
		loadTasksApiData({
			tasks: [makeTask()],
		});
		mockEditTask.mockResolvedValue('result');

		renderTasksPage();

		await waitFor(() =>
			expect(screen.getByText('the_task')).toBeInTheDocument()
		);

		userEvent.click(screen.getByLabelText('Menu'));
		userEvent.click(screen.getByText('Edit'));

		await waitFor(() => {
			expect(screen.getByLabelText('Due Date *')).toBeInTheDocument();
		});

		userEvent.click(screen.getByText('Save'));

		await waitFor(() => {
			expect(getTasks).toBeCalledTimes(2);
		});
	});

	it('creates multiple tasks, one per line', async () => {
		const view = renderTasksPage();

		await view.openForm();

		userEvent.type(view.getTaskInput(), 'task1{enter}task2');
		userEvent.click(view.getAddButton());

		await waitFor(() => {
			expect(new_api.addTask).toBeCalledWith(
				'task1',
				expect.anything(),
				expect.anything()
			);
		});
	});
});

// TODO:
// lazy load API data for tasks
// Fail on console errors: https://github.com/facebook/jest/issues/6121#issuecomment-529591574
