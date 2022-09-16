import apiFetch from './fetch1';

export async function getTasks(): Promise<unknown> {
	const response = await apiFetch('me/tasks', true);

	return response.json();
}
