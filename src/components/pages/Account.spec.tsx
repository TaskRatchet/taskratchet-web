import { screen, waitFor } from '@testing-library/react';
import React from 'react';
import Account from './Account';
import {
	loadCheckoutSession,
	loadMe,
	loadTimezones,
	renderWithQueryProvider,
} from '../../lib/test/helpers';
import userEvent from '@testing-library/user-event';
import { useGetApiToken } from '../../lib/api';
import { getCheckoutSession } from '../../lib/api/getCheckoutSession';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../lib/api/getTimezones');
vi.mock('../../lib/api/getMe');
vi.mock('../../lib/api/updateMe');
vi.mock('../../lib/api/getCheckoutSession');
vi.mock('../../lib/api/apiFetch');
vi.mock('../../lib/api/updatePassword');
vi.mock('../../lib/api/useGetApiToken');

describe('account page', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		loadMe({});
		loadCheckoutSession();
		vi.mocked(useGetApiToken).mockReturnValue({
			isLoading: false,
			mutate: () => {
				/* noop */
			},
		} as any);
	});

	it('includes Beeminder integration settings', async () => {
		loadTimezones();
		loadMe({});
		loadCheckoutSession();

		renderWithQueryProvider(<Account />);

		await screen.findByText('Enable Beeminder integration');
	});

	it('loads name', async () => {
		loadMe({
			json: {
				name: 'the_name',
			},
		});

		renderWithQueryProvider(<Account />);

		await screen.findByDisplayValue('the_name');
	});

	it('loads email', async () => {
		loadMe({
			json: {
				email: 'the_email',
			},
		});

		renderWithQueryProvider(<Account />);

		await screen.findByDisplayValue('the_email');
	});

	it('loads timezone', async () => {
		loadTimezones(['first', 'America/Indiana/Knox', 'third']);

		loadMe({
			json: {
				timezone: 'America/Indiana/Knox',
			},
		});

		renderWithQueryProvider(<Account />);

		await screen.findByDisplayValue('America/Indiana/Knox');
	});

	it('loads payment methods', async () => {
		loadMe({
			json: {
				cards: [
					{
						brand: 'visa',
						last4: '1111',
					},
				],
			},
		});

		renderWithQueryProvider(<Account />);

		await screen.findByText('visa ending with 1111');
	});

	it('gets checkout session only once', async () => {
		const { queryClient } = renderWithQueryProvider(<Account />);

		await queryClient.invalidateQueries('checkoutSession');

		await waitFor(() => expect(getCheckoutSession).toBeCalledTimes(1));
	});

	it('has token request button', async () => {
		renderWithQueryProvider(<Account />);

		await screen.findByText('Request API token');
	});

	it('displays response data', async () => {
		vi.mocked(useGetApiToken).mockReturnValue({
			isLoading: false,
			mutate: () => {
				/* noop */
			},
			data: 'the_token',
		} as any);

		renderWithQueryProvider(<Account />);

		userEvent.click(await screen.findByText('Request API token'));

		await screen.findByText('the_token');
	});
});
