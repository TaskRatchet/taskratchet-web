import {
	api2Local,
	api2Staging,
	api2Production,
	isProduction,
	isStaging,
} from '../../tr_constants';
import fetch0 from './fetch0';

const _get_base = () => {
	if (isProduction) {
		return api2Production;
	}

	if (isStaging) {
		return api2Staging;
	}

	return api2Local;
};

export default function fetch2(
	route: string,
	protected_ = false,
	method = 'GET',
	data: unknown = null
): Promise<Response> {
	return fetch0(route, protected_, method, data, _get_base());
}
