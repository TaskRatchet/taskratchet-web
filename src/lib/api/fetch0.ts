import { logout } from './useSession';

const _trim = (s: string, c: string) => {
	if (c === ']') c = '\\]';
	if (c === '\\') c = '\\\\';
	return s.replace(new RegExp('^[' + c + ']+|[' + c + ']+$', 'g'), '');
};

export default async function fetch0(
	route: string,
	protected_ = false,
	method = 'GET',
	data: unknown = null,
	base: string
): Promise<Response> {
	const token = window.localStorage.getItem('token'),
		route_ = _trim(route, '/');

	if (protected_ && !token) {
		throw new Error('User not logged in');
	}

	// noinspection SpellCheckingInspection
	const response = await fetch(base + route_, {
		method: method,
		body: data ? JSON.stringify(data) : undefined,
		headers: {
			'X-Taskratchet-Token': token || '',
		},
	});

	if (response.status === 403) {
		logout();
	}

	return response;
}
