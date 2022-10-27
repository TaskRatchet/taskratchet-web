import { addTask } from '../api/addTask';
import { getTasks } from '../api/getTasks';
import { updateTask } from '../api/updateTask';
import { vi } from 'vitest';
import { getMe } from '../api/getMe';
import { makeResponse } from './makeResponse';

export const loadTasksApiData = ({
	tasks = [],
	me = {},
}: { tasks?: TaskType[]; me?: Partial<User> } = {}): void => {
	vi.mocked(getTasks).mockResolvedValue(tasks);
	vi.mocked(getMe).mockResolvedValue(me as User);

	vi.mocked(updateTask).mockResolvedValue(makeResponse() as Response);
	vi.mocked(addTask).mockResolvedValue(makeResponse() as Response);
};
