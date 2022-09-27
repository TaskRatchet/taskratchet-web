import fetch1 from './fetch1';
import { describe, it, expect } from 'vitest';

describe('fetch1', () => {
	it('uses localStorage token', async () => {
		fetchMock.mockResponse(JSON.stringify({}));

		const token = 'token';

		global.localStorage.setItem('token', token);

		const url = 'https://example.com';
		await fetch1(url);

		expect(fetch).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				headers: {
					'X-Taskratchet-Token': token,
				},
			})
		);
	});
});
