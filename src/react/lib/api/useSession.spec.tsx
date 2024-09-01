import { useSession } from './useSession';
import { renderHook } from '@testing-library/react';
import { getSession } from '@taskratchet/sdk';
import { expect, it, describe, vi } from 'vitest';

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
