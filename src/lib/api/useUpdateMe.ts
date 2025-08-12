import { type MeInput, updateMe } from '@taskratchet/sdk';
import {
	type UseBaseMutationResult,
	useMutation,
	useQueryClient,
} from 'react-query';

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
