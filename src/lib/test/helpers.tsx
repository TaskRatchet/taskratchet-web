import { ParsedQuery } from 'query-string';
import browser from '../Browser';
import { QueryClient, QueryClientProvider, setLogger } from 'react-query';
import React, { ReactElement } from 'react';
import { render, RenderResult } from '@testing-library/react';
import { addTask } from '../api/addTask';
import { getCheckoutSession } from '../api/getCheckoutSession';
import { getTasks } from '../api/getTasks';
import { getTimezones } from '../api/getTimezones';
import { updateTask } from '../api/updateTask';
import { vi, Mock, expect } from 'vitest';
import { getMe } from '../api/getMe';
import { updateMe } from '../api/updateMe';
import { createTheme, ThemeProvider } from '@mui/material/styles';

vi.mock('../../lib/api/getTimezones');

export const makeResponse = (
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

export const loadMeWithBeeminder = (
	user = 'bm_user',
	goal = 'bm_goal'
): void => {
	loadMe({
		json: {
			integrations: {
				beeminder: { user, goal_new_tasks: goal },
			},
		},
	});
};

export function loadTimezones(timezones: string[] = []): void {
	vi.mocked(getTimezones).mockResolvedValue(timezones);
}

export function loadCheckoutSession(): void {
	vi.mocked(getCheckoutSession).mockResolvedValue({
		id: 'session',
	});
}

export const loadUrlParams = (params: ParsedQuery): void => {
	vi.spyOn(browser, 'getUrlParams').mockReturnValue(params);
};

export const loadNowDate = (dateString: string | Date): void => {
	vi.spyOn(browser, 'getNowDate').mockImplementation(
		() => new Date(dateString)
	);
};

export const loadNowTime = (time: number): void => {
	vi.spyOn(browser, 'getNowTime').mockReturnValue(time);
};

export function renderWithQueryProvider(
	ui: ReactElement
): RenderResult & { queryClient: QueryClient } {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	const theme = createTheme({
		components: {
			MuiBackdrop: {
				defaultProps: {
					component: React.forwardRef(function C(props, ref: any) {
						return <div {...props} ref={ref} data-testid="mui-backdrop" />;
					}),
				} as any,
			},
		},
	});

	const view = render(
		<ThemeProvider theme={theme}>
			<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
		</ThemeProvider>
	);

	return {
		...view,
		queryClient,
	};
}

export function makeTask({
	complete = false,
	due = '5/22/2020, 11:59 PM',
	due_timestamp = undefined,
	id = Math.random().toString(),
	cents = 100,
	task = 'the_task',
	status = complete ? 'complete' : 'pending',
	isNew = undefined,
	timezone = 'Etc/GMT',
}: Partial<TaskType> = {}): TaskType {
	return {
		complete,
		due,
		due_timestamp,
		id,
		cents,
		task,
		status,
		isNew,
		timezone,
	};
}

export async function withMutedReactQueryLogger(
	callback: () => Promise<void>
): Promise<void> {
	setLogger({
		log: () => {
			/* noop */
		},
		warn: () => {
			/* noop */
		},
		error: () => {
			/* noop */
		},
	});

	await callback();

	setLogger(window.console);
}

const loadApiResponse = (
	mock: Mock,
	response: { json?: Record<string, unknown>; ok?: boolean } = {
		json: undefined,
		ok: true,
	}
) => {
	mock.mockReturnValue(makeResponse(response));
};

export const loadTasksApiData = ({
	tasks = [],
	me = {},
}: { tasks?: TaskType[]; me?: Partial<User> } = {}): void => {
	vi.mocked(getTasks).mockResolvedValue(tasks);
	vi.mocked(getMe).mockResolvedValue(me as User);

	loadApiResponse(updateTask as Mock);
	loadApiResponse(addTask as Mock);
};
