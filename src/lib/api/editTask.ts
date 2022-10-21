import logEvent from '../logEvent';
import fetch1 from './fetch1';
import { EventCategory, EventAction } from '../logEvent';

// Requires that user be authenticated.
export async function editTask(
	id: string,
	due: string,
	cents: number
): Promise<Response> {
	const response = await fetch1(`me/tasks/${id}`, true, 'PUT', {
		due,
		cents,
	});

	if (!response.ok) {
		const error = await response.text();
		throw new Error(error);
	}

	logEvent({
		category: EventCategory.Task,
		action: EventAction.TaskUpdate,
		value: cents / 100,
	});

	return response;
}
