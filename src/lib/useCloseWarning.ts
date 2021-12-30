import { useQueryClient } from 'react-query';
import { useBeforeunload } from 'react-beforeunload';
import { getUnloadMessage } from './getUnloadMessage';

// TODO: consider using react-router prompt instead
// https://reactrouter.com/core/api/Prompt
export function useCloseWarning(): void {
	const client = useQueryClient();
	useBeforeunload(() => getUnloadMessage(client));
}
