import fetch2 from './fetch2';
import { describe, it, expect } from 'vitest';

describe('fetch2', () => {
	it('uses localStorage token', async () => {
		fetchMock.mockResponse(JSON.stringify({}));

		const token = 'token';

		global.localStorage.setItem('firebase_token', token);

		const url = 'https://example.com';
		await fetch2(url);

		expect(fetch).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
		);
	});
});
