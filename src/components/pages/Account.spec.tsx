import { screen } from '@testing-library/react';
import React from 'react';
import Account from './Account';
import { loadMe } from '../../lib/test/loadMe';
import { renderWithQueryProvider } from '../../lib/test/renderWithQueryProvider';
import { loadTimezones } from '../../lib/test/loadTimezones';
import userEvent from '@testing-library/user-event';
import { useGetApiToken } from '../../lib/api/useGetApiToken';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../lib/api/getTimezones');
vi.mock('../../lib/api/getMe');
vi.mock('../../lib/api/updateMe');
vi.mock('../../lib/api/getCheckoutSession');
vi.mock('../../lib/api/fetch1');
vi.mock('../../lib/api/updatePassword');
vi.mock('../../lib/api/useGetApiToken');

describe('account page', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		loadMe({});
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

		renderWithQueryProvider(<Account />);

		expect(
			await screen.findByText('Enable Beeminder integration')
		).toBeInTheDocument();
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

		await userEvent.click(await screen.findByText('Request API token'));

		await screen.findByText('the_token');
	});
});
