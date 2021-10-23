import { apiFetch } from './apiFetch';

export async function getTasks() {
	const response = await apiFetch('me/tasks', true);

	return response.json();
}
