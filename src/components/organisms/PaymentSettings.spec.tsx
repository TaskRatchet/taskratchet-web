import { loadMe, renderWithQueryProvider } from '../../lib/test/helpers';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';
import PaymentSettings from './PaymentSettings';
import { useCheckoutSession } from '../../lib/api';
import { vi, Mock } from 'vitest';

vi.mock('../../lib/api/getMe');
vi.mock('../../lib/api/updateMe');
vi.mock('../../lib/api/useCheckoutSession');

describe('general settings', () => {
	it('displays loading indicator on replace click', async () => {
		loadMe({});

		const { container, getByText } = renderWithQueryProvider(
			<PaymentSettings />
		);

		userEvent.click(getByText('Replace payment method'));

		await waitFor(() => {
			expect(
				container.querySelector('.MuiLoadingButton-loading')
			).toBeInTheDocument();
		});
	});

	it('displays checkout session error', async () => {
		loadMe({});
		(useCheckoutSession as Mock).mockResolvedValue({});

		const { getByText } = renderWithQueryProvider(<PaymentSettings />);

		userEvent.click(getByText('Replace payment method'));

		await waitFor(() => {
			expect(getByText('Checkout session error')).toBeInTheDocument();
		});
	});

	it('displays stripe errors', async () => {
		(useCheckoutSession as Mock).mockResolvedValue({ id: 'the_id' });

		window.Stripe = vi.fn(() => ({
			redirectToCheckout: async () => ({
				error: { message: 'the_error_message' },
			}),
		}));

		const { getByText } = renderWithQueryProvider(<PaymentSettings />);

		userEvent.click(getByText('Replace payment method'));

		await waitFor(() => {
			expect(getByText('the_error_message')).toBeInTheDocument();
		});
	});

	it('cancels loading state when error set', async () => {
		loadMe({});
		(useCheckoutSession as Mock).mockResolvedValue({});

		const { getByText, container } = renderWithQueryProvider(
			<PaymentSettings />
		);

		userEvent.click(getByText('Replace payment method'));

		await waitFor(() => {
			expect(getByText('Checkout session error')).toBeInTheDocument();
		});

		expect(
			container.querySelector('.MuiLoadingButton-loading')
		).not.toBeInTheDocument();
	});
});
