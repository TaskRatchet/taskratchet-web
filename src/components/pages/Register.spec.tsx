import {
	loadCheckoutSession,
	loadTimezones,
	renderWithQueryProvider,
} from '../../lib/test/helpers';
import React from 'react';
import Register from './Register';
import { waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getTimezones } from '../../lib/api';
import { vi } from 'vitest';
import register from '../../lib/api/register';

vi.mock('../../lib/api/getCheckoutSession');
vi.mock('../../lib/api/register');

describe('registration page', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		loadCheckoutSession();
		window.Stripe = vi.fn(() => ({
			redirectToCheckout: vi.fn(async () =>
				Promise.resolve({
					error: { message: 'error' },
				})
			),
		}));
	});

	it('uses timezone loading placeholder', async () => {
		renderWithQueryProvider(<Register />);

		await screen.findByText('Loading...');
	});

	it('defaults to "Choose your timezone..." option', async () => {
		loadTimezones();

		renderWithQueryProvider(<Register />);

		await screen.findByText('Choose your timezone...');
	});

	it('uses Input for name field', async () => {
		renderWithQueryProvider(<Register />);

		await screen.findByLabelText('Name');
	});

	it('uses Input for email field', async () => {
		renderWithQueryProvider(<Register />);

		await screen.findByLabelText('Email');
	});

	it('uses Input for password field', async () => {
		renderWithQueryProvider(<Register />);

		await screen.findByLabelText('Password');
	});

	it('uses Input for password2 field', async () => {
		renderWithQueryProvider(<Register />);

		await screen.findByLabelText('Retype Password');
	});

	it('submits registration', async () => {
		loadTimezones(['the_timezone']);

		vi.mocked(register).mockImplementation(async () => {
			return Promise.resolve(new Response());
		});

		renderWithQueryProvider(<Register />);

		userEvent.type(await screen.findByLabelText('Name'), 'the_name');
		userEvent.type(await screen.findByLabelText('Email'), 'the_email');
		userEvent.type(await screen.findByLabelText('Password'), 'the_password');
		userEvent.type(
			await screen.findByLabelText('Retype Password'),
			'the_password'
		);

		await waitFor(() => {
			expect(getTimezones).toBeCalled();
		});
		userEvent.selectOptions(
			await screen.findByLabelText('Timezone'),
			'the_timezone'
		);

		userEvent.click(
			await screen.findByLabelText(
				"I have read and agree to TaskRatchet's privacy policy and terms of service."
			)
		);

		await waitFor(() => {
			expect(screen.getByText('Add payment method')).not.toBeDisabled();
		});
		userEvent.click(await screen.findByText('Add payment method'));

		await waitFor(() => {
			expect(register).toBeCalled();
		});

		expect(register).toBeCalledWith(
			'the_name',
			'the_email',
			'the_password',
			'the_timezone',
			'session'
		);
	});
});
