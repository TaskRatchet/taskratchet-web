import { writable } from 'svelte/store';
import { getMe } from '@taskratchet/sdk';

export type User = {
	email: string;
};

export const user = writable<User | null>(null);

export async function refreshUser() {
	try {
		const userData = await getMe();
		user.set(userData);
	} catch {
		user.set(null);
	}
}

// Initialize user state
refreshUser();
