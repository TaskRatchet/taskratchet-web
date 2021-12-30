import { useMutation } from 'react-query';
import { updatePassword } from './updatePassword';

export function useUpdatePassword(): {
	updatePassword: (oldPass: string, newPass: string) => void;
	isLoading: boolean;
} {
	const { mutate, isLoading } = useMutation(
		(variables: { oldPass: string; newPass: string }) => {
			return updatePassword(variables.oldPass, variables.newPass);
		}
	);

	return {
		updatePassword: (oldPass: string, newPass: string) =>
			mutate({ oldPass: oldPass, newPass: newPass }),
		isLoading,
	};
}
