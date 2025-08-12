import { addTask, editTask, getTasks, updateTask } from '@taskratchet/sdk';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'react-toastify';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { getUnloadMessage } from '../../lib/getUnloadMessage';
import loadControlledPromise from '../../lib/test/loadControlledPromise';
import { loadTasksApiData } from '../../lib/test/loadTasksApiData';
import { makeTask } from '../../lib/test/makeTask';
import { findTaskCheckbox } from '../../lib/test/queries';
import { renderWithQueryProvider } from '../../lib/test/renderWithQueryProvider';
import { withMutedReactQueryLogger } from '../../lib/test/withMutedReactQueryLogger';
import Tasks from './Tasks';

vi.mock('../../lib/api/fetch1');
vi.mock('../../lib/api/getTasks');
vi.mock('../../lib/api/getMe');
vi.mock('../../lib/api/updateTask');
vi.mock('../../lib/api/getTimezones');
vi.mock('../../lib/api/addTask');
vi.mock('../../lib/LegacyApi');
vi.mock('../../lib/getUnloadMessage');
vi.mock('../../lib/api/editTask');
vi.mock('react-ga');
vi.mock('react-list');
vi.mock('react-toastify');

const mockEditTask = editTask as Mock;

const expectTaskSave = async ({
	task,
	due,
	cents = 500,
}: {
	task: string;
	due: Date;
	cents?: number;
}) => {
	expect(screen.queryByRole('alert')).not.toBeInTheDocument();

	await waitFor(() => expect(addTask).toBeCalled());

	expect(addTask).toBeCalledWith({ task, due: due.getTime() / 1000, cents });
};

const renderTasksPage = () => {
	const view = renderWithQueryProvider(<Tasks lastToday={undefined} />);

	return {
		openForm: async () => {
			await screen.findByLabelText('add');
			await userEvent.click(screen.getByLabelText('add'));
		},
		getTaskInput: () => screen.getByLabelText('Task *'),
		getDueInput: () => screen.getByLabelText('due date'),
		getAddButton: () => screen.getByText('Add'),
		clickCheckbox: async (task = 'the_task') => {
			const checkbox = await findTaskCheckbox(task);

			await userEvent.click(checkbox);
		},
		...view,
	};
};

describe('tasks page', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		vi.setSystemTime(new Date('10/29/2020'));
		loadTasksApiData();
	});

	it('loads tasks', async () => {
		loadTasksApiData({ tasks: [makeTask()] });

		renderTasksPage();

		expect(await screen.findByText('the_task')).toBeInTheDocument();
	});

	it('saves task', async () => {
		vi.setSystemTime(new Date('10/29/2020'));
		loadTasksApiData();

		renderTasksPage();

		await waitFor(() => expect(getTasks).toHaveBeenCalled());

		/* Open new task form */
		await userEvent.click(screen.getByLabelText('add'));

		await userEvent.type(await screen.findByLabelText(/^Task/), 'the_task');
		await userEvent.click(screen.getByText('Add'));

		await expectTaskSave({
			task: 'the_task',
			due: new Date('11/05/2020 11:59 PM'),
			cents: 500,
		});
	});

	it("doesn't accept empty task", async () => {
		loadTasksApiData();

		const { getAddButton, openForm } = renderTasksPage();

		await waitFor(() => {
			expect(getTasks).toHaveBeenCalled();
		});

		await openForm();
		await screen.findByText('Add');

		await userEvent.click(getAddButton());

		expect(addTask).not.toHaveBeenCalled();
	});

	it('displays timezone', async () => {
		loadTasksApiData({ me: { timezone: 'the_timezone' } });

		const { openForm } = renderTasksPage();

		await openForm();

		await screen.findByText('the_timezone');
	});

	it('tells api task is complete', async () => {
		loadTasksApiData({
			tasks: [makeTask({ id: '3' })],
		});

		const { clickCheckbox } = renderTasksPage();

		await waitFor(() => expect(getTasks).toHaveBeenCalled());

		await clickCheckbox();

		await waitFor(() =>
			expect(updateTask).toBeCalledWith('3', { complete: true }),
		);
	});

	it('reloads tasks', async () => {
		loadTasksApiData({
			tasks: [makeTask({ id: '3' })],
		});

		const { clickCheckbox } = renderTasksPage();

		await waitFor(() => expect(getTasks).toHaveBeenCalled());

		await clickCheckbox();

		await waitFor(() => expect(getTasks).toBeCalledTimes(2));
	});

	it('toasts task creation failure', async () => {
		await withMutedReactQueryLogger(async () => {
			loadTasksApiData();
			vi.mocked(addTask).mockImplementation(() => {
				throw new Error('Failed to add task');
			});

			const { getTaskInput, getAddButton, openForm } = renderTasksPage();

			await waitFor(() => expect(getTasks).toHaveBeenCalled());

			await openForm();

			await userEvent.type(getTaskInput(), 'the_task by Friday or pay $5');
			await userEvent.click(getAddButton());

			await waitFor(() =>
				expect(toast).toBeCalledWith('Error: Failed to add task'),
			);
		});
	});

	it('toasts task creation exception', async () => {
		await withMutedReactQueryLogger(async () => {
			loadTasksApiData();

			vi.mocked(addTask).mockImplementation(() => {
				throw Error('Oops!');
			});

			const { getTaskInput, getAddButton, openForm } = renderTasksPage();

			await waitFor(() => expect(getTasks).toHaveBeenCalled());

			await openForm();

			await userEvent.type(getTaskInput(), 'the_task by Friday or pay $5');
			await userEvent.click(getAddButton());

			await waitFor(() => expect(toast).toBeCalledWith('Error: Oops!'));
		});
	});

	it('toasts task toggle exception', async () => {
		await withMutedReactQueryLogger(async () => {
			loadTasksApiData({
				tasks: [makeTask({ id: '3' })],
			});

			vi.mocked(updateTask).mockImplementation(() => {
				throw Error('Oops!');
			});

			const { clickCheckbox } = renderTasksPage();

			await waitFor(() => expect(getTasks).toHaveBeenCalled());

			await clickCheckbox();

			await waitFor(() => expect(toast).toBeCalledWith('Error: Oops!'));
		});
	});

	it('updates checkboxes optimistically', async () => {
		loadTasksApiData({
			tasks: [makeTask({ id: '3' })],
		});

		const { clickCheckbox } = renderTasksPage();

		await waitFor(() => expect(getTasks).toHaveBeenCalled());

		const { resolve } = loadControlledPromise(getTasks);

		await clickCheckbox();

		await waitFor(async () => {
			const taskCheckbox = await findTaskCheckbox();
			expect(taskCheckbox?.checked).toBeTruthy();
		});

		resolve();
	});

	it('rolls back checkbox optimistic update', async () => {
		await withMutedReactQueryLogger(async () => {
			loadTasksApiData({
				tasks: [makeTask({ id: '3', status: 'pending' })],
			});

			const { clickCheckbox } = renderTasksPage();

			await waitFor(() => expect(getTasks).toHaveBeenCalled());
			const { reject } = loadControlledPromise(updateTask);
			await clickCheckbox();

			await waitFor(async () => {
				const checkbox = await findTaskCheckbox();
				expect(checkbox?.checked).toBeTruthy();
			});

			reject();

			await waitFor(async () => {
				const checkbox = await findTaskCheckbox();
				expect(checkbox?.checked).toBeFalsy();
			});
		});
	});

	it('gets unload warning', async () => {
		loadTasksApiData({
			tasks: [makeTask({ id: '3' })],
		});

		const { clickCheckbox } = renderTasksPage();

		await waitFor(() => expect(getTasks).toHaveBeenCalled());

		const event = new Event('beforeunload');

		await clickCheckbox();
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

		const { clickCheckbox } = renderTasksPage();

		await waitFor(() => expect(getTasks).toHaveBeenCalled());

		// Load slow query response to clobber

		const { resolve } = loadControlledPromise(getTasks);

		// Check first task

		await clickCheckbox('first');

		// Wait for slow response to be requested

		await waitFor(() => expect(getTasks).toBeCalledTimes(2));

		// Load second, fast response

		vi.mocked(getTasks).mockResolvedValue([
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

		await clickCheckbox('second');
		await waitFor(async () => {
			const checkbox = await findTaskCheckbox('second');
			if (!checkbox) {
				throw new Error('missing checkbox');
			}
			expect(checkbox).toBeChecked();
		});
		// Resolve getTasks promise

		resolve([
			makeTask({ task: 'first', id: '3', status: 'complete', complete: true }),
			makeTask({ task: 'second', id: '4', status: 'pending' }),
		]);

		// Check that first, slow response didn't clobber second, fast response

		const checkboxLater = await findTaskCheckbox('second');
		if (!checkboxLater) {
			throw new Error('missing checkbox');
		}
		expect(checkboxLater).toBeChecked();
	});

	it('has stakes form', async () => {
		loadTasksApiData();

		const { openForm } = renderTasksPage();

		await openForm();

		expect(screen.getByText('Stakes')).toBeInTheDocument();
	});

	it('adds task optimistically', async () => {
		const { getTaskInput, getAddButton, openForm } = renderTasksPage();

		await waitFor(() => expect(getTasks).toHaveBeenCalled());

		await openForm();

		await userEvent.type(getTaskInput(), 'the_task');
		await userEvent.click(getAddButton());

		expect(await screen.findByText('the_task')).toBeInTheDocument();
	});

	it('rolls back task add if mutation fails', async () => {
		await withMutedReactQueryLogger(async () => {
			loadTasksApiData();

			const { reject } = loadControlledPromise(addTask);

			const { getTaskInput, getAddButton, openForm } = renderTasksPage();

			await waitFor(() => expect(getTasks).toHaveBeenCalled());

			await openForm();

			await userEvent.type(getTaskInput(), 'the_task');
			await userEvent.click(getAddButton());

			await userEvent.click(await screen.findByText('Cancel'));

			await waitFor(() => {
				expect(screen.getByText('the_task')).toBeInTheDocument();
			});

			reject();

			await waitFor(() => {
				expect(screen.queryByText('the_task')).not.toBeInTheDocument();
			});
		});
	});

	it('shows all tasks', async () => {
		loadTasksApiData({
			tasks: [makeTask({ complete: true })],
		});

		renderTasksPage();

		await waitFor(() => expect(getTasks).toHaveBeenCalled());

		expect(await screen.findByText('the_task')).toBeInTheDocument();
	});

	it('shows date headings', async () => {
		loadTasksApiData({
			tasks: [
				makeTask({ due: new Date('5/22/2020, 11:59 PM').getTime() / 1000 }),
			],
		});

		renderTasksPage();

		await waitFor(() => expect(getTasks).toHaveBeenCalled());

		expect(await screen.findByText('May 22, 2020')).toBeInTheDocument();
	});

	it('scrolls next section into view', async () => {
		vi.setSystemTime(new Date('3/22/2020'));

		loadTasksApiData({
			tasks: [
				makeTask({ due: new Date('1/22/2020, 11:59 PM').getTime() / 1000 }),
				makeTask({ due: new Date('1/22/2020, 11:59 PM').getTime() / 1000 }),
				makeTask({ due: new Date('1/22/2020, 11:59 PM').getTime() / 1000 }),
				makeTask({ due: new Date('1/22/2020, 11:59 PM').getTime() / 1000 }),
				makeTask({ due: new Date('1/22/2020, 11:59 PM').getTime() / 1000 }),
				makeTask({ due: new Date('1/22/2020, 11:59 PM').getTime() / 1000 }),
				makeTask({ due: new Date('1/22/2020, 11:59 PM').getTime() / 1000 }),
				makeTask({ due: new Date('1/22/2020, 11:59 PM').getTime() / 1000 }),
				makeTask({ due: new Date('1/22/2020, 11:59 PM').getTime() / 1000 }),
				makeTask({ due: new Date('1/22/2020, 11:59 PM').getTime() / 1000 }),
				makeTask({ due: new Date('1/22/2020, 11:59 PM').getTime() / 1000 }),
				makeTask({ due: new Date('1/22/2020, 11:59 PM').getTime() / 1000 }),
				makeTask({ due: new Date('1/22/2020, 11:59 PM').getTime() / 1000 }),
				makeTask({ due: new Date('1/22/2020, 11:59 PM').getTime() / 1000 }),
				makeTask({ due: new Date('1/22/2020, 11:59 PM').getTime() / 1000 }),
				makeTask({ due: new Date('1/22/2020, 11:59 PM').getTime() / 1000 }),
				makeTask({ due: new Date('1/22/2020, 11:59 PM').getTime() / 1000 }),
				makeTask({ due: new Date('1/22/2020, 11:59 PM').getTime() / 1000 }),
				makeTask({ due: new Date('1/22/2020, 11:59 PM').getTime() / 1000 }),
				makeTask({ due: new Date('1/22/2020, 11:59 PM').getTime() / 1000 }),
				makeTask({ due: new Date('1/22/2020, 11:59 PM').getTime() / 1000 }),
				makeTask({ due: new Date('5/22/2020, 11:59 PM').getTime() / 1000 }),
				makeTask({ due: new Date('7/22/2020, 11:59 PM').getTime() / 1000 }),
			],
		});

		renderTasksPage();

		expect(
			await screen.findByText((s) => s.indexOf('May') !== -1),
		).toBeInTheDocument();
	});

	it('scrolls new task into view', async () => {
		loadTasksApiData();

		const { getTaskInput, getAddButton, openForm } = renderTasksPage();

		loadTasksApiData({
			tasks: [makeTask({ task: 'new_task' })],
		});

		await openForm();

		await userEvent.type(getTaskInput(), 'new_task');

		await userEvent.click(getAddButton());

		await userEvent.clear(getTaskInput());

		await waitFor(() => {
			expect(screen.getByText('new_task')).toBeInTheDocument();
		});
	});

	it('immediately renders future new task', async () => {
		vi.setSystemTime(new Date('1/1/2020'));

		loadTasksApiData({
			tasks: [
				makeTask({
					due: new Date('1/1/2020, 11:59 PM').getTime() / 1000,
					task: 'task 1',
				}),
				makeTask({
					due: new Date('1/2/2020, 11:59 PM').getTime() / 1000,
					task: 'task 2',
				}),
				makeTask({
					due: new Date('1/3/2020, 11:59 PM').getTime() / 1000,
					task: 'task 3',
				}),
				makeTask({
					due: new Date('1/4/2020, 11:59 PM').getTime() / 1000,
					task: 'task 4',
				}),
				makeTask({
					due: new Date('1/5/2020, 11:59 PM').getTime() / 1000,
					task: 'task 5',
				}),
				makeTask({
					due: new Date('1/6/2020, 11:59 PM').getTime() / 1000,
					task: 'task 6',
				}),
				makeTask({
					due: new Date('1/7/2020, 11:59 PM').getTime() / 1000,
					task: 'task 7',
				}),
				makeTask({
					due: new Date('1/8/2020, 11:59 PM').getTime() / 1000,
					task: 'task 8',
				}),
				makeTask({
					due: new Date('1/9/2020, 11:59 PM').getTime() / 1000,
					task: 'task 9',
				}),
				makeTask({
					due: new Date('1/10/2020, 11:59 PM').getTime() / 1000,
					task: 'task 10',
				}),
				makeTask({
					due: new Date('1/11/2020, 11:59 PM').getTime() / 1000,
					task: 'task 11',
				}),
				makeTask({
					due: new Date('1/12/2020, 11:59 PM').getTime() / 1000,
					task: 'task 12',
				}),
				makeTask({
					due: new Date('1/13/2020, 11:59 PM').getTime() / 1000,
					task: 'task 13',
				}),
				makeTask({
					due: new Date('1/14/2020, 11:59 PM').getTime() / 1000,
					task: 'task 14',
				}),
				makeTask({
					due: new Date('1/15/2020, 11:59 PM').getTime() / 1000,
					task: 'task 15',
				}),
			],
		});

		const { getTaskInput, getDueInput, getAddButton, openForm } =
			renderTasksPage();

		await waitFor(() => {
			expect(screen.getByText('task 1')).toBeInTheDocument();
		});

		await openForm();

		await userEvent.type(getTaskInput(), 'new_task');
		await userEvent.type(getDueInput(), '{backspace}9');

		loadTasksApiData({
			tasks: [
				makeTask({
					due: new Date('1/1/2020, 11:59 PM').getTime() / 1000,
					task: 'task 1',
				}),
				makeTask({
					due: new Date('1/2/2020, 11:59 PM').getTime() / 1000,
					task: 'task 2',
				}),
				makeTask({
					due: new Date('1/3/2020, 11:59 PM').getTime() / 1000,
					task: 'task 3',
				}),
				makeTask({
					due: new Date('1/4/2020, 11:59 PM').getTime() / 1000,
					task: 'task 4',
				}),
				makeTask({
					due: new Date('1/5/2020, 11:59 PM').getTime() / 1000,
					task: 'task 5',
				}),
				makeTask({
					due: new Date('1/6/2020, 11:59 PM').getTime() / 1000,
					task: 'task 6',
				}),
				makeTask({
					due: new Date('1/7/2020, 11:59 PM').getTime() / 1000,
					task: 'task 7',
				}),
				makeTask({
					due: new Date('1/8/2020, 11:59 PM').getTime() / 1000,
					task: 'task 8',
				}),
				makeTask({
					due: new Date('1/9/2020, 11:59 PM').getTime() / 1000,
					task: 'task 9',
				}),
				makeTask({
					due: new Date('1/10/2020, 11:59 PM').getTime() / 1000,
					task: 'task 10',
				}),
				makeTask({
					due: new Date('1/11/2020, 11:59 PM').getTime() / 1000,
					task: 'task 11',
				}),
				makeTask({
					due: new Date('1/12/2020, 11:59 PM').getTime() / 1000,
					task: 'task 12',
				}),
				makeTask({
					due: new Date('1/13/2020, 11:59 PM').getTime() / 1000,
					task: 'task 13',
				}),
				makeTask({
					due: new Date('1/14/2020, 11:59 PM').getTime() / 1000,
					task: 'task 14',
				}),
				makeTask({
					due: new Date('1/15/2020, 11:59 PM').getTime() / 1000,
					task: 'task 15',
				}),
				makeTask({
					due: new Date('1/8/2029, 11:59 PM').getTime() / 1000,
					task: 'new_task',
					cents: 500,
				}),
			],
		});

		await userEvent.click(getAddButton());

		await waitFor(() => {
			expect(getTasks).toBeCalledTimes(2);
		});
		await screen.findByText('January 8, 2029');
	});

	it('does not show empty state while loading', () => {
		loadTasksApiData({
			tasks: [makeTask({ complete: true })],
		});

		renderTasksPage();

		expect(screen.queryByText('Nothing here!')).not.toBeInTheDocument();
	});

	it('reloads tasks on task edit save', async () => {
		loadTasksApiData({
			tasks: [makeTask()],
		});
		mockEditTask.mockResolvedValue('result');

		renderTasksPage();

		await screen.findByText('the_task');

		await userEvent.click(screen.getByLabelText('Menu'));
		await userEvent.click(screen.getByText('Edit'));

		await waitFor(() => {
			expect(screen.getByLabelText('Due Date *')).toBeInTheDocument();
		});

		await userEvent.click(screen.getByText('Save'));

		await waitFor(() => {
			expect(getTasks).toBeCalledTimes(2);
		});
	});

	it('creates multiple tasks, one per line', async () => {
		const view = renderTasksPage();

		await view.openForm();

		await userEvent.type(view.getTaskInput(), 'task1{enter}task2');
		await userEvent.click(view.getAddButton());

		await waitFor(() => {
			expect(addTask).toBeCalledWith(
				expect.objectContaining({
					task: 'task1',
				}),
			);
		});
	});
});
