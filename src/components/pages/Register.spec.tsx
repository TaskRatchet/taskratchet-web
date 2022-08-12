import {
	loadCheckoutSession,
	loadTimezones,
	renderWithQueryProvider,
} from '../../lib/test/helpers';
import React from 'react';
import Register from './Register';
import { waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { getTimezones } from '../../lib/api';
import { act } from '@testing-library/react';
import { vi } from 'vitest';
import register from '../../lib/api/register';

vi.mock('../../lib/api/getCheckoutSession');
vi.mock('../../lib/api/register');

describe('registration page', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		loadCheckoutSession();
		window.Stripe = vi.fn(() => ({
			redirectToCheckout: vi.fn(async () => ({
				error: { message: 'error' },
			})),
		}));
	});

	it('uses timezone loading placeholder', async () => {
		await act(async () => {
			const { getByText } = await renderWithQueryProvider(<Register />);

			expect(getByText('Loading...')).toBeInTheDocument();
		});
	});

	it('defaults to "Choose your timezone..." option', async () => {
		await act(async () => {
			loadTimezones();

			const { getByText } = await renderWithQueryProvider(<Register />);

			await waitFor(() =>
				expect(getByText('Choose your timezone...')).toBeInTheDocument()
			);
		});
	});

	it('uses Input for name field', async () => {
		await act(async () => {
			const { getByLabelText } = await renderWithQueryProvider(<Register />);

			expect(getByLabelText('Name')).toBeInTheDocument();
		});
	});

	it('uses Input for email field', async () => {
		await act(async () => {
			const { getByLabelText } = await renderWithQueryProvider(<Register />);

			expect(getByLabelText('Email')).toBeInTheDocument();
		});
	});

	it('uses Input for password field', async () => {
		await act(async () => {
			const { getByLabelText } = await renderWithQueryProvider(<Register />);

			expect(getByLabelText('Password')).toBeInTheDocument();
		});
	});

	it('uses Input for password2 field', async () => {
		await act(async () => {
			const { getByLabelText } = await renderWithQueryProvider(<Register />);

			expect(getByLabelText('Retype Password')).toBeInTheDocument();
		});
	});

	it('submits registration', async () => {
		await act(async () => {
			loadTimezones(['the_timezone']);

			vi.mocked(register).mockImplementation(async () => new Response());

			const { getByLabelText, getByText } = await renderWithQueryProvider(
				<Register />
			);

			userEvent.type(getByLabelText('Name'), 'the_name');
			userEvent.type(getByLabelText('Email'), 'the_email');
			userEvent.type(getByLabelText('Password'), 'the_password');
			userEvent.type(getByLabelText('Retype Password'), 'the_password');

			await waitFor(() => {
				expect(getTimezones).toBeCalled();
				userEvent.selectOptions(getByLabelText('Timezone'), 'the_timezone');
			});

			userEvent.click(
				getByLabelText(
					"I have read and agree to TaskRatchet's privacy policy and terms of service."
				)
			);

			userEvent.click(getByText('Add payment method'));

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
});
