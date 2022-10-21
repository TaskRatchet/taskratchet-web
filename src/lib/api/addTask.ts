import logEvent from '../logEvent';
import fetch1 from './fetch1';
import { EventCategory, EventAction } from '../logEvent';

// Requires that user be authenticated.
export async function addTask(
	task: string,
	due: string,
	cents: number
): Promise<Response> {
	const response = await fetch1('me/tasks', true, 'POST', {
		task,
		due,
		cents,
	});

	if (!response.ok) {
		throw new Error('Failed to add task');
	}

	logEvent({
		category: EventCategory.Task,
		action: EventAction.TaskCreate,
		value: cents / 100,
	});

	return response;
}
