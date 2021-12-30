import { apiFetch } from './apiFetch';

export function updatePassword(
	oldPassword: string,
	newPassword: string
): Promise<Response> {
	return apiFetch('me', true, 'PUT', {
		old_password: oldPassword,
		new_password: newPassword,
	});
}
