import fetch1 from './fetch1';

export async function getTimezones(): Promise<string[]> {
	const response = await fetch1('timezones');

	return response.json() as Promise<string[]>;
}
