import { act, render, waitFor } from '@testing-library/react';
import React from 'react';
import Account from './Account';
import {
	expectLoadingOverlay,
	loadCheckoutSession,
	loadMe,
	loadTimezones,
	renderWithQueryProvider,
	resolveWithDelay,
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

	it('uses loading overlay', async () => {
		await act(async () => {
			loadMe({});

			const { container } = await renderWithQueryProvider(<Account />);

			await waitFor(() =>
				expectLoadingOverlay(container, { extraClasses: 'page-account' })
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

	it('uses loading overlay on fetch', async () => {
		await act(async () => {
			loadMe({});

			const { container, getAllByText } = await renderWithQueryProvider(
				<Account />
			);

			const button = getAllByText('Save')[0];

			await waitFor(() =>
				expectLoadingOverlay(container, {
					extraClasses: 'page-account',
					shouldExist: false,
				})
			);

			userEvent.click(button);

			await waitFor(() =>
				expectLoadingOverlay(container, { extraClasses: 'page-account' })
			);
		});
	});

	it('uses loading screen when saving password', async () => {
		await act(async () => {
			loadMe({});

			resolveWithDelay(jest.spyOn(api, 'updatePassword'), 100);

			const { container, getAllByText, getByLabelText } =
				await renderWithQueryProvider(<Account />);

			const button = getAllByText('Save')[1];

			await waitFor(() =>
				expectLoadingOverlay(container, {
					extraClasses: 'page-account',
					shouldExist: false,
				})
			);

			userEvent.type(getByLabelText('Old Password'), 'old');
			userEvent.type(getByLabelText('New Password'), 'new');
			userEvent.type(getByLabelText('Retype Password'), 'new');
			userEvent.click(button);

			await waitFor(() =>
				expectLoadingOverlay(container, { extraClasses: 'page-account' })
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
