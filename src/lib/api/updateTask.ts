import { fetch1 } from './fetch1';

export interface TaskInput {
	complete?: boolean;
	uncle?: boolean;
}

// Requires that user be authenticated.
export function updateTask(taskId: string, data: TaskInput): Promise<Response> {
	return fetch1('me/tasks/' + taskId, true, 'PUT', data);
}
