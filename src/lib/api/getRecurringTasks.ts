import fetch2 from './fetch2';

function isRecurringTask(input: unknown): input is RecurringTask {
	const expectedKeys = [
		'id',
		'cents',
		'task',
		'complete',
		'status',
		'timezone',
		'recurrence',
	];

	if (typeof input !== 'object' || input === null) {
		return false;
	}

	for (const key of expectedKeys) {
		if (!(key in input)) {
			return false;
		}
	}

	return true;
}

function isRecurringTasks(input: unknown): input is RecurringTask[] {
	if (!Array.isArray(input)) {
		return false;
	}

	for (const item of input) {
		if (!isRecurringTask(item)) {
			return false;
		}
	}

	return true;
}

export default async function getRecurringTasks(): Promise<RecurringTask[]> {
	const response = await fetch2('me/recurring', true);

	if (!response.ok) {
		throw new Error('Failed to get recurring tasks');
	}

	const tasks = (await response.json()) as unknown[];

	if (!isRecurringTasks(tasks)) {
		throw new Error('Failed to get recurring tasks');
	}

	return tasks;
}
