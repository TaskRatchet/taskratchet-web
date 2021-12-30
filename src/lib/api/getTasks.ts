import { apiFetch } from './apiFetch';

export async function getTasks(): Promise<unknown> {
	const response = await apiFetch('me/tasks', true);

	return response.json();
}
