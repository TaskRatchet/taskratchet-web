import { apiFetch } from './apiFetch';
import { expect, it, describe } from 'vitest';

describe('apiFetch', () => {
	it('uses localStorage token', async () => {
		fetchMock.mockResponse(JSON.stringify({}));

		const token = 'token';

		global.localStorage.setItem('token', token);

		const url = 'https://example.com';
		await apiFetch(url);

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
