import { apiFetch } from './apiFetch';

export async function getTimezones() {
	const response = await apiFetch('timezones');

	return response.json();
}
