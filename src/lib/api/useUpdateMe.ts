import {
	useMutation,
	useQueryClient,
	UseBaseMutationResult,
} from 'react-query';
import { MeInput, updateMe } from '@taskratchet/sdk';

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
