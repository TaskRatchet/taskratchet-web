import apiFetch from './fetch1';

export async function getTimezones(): Promise<string[]> {
	const response = await apiFetch('timezones');

	return response.json() as Promise<string[]>;
}
