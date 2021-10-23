import { apiFetch } from './apiFetch';

export interface TaskInput {
	complete?: boolean;
	uncle?: boolean;
}

// Requires that user be authenticated.
export function updateTask(taskId: number | string, data: TaskInput) {
	return apiFetch('me/tasks/' + taskId, true, 'PUT', data);
}
