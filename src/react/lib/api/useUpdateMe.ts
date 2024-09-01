import {
	useMutation,
	useQueryClient,
	type UseBaseMutationResult,
} from 'react-query';
import { type MeInput, updateMe } from '@taskratchet/sdk';

export default function useUpdateMe(): UseBaseMutationResult<
	Response,
	unknown,
	MeInput,
	unknown
> {
	const queryClient = useQueryClient();
	return useMutation(updateMe, {
		onSuccess: () => queryClient.invalidateQueries('me'),
	});
}
