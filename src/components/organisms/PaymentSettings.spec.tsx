import { getCheckoutSession, updateMe } from '@taskratchet/sdk';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { redirectToCheckout } from '../../lib/stripe';
import loadControlledPromise from '../../lib/test/loadControlledPromise';
import { loadMe } from '../../lib/test/loadMe';
import { renderWithQueryProvider } from '../../lib/test/renderWithQueryProvider';
import PaymentSettings from './PaymentSettings';

vi.mock('../../lib/api/getMe');
vi.mock('../../lib/api/updateMe');

describe('paymentSettings', () => {
	it('loads add payment method if user is missing customer id', async () => {
		loadMe({});

		renderWithQueryProvider(<PaymentSettings />);

		await screen.findByText('Add payment method');
	});

	it('displays manage payment method if user has_stripe_customer true', async () => {
		loadMe({ json: { has_stripe_customer: true } });

		renderWithQueryProvider(<PaymentSettings />);

		await screen.findByText('Manage with Stripe');
	});

	it('hides add payment method when user has_stripe_customer true', async () => {
		loadMe({ json: { has_stripe_customer: true } });

		renderWithQueryProvider(<PaymentSettings />);

		await screen.findByText('Manage with Stripe');

		expect(screen.queryByText('Add payment method')).not.toBeInTheDocument();
	});

	it('redirects to checkout page', async () => {
		loadMe({});

		renderWithQueryProvider(<PaymentSettings />);

		const button = await screen.findByText('Add payment method');

		await userEvent.click(button);

		expect(redirectToCheckout).toBeCalledWith('session');
	});

	it('displays loading indicator for add payment', async () => {
		loadMe({});

		const promise = loadControlledPromise(getCheckoutSession);

		renderWithQueryProvider(<PaymentSettings />);

		const button = await screen.findByText('Add payment method');

		await userEvent.click(button);

		await screen.findByRole('progressbar');

		promise.resolve({ id: 'session' });
	});

	it('saves checkout session id to user', async () => {
		loadMe({});

		renderWithQueryProvider(<PaymentSettings />);

		const button = await screen.findByText('Add payment method');

		await userEvent.click(button);

		expect(updateMe).toBeCalledWith({ checkout_session_id: 'session' });
	});
});
