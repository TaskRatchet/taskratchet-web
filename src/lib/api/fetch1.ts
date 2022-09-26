import {
	api1Local,
	api1Staging,
	api1Production,
	isProduction,
	isStaging,
} from '../../tr_constants';
import fetch0 from './fetch0';

const _get_base = () => {
	if (isProduction) {
		return api1Production;
	}

	if (isStaging) {
		return api1Staging;
	}

	return api1Local;
};

export default function fetch1(
	route: string,
	protected_ = false,
	method = 'GET',
	data: unknown = null
): Promise<Response> {
	return fetch0(route, protected_, method, data, _get_base());
}
