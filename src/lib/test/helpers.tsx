import * as new_api from '../api';
import { ParsedQuery } from 'query-string';
import browser from '../Browser';
import { QueryClient, QueryClientProvider, setLogger } from 'react-query';
import React, { ReactElement } from 'react';
import { render, RenderResult } from '@testing-library/react';
import { addTask, updateTask } from '../api';
import { waitFor } from '@testing-library/dom';

jest.mock('../../lib/api/getTimezones');

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
}): void => {
	const response = makeResponse({ json, ok });

	jest.spyOn(new_api, 'getMe').mockResolvedValue(json as User);
	jest.spyOn(new_api, 'updateMe').mockResolvedValue(response as Response);
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
	jest.spyOn(new_api, 'getTimezones').mockResolvedValue(timezones);
}

export function loadCheckoutSession(): void {
	jest.spyOn(new_api, 'getCheckoutSession').mockResolvedValue({
		id: 'session',
	});
}

export const loadUrlParams = (params: ParsedQuery): void => {
	jest.spyOn(browser, 'getUrlParams').mockReturnValue(params);
};

export const loadNow = (date: Date): void => {
	const clone = new Date(date.getTime());
	jest
		.spyOn(browser, 'getNow')
		.mockImplementation(() => new Date(clone.getTime()));
};

export function expectLoadingOverlay(
	container: HTMLElement,
	options: {
		shouldExist?: boolean;
		extraClasses?: string;
	} = {}
): void {
	const { shouldExist = true, extraClasses = '' } = options;

	expect(
		container.getElementsByClassName(`loading ${extraClasses}`).length
	).toBe(+shouldExist);
}

export function expectLoadingSpinner(
	getByLabelText: (text: string) => HTMLElement | null,
	options: {
		shouldExist?: boolean;
		extraClasses?: string;
	} = {}
): void {
	const { shouldExist = true } = options;

	if (shouldExist) {
		expect(getByLabelText('loading')).toBeInTheDocument();
	} else {
		expect(getByLabelText('loading')).not.toBeInTheDocument();
	}
}

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

	const result = render(
		<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
	);

	return {
		...result,
		queryClient,
	};
}

export function sleep<Type>({
	ms = 50,
	value = undefined,
}: { ms?: number; value?: Type } = {}): Promise<Type> {
	return new Promise((resolve) =>
		setTimeout(() => {
			resolve(value);
		}, ms)
	);
}

export function resolveWithDelay(
	mock: jest.SpyInstance,
	ms = 50,
	value: unknown = undefined
): void {
	mock.mockImplementation(() => sleep({ ms, value }));
}

export function makeTask({
	complete = false,
	due = '5/22/2020, 11:59 PM',
	id = Math.random(),
	cents = 0,
	task = 'the_task',
	status = 'pending',
	isNew = undefined,
}: Partial<TaskType> = {}): TaskType {
	return {
		complete,
		due,
		id,
		cents,
		task,
		status,
		isNew,
	};
}

export async function withMutedReactQueryLogger(
	callback: () => void
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
	mock: jest.Mock,
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
	jest.spyOn(new_api, 'getTasks').mockResolvedValue(tasks);
	jest.spyOn(new_api, 'getMe').mockResolvedValue(me as User);

	loadApiResponse(updateTask as jest.Mock);
	loadApiResponse(addTask as jest.Mock);
};

export async function expectNever(callable: () => unknown): Promise<void> {
	await expect(() => waitFor(callable)).rejects.toEqual(expect.anything());
}
