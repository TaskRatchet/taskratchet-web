import { vi } from 'vitest';
import { makeResponse } from './makeResponse';
import { type User, getMe, updateMe } from '@taskratchet/sdk';

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
