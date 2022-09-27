import { fetch1 } from './fetch1';

export async function getMe(): Promise<User> {
	const response = await fetch1('me', true);

	if (!response.ok) {
		throw new Error('Failed to get me');
	}

	return response.json() as Promise<User>;
}
