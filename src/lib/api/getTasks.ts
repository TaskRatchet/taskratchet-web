import fetch2 from './fetch2';

export async function getTasks(): Promise<unknown> {
	const response = await fetch2('me/tasks', true);

	return response.json();
}
