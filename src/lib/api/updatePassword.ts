import fetch1 from './fetch1';

export function updatePassword(
	oldPassword: string,
	newPassword: string
): Promise<Response> {
	return fetch1('me', true, 'PUT', {
		old_password: oldPassword,
		new_password: newPassword,
	});
}
