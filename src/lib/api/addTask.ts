import { apiFetch } from './apiFetch';

// Requires that user be authenticated.
export async function addTask(
	task: string,
	due: string,
	cents: number,
	recurrence?: Record<string, number>
): Promise<Response> {
	const response = await apiFetch('me/tasks', true, 'POST', {
		task,
		due,
		cents,
		recurrence,
	});

	if (!response.ok) {
		throw new Error('Failed to add task');
	}

	return response;
}
