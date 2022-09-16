import apiFetch from './fetch1';

export async function getMe(): Promise<User> {
	const response = await apiFetch('me', true);

	if (!response.ok) {
		throw new Error('Failed to get me');
	}

	return response.json() as Promise<User>;
}
