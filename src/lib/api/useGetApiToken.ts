import { useMutation } from 'react-query';
import type { UseMutationResult } from 'react-query';
import { getApiToken } from '@taskratchet/sdk';

export function useGetApiToken(): UseMutationResult<
	string,
	unknown,
	void,
	unknown
> {
	return useMutation<string>('api-token', getApiToken);
}
