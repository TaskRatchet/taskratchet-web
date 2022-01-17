import Cookies from 'universal-cookie';
import { isProduction } from '../../tr_constants';
import { logout } from './useSession';

const cookies = new Cookies();

const _get_base = () => {
	if (isProduction) {
		return 'https://api.taskratchet.com/api1/';
	}

	// TODO: Create staging env using cloud run
	// if (isStaging) {
	// 	return 'https://us-central1-taskratchet-dev.cloudfunctions.net/api1/';
	// }

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
	const session = cookies.get('tr_session'),
		route_ = _trim(route, '/'),
		base = _get_base();

	if (protected_ && !session) {
		throw new Error('User not logged in');
	}

	// noinspection SpellCheckingInspection
	const response = await fetch(base + route_, {
		method: method,
		body: data ? JSON.stringify(data) : undefined,
		headers: {
			'X-Taskratchet-Token': session ? session.token : undefined,
		},
	});

	if (response.status === 403) {
		logout();
	}

	return response;
}
