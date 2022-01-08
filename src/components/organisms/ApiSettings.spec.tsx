import { loadMe, renderWithQueryProvider } from '../../lib/test/helpers';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';
import React from 'react';
import ApiSettings from './ApiSettings';
import { apiFetch } from '../../lib/api';

jest.mock('../../lib/api/getMe');
jest.mock('../../lib/api/updateMe');
jest.mock('../../lib/api/apiFetch');

describe('API settings', () => {
	it('displays loading indicator on request click', async () => {
		loadMe({});
		(apiFetch as jest.Mock).mockResolvedValue(new Response());

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

		const { getByText } = renderWithQueryProvider(<ApiSettings />);

		await waitFor(() => expect(getByText('user_id')).toBeInTheDocument());
	});
});
