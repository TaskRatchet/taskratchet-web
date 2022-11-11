import { renderWithQueryProvider } from '../../lib/test/renderWithQueryProvider';
import { loadTimezones } from '../../lib/test/loadTimezones';
import React from 'react';
import Register from './Register';
import { waitFor, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getTimezones } from '../../lib/api/getTimezones';
import { vi, expect, it, describe } from 'vitest';
import register from '../../lib/api/register';
import { getCheckoutSession } from '../../lib/api/getCheckoutSession';
import { redirectToCheckout } from '../../lib/stripe';

vi.mock('../../lib/api/getCheckoutSession');
vi.mock('../../lib/api/register');

describe('registration page', () => {
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

		await userEvent.type(await screen.findByLabelText('Name'), 'the_name');
		await userEvent.type(await screen.findByLabelText('Email'), 'the_email');
		await userEvent.type(
			await screen.findByLabelText('Password'),
			'the_password'
		);
		await userEvent.type(
			await screen.findByLabelText('Retype Password'),
			'the_password'
		);

		await waitFor(() => {
			expect(getTimezones).toBeCalled();
		});

		await userEvent.click(await screen.findByLabelText('Timezone'));

		const listbox = within(screen.getByRole('listbox'));

		await userEvent.click(listbox.getByText('the_timezone'));

		await userEvent.click(
			await screen.findByLabelText(
				"I have read and agree to TaskRatchet's privacy policy and terms of service."
			)
		);

		await waitFor(() => {
			expect(screen.getByText('Add payment method')).not.toBeDisabled();
		});
		await userEvent.click(await screen.findByText('Add payment method'));

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

	it('uses same checkout session for registration and redirection', async () => {
		vi.mocked(getCheckoutSession).mockResolvedValue({
			id: 'session_id',
		});

		loadTimezones(['the_timezone']);

		vi.mocked(register).mockImplementation(async () => {
			return Promise.resolve(new Response());
		});

		renderWithQueryProvider(<Register />);

		await userEvent.type(await screen.findByLabelText('Name'), 'the_name');
		await userEvent.type(await screen.findByLabelText('Email'), 'the_email');
		await userEvent.type(
			await screen.findByLabelText('Password'),
			'the_password'
		);
		await userEvent.type(
			await screen.findByLabelText('Retype Password'),
			'the_password'
		);

		await waitFor(() => {
			expect(getTimezones).toBeCalled();
		});

		const timezoneLabels = await screen.findAllByLabelText('Timezone');

		await userEvent.click(timezoneLabels[0]);

		const listbox = within(screen.getByRole('listbox'));

		await userEvent.click(listbox.getByText('the_timezone'));

		await userEvent.click(
			await screen.findByLabelText(
				"I have read and agree to TaskRatchet's privacy policy and terms of service."
			)
		);

		await waitFor(() => {
			expect(screen.getByText('Add payment method')).not.toBeDisabled();
		});
		await userEvent.click(await screen.findByText('Add payment method'));

		await waitFor(() => {
			expect(redirectToCheckout).toBeCalledWith('session_id');
		});
	});
});
