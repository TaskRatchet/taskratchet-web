import { useCallback } from 'react';
import { useQuery, useQueryClient } from 'react-query';

type PrefResult<T> = {
	pref: T;
	setPref: (pref: T) => void;
};

// SOURCE: https://github.com/TanStack/query/discussions/1303
export function usePref<T>(id: string, defaultValue: T): PrefResult<T> {
	const queryKey = makePrefQueryKey(id);
	const queryClient = useQueryClient();

	const { data, refetch } = useQuery<T>(
		queryKey,
		() => {
			return getPrefFromLocalStorage(id) ?? defaultValue;
		},
		{
			initialData: () => getPrefFromLocalStorage<T>(id) ?? defaultValue,
		}
	);

	const setPref = useCallback(
		(newPref: T) => {
			// Use an envelope because JSON.stringify likes serializable objects and
			// prefs could be anything
			const prefEnvelope = makePrefEnvelope(newPref);
			localStorage.setItem(id, JSON.stringify(prefEnvelope));

			// Invalidate this pref so callers will re-ensure the data as needed
			void queryClient.invalidateQueries(queryKey).then(() => refetch());
		},
		[id, queryKey, queryClient, refetch]
	);

	return {
		pref: data as T, // safe to cast because initialData is set in useQuery
		setPref,
	};
}

function makePrefQueryKey(id: string) {
	return ['prefs', id];
}

function getPrefFromLocalStorage<T>(id: string) {
	const prefString = localStorage.getItem(id);

	if (!prefString) {
		return;
	}

	const prefEnvelope: PrefEnvelope<T> = JSON.parse(prefString) as PrefEnvelope<T>;

	return prefEnvelope.pref;
}

export interface PrefEnvelope<T> {
	pref: T;
	version: string;
}

const PREF_ENVELOPE_VERSION = '1.0.0';

// exported for testing only
export function makePrefEnvelope<T>(pref: T): PrefEnvelope<T> {
	return { pref, version: PREF_ENVELOPE_VERSION };
}
