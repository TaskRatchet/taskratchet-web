import { useMutation } from 'react-query';
import apiFetch from './fetch1';
import { UseMutationResult } from 'react-query';

export function useGetApiToken(): UseMutationResult<
	string,
	unknown,
	void,
	unknown
> {
	return useMutation<string>('api-token', async () => {
		const response = await apiFetch('me/token', true, 'GET');
		return response.text();
	});
}
