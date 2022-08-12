import { apiFetch } from './apiFetch';

describe('apiFetch', () => {
	it('uses localStorage token', () => {
		fetchMock.mockResponse(JSON.stringify({}));

		const token = 'token';

		global.localStorage.setItem('token', token);

		const url = 'https://example.com';
		apiFetch(url);

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
