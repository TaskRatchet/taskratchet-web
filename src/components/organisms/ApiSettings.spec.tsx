import { loadMe, renderWithQueryProvider } from '../../lib/test/helpers';
import userEvent from '@testing-library/user-event';
import { waitFor, screen } from '@testing-library/react';
import React from 'react';
import ApiSettings from './ApiSettings';
import { apiFetch } from '../../lib/api';
import { vi, Mock } from 'vitest';

vi.mock('../../lib/api/getMe');
vi.mock('../../lib/api/updateMe');
vi.mock('../../lib/api/apiFetch');

describe('API settings', () => {
	it('displays loading indicator on request click', async () => {
		loadMe({});
		(apiFetch as Mock).mockResolvedValue(new Response());

		const { container, getByText } = renderWithQueryProvider(<ApiSettings />);

		userEvent.click(getByText('Request API token'));

		await waitFor(() => {
			expect(
				container.querySelector('.MuiLoadingButton-loading')
			).toBeInTheDocument();
		});
	});

	it('displays user id', async () => {
		loadMe({ json: { id: 'user_id' } });

		renderWithQueryProvider(<ApiSettings />);

		// await waitFor(() => expect(getByText('user_id')).toBeInTheDocument());

		expect(await screen.findByText('user_id')).toBeInTheDocument();
	});
});
