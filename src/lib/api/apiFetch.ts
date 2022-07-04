import { isProduction, isStaging } from '../../tr_constants';
import { logout } from './useSession';

const _get_base = () => {
	if (isProduction) {
		return 'https://api.taskratchet.com/api1/';
	}

	if (isStaging) {
		return 'https://taskratchet-api-node-c3yk2gl5eq-uc.a.run.app/api1/';
	}

	return 'http://localhost:8080/api1/';
};

const _trim = (s: string, c: string) => {
	if (c === ']') c = '\\]';
	if (c === '\\') c = '\\\\';
	return s.replace(new RegExp('^[' + c + ']+|[' + c + ']+$', 'g'), '');
};

export async function apiFetch(
	route: string,
	protected_ = false,
	method = 'GET',
	data: unknown = null
): Promise<Response> {
	const token = window.localStorage.getItem('token'),
		route_ = _trim(route, '/'),
		base = _get_base();

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
