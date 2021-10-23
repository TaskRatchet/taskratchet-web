import { apiFetch } from './apiFetch';

// Requires that user be authenticated.
export async function addTask(task: string, due: string, cents: number) {
	const response = await apiFetch('me/tasks', true, 'POST', {
		task,
		due,
		cents,
	});

	if (!response.ok) {
		throw new Error('Failed to add task');
	}

	return response;
}
