import { apiFetch } from './apiFetch';

export async function getTimezones(): Promise<string[]> {
	const response = await apiFetch('timezones');

	return response.json();
}
