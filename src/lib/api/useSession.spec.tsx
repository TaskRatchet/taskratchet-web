import { getSession } from '@taskratchet/sdk';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useSession } from './useSession';

describe('useSession', () => {
	it('should return the session', () => {
		const session = {
			email: 'the_email',
			token: 'the_token',
		};

		vi.mocked(getSession).mockReturnValue(session);

		const { result } = renderHook(useSession);

		expect(result.current).toEqual(session);
	});
});
