import { loadMe, renderWithQueryProvider } from '../../lib/test/helpers';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { waitFor, screen } from '@testing-library/react';
import PaymentSettings from './PaymentSettings';
import { useCheckoutSession } from '../../lib/api';
import { vi, Mock } from 'vitest';

vi.mock('../../lib/api/getMe');
vi.mock('../../lib/api/updateMe');
vi.mock('../../lib/api/useCheckoutSession');

describe('general settings', () => {
	it('displays loading indicator on replace click', async () => {
		loadMe({});

		const { container } = renderWithQueryProvider(<PaymentSettings />);

		userEvent.click(await screen.findByText('Replace payment method'));

		await waitFor(() => {
			expect(
				container.querySelector('.MuiLoadingButton-loading')
			).toBeInTheDocument();
		});
	});

	it('displays checkout session error', async () => {
		loadMe({});
		vi.mocked(useCheckoutSession).mockResolvedValue({} as any);

		renderWithQueryProvider(<PaymentSettings />);

		userEvent.click(await screen.findByText('Replace payment method'));

		await screen.findByText('Checkout session error');
	});

	it('displays stripe errors', async () => {
		(useCheckoutSession as Mock).mockResolvedValue({ id: 'the_id' });

		window.Stripe = vi.fn(() => ({
			redirectToCheckout: async () =>
				Promise.resolve({
					error: { message: 'the_error_message' },
				}),
		}));

		renderWithQueryProvider(<PaymentSettings />);

		userEvent.click(await screen.findByText('Replace payment method'));

		await screen.findByText('the_error_message');
	});

	it('cancels loading state when error set', async () => {
		loadMe({});
		vi.mocked(useCheckoutSession).mockResolvedValue({} as any);

		const { container } = renderWithQueryProvider(<PaymentSettings />);

		userEvent.click(await screen.findByText('Replace payment method'));

		await screen.findByText('Checkout session error');

		await waitFor(() => {
			expect(
				container.querySelector('.MuiLoadingButton-loading')
			).not.toBeInTheDocument();
		});
	});
});
