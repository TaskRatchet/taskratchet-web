import { updatePassword } from '@taskratchet/sdk';
import { useMutation } from 'react-query';

export function useUpdatePassword(): {
	updatePassword: (oldPass: string, newPass: string) => void;
	isLoading: boolean;
} {
	const { mutate, isLoading } = useMutation(
		(variables: { oldPass: string; newPass: string }) =>
			updatePassword(variables.oldPass, variables.newPass),
	);

	return {
		updatePassword: (oldPass: string, newPass: string) =>
			mutate({ oldPass: oldPass, newPass: newPass }),
		isLoading,
	};
}
