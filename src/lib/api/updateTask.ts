import logEvent from '../logEvent';
import fetch1 from './fetch1';
import { EventCategory, EventAction } from '../logEvent';

export interface TaskInput {
	complete?: boolean;
	uncle?: boolean;
}

// Requires that user be authenticated.
export async function updateTask(
	taskId: string,
	data: TaskInput
): Promise<Response> {
	const result = await fetch1('me/tasks/' + taskId, true, 'PUT', data);

	if (result.ok) {
		if (data.complete) {
			logEvent({
				category: EventCategory.Task,
				action: EventAction.TaskComplete,
			});
		}

		if (data.uncle) {
			logEvent({
				category: EventCategory.Task,
				action: EventAction.TaskUncle,
			});
		}
	}

	return result;
}
