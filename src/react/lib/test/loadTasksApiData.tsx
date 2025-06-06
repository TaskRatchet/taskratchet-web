import { vi } from 'vitest';
import { makeResponse } from './makeResponse';
import {
	type User,
	addTask,
	getMe,
	getTasks,
	updateTask,
} from '@taskratchet/sdk';
import { makeTask } from './makeTask';

export const loadTasksApiData = ({
	tasks = [],
	me = {},
}: { tasks?: TaskType[]; me?: Partial<User> } = {}): void => {
	vi.mocked(getTasks).mockResolvedValue(tasks);
	vi.mocked(getMe).mockResolvedValue(me as User);
	vi.mocked(updateTask).mockResolvedValue(makeResponse() as Response);
	vi.mocked(addTask).mockResolvedValue(makeTask());
};
