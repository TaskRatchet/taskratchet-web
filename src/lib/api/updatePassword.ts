import apiFetch from './fetch1';

export function updatePassword(
	oldPassword: string,
	newPassword: string
): Promise<Response> {
	return apiFetch('me', true, 'PUT', {
		old_password: oldPassword,
		new_password: newPassword,
	});
}
