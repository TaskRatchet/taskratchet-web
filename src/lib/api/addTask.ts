import fetch2 from './fetch2';

// Requires that user be authenticated.
export async function addTask(
	task: string,
	due: string,
	cents: number,
	recurrence?: Record<string, number>
): Promise<Response> {
	const response = await fetch2('me/tasks', true, 'POST', {
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
