import apiFetch from './fetch1';
import { expect, it, describe, vi } from 'vitest';

vi.mock('./fetch1', () => {
	return vi.importActual('./fetch1');
});

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
