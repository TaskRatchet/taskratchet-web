import { useMe } from './useMe';
import _ from 'lodash';

export function useTimezone(): string | undefined {
	const { me } = useMe();

	return _.get(me, 'timezone');
}
