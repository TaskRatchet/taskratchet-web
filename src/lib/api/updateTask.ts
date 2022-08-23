import { apiFetch } from './apiFetch';

export interface TaskInput {
	complete?: boolean;
	uncle?: boolean;
}

// Requires that user be authenticated.
export function updateTask(taskId: string, data: TaskInput): Promise<Response> {
	return apiFetch('me/tasks/' + taskId, true, 'PUT', data);
}
