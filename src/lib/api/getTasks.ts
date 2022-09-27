import fetch1 from './fetch1';

export async function getTasks(): Promise<unknown> {
	const response = await fetch1('me/tasks', true);

	return response.json();
}
