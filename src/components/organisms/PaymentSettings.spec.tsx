import { loadMe, renderWithQueryProvider } from '../../lib/test/helpers';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/dom';
import PaymentSettings from './PaymentSettings';
import { useCheckoutSession } from '../../lib/api';

jest.mock('../../lib/api/getMe');
jest.mock('../../lib/api/updateMe');
jest.mock('../../lib/api/useCheckoutSession');

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
		(useCheckoutSession as jest.Mock).mockResolvedValue({});

		const { getByText } = renderWithQueryProvider(<PaymentSettings />);

		userEvent.click(getByText('Replace payment method'));

		await waitFor(() => {
			expect(getByText('Checkout session error')).toBeInTheDocument();
		});
	});

	it('displays stripe errors', async () => {
		(useCheckoutSession as jest.Mock).mockResolvedValue({ id: 'the_id' });

		window.Stripe = jest.fn(() => ({
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
});
