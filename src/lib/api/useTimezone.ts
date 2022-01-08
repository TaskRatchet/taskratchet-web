import { useMe } from './useMe';

export function useTimezone(): string | undefined {
	const me = useMe();

	return me.data?.timezone;
}
