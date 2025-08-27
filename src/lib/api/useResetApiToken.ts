import { resetApiToken } from '@taskratchet/sdk';
import type { UseMutationResult } from 'react-query';
import { useMutation } from 'react-query';

export function useResetApiToken(): UseMutationResult<
	string,
	unknown,
	void,
	unknown
> {
	return useMutation<string>('reset-api-token', resetApiToken);
}
