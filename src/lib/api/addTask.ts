import logEvent from '../logEvent';
import fetch1 from './fetch1';
import { EventCategory, EventAction } from '../logEvent';

type Input = {
	task: string;
	due: string;
	cents: number;
};

// Requires that user be authenticated.
export async function addTask(input: Input): Promise<Response> {
	const response = await fetch1('me/tasks', true, 'POST', input);

	if (!response.ok) {
		throw new Error('Failed to add task');
	}

	logEvent({
		category: EventCategory.Task,
		action: EventAction.TaskCreate,
		value: input.cents / 100,
	});

	return response;
}
