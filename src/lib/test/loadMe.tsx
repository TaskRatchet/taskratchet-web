import { vi } from 'vitest';
import { getMe } from '../api/getMe';
import { updateMe } from '../api/updateMe';
import { makeResponse } from './makeResponse';

export const loadMe = ({
	json = {},
	ok = true,
}: {
	json?: Partial<User>;
	ok?: boolean;
} = {}): void => {
	const response = makeResponse({ json, ok });

	vi.mocked(getMe).mockResolvedValue(json as User);
	vi.mocked(updateMe).mockResolvedValue(response as Response);
};
