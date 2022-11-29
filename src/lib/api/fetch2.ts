import { API2_BASE } from '../../tr_constants';
import fetch0 from './fetch0';

export default function fetch2(
	route: string,
	protected_ = false,
	method = 'GET',
	data: unknown = null
): Promise<Response> {
	return fetch0(route, protected_, method, data, API2_BASE);
}
