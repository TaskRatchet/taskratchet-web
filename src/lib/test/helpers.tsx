import { addTask } from '../api/addTask';
import { getTasks } from '../api/getTasks';
import { updateTask } from '../api/updateTask';
import { vi, Mock } from 'vitest';
import { getMe } from '../api/getMe';
import { updateMe } from '../api/updateMe';

const makeResponse = (
	args: {
		ok?: boolean;
		json?: Record<string, unknown>;
	} = {}
): Partial<Response> => {
	const { ok = true, json = null } = args;

	return {
		ok,
		json: () => Promise.resolve(json),
		text(): Promise<string> {
			return Promise.resolve(JSON.stringify(json));
		},
	};
};

export const loadMe = ({
	json = {},
	ok = true,
}: {
	json?: Partial<User>;
	ok?: boolean;
} = {}): void => {
	const response = makeResponse({ json, ok });

	vi.mocked(getMe).mockResolvedValue(json as User);
	vi.mocked(updateMe).mockResolvedValue(response as Response);
};

export const loadTasksApiData = ({
	tasks = [],
	me = {},
}: { tasks?: TaskType[]; me?: Partial<User> } = {}): void => {
	vi.mocked(getTasks).mockResolvedValue(tasks);
	vi.mocked(getMe).mockResolvedValue(me as User);

	vi.mocked(updateTask).mockResolvedValue(makeResponse() as Response);
	vi.mocked(addTask).mockResolvedValue(makeResponse() as Response);
};
