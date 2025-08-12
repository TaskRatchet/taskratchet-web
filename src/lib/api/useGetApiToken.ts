import { getApiToken } from '@taskratchet/sdk';
import type { UseMutationResult } from 'react-query';
import { useMutation } from 'react-query';

export function useGetApiToken(): UseMutationResult<
	string,
	unknown,
	void,
	unknown
> {
	return useMutation<string>('api-token', getApiToken);
}
