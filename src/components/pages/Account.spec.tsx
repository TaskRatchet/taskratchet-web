import { act, render, waitFor } from '@testing-library/react';
import React from 'react';
import Account from './Account';
import {
	loadCheckoutSession,
	loadMe,
	loadTimezones,
	renderWithQueryProvider,
} from '../../lib/test/helpers';
import { QueryClient, QueryClientProvider } from 'react-query';
import userEvent from '@testing-library/user-event';
import * as api from '../../lib/api';

jest.mock('../../lib/api/getTimezones');
jest.mock('../../lib/api/getMe');
jest.mock('../../lib/api/updateMe');
jest.mock('../../lib/api/getCheckoutSession');
jest.mock('../../lib/api/apiFetch');
jest.mock('../../lib/api/updatePassword');
jest.mock('../../lib/api/useGetApiToken');

describe('account page', () => {
	beforeEach(() => {
		jest.resetAllMocks();
		loadCheckoutSession();
		jest.spyOn(api, 'useGetApiToken').mockReturnValue({
			isLoading: false,
			mutate: () => {
				/* noop */
			},
		} as any);
	});

	it('includes Beeminder integration settings', async () => {
		await act(async () => {
			loadTimezones();
			loadMe({});
			loadCheckoutSession();

			// TODO: extract renderWithClientProvider to helpers
			const queryClient = new QueryClient();
			const { getByText } = await render(
				<QueryClientProvider client={queryClient}>
					<Account />
				</QueryClientProvider>
			);

			expect(getByText('Enable Beeminder integration')).toBeDefined();
		});
	});

	it('loads name', async () => {
		await act(async () => {
			loadMe({
				json: {
					name: 'the_name',
				},
			});

			const { getByDisplayValue } = await renderWithQueryProvider(<Account />);

			await waitFor(() =>
				expect(getByDisplayValue('the_name')).toBeInTheDocument()
			);
		});
	});

	it('loads email', async () => {
		await act(async () => {
			loadMe({
				json: {
					email: 'the_email',
				},
			});

			const { getByDisplayValue } = await renderWithQueryProvider(<Account />);

			await waitFor(() =>
				expect(getByDisplayValue('the_email')).toBeInTheDocument()
			);
		});
	});

	it('loads timezone', async () => {
		await act(async () => {
			loadTimezones(['first', 'America/Indiana/Knox', 'third']);

			loadMe({
				json: {
					timezone: 'America/Indiana/Knox',
				},
			});

			const { getByDisplayValue } = await renderWithQueryProvider(<Account />);

			await waitFor(() =>
				expect(getByDisplayValue('America/Indiana/Knox')).toBeInTheDocument()
			);
		});
	});

	it('loads payment methods', async () => {
		await act(async () => {
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

			const { getByText } = await renderWithQueryProvider(<Account />);

			await waitFor(() =>
				expect(getByText('visa ending with 1111')).toBeInTheDocument()
			);
		});
	});

	it('gets checkout session only once', async () => {
		await act(async () => {
			const { queryClient } = await renderWithQueryProvider(<Account />);

			await queryClient.invalidateQueries('checkoutSession');

			await waitFor(() => expect(api.getCheckoutSession).toBeCalledTimes(1));
		});
	});

	it('has token request button', async () => {
		await act(async () => {
			const { getByText } = await renderWithQueryProvider(<Account />);

			expect(getByText('Request API token')).toBeInTheDocument();
		});
	});

	it('indicates loading state', async () => {
		await act(async () => {
			jest.spyOn(api, 'useGetApiToken').mockReturnValue({
				isLoading: true,
				mutate: () => {
					/* noop */
				},
			} as any);

			const { getByText } = await renderWithQueryProvider(<Account />);

			userEvent.click(getByText('Request API token'));

			await waitFor(() => {
				expect(getByText('Loading...')).toBeInTheDocument();
			});
		});
	});

	it('displays response data', async () => {
		await act(async () => {
			jest.spyOn(api, 'useGetApiToken').mockReturnValue({
				isLoading: false,
				mutate: () => {
					/* noop */
				},
				data: 'the_token',
			} as any);

			const { getByText } = await renderWithQueryProvider(<Account />);

			userEvent.click(getByText('Request API token'));

			await waitFor(() => {
				expect(getByText('the_token')).toBeInTheDocument();
			});
		});
	});

	// TODO: break sections into their own components
	// TODO: get rid of test run terminal errors
	// TODO: use loading overlay on payment details until both cards and checkout session loaded
});
